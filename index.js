`use strict`;

/**
 * Required modules
 */
require('dotenv').config();
const express = require(`express`);
const body_parser = require(`body-parser`);
const graphqlHTTP = require(`express-graphql`);
const { server_config } = require(`./config`);
const { buildSchema } = require('graphql');
const bcrypt = require(`bcryptjs`);
const { events } = require(`./mocks/events`);
const db_connect = require(`./db/connect`);
const { Event, User } = require('./models')
const app = express();

/**
 * Request body parser
 */
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

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
    schema: buildSchema(`

        type User {
            _id: ID!,
            email: String!
            password: String
        }

        type Event {
            _id: ID!
           title: String!
           description: String! 
           price: Float!
           date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
            users: [User!]!
        }

        type RootMutation {
            createEvents(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: async () => {
            try {
                let events = await Event.find({}).lean();
                return events;
            } catch (error) {
                throw error;
            }
        },
        users: async () => {
            try {
                let users = await User.find({}, { password: 0 }).lean();
                return users;
            } catch (error) {
                throw error;
            }
        },
        createEvents: async (args) => {
            try {
                let event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date),
                    creator: `5ccf37194f5381090e1251b3`
                });

                event = await event.save();
                let user = await User.findById(`5ccf37194f5381090e1251b3`);
                if (!user) {
                    throw new Error(`User not found!`);
                }

                user.createdEvents.push(event);
                await user.save();
                return { ...event._doc };
            } catch (error) {
                throw error;
            }
        },
        createUser: async (args) => {
            try {
                let isExist = await User.findOne({ email: args.userInput.email }).lean();
                if (isExist) {
                    throw new Error('User already exist')
                }
                let password = await bcrypt.hash(args.userInput.password, 10);
                args.userInput.password = password;

                let user = new User(args.userInput);
                user = await user.save();
                delete user._doc.password;
                return { ...user._doc, _id: user.id }
            } catch (error) {
                throw error;
            }
        }
    },
    graphiql: true,
    customFormatErrorFn(err) {
        if (!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || `Something went wrong!`;
        const status = err.originalError.code || 500;
        return { message, status, data };
    }
}))

/**
 * Connect mongodb
 */
db_connect().then(result => {
    console.log(`Mongodb successfully connected...`);
    start_server(app);
}).catch(error => {
    console.log(`Error:  ${JSON.stringify(error)}`);
})

/**
 * Server listen
 */
const start_server = () => {
    app.listen(server_config.port, () => {
        console.log(`Server is running ${server_config.port}`)
    });
}
