`use strict`;
const {User, Event, Booking} = require(`../../models`);
const bcrypt = require(`bcryptjs`);
const {MESSAGE, SERVER} = require(`../../utils/constants`);

/**
 * Return user data by id
 * @param userId
 * @returns {Promise<void>}
 */
const user = async userId => {
    let user_data = await User.findById(userId);
    return {...user_data._doc, createdEvents: await get_events.bind(this, user_data._doc.createdEvents)}
};

/**
 * Return user data by id
 * @param userId
 * @returns {Promise<void>}
 */
const get_events = async eventIds => {
    let events = await Event.find({_id: {$in: eventIds}}).lean();
    return events.map(async event => {
        return {
            ...event, creator: await user.bind(this, event.creator),
            date: new Date(event.date).toISOString(),
        };
    })
};

class AllResolver {
    constructor() {
    }

    async events() {
        try {
            let events = await Event.find({}).lean();
            return await get_events([events[0]._id]);

        } catch (error) {
            throw error;
        }
    }

    async users() {
        try {
            let users = await User.find({}, {password: 0}).populate('createdEvents').lean();
            return users;
        } catch (error) {
            throw error;
        }
    }

    async createEvents(args) {
        try {
            let user = await User.findById(`5ce064a825f359104f65adb1`);
            if (!user) {
                throw new Error(MESSAGE.USER_NOT_FOUNT);
            }

            let event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: user._doc._id
            });

            event = await event.save();
            user.createdEvents.push(event);
            await user.save();

            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user._doc
            };
        } catch (error) {
            throw error;
        }
    }

    async createUser(args) {
        try {
            let isExist = await User.findOne({email: args.userInput.email}).lean();
            if (isExist) {
                throw new Error(MESSAGE.USER_ALREADY_EXISTS);
            }
            let password = await bcrypt.hash(args.userInput.password, SERVER.ENCRYPTION_SALT);
            args.userInput.password = password;

            let user = new User(args.userInput);
            user = await user.save();
            delete user._doc.password;
            return {...user._doc, _id: user.id}
        } catch (error) {
            throw error;
        }
    }

    async bookings() {
        try {
            let allBoolings = await Booking.find().lean();
            return allBoolings.map(booking => {
                return {
                    ...booking,
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new Date(booking.updatedAt).toISOString()
                }
            })
        } catch (error) {
            throw error;
        }
    }

    async bookEvent(args) {
        try {
            let event = await Event.findById(args.eventId).lean();
            if (!event) {
                throw new Error('Event not exists!');
            }
            const booking = new Booking({
                user: `5ce064a825f359104f65adb1`,
                event: event
            });

            let result = await booking.save();
            return {
                ...result._doc,
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString(),
            }
        } catch (error) {
            throw error;
        }
    }
}

let resolvers = new AllResolver();
module.exports = resolvers;