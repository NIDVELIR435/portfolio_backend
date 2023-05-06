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


FROM build AS run_migrations
WORKDIR /app
#should be reassigned during docker run command
ENV BASTION_URL=""
ENV POSTGRES_URL=""
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV SSH_PRIVATE_KEY=""

#default
ENV USERNAME=ubuntu
ENV KEY_NAME=aws_pipeline_private_key.pem
ENV SSH_PATH=/root/.ssh
ENV KNOWN_HOSTS_PATH=$SSH_PATH/known_hosts
ENV COMMAND="yarn migration:run"

# add ssh because node image is alpine
RUN apk add --no-cache openssh

# add ssh path and change permissions
RUN  mkdir -p $SSH_PATH && chmod 700 $SSH_PATH  \
     # add private key to ssh folder and change permissions
     && touch $SSH_PATH/$KEY_NAME && chmod 400 $SSH_PATH/$KEY_NAME

           # register bastion server url to known host list and change permissions
ENTRYPOINT ssh-keyscan $BASTION_URL > $KNOWN_HOSTS_PATH && chmod 600 $KNOWN_HOSTS_PATH \
           # write private RSA key to file
           && echo "$SSH_PRIVATE_KEY" > $SSH_PATH/$KEY_NAME \
           && ssh -i$SSH_PATH/$KEY_NAME -f -N -L 5432:$POSTGRES_URL:5432 $USERNAME@$BASTION_URL\
           && POSTGRES_PASSWORD=$POSTGRES_PASSWORD POSTGRES_USER=$POSTGRES_USER POSTGRES_DB=$POSTGRES_DB  $COMMAND \
           # clear key from file
           && echo "" > $SSH_PATH/$KEY_NAME

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

USER node
CMD ["node", "dist/main"]
