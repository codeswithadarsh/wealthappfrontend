import { useEffect, useState } from "react";

export default function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!isRunning || time <= 0) return;

    const id = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, time]);

  const startTimer = () => {
    const total =
      Number(input.h) * 3600 +
      Number(input.m) * 60 +
      Number(input.s);

    if (total > 0) {
      setTime(total);
      setIsRunning(true);
    }
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setInput({ h: 0, m: 0, s: 0 });
  };

  const format = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div style={{ width: 300, textAlign: "center" }}>
      <h2>{format(time)}</h2>

      {!isRunning && time === 0 && (
        <div>
          <input
            type="number"
            placeholder="HH"
            value={input.h}
            onChange={(e) => setInput({ ...input, h: e.target.value })}
          />
          <input
            type="number"
            placeholder="MM"
            value={input.m}
            onChange={(e) => setInput({ ...input, m: e.target.value })}
          />
          <input
            type="number"
            placeholder="SS"
            value={input.s}
            onChange={(e) => setInput({ ...input, s: e.target.value })}
          />
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        {!isRunning ? (
          <button onClick={startTimer}>Start</button>
        ) : (
          <button onClick={pauseTimer}>Pause</button>
        )}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}
