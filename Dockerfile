#main build
FROM node:19-alpine AS build
WORKDIR /app
COPY . .
RUN npx yarn install
RUN npx yarn test
RUN npx yarn build

FROM build AS debug
CMD ["npx", "yarn", "start"]

FROM build AS production_build
RUN npx yarn install --production

FROM node:19-alpine AS production
WORKDIR /app
#copies only required files/folders
COPY --from=production_build /app/dist /app/dist
COPY --from=production_build /app/node_modules /app/node_modules
COPY --from=production_build /app/.env /app/package.json /app/yarn.lock /app/
CMD ["node", "dist/main"]
