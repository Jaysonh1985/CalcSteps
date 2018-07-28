"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const helpers_1 = require("./helpers");
const admin = require("firebase-admin");
exports.createStripeCustomer = functions.auth
    .user()
    .onCreate((user) => {
    return helpers_1.createCustomer(user)
        .then(customer => {
        /// update Firestore with stripe customer id
        const data = { stripeCustomerId: customer.id };
        const updates = {};
        updates[`/customers/${customer.id}`] = user.data.uid;
        updates[`/users/${user.data.uid}/customerId`] = customer.id;
        return admin.database().ref().update(updates);
    })
        .catch(console.log);
});
//# sourceMappingURL=auth.js.map