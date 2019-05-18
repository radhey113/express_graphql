`use strict`;

/**
 * Required modules
 */
require('dotenv').config();
const express = require(`express`);
const body_parser = require(`body-parser`);
const graphqlHTTP = require(`express-graphql`);
const {server_config} = require(`./config`);
const { resolvers, graphqlSchemas } = require(`./graphql`);
const db_connect = require(`./db/connect`);
const app = express();

/**
 * Request body parser
 */
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

/**
 * Render static file on browser
 */
app.use(express.static(`public`));

/**
 * All unhandle rejetion comes here
 */
process.on(`unhandledRejection`, rejection => {
    console.log(`Rejection: `);
    console.log(rejection);
});

/**
 * All unhandle exception comes here
 */
process.on(`uncaughtException`, exception => {
    console.log(`Exception: `);
    console.log(exception);
});


/**
 * Graphql end point intializatoin
 * Graph ql operation type
 *        1: Query
 *        2: Mutation
 *        3: Subscription
 *
 * type is just like the type of data which your method will return
 * query is used for getting data from the server, we need to send the query as a sting and graph ql will parse it to understand
 * mutations is used to manupulate the data, it uses the input type of graphql to get the inputs
 * subscription has not used here, but these are used for the realtime communication between server and client
 */
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchemas,
    rootValue: resolvers,
    graphiql: true,
    customFormatErrorFn(err) {
        if (!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || `Something went wrong!`;
        const status = err.originalError.code || 500;
        return {message, status, data};
    }
}));

/**
 * Connect mongodb
 */
db_connect().then(result => {
    console.log(`Mongodb successfully connected...`);
    start_server(app);
}).catch(error => {
    console.log(`Error:  ${JSON.stringify(error)}`);
});

/**
 * Server listen
 */
const start_server = () => {
    app.listen(server_config.port, () => {
        console.log(`Server is running ${server_config.port}`)
    });
};
