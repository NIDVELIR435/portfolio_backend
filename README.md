## Installation
```bash
# install all dependencies in your host(need only to show dependency your IDE)
$ yarn;
```

## Running the app
```bash
# will configure and start container in watch mode
# (all changes from host will be change application in docker container)
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
