"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const http = require("request-promise");
/////  USER MANAGEMENT ///////
// Authenticates Firebase user on HTTP functions, used as expressJS middleware
function authenticateUser(req, res, next) {
    let authToken;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")) {
        authToken = req.headers.authorization.split("Bearer ")[1];
    }
    else {
        res
            .status(403)
            .send('Must provide a header that looks like "Authorization: Bearer <Firebase ID Token>"');
    }
    config_1.auth
        .verifyIdToken(authToken)
        .then(decodedToken => {
        req.user = decodedToken;
        next();
    })
        .catch(err => res.status(403).send(err));
}
exports.authenticateUser = authenticateUser;
// Returns the user document data from Firestore
function getUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield config_1.db
            .ref(`/users/${userId}`)
            .once('value')
            .then(snapshot => {
            return snapshot.val();
        });
    });
}
exports.getUser = getUser;
;
// // Returns the user document data from Firestore
// Takes a Firebase user and creates a Stripe customer account
function createCustomer(firebaseUser) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield config_1.stripe.customers.create({
            email: firebaseUser.data.email,
            metadata: { firebaseUID: firebaseUser.data.uid }
        });
    });
}
exports.createCustomer = createCustomer;
// Takes a Firebase user and creates a Stripe customer account
function deleteCustomer(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(userId);
        return yield config_1.stripe.customers.del(user.customerId);
    });
}
exports.deleteCustomer = deleteCustomer;
function getCustomer(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(userId);
        const customerId = user.customerId;
        return yield config_1.stripe.customers.retrieve(customerId);
    });
}
exports.getCustomer = getCustomer;
/////  CHARGES and SOURCES ///////
// Looks for payment source attached to user, otherwise it creates it.
function attachSource(userId, sourceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield getCustomer(userId);
        const existingSource = customer.sources.data
            .filter(source => source.id === sourceId)
            .pop();
        if (existingSource) {
            return existingSource;
        }
        else {
            return yield config_1.stripe.customers.createSource(customer.id, {
                source: sourceId
            });
        }
    });
}
exports.attachSource = attachSource;
// Charges customer with supplied source and amount
function createCharge(userId, sourceId, amount, currency) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(userId);
        const customerId = user.customerId;
        console.log(user.email);
        const card = yield attachSource(userId, sourceId);
        return yield config_1.stripe.charges.create({
            amount: amount,
            currency: currency || "gbp",
            customer: customerId,
            source: sourceId,
            receipt_email: user.email
        });
    });
}
exports.createCharge = createCharge;
/////  RETRIEVE DATA from STRIPE ///////
// Returns all charges associated with a user/customer
function getUserCharges(userId, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(userId);
        const customerId = user.customerId;
        return yield config_1.stripe.charges.list({
            limit,
            customer: customerId
        });
    });
}
exports.getUserCharges = getUserCharges;
/////  SUBSCRIPTIONS ///////
// Creates a subscription
function createSubscription(userId, sourceId, planId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(userId);
        const customerId = user.customerId;
        const card = yield attachSource(userId, sourceId);
        const subscription = yield config_1.stripe.subscriptions.create({
            customer: customerId,
            items: [
                {
                    plan: planId
                }
            ]
        });
        yield config_1.db.ref(`/users/${userId}/subscriptions`)
            .update({
            status: 'active',
            productId: planId
        });
        return subscription;
    });
}
exports.createSubscription = createSubscription;
// Cancel/pause a subscription
function cancelSubscription(userId, planId) {
    return __awaiter(this, void 0, void 0, function* () {
        const subscription = yield getSubscription(userId, planId);
        let cancellation;
        // Possible cancellation already occured in Stripe
        if (subscription) {
            cancellation = yield config_1.stripe.subscriptions.del(subscription.id);
        }
        yield config_1.db
            .ref(`/users/${userId}/subscriptions`)
            .update({
            status: "cancelled",
            productId: ""
        });
        return cancellation;
    });
}
exports.cancelSubscription = cancelSubscription;
// recurringPayment is called by a Stripe webhook
function recurringPayment(customerId, planId, hook) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield config_1.stripe.customers.retrieve(customerId);
        const userId = customer.metadata.firebaseUID;
        let status;
        // Payment succeeded
        if (hook === "invoice.payment_succeeded") {
            status = "active";
        }
        // Payment failed
        if (hook === "invoice.payment_failed") {
            status = "cancelled";
        }
        yield config_1.db
            .ref(`/users/${userId}/subscriptions`)
            .update({
            status: status,
        });
    });
}
exports.recurringPayment = recurringPayment;
function getSubscription(userId, planId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(userId);
        const customer = user.customerId;
        const stripeSubs = yield config_1.stripe.subscriptions.list({
            customer,
            plan: planId
        });
        return stripeSubs.data[0];
    });
}
exports.getSubscription = getSubscription;
function getDistanceMatrix(res, req, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${req.query.Origin}&destinations=${req.query.Destination}&mode=driving&language=en-GB&key=${apiKey}`;
        return yield http
            .get(url)
            .then(response => {
            return response;
        })
            .catch(err => {
            return err;
        });
    });
}
exports.getDistanceMatrix = getDistanceMatrix;
function getLookupTable(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const Name = req.query.Name;
        return yield config_1.db
            .ref(`/lookups/${Name}`)
            .once("value")
            .then(snapshot => {
            return snapshot.val();
        });
    });
}
exports.getLookupTable = getLookupTable;
//# sourceMappingURL=helpers.js.map