import { useState, useCallback, useMemo } from "react";

// Tipo para cada configuración de descuento
interface Discount {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  calc: (price: number, qty: number) => number;
  minQty: number;
}

// Tipo para cada resultado calculado
interface DiscountResult {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  finalPrice: number;
  saved: number;
  pct: string;
  effectiveQty: number;
}

// Tipo para el estado de resultados
interface CalcResult {
  baseTotal: number;
  results: DiscountResult[];
  unitPrice: number;
  qty: number;
}

const DISCOUNTS: Discount[] = [
  {
    id: "2x1",
    label: "2×1",
    sublabel: "Llevás 2, pagás 1",
    icon: "🛒",
    calc: (price, qty) => {
      const pairs = Math.floor(qty / 2);
      const rest = qty % 2;
      return pairs * price + rest * price;
    },
    minQty: 2,
  },
  {
    id: "3x2",
    label: "3×2",
    sublabel: "Llevás 3, pagás 2",
    icon: "📦",
    calc: (price, qty) => {
      const groups = Math.floor(qty / 3);
      const rest = qty % 3;
      return groups * 2 * price + rest * price;
    },
    minQty: 3,
  },
  {
    id: "4x3",
    label: "4×3",
    sublabel: "Llevás 4, pagás 3",
    icon: "🎯",
    calc: (price, qty) => {
      const groups = Math.floor(qty / 4);
      const rest = qty % 4;
      return groups * 3 * price + rest * price;
    },
    minQty: 4,
  },
  {
    id: "4x2",
    label: "4×2",
    sublabel: "Llevás 4, pagás 2",
    icon: "🎁",
    calc: (price, qty) => {
      const groups = Math.floor(qty / 4);
      const rest = qty % 4;
      return groups * 2 * price + rest * price;
    },
    minQty: 4,
  },
  {
    id: "80off2nd",
    label: "80% 2da",
    sublabel: "80% off en la 2da unidad",
    icon: "🔥",
    calc: (price, qty) => {
      const pairs = Math.floor(qty / 2);
      const rest = qty % 2;
      return pairs * price + pairs * price * 0.2 + rest * price;
    },
    minQty: 2,
  },
  {
    id: "50off2nd",
    label: "50% 2da",
    sublabel: "50% off en la 2da unidad",
    icon: "⚡",
    calc: (price, qty) => {
      const pairs = Math.floor(qty / 2);
      const rest = qty % 2;
      return pairs * price + pairs * price * 0.5 + rest * price;
    },
    minQty: 2,
  },
  {
    id: "70off2nd",
    label: "70% 2da",
    sublabel: "70% off en la 2da unidad",
    icon: "💥",
    calc: (price, qty) => {
      const pairs = Math.floor(qty / 2);
      const rest = qty % 2;
      return pairs * price + pairs * price * 0.3 + rest * price;
    },
    minQty: 2,
  },
];

// Formatea número como moneda ARS
const fmt = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 });

