self.addEventListener("push", (event) => {
  let data = { title: "Safe Money", body: "", url: "/" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: "Safe Money", body: event.data.text(), url: "/" };
    }
  }

  const options = {
    body: data.body,
    icon: "/logo192.png",
    badge: "/favicon.ico",
    vibrate: [200, 100, 200],
    data: { url: data.url }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const matchingClient = windowClients.find((client) => {
        return client.url === url || client.url.startsWith(url);
      });

      if (matchingClient) {
        return matchingClient.focus();
      }

      return clients.openWindow(url);
    })
  );
});
