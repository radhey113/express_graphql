`use strict`;

/**
 * Require modules
 */
const { db_connection_string } = require(`../config/server.config`);
const mongoose = require(`mongoose`);

/**
 * Connect mongodb
 */
module.exports = () => {
    return mongoose.connect(db_connection_string, { useNewUrlParser: true });
}


