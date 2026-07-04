import { postRequest } from "./apiClient"
import { API_ROUTES } from "../constants/apiRoutes"

const VAPID_PUBLIC_KEY =
  "BH-MRfAhJ61dwwaWRoMiI5GKVcJdFgw4CxVFX6h8esE_VVyoNFuvv1kBoR-GwZzSs3FopwkfTkuvMJ0xcbKSAmM"

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export const setupPushNotifications = async () => {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("Push notifications not supported")
      return false
    }

    const permission = await Notification.requestPermission()

    if (permission !== "granted") {
      console.log("Notification permission denied")
      return false
    }

    const registration = await navigator.serviceWorker.register("/service-worker.js")
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    })

    const response = await postRequest(API_ROUTES.NOTIFICATION_SUBSCRIBE, {
      subscription: subscription.toJSON(),
      deviceInfo: navigator.userAgent
    })

    if (response?.status === 1) {
      return true
    }

    return false
  } catch (error) {
    console.error("Push notification setup failed:", error)
    return false
  }
}

export const unsubscribePushNotifications = async () => {
  try {
    if (!("serviceWorker" in navigator)) {
      return
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      const endpoint = subscription.endpoint
      await subscription.unsubscribe()
      await postRequest(API_ROUTES.NOTIFICATION_UNSUBSCRIBE, { endpoint })
    }
  } catch (error) {
    console.error("Push notification unsubscribe failed:", error)
  }
}
