import { useState, useEffect } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState(10);
  const [style, setStyle] = useState("academic");
  const [requirements, setRequirements] = useState("");
  const [status, setStatus] = useState("idle");
  const [resultLink, setResultLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setStatus("loading");
    setResultLink("");
    setError("");

    try {
      const response = await fetch("/api/presentation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          slides_count: slides,
          style,
          requirements: requirements || ""
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка сервера");
      }

      const data = await response.json();
      setResultLink(data.presentation || data.result || "#");
      setStatus("done");
    } catch (err) {
      console.error("Ошибка:", err);
      setStatus("error");
      setError("Не удалось создать презентацию. Попробуйте позже.");
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <h2>Презентация за 15 минут</h2>
      <p style={{ fontSize: 14, opacity: 0.8 }}>
        Введите тему, выберите количество слайдов и стиль — ИИ подготовит структуру и текст.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Тема презентации
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            placeholder="Например: «Влияние ИИ на высшее образование»"
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Количество слайдов
          <select
            value={slides}
            onChange={(e) => setSlides(Number(e.target.value))}
            style={{ width: "100%", marginTop: 4 }}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </label>

        <label>
          Стиль оформления
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={{ width: "100%", marginTop: 4 }}
          >
            <option value="academic">Академический</option>
            <option value="creative">Креативный</option>
            <option value="minimal">Минимализм</option>
          </select>
        </label>

        <label>
          Особые требования (опционально)
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={2}
            placeholder="Например: добавить слайд с выводами и списком литературы"
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            marginTop: 8,
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: status === "loading" ? "#9aa5c1" : "#4c6fff",
            color: "white",
            fontWeight: 600,
          }}
        >
          {status === "loading" ? "Генерирую..." : "Создать презентацию"}
        </button>
      </form>

      {status === "error" && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#ffebee" }}>
          <strong>Ошибка!</strong>
          <p style={{ fontSize: 14, marginTop: 4 }}>{error}</p>
        </div>
      )}

      {status === "done" && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#e8f5e9" }}>
          <strong>Презентация готова!</strong>
          <p style={{ fontSize: 14, marginTop: 4 }}>
            {resultLink ? resultLink : "Результат получен от сервера"}
          </p>
          {resultLink && (
            <a 
              href={resultLink} 
              style={{ 
                display: "inline-block", 
                marginTop: 8, 
                padding: "8px 16px", 
                background: "#4c6fff", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: 6 
              }}
            >
              Скачать PPTX
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
