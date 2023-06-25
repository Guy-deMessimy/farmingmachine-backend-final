<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# Farming Machine server 🫐

## Installation

Cloner le repo et lancer un `npm install` pour récupérer les dépendances. Se diriger ensuite vers le terminal et accéder à l'interface mysql

```sh
mysql -u root -p
```

puis créer la base pour que Prisma puisse y accéder

```sql
CREATE DATABASE IF NOT EXISTS farmingmachine;
```

quitter mysql avec `exit` et créer un fichier `.env` pour renseigner la variable pour la connexion a la db. Voir .env.example

```dosini
PRISMA_DATABASE_URL=mysql://root:password$@localhost:3306/farmingmachine
```

lancer le server sql local 

```sh
docker-compose up -d
```

lancer ensuite la migration Prisma

```sh
npx prisma migrate dev --name init
```

## Tools

Pour lancer Prisma studio

```sh
npx prisma studio
```

Une session sera lancée sur [localhost:5555](http://localhost:5555/)


Apollo sandbox playground

```sh
localhost:3000/graphql
```

Une session sera lancée sur [localhost:3000/graphql](http://localhost:3000/graphql)

Generate OpenAPI documentation 

```sh
localhost:3000/api
```
Une session sera lancée sur [localhost:3000/api](http://localhost:3000/api)

## Technical project structure

Prisma ORM est le pont entre la bdd et les services du backend

```sh
npx prisma init
```

Le shema Bdd Prisma est definit dans le dossier Prisma

```sh
schema.prisma
```

Mapper le modèle Prisma définit dans la bdd (execute la 1ere migration)

```sh
npx prisma migrate dev --name init
```

en cas d'ajout et/ou modifications du shema le script ci-dessous est à jouer

```sh
npm run migrate
```

pour reset la db

```sh
npm run reset
```
pour seed la db

```sh
npm run seed
```

Prisma client permet a Nest JS l'accès et la modification des données en bdd

```sh
prisma client
```

Data access layer : couche accès client à l'api (equivalent du controller en REST api)

```sh
couche resolver
```

Data access layer : definir le type des données entrantes

```sh
couche dto
```

Data access layer : couche logique métier

```sh
couche service
```

Data access layer : couche mutation de la bdd

```sh
couche repository
```

Data access layer : objet GraphQl pour typer la reponse server
```sh
resolver model
```

## Linter

```sh
npm run lint
```

## Nest Js CLI

Create service

```sh
nest g service ${name}
```

Generate a new controller

```sh
nest g resolver ${name}
```

Generate a new module

```sh
nest g module ${name}
```

Defines the interface for input or/and output within our system

```sh
nest g class ${name} 'user/dto/create-user.dto' --no-spec
```
