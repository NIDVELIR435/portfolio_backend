## Installation
```bash
# install all dependencies in your host  
$ yarn;
```

## Running the app
```bash
# rename create env or rename env.example to .env
$ mv .env.example .env
# will configure and start container in watch mode 
$ yarn docker:start;
```

## stop the app
```bash
# will stop related containers
$ yarn docker:stop;
```

## Swagger

To open swagger, open in your browser:
`http://localhost:3000/api/`

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
