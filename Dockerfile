# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.11.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Install libc6-compat for native modules like sharp
RUN apk add --no-cache libc6-compat

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Set dummy environment variables for build process
ENV BETTER_AUTH_SECRET=dummy_secret_for_build_only_123456
ENV BETTER_AUTH_URL=https://portfolio-reignier.eternom.fr

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# ✅ Créer le répertoire uploads AVANT de passer en user node
RUN mkdir -p /usr/src/app/public/uploads && \
    chown -R node:node /usr/src/app/public/uploads

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY --chown=node:node package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/ ./

# ✅ IMPORTANT: Déclarer le volume pour persister les uploads
# Ce dossier sera monté depuis l'hôte et survivra aux redémarrages
VOLUME ["/usr/src/app/public/uploads"]

# Expose the port that the application listens on.
EXPOSE 3454

# Run the application.
CMD npm start -- -p 3454
