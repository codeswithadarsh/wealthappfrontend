import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY =
  "BH-MRfAhJ61dwwaWRoMiI5GKVcJdFgw4CxVFX6h8esE_VVyoNFuvv1kBoR-GwZzSs3FopwkfTkuvMJ0xcbKSAmM";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export default function PushDebugPage() {
  const [logs, setLogs] = useState([]);
  const [info, setInfo] = useState({});

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${time} - ${message}`]);
  };

  const loadInfo = async () => {
    try {
      addLog("Loading debug info...");

      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      const swSupported = "serviceWorker" in navigator;
      const pushSupported = "PushManager" in window;

      let subscription = null;
      let endpoint = "";

      if (swSupported) {
        const registration = await navigator.serviceWorker.ready;

        subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          endpoint = subscription.endpoint;
        }
      }

      setInfo({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        online: navigator.onLine,
        secureContext: window.isSecureContext,
        permission:
          typeof Notification !== "undefined"
            ? Notification.permission
            : "Not Supported",
        standalone: isStandalone,
        swSupported,
        pushSupported,
        hasSubscription: !!subscription,
        endpoint,
      });

      addLog(`Subscription exists: ${!!subscription}`);
    } catch (e) {
      addLog(`Load Error: ${e.name} - ${e.message}`);
    }
  };

  const testSubscribe = async () => {
    try {
      addLog("Starting subscription...");

      const permission = await Notification.requestPermission();

      addLog(`Permission: ${permission}`);

      if (permission !== "granted") {
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      addLog("Service Worker Ready");

      let subscription = await registration.pushManager.getSubscription();

      addLog(`Existing subscription: ${!!subscription}`);

      if (!subscription) {
        addLog("Creating subscription...");

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        addLog("Subscription created successfully");
        addLog(subscription.endpoint);
      } else {
        addLog("Already subscribed");
        addLog(subscription.endpoint);
      }

      await loadInfo();
    } catch (e) {
      addLog(`ERROR: ${e.name}`);
      addLog(`MESSAGE: ${e.message}`);
      console.error(e);
    }
  };

  useEffect(() => {
    loadInfo();
  }, []);

  const logss = JSON.parse(localStorage.getItem("pushLogs") || "[]");

  return (
    <div style={{ padding: 20 }}>
      <h2>Push Debug Page</h2>

      <button onClick={loadInfo}>Refresh Info</button>

      <button onClick={testSubscribe} style={{ marginLeft: 10 }}>
        Test Subscribe
      </button>

      <hr />

      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(info, null, 2)}
      </pre>

      <hr />

      <h3>Logs</h3>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          maxHeight: 400,
          overflow: "auto",
        }}
      >
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>

      <div>
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #ddd",
              padding: 8,
            }}
          >
            <div>{log.time}</div>
            <div>{log.message}</div>
            <pre>{JSON.stringify(log.data, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
