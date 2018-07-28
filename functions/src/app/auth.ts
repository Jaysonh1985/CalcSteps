import * as functions from "firebase-functions";
import { stripe, db, stripeClientId } from "./config";
import { createCustomer, getCustomer, deleteCustomer } from "./helpers";
import * as admin from "firebase-admin";

export const createStripeCustomer = functions.auth.user().onCreate(user => {
  return createCustomer(user)
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

export const deleteStripeCustomer = functions.auth.user().onDelete(user => {
  deleteCustomer(user.data.uid)
    .then(customer => {
      return admin
        .database()
        .ref(`/users/${user.data.uid}`)
        .remove();
    })
    .catch(console.log);
});
