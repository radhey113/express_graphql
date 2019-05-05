`use strict`;

const mongoose = require(`mongoose`);

/**
 * Capital S because Schema is a constructor function
 */
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    creator: { type: Schema.Types.ObjectId, ref: `user` }
}, {
        timestamps: {
            createdAt: `createdAt`,
            updatedAt: `updatedAt`
        }
    })

/**
 * Export event model
 */
module.exports = mongoose.model(`event`, eventSchema);