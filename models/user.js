`use strict`;

const mongoose = require(`mongoose`);

/**
 * Capital S because Schema is a constructor function
 */
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdEvents: [
        { type: Schema.Types.ObjectId, ref: 'event' }
    ]
}, {
        timestamps: {
            createdAt: `createdAt`,
            updatedAt: `updatedAt`
        }
    })

/**
 * Export event model
 */
module.exports = mongoose.model(`user`, userSchema);