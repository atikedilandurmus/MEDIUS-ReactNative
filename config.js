import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "****************************",
  authDomain: "mediusapp-264bc.firebaseapp.com",
  projectId: "mediusapp-264bc",
  storageBucket: "mediusapp-264bc.appspot.com",
  messagingSenderId: "150056978380",
  appId: "1:150056978380:web:ee74610303eda3d1cb7f69",
  measurementId: "G-CC7B1C8CYT"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export { firebase };