export default function App() {
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [bankDiscount, setBankDiscount] = useState(10);
  const [bankEnabled, setBankEnabled] = useState(false);
  const [customPct, setCustomPct] = useState(10);

  const customDisc = useMemo<Discount>(() => ({
    id: "discCustom",
    label: `${customPct}% off`,
    sublabel: `Descuento directo ${customPct}%`,
    icon: "🏷️",
    calc: (price, qty) => price * qty * (1 - customPct / 100),
    minQty: 1,
  }), [customPct]);

  const toggleDiscount = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setResult(null);
  }, []);

  const calculate = () => {
    const p = parseFloat(price.replace(",", "."));
    if (!p || p <= 0) return;

    const effectiveBankDiscount = bankEnabled ? bankDiscount : 0;
    const baseTotal = p * qty;
    let results: DiscountResult[];

    if (selected.length === 0) {
      const finalPrice = baseTotal * (1 - effectiveBankDiscount / 100);
      const saved = baseTotal - finalPrice;
      const pct = ((saved / baseTotal) * 100).toFixed(1);
      results = [{ id: "bank-only", label: `${effectiveBankDiscount}% bancario`, sublabel: "Solo descuento bancario/billetera", icon: "🏦", finalPrice, saved, pct, effectiveQty: qty }];
    } else {
      results = selected.map((id) => {
        const disc = [...DISCOUNTS, customDisc].find((d) => d.id === id)!;
        const effectiveQty = Math.max(qty, disc.minQty);
        const priceAfterPromo = disc.calc(p, effectiveQty);
        const priceAfterBank = priceAfterPromo * (1 - effectiveBankDiscount / 100);
        const saved = p * effectiveQty - priceAfterBank;
        const pct = ((saved / (p * effectiveQty)) * 100).toFixed(1);
        return { id, label: disc.label, sublabel: disc.sublabel, icon: disc.icon, finalPrice: priceAfterBank, saved, pct, effectiveQty };
      });
    }

    results.sort((a, b) => a.finalPrice - b.finalPrice);
    setResult({ baseTotal, results, unitPrice: p, qty });
  };

  const reset = () => {
    setPrice("");
    setQty(1);
    setSelected([]);
    setResult(null);
  };

  const numSelected = selected.length;

  return (
    <div style={styles.root}>
      <style>{css}</style>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerBrandingRow}>
            <div style={styles.headerBadge}>Desarrollado por Oliva Devs</div>
            <img src="/app-icon.png" alt="Oliva Devs" style={styles.headerBadgeIcon} />
          </div>
          <h1 style={styles.title}>Calculadora<br />de Ofertas</h1>
          <p style={styles.subtitle}>Encontrá la mejor oferta antes de llegar a la caja</p>
        </div>

        {/* Entrada de precio */}
        <div style={styles.card}>
          <label style={styles.label}>💰 Precio de lista</label>
          <div style={styles.inputRow}>
            <span style={styles.currencySymbol}>$</span>
            <input
              style={styles.input}
              type="number"
              inputMode="decimal"
              placeholder="0,00"
              value={price}
              onChange={(e) => { setPrice(e.target.value); setResult(null); }}
            />
          </div>

          <label style={styles.label} className="mt">📦 Cantidad de unidades</label>
          <div style={styles.qtyRow}>
            <button style={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span style={styles.qtyVal}>{qty}</span>
            <button style={styles.qtyBtn} onClick={() => setQty(qty + 1)}>+</button>
          </div>
        </div>

        {/* Opciones de descuento */}
        <div style={styles.card}>
          <label style={styles.label}>🏷️ Tipo de descuento</label>
          <p style={styles.hint}>Podés seleccionar uno o varios para comparar</p>
          <div style={styles.grid}>
            {DISCOUNTS.map((d) => {
              const active = selected.includes(d.id);
              return (
                <button
                  key={d.id}
                  style={{ ...styles.discBtn, ...(active ? styles.discBtnActive : {}) }}
                  className={`disc-btn${active ? " active" : ""}`}
                  onClick={() => toggleDiscount(d.id)}
                >
                  <span style={styles.discIcon}>{d.icon}</span>
                  <span style={styles.discLabel}>{d.label}</span>
                  <span style={styles.discSub}>{d.sublabel}</span>
                  {active && <span style={styles.check}>✓</span>}
                </button>
              );
            })}
          </div>

          {/* Slider de porcentaje directo */}
          <div style={styles.sliderSection}>
            <div style={styles.sliderHeader}>
              <span style={styles.sliderTitle}>🏷️ % Descuento directo</span>
              <span style={styles.sliderBadge}>{customPct}% off</span>
            </div>
            <input
              type="range"
              min={1}
              max={99}
              value={customPct}
              onChange={(e) => {
                setCustomPct(Number(e.target.value));
                setResult(null);
              }}
              className="pct-slider"
              style={styles.slider}
            />
            <div style={styles.sliderTicks}>
              <span>1%</span><span>25%</span><span>50%</span><span>75%</span><span>99%</span>
            </div>
            <button
              style={{ ...styles.discBtn, ...styles.sliderToggle, ...(selected.includes("discCustom") ? styles.discBtnActive : {}) }}
              className={`disc-btn${selected.includes("discCustom") ? " active" : ""}`}
              onClick={() => toggleDiscount("discCustom")}
            >
              <span style={styles.discIcon}>{customDisc.icon}</span>
              <span style={styles.discLabel}>{customDisc.label}</span>
              <span style={styles.discSub}>{customDisc.sublabel}</span>
              {selected.includes("discCustom") && <span style={styles.check}>✓</span>}
            </button>
          </div>
        </div>

        {/* Descuento bancario o billetera */}
        <div style={styles.card}>
          <label style={styles.label}>🏦 Descuento bancario o billetera</label>
          <p style={styles.hint}>Se aplica sobre el total final (Naranja X, Modo, Galicia, etc.)</p>
          <div style={styles.sliderSection}>
            <div style={styles.sliderHeader}>
              <span style={styles.sliderTitle}>
                {bankEnabled ? `${bankDiscount}% de descuento` : "Sin descuento bancario"}
              </span>
              <button
                style={{ ...styles.bankToggle, ...(bankEnabled ? styles.bankToggleActive : {}) }}
                onClick={() => { setBankEnabled((v) => !v); setResult(null); }}
              >
                {bankEnabled ? "Activado ✓" : "Activar"}
              </button>
            </div>
            {bankEnabled && (
              <>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={bankDiscount}
                  onChange={(e) => { setBankDiscount(Number(e.target.value)); setResult(null); }}
                  className="pct-slider"
                  style={styles.slider}
                />
                <div style={styles.sliderTicks}>
                  <span>5%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Botón calcular */}
        <button
          style={{
            ...styles.calcBtn,
            ...((!price || (numSelected === 0 && !bankEnabled)) ? styles.calcBtnDisabled : {}),
          }}
          className="calc-btn"
          onClick={calculate}
          disabled={!price || (numSelected === 0 && !bankEnabled)}
        >
          Calcular {numSelected > 0 ? `(${numSelected} descuento${numSelected > 1 ? "s" : ""})` : ""}
        </button>

        {/* Resultados */}
        {result && (
          <div style={styles.resultsWrap} className="results-in">
            <h2 style={styles.resultsTitle}>Resultados</h2>
            <p style={styles.resultsBase}>
              Precio sin descuento ({result.qty} u.): <strong>{fmt(result.baseTotal)}</strong>
            </p>

            {result.results.map((r, i) => (
              <div
                key={r.id}
                style={{
                  ...styles.resultCard,
                  ...(i === 0 ? styles.resultCardBest : {}),
                }}
                className="result-card"
              >
                {i === 0 && <div style={styles.bestBadge}>⭐ MEJOR OPCIÓN</div>}
                <div style={styles.resultHeader}>
                  <span style={styles.resultIcon}>{r.icon}</span>
                  <div>
                    <div style={styles.resultLabel}>{r.label}</div>
                    <div style={styles.resultSub}>{r.sublabel}</div>
                  </div>
                </div>
                <div style={styles.resultPriceRow}>
                  <div>
                    <div style={styles.resultPriceLabel}>Pagás (total)</div>
                    <div style={{ ...styles.resultPrice, ...(i === 0 ? styles.resultPriceBest : {}) }}>
                      {fmt(r.finalPrice)}
                    </div>
                    <div style={styles.resultPriceLabel}>
                      Precio por unidad: <strong style={{color: "#1a7a52"}}>{fmt(r.finalPrice / r.effectiveQty)}</strong>
                    </div>
                  </div>
                  <div style={styles.resultSaving}>
                    <div style={styles.savingPct}>−{r.pct}%</div>
                    <div style={styles.savingAmt}>Ahorrás {fmt(r.saved)}</div>
                  </div>
                </div>
                {r.effectiveQty !== result.qty && (
                  <p style={styles.noteQty}>* Calculado para {r.effectiveQty} unidades (mínimo de esta oferta)</p>
                )}
              </div>
            ))}

            <button style={styles.resetBtn} className="reset-btn" onClick={reset}>
              Nueva consulta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f4c35 0%, #1a7a52 50%, #0d3d2b 100%)",
    fontFamily: "'Nunito', sans-serif",
    padding: "0 0 48px",
  },
  container: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "0 16px",
  },
  header: {
    textAlign: "center",
    padding: "40px 0 28px",
  },
  headerBrandingRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  headerBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
    color: "#0f4c35",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1,
    padding: "4px 12px",
    borderRadius: 20,
  },
  headerBadgeIcon: {
    width: 27,
    height: 27,
    objectFit: "contain",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: 900,
    margin: "0 0 8px",
    lineHeight: 1.15,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    margin: 0,
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "20px 20px 24px",
    marginBottom: 14,
    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
  },
  label: {
    display: "block",
    fontWeight: 800,
    fontSize: 14,
    color: "#0f4c35",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  hint: {
    fontSize: 12,
    color: "#888",
    margin: "-6px 0 12px",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    border: "2.5px solid #e0e0e0",
    borderRadius: 12,
    overflow: "hidden",
    transition: "border-color 0.2s",
  },
  currencySymbol: {
    padding: "0 14px",
    fontSize: 22,
    fontWeight: 900,
    color: "#1a7a52",
    background: "#f0faf5",
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 26,
    fontWeight: 800,
    padding: "14px 16px",
    color: "#111",
    fontFamily: "'Nunito', sans-serif",
    background: "transparent",
    width: "100%",
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginTop: 4,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "none",
    background: "#f0faf5",
    color: "#0f4c35",
    fontSize: 22,
    fontWeight: 900,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  },
  qtyVal: {
    fontSize: 28,
    fontWeight: 900,
    color: "#0f4c35",
    minWidth: 40,
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  discBtn: {
    position: "relative",
    background: "#f7f7f7",
    border: "2.5px solid #e8e8e8",
    borderRadius: 14,
    padding: "12px 10px 10px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.18s",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  discBtnActive: {
    background: "#f0faf5",
    border: "2.5px solid #1a7a52",
  },
  discIcon: { fontSize: 20, marginBottom: 2 },
  discLabel: { fontWeight: 900, fontSize: 15, color: "#111" },
  discSub: { fontSize: 11, color: "#666", lineHeight: 1.3 },
  check: {
    position: "absolute",
    top: 8,
    right: 10,
    background: "#1a7a52",
    color: "#fff",
    borderRadius: "50%",
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 900,
  },
  calcBtn: {
    width: "100%",
    padding: "18px",
    background: "#f5c842",
    border: "none",
    borderRadius: 16,
    fontSize: 17,
    fontWeight: 900,
    color: "#0f4c35",
    cursor: "pointer",
    letterSpacing: 0.3,
    boxShadow: "0 4px 20px rgba(245,200,66,0.4)",
    transition: "all 0.18s",
    marginBottom: 14,
  },
  calcBtnDisabled: {
    background: "#ccc",
    color: "#888",
    boxShadow: "none",
    cursor: "not-allowed",
  },
  resultsWrap: { marginTop: 4 },
  resultsTitle: {
    color: "#fff",
    fontWeight: 900,
    fontSize: 22,
    margin: "0 0 8px",
  },
  resultsBase: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    margin: "0 0 14px",
  },
  resultCard: {
    background: "#fff",
    borderRadius: 18,
    padding: "16px 18px",
    marginBottom: 10,
    boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
    position: "relative",
    overflow: "hidden",
    border: "2.5px solid transparent",
  },
  resultCardBest: {
    border: "2.5px solid #f5c842",
    boxShadow: "0 4px 24px rgba(245,200,66,0.25)",
  },
  bestBadge: {
    background: "#f5c842",
    color: "#0f4c35",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1,
    padding: "3px 10px",
    borderRadius: 20,
    display: "inline-block",
    marginBottom: 10,
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  resultIcon: { fontSize: 24 },
  resultLabel: { fontWeight: 900, fontSize: 15, color: "#111" },
  resultSub: { fontSize: 12, color: "#666" },
  resultPriceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  resultPriceLabel: { fontSize: 12, color: "#888", marginBottom: 2 },
  resultPrice: { fontSize: 26, fontWeight: 900, color: "#333" },
  resultPriceBest: { color: "#0f4c35" },
  resultSaving: { textAlign: "right" },
  savingPct: {
    background: "#1a7a52",
    color: "#fff",
    fontWeight: 900,
    fontSize: 15,
    borderRadius: 8,
    padding: "3px 10px",
    marginBottom: 4,
    display: "inline-block",
  },
  savingAmt: { fontSize: 12, color: "#444", fontWeight: 700 },
  noteQty: { fontSize: 11, color: "#aaa", margin: "8px 0 0", fontStyle: "italic" },
  resetBtn: {
    width: "100%",
    padding: "14px",
    background: "rgba(255,255,255,0.12)",
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 800,
    color: "#fff",
    cursor: "pointer",
    marginTop: 6,
    transition: "background 0.18s",
  },
  sliderSection: {
    marginTop: 16,
    padding: "14px 14px 12px",
    background: "#f7f7f7",
    borderRadius: 14,
    border: "2px solid #e8e8e8",
  },
  sliderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sliderTitle: {
    fontWeight: 800,
    fontSize: 13,
    color: "#0f4c35",
  },
  sliderBadge: {
    background: "#1a7a52",
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    borderRadius: 8,
    padding: "2px 10px",
  },
  slider: {
    width: "100%",
    accentColor: "#1a7a52",
    cursor: "pointer",
    margin: "4px 0",
  },
  sliderTicks: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#aaa",
    marginBottom: 10,
  },
  sliderToggle: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
  },
  bankToggle: {
    padding: "6px 14px",
    borderRadius: 20,
    border: "2px solid #e8e8e8",
    background: "#f7f7f7",
    fontWeight: 800,
    fontSize: 13,
    color: "#888",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    transition: "all 0.18s",
  },
  bankToggleActive: {
    background: "#fff8e1",
    border: "2px solid #f5c842",
    color: "#0f4c35",
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; }
  .mt { margin-top: 18px !important; }
  .disc-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .disc-btn.active { transform: translateY(-1px); }
  .calc-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(245,200,66,0.5); }
  .calc-btn:not(:disabled):active { transform: translateY(0); }
  .reset-btn:hover { background: rgba(255,255,255,0.2); }
  .results-in { animation: slideUp 0.35s ease; }
  .result-card { animation: fadeIn 0.3s ease both; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  .pct-slider { height: 6px; border-radius: 4px; }
  .pct-slider::-webkit-slider-thumb { width: 22px; height: 22px; border-radius: 50%; background: #1a7a52; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer; -webkit-appearance: none; }
  .pct-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #1a7a52; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer; }
`;
