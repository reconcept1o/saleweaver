import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDv1Wc537kHgipmYPBUugWZH2j9yVwYc_4",
  authDomain: "instagramseller-1bc24.firebaseapp.com",
  projectId: "instagramseller-1bc24",
  storageBucket: "instagramseller-1bc24.firebasestorage.app",
  messagingSenderId: "277359943415",
  appId: "1:277359943415:web:91464fef93333122c1fdf2",
  measurementId: "G-5533DJ3T2F",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// FCM token alma fonksiyonu
export const fetchFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BD76vScR-DuLGsxi9ARax2_hG0UWeZxPvkYFkKOpelkXa1pdgDjXvBmhAU_6zp9N0tVApHh1wKqFwa60tCBGJFc", // Firebase Console’dan alınan VAPID anahtarı
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Bildirim izni reddedildi.");
      return null;
    }
  } catch (error) {
    console.error("FCM token alınırken hata oluştu:", error);
    return null;
  }
};

// Gelen mesajları dinleme
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
