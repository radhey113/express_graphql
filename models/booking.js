`use strict`;

const mongoose = require(`mongoose`);

/**
 * Capital S because Schema is a constructor function
 */
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: `event`},
    creator: {type: Schema.Types.ObjectId, ref: `user`}
}, {timestamps: true});

/**
 * Export event model
 */
module.exports = mongoose.model(`booking`, bookingSchema);