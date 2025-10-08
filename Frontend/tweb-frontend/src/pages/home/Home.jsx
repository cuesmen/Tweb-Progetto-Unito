import { useState } from "react";
import axios from "axios";
import DefaultPage from "../../components/DefaultPage";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);
    setErr(null);
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/movies/1000005",
        { headers: { Accept: "application/json" } }
      );
      setResult(data);
      alert("OK:\n" + JSON.stringify(data).slice(0, 300) + "...");
    } catch (e) {
      const status = e?.response?.status;
      const payload = e?.response?.data;
      setErr({ status, payload, message: e.message });
      alert(
        `ERR ${status ?? ""}:\n` +
          (typeof payload === "string"
            ? payload
            : JSON.stringify(payload, null, 2))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultPage loadingMessage="Caricamento home…">
      <div className="home-page">
        <h1>Benvenuto su MoviePoint</h1>
        <p>Esplora il nostro vasto catalogo di film e serie TV. Trova i tuoi preferiti, guarda trailer e leggi recensioni.</p>
        <p>Inizia la tua avventura cinematografica con noi!</p>

        <button onClick={testConnection} disabled={loading}>
          {loading ? "Testing…" : "Test Connection"}
        </button>

        <pre style={{marginTop:12, padding:8, background:"#111", color:"#0f0", whiteSpace:"pre-wrap", wordBreak:"break-word"}}>
          {result
            ? JSON.stringify(result, null, 2)
            : err
            ? JSON.stringify(err, null, 2)
            : "—"}
        </pre>
      </div>
    </DefaultPage>
  );
}
