import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken
} from "firebase/messaging";
import { postRequest } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";

const firebaseConfig = {
  apiKey: "AIzaSyD9jVBd3prMoNfUNjEa05AS-1J8_eqN8Ow",
  authDomain: "nidhify-cd207.firebaseapp.com",
  projectId: "nidhify-cd207",
  storageBucket: "nidhify-cd207.firebasestorage.app",
  messagingSenderId: "995695015061",
  appId: "1:995695015061:web:eff7724dfccfab08c6179c",
  measurementId: "G-6EC21NZ25T"
};

const VAPID_PUBLIC_KEY =
  "BH-MRfAhJ61dwwaWRoMiI5GKVcJdFgw4CxVFX6h8esE_VVyoNFuvv1kBoR-GwZzSs3FopwkfTkuvMJ0xcbKSAmM";

initializeApp(firebaseConfig);

let messaging = null;
let currentFcmToken = null;

export const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const requestFcmToken = async () => {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    messaging = getMessaging();

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      return null;
    }

    currentFcmToken = token;

    onMessage(messaging, (payload) => {
      const { title, body } = payload.data || {};
      if (title || body) {
        const notification = new Notification(title || "WealthApp", {
          body: body || "",
          icon: "/logo192.png"
        });
        if (payload.data?.url) {
          notification.onclick = () => {
            window.open(payload.data.url, "_self");
          };
        }
      }
    });

    return token;
  } catch {
    return null;
  }
};

export const sendTokenToBackend = async (fcmToken) => {
  const response = await postRequest(API_ROUTES.NOTIFICATION_SUBSCRIBE, {
    fcmToken,
    deviceInfo: navigator.userAgent
  });
  return response;
};

export const removeFcmToken = async () => {
  if (!currentFcmToken) {
    return;
  }

  try {
    await postRequest(API_ROUTES.NOTIFICATION_UNSUBSCRIBE, {
      fcmToken: currentFcmToken
    });
  } catch {
  }

  try {
    if (messaging && currentFcmToken) {
      await deleteToken(messaging);
    }
  } catch {
  }

  currentFcmToken = null;
};

export const getCurrentFcmToken = () => currentFcmToken;
