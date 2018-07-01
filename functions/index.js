const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const http = require('requestify');
const cors = require('cors')({
  origin: true
});
const stripe = require('stripe')(functions.config().stripe.testkey);

exports.distanceMatrixProxy = functions.https.onRequest((req, res) => {

  /// Wrap request with cors
  cors(req, res, () => {

    /// Get the url params
    const Origin = req.query.Origin
    const Destination = req.query.Destination

    const url = formatUrl(Origin, Destination)
    /// Send request to DarkSky
    return http.get(url).then(response => {
        return res.status(200).send(response.getBody());
      })
      .catch(err => {
        return res.status(400).send(err)
      })

  });

});
exports.getLookupTable = functions.https.onRequest((req, res) => {
  /// Wrap request with cors
  cors(req, res, () => {
    /// Get the url params
    const Name = req.query.Name
    try {
      console.log(Name);
        const snapshot = admin.database().ref(`/lookups/${Name}`).once('value').then(snapshot => {
        console.log(snapshot);
        res.status(200).send(snapshot.val())
      })
    }
    catch (error) {
      console.log(error)
      return res.status(200).send(error);
    }
  });

});
/// Helper to format the request URL
function formatUrl(Origin, Destination) {
  const apiKey = functions.config().distancematrix.key
  return `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${Origin}&destinations=${Destination}&mode=driving&language=en-GB&key=${apiKey}`
}
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


exports.deleteStripeCustomer = functions.auth.user().onDelete(event => {
  const user = event.data;
  return admin.database()
    .ref(`/users/${user.uid}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(cus => {
      return stripe.customers.del(cus.customerId)
    })
    .then(getuser => {
      return admin.database()
        .ref(`/users/${user.uid}`)
        .once('value')
        .then(snapshot => snapshot.val())
    })
    .then(delcus => {
      return admin.database()
        .ref(`/customers/${delcus.customerId}`)
        .remove()
    })
    .then(sub => {
      return admin.database()
        .ref(`/users/${user.uid}`)
        .remove()
    })
})


exports.createSubscription = functions.database.ref('/users/{userId}/enterprisemembership/token').onWrite(event => {
  const tokenId = event.data.val();
  const userId = event.params.userId;
  if (!tokenId) throw new Error('token missing');
  return admin.database()
    .ref(`/users/${userId}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(user => {
      if (user.enterprisemembership.status === "pastDue") {
        console.log(user.customerId, "cusID")
        console.log(user.enterprisemembership.token, "tokeid")
        console.log(user.enterprisemembership.subscriptionId, "subID")
        stripe.customers.update(user.customerId, {source: user.enterprisemembership.token})
        return stripe.subscriptions.retrieve(
          user.enterprisemembership.subscriptionId);

      } else {
        return stripe.subscriptions.create({
          customer: user.customerId,
          source: tokenId,
          items: [{
            plan: 'plan_Cwi9mPWRIyMUEp',
          }, ],
        });
      }
    })
    .then(sub => {
      admin.database()
        .ref(`/users/${userId}/enterprisemembership`)
        .update({
          status: 'active',
          subscriptionId: sub.id,
          productId: sub.plan.id,
          plan: sub.plan.product
        })
    })
    .catch(err => console.log(err))
});

exports.cancelSubscription = functions.database.ref('/users/{userId}/enterprisemembership/status').onUpdate(event => {
  const userId = event.params.userId;
  return admin.database()
    .ref(`/users/${userId}/enterprisemembership`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(user => {
      if (user.status === "cancelled") {
        admin.database()
          .ref(`/users/${userId}/enterprisemembership`)
          .remove()
        return stripe.subscriptions.del(user.subscriptionId);
      }
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
      const ref = admin.database().ref(`/users/${userId}/enterprisemembership`)
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
      // Handle failed payment webhook
      if (hook === 'customer.subscription.deleted') {
        return ref.update({
          status: 'cancelled'
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
