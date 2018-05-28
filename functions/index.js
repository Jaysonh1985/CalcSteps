const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const stripe = require('stripe')(functions.config().stripe.testkey);

exports.createStripeCustomer = functions.auth.user().onCreate(event => {
  // user auth data
  const user = event.data;

  // register Stripe user
  return stripe.customers.create({
      email: user.email
    })
    .then(customer => {
      /// update database with stripe customer id

      const data = {
        customerId: customer.id
      }

      const updates = {}
      updates[`/customers/${customer.id}`] = user.uid
      updates[`/users/${user.uid}/customerId`] = customer.id


      return admin.database().ref().update(updates);
    });
});
exports.createSubscription = functions.database.ref('/users/{userId}/enterprise-membership/token').onWrite(event => {

  const tokenId = event.data.val();
  const userId = event.params.userId;


  if (!tokenId) throw new Error('token missing');

  return admin.database()
    .ref(`/users/${userId}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(user => {

      return stripe.subscriptions.create({
        customer: user.customerId,
        source: tokenId,
        items: [{
          plan: 'plan_Cwi9mPWRIyMUEp',
        }, ],
      });

    })
    .then(sub => {
      admin.database()
        .ref(`/users/${userId}/enterprise-membership`)
        .update({
          status: 'active',
          subscriptionId: sub.subscriptionId,
          productId: sub.productId,
          plan: sub.plan
        })


    })
    .catch(err => console.log(err))

});

exports.recurringPayment = functions.https.onRequest((req, res) => {

  const hook = req.body.type
  const data = req.body.data.object

  if (!data) throw new Error('missing data')

  return admin.database()
    .ref(`/customers/${data.customer}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then((userId) => {
      const ref = admin.database().ref(`/users/${userId}/enterprise-membership`)

      // Handle successful payment webhook
      if (hook === 'invoice.payment_succeeded') {
        return ref.update({
          status: 'active'
        });
      }

      // Handle failed payment webhook
      if (hook === 'invoice.payment_failed') {
        return ref.update({
          status: 'pastDue'
        });
      }


    })
    .then(() => res.status(200).send(`successfully handled ${hook}`))
    .catch(err => res.status(400).send(`error handling ${hook}`))


});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
