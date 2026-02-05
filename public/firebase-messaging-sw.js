importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyDb9lk0oyEUvGZwK1fEYcu6OsVpgkwN9kk',
  authDomain: 'vtrading-prod.firebaseapp.com',
  projectId: 'vtrading-prod',
  storageBucket: 'vtrading-prod.firebasestorage.app',
  messagingSenderId: '33026454370',
  appId: '1:33026454370:web:53095e36730086d7b0323b',
  measurementId: 'G-LQSG331GEV',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
