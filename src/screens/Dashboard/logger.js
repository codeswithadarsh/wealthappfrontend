export const addDebugLog = (message, data = null) => {
  const logs = JSON.parse(
    localStorage.getItem("pushLogs") || "[]"
  );

  logs.push({
    time: new Date().toISOString(),
    message,
    data,
  });

  localStorage.setItem(
    "pushLogs",
    JSON.stringify(logs.slice(-100))
  );
};

export const clearDebugLogs = () => {
  localStorage.removeItem("pushLogs");
};