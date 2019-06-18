# Express with GraphQL
## Description
##### It is a demo project with Graphql. 

## Pre-requisition
```
    1: Node 8+
    2: Mongodb 4+
    3: Graphql
```

## What is Graphql? 
##### GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

```
 Graph ql operation type
        1: Query
        2: Mutation
        3: Subscription

~Type~ is just like the type of data which your method will return.

~Query~ is used for getting data from the server, we need to send the query as a sting and graph ql will parse it to understand.

~Mutations~ is used to manupulate the data, it uses the input type of graphql to get the inputs.

~Subscription~ has not used here, but these are used for the realtime communication between server and client
```


## Set enviornment variable
```
    NODE_ENV=development
    SERVER_PORT=4003
    BASE_URL=http://localhost:4001
```

## Run the project
##### To run the project you need to go to the project working directory (`inside express_graphql`) and run these commands.
```
    1: npm install
    2: node index.js / npm start
```

Thank you

