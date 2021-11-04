# charade

made with chakra-ui, express, graphQL and next-js

### The purpose of this project is to learn and practice concepts related to:<br />
> * Building a GraphQL API
> * Apollo
> * MVC Architectural Pattern
> * SQL

#### More specifically, I used the following:
> * Dependency injection
> * postgreSQL pgdmin and command line
> * typeORM (DBContext, Migration)
> * GraphQL (query, mutation,subscriptions and fragments)
> * file upload and websockets
> * HTTP (GET, POST, PUT, PATCH, DELETE, status codes)
> * complex database design (multiple foreign-key relation) 
> * styled-component library (chakra-UI)  
> * jsx, props, hooks, conditional rendering and custom hooks


_Note: Please excuse the large amount of comments in my code, they are used as notes for later review._

## features: <br />
users can create team, only the admin of the team have access to create channel and add new users to the team. <br />
admin of the team can also make the channels private, if needed. <br />
team members can dm each other. <br />
user session are managed with jwt tokens <br />
real-time messaging feature is implemented with graphql-subscription </br>
user can also send audio, files and other data. </br>

see the project: https://www.youtube.com/watch?v=BEIEE_k2gu8
