#base image
FROM node:19-alpine AS alpine
HEALTHCHECK --interval=5s --timeout=3s --retries=3 \
    CMD wget -qO- http://localhost:${APP_PORT}/app/health-check || exit 1

#main build
FROM alpine AS build
WORKDIR /app
COPY . .
RUN npx yarn install --frozen-lockfile
RUN npx yarn build


#image for start locally and debug
FROM build AS debug
WORKDIR /app
CMD ["npx", "yarn", "start"]


#prepare build for production
FROM build AS production_build
WORKDIR /app
RUN npx yarn test
#will removes packages declared in package "devDependency" from "build" image
RUN npx yarn install --production --frozen-lockfile


#production image, which included only peer dependencies
FROM alpine AS production
MAINTAINER Mudryi Yaroslav
WORKDIR /app

#copies only required files/folders
COPY --from=production_build /app/dist /app/dist
COPY --from=production_build /app/node_modules /app/node_modules
COPY --from=production_build /app/.env /app/

CMD ["node", "dist/main"]
