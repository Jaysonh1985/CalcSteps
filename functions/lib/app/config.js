"use strict";
//// Initialize Express App and Middleware ////
Object.defineProperty(exports, "__esModule", { value: true });
const CORS = require("cors");
exports.cors = CORS({ origin: true });
function corsMiddleware(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
}
const express = require("express");
exports.app = express();
const helpers_1 = require("./helpers");
exports.app.use(exports.cors);
exports.app.use(corsMiddleware);
exports.app.use(helpers_1.authenticateUser);
//// Initialize Firebase ////
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// //// Service account required for Stripe Connect OAuth
// const serviceAccount = require("../../credntials.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://stripe-elements.firebaseio.com"
// });
//// If not using Stripe Connect, initialize without service account
admin.initializeApp(functions.config().firebase);
exports.db = admin.database();
exports.auth = admin.auth();
//// Initalize Stripe NodeJS SDK ////
const Stripe = require("stripe");
// Possible bug with v1.0 and firebase-tools CLI
exports.stripeSecret = functions.config().stripe.secret;
exports.stripePublishable = functions.config().stripe.publishable;
exports.stripeClientId = functions.config().stripe.clientid; // only used for stripe connect
// export const stripeSecret = serviceAccount.stripe.secret;
// export const stripePublishable = serviceAccount.stripe.publishable;
// export const stripeClientId = serviceAccount.stripe.clientid;
exports.stripe = new Stripe(exports.stripeSecret);
//# sourceMappingURL=config.js.map