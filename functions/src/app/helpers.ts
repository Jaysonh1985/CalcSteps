import { stripe, db, auth } from "./config";
import { isAdmin } from "../../../node_modules/@firebase/util";
import * as http from "request-promise";

/////  USER MANAGEMENT ///////

// Authenticates Firebase user on HTTP functions, used as expressJS middleware
export function authenticateUser(req, res, next): void {
  let authToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    authToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    res
      .status(403)
      .send(
        'Must provide a header that looks like "Authorization: Bearer <Firebase ID Token>"'
      );
  }

  auth
    .verifyIdToken(authToken)
    .then(decodedToken => {
      req.user = decodedToken;
      next();
    })
    .catch(err => res.status(403).send(err));
}

// Returns the user document data from Firestore
export async function getUser(userId: string): Promise<any> {
  return await db
    .ref(`/users/${userId}`)
    .once('value')
    .then(snapshot => {
      return snapshot.val();
    })
};
// // Returns the user document data from Firestore
// Takes a Firebase user and creates a Stripe customer account
export async function createCustomer(firebaseUser: any): Promise<any> {
  return await stripe.customers.create({
    email: firebaseUser.data.email,
    metadata: { firebaseUID: firebaseUser.data.uid }
  });
}
// Takes a Firebase user and creates a Stripe customer account
export async function deleteCustomer(userId: string): Promise<any> {
  const user = await getUser(userId);
  return await stripe.customers.del(user.customerId);
}
export async function getCustomer(userId: string): Promise<any> {
  const user = await getUser(userId);
  const customerId = user.customerId;
  return await stripe.customers.retrieve(customerId);
}
/////  CHARGES and SOURCES ///////
// Looks for payment source attached to user, otherwise it creates it.
export async function attachSource(
  userId: string,
  sourceId: string
): Promise<any> {
  const customer = await getCustomer(userId);

  const existingSource = customer.sources.data
    .filter(source => source.id === sourceId)
    .pop();

  if (existingSource) {
    return existingSource;
  } else {
    return await stripe.customers.createSource(customer.id, {
      source: sourceId
    });
  }
}

// Charges customer with supplied source and amount
export async function createCharge(
  userId: string,
  sourceId: string,
  amount: number,
  currency?: string
): Promise<any> {
  const user = await getUser(userId);
  const customerId = user.customerId;
  console.log(user.email)

  const card = await attachSource(userId, sourceId);

  return await stripe.charges.create({
    amount: amount,
    currency: currency || "gbp",
    customer: customerId,
    source: sourceId,
    receipt_email: user.email
  });
}

/////  RETRIEVE DATA from STRIPE ///////

// Returns all charges associated with a user/customer
export async function getUserCharges(
  userId: string,
  limit?: number
): Promise<any> {
  const user = await getUser(userId);
  const customerId = user.customerId;

  return await stripe.charges.list({
    limit,
    customer: customerId
  });
}

/////  SUBSCRIPTIONS ///////

// Creates a subscription
export async function createSubscription(
  userId: string,
  sourceId: string,
  planId: string
): Promise<any> {
  const user = await getUser(userId);
  const customerId = user.customerId;

  const card = await attachSource(userId, sourceId);

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        plan: planId
      }
    ]
  });

  await db.ref(`/users/${userId}/subscriptions`)
    .update({
      status: 'active',
      productId: planId
    });

  return subscription;
}

// Cancel/pause a subscription
export async function cancelSubscription(
  userId: string,
  planId: string
): Promise<any> {
  const subscription = await getSubscription(userId, planId);

  let cancellation;

  // Possible cancellation already occured in Stripe
  if (subscription) {
    cancellation = await stripe.subscriptions.del(subscription.id);
  }

  await db
    .ref(`/users/${userId}/subscriptions`)
    .update({
      status: "cancelled",
      productId: ""
    });

  return cancellation;
}

// recurringPayment is called by a Stripe webhook

export async function recurringPayment(
  customerId: string,
  planId: string,
  hook: string
): Promise<any> {
  const customer = await stripe.customers.retrieve(customerId);
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

  await db
    .ref(`/users/${userId}/subscriptions`)
    .update({
      status: status,
    });
}

export async function getSubscription(
  userId: string,
  planId: string
): Promise<any> {
  const user = await getUser(userId);
  const customer = user.customerId;

  const stripeSubs = await stripe.subscriptions.list({
    customer,
    plan: planId
  });
  return stripeSubs.data[0];
}

export async function getDistanceMatrix(res, req,apiKey): Promise<any> {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${req.query.Origin}&destinations=${req.query.Destination}&mode=driving&language=en-GB&key=${apiKey}`;
    return await http
    .get(url)
    .then(response => {
      return response;
    })
    .catch(err => {
      return err;
    });
}
export async function getLookupTable(req): Promise<any> {
  const Name = req.query.Name
  return await db
    .ref(`/lookups/${Name}`)
    .once("value")
    .then(snapshot => {
      return snapshot.val();
    });
}
