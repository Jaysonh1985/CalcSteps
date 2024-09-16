"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./app/config");
const auth = require("./app/auth");
const webhooks = require("./app/webhooks");
const connect = require("./app/connect");
const api_1 = require("./app/api");
// Main Authenticated User API
exports.app = api_1.api;
// Auth Functions
exports.createStripeCustomer = auth.createStripeCustomer;
exports.deleteStripeCustomer = auth.deleteStripeCustomer;
// Webhook Functions
exports.recurringPaymentWebhook = webhooks.recurringPaymentWebhook;
// Connect Functions
exports.stripeRedirect = connect.redirect;
exports.oauthCallback = connect.callback;
//# sourceMappingURL=index.js.map