import * as functions from "firebase-functions";
import { stripe, db, stripeClientId } from "./config";
import { createCustomer } from "./helpers";
import * as admin from "firebase-admin";

export const createStripeCustomer = functions.auth

  .user()
  .onCreate((user) => {
    return createCustomer(user)
      .then(customer => {
        /// update Firestore with stripe customer id
        const data = { stripeCustomerId: customer.id };
        const updates = {}
        updates[`/customers/${customer.id}`] = user.data.uid
        updates[`/users/${user.data.uid}/customerId`] = customer.id
        return admin.database().ref().update(updates);
      })
      .catch(console.log);
  });
