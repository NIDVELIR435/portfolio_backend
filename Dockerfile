FROM node:19-alpine

# Create app directory
WORKDIR /app

#copy packages and env
COPY package*.json yarn.lock .env ./

#install yarn
RUN npm install yarn -G

#install node_modules
RUN yarn

#build app sourse
COPY . .

#create build
RUN yarn build

EXPOSE 8080
# start the server using the production build
CMD ["yarn start:prod"]
