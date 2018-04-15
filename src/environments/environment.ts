// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBM-ns8GzoibvP4ZOVaZ1MgpVLDnaNNw98",
    authDomain: "calc-steps.firebaseapp.com",
    databaseURL: "https://calc-steps.firebaseio.com",
    projectId: "calc-steps",
    storageBucket: "calc-steps.appspot.com",
    messagingSenderId: "468301501954"
  }
};
