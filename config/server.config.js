`use strict`;

/**
 * Default setting
 */
let server_config = {
    host: process.env.SERVER_HOST || `localhost`,
    api_secret: process.env.API_SECRETE || `jdslakd43rrwef2qwr2oifj2fewij498f4ih8fur`,
    db_username: process.env.MONGO_USER,
    db_password: process.env.MONGO_PASSWORD
};

/**
 * Mongodb connection string from mongodb atlas https://clound.mongodb.org
 */
// server_config.db_connection_string = `mongodb+srv://${server_config.db_username}:${server_config.db_password}@cluster0-ial3m.mongodb.net/test?retryWrites=true`;
server_config.db_connection_string = `mongodb://localhost/graphql_test`;

/**
 * Select server config according to the deployemnt environment (prod/stagging/dev)
 */
if (process.env.NODE_ENV === `production`) {
    server_config.port = process.env.SERVER_PORT || 4001;
} else if (process.env.NODE_ENV === `stagging`) {
    server_config.port = process.env.SERVER_PORT || 4002;
} else {
    server_config.port = 4003;
}

module.exports = server_config;