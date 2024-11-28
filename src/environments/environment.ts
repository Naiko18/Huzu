// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const environment = {
  production: false,
  firebaseConfig :{
  apiKey: "AIzaSyCAfCf4lNU-0GUY8dMuU3A7u6StVsiBqi8",
  authDomain: "huzuaplicacion.firebaseapp.com",
  projectId: "huzuaplicacion",
  storageBucket: "huzuaplicacion.firebasestorage.app",
  messagingSenderId: "624857531316",
  appId: "1:624857531316:web:173187b653073cad97e8e1",
  measurementId: "G-Z24KG5HRFG"
  }
};
 
// Initialize Firebase


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
