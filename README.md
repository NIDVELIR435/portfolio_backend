## Installation

```bash
$ yarn;
$ docker compose up -d;
```

## Running the app
```bash
# start postgres
$ docker start cmc-backend_db_1;

# development
$ yarn start
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
