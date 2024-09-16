"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const helpers_1 = require("./helpers");
const admin = require("firebase-admin");
exports.createStripeCustomer = functions.auth.user().onCreate(user => {
    return helpers_1.createCustomer(user)
        .then(customer => {
        /// update Firestore with stripe customer id
        const updates = {};
        updates[`/users/${user.data.uid}/customerId`] = customer.id;
        return admin
            .database()
            .ref()
            .update(updates);
    })
        .catch(console.log);
});
exports.deleteStripeCustomer = functions.auth.user().onDelete(user => {
    helpers_1.deleteCustomer(user.data.uid)
        .then(customer => {
        return admin
            .database()
            .ref(`/users/${user.data.uid}`)
            .remove();
    })
        .catch(console.log);
});
//# sourceMappingURL=auth.js.map