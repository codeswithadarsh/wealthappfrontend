import { useEffect, useState } from "react";

function PushDebugInfo() {
  const [debugInfo, setDebugInfo] = useState({
    userAgent: "",
    platform: "",
    online: false,
    notificationPermission: "",
    isStandalone: false,
    serviceWorkerSupported: false,
    serviceWorkerController: false,
    pushManagerSupported: false,
    subscription: null,
    subscriptionEndpoint: "",
  });

  useEffect(() => {
    const loadDebugInfo = async () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      const serviceWorkerSupported = "serviceWorker" in navigator;
      const pushManagerSupported = "PushManager" in window;

      let subscription = null;
      let subscriptionEndpoint = "";

      if (serviceWorkerSupported) {
        try {
          const registration = await navigator.serviceWorker.ready;
          subscription = await registration.pushManager.getSubscription();

          if (subscription) {
            subscriptionEndpoint = subscription.endpoint;
          }
        } catch (e) {
          console.error(e);
        }
      }

      setDebugInfo({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        online: navigator.onLine,
        notificationPermission:
          typeof Notification !== "undefined"
            ? Notification.permission
            : "Not Supported",
        isStandalone,
        serviceWorkerSupported,
        serviceWorkerController: !!navigator.serviceWorker?.controller,
        pushManagerSupported,
        subscription: !!subscription,
        subscriptionEndpoint,
      });
    };

    loadDebugInfo();
  }, []);

  return (
    <div
      style={{
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        margin: 16,
        wordBreak: "break-word",
      }}
    >
      <h3>Push Debug Info</h3>

      <p><strong>User Agent:</strong> {debugInfo.userAgent}</p>
      <p><strong>Platform:</strong> {debugInfo.platform}</p>
      <p><strong>Online:</strong> {String(debugInfo.online)}</p>
      <p><strong>Notification Permission:</strong> {debugInfo.notificationPermission}</p>
      <p><strong>PWA Standalone:</strong> {String(debugInfo.isStandalone)}</p>
      <p><strong>Service Worker Supported:</strong> {String(debugInfo.serviceWorkerSupported)}</p>
      <p><strong>Service Worker Active:</strong> {String(debugInfo.serviceWorkerController)}</p>
      <p><strong>PushManager Supported:</strong> {String(debugInfo.pushManagerSupported)}</p>
      <p><strong>Push Subscription Exists:</strong> {String(debugInfo.subscription)}</p>

      {debugInfo.subscriptionEndpoint && (
        <p>
          <strong>Subscription Endpoint:</strong>
          <br />
          {debugInfo.subscriptionEndpoint}
        </p>
      )}
    </div>
  );
}

export default PushDebugInfo;