FROM node:19-alpine

# Create app directory
WORKDIR usr/src/app

#copy package and packege-lock
COPY package*.json ./

#install yarn
RUN npm install yarn -G
RUN yarn add pg

#install node_modules
RUN yarn

#build app sourse
COPY . .

#create build
RUN yarn build

EXPOSE 8080
# start the server using the production build
CMD ["node", "dist/main"]
