/**
 * Created by Faysal on 2/21/2016.
 */
Schemas = {};
UserInformation = new Mongo.Collection('userInformation');
/**
 * Profile for User Schema.
 * Its almost same as Meteor.users.profile
 * User roles : admin, user
 */
Schemas.UserProfile = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    id: {
        type: String,
        optional: true
    },
    age: {
        type: Number,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ["male", "female"]
    },
    major: {
        type: String
    }
});

Schemas.Questionnaires = new SimpleSchema({
    believe: {
        type: Number

    },
    honest: {
        type: Number
    },
    prefer: {
        type: Number
    },
    mostHonest: {
        type: Number,
        allowedValues: [1,2,3,4]
    }
});

/**
 * Users Schema
 * Same as Meteor.users
 * @type {SimpleSchema}
 */
Schemas.User = new SimpleSchema({
    profile: {
        type: Schemas.UserProfile,
        optional: true
    },
    questionnaires: {
        type: Schemas.Questionnaires,
        optional: true
    }

});

UserInformation.attachSchema(Schemas.User);