import { ItemCarrito } from "../hooks/useCarrito";

// Formatea número como moneda ARS
const fmt = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 });

interface CarritoModalProps {
  items: ItemCarrito[];
  totalFinal: number;
  totalAhorrado: number;
  onEliminar: (id: string) => void;
  onVaciar: () => void;
  onCerrar: () => void;
}

export default function CarritoModal({
  items,
  totalFinal,
  totalAhorrado,
  onEliminar,
  onVaciar,
  onCerrar,
}: CarritoModalProps) {
  const hayItems = items.length > 0;

  return (
    // Overlay oscuro — clic fuera cierra el modal
    <div style={estilos.overlay} onClick={onCerrar}>
      {/* Contenedor del modal — detiene la propagación para no cerrar al hacer clic adentro */}
      <div style={estilos.modal} onClick={(e) => e.stopPropagation()}>

        {/* Encabezado */}
        <div style={estilos.header}>
          <h2 style={estilos.titulo}>Tu compra</h2>
          <button style={estilos.btnCerrar} onClick={onCerrar}>✕</button>
        </div>

        {/* Cuerpo */}
        <div style={estilos.cuerpo}>
          {!hayItems ? (
            <p style={estilos.vacio}>Todavía no agregaste productos</p>
          ) : (
            <>
              {/* Lista de ítems */}
              <ul style={estilos.lista}>
                {items.map((item, index) => {
                  const ahorro = item.precioOriginal - item.precioFinal;
                  return (
                    <li key={item.id} style={estilos.itemFila}>
                      <div style={estilos.itemInfo}>
                        <span style={estilos.itemNumero}>#{index + 1}</span>
                        <div style={estilos.itemPrecios}>
                          {/* Precio original tachado */}
                          <span style={estilos.precioOriginal}>{fmt(item.precioOriginal)}</span>
                          {/* Precio final */}
                          <span style={estilos.precioFinal}>{fmt(item.precioFinal)}</span>
                          {/* Ahorro individual */}
                          <span style={estilos.ahorroBadge}>Ahorrás {fmt(ahorro)}</span>
                        </div>
                      </div>
                      {/* Botón eliminar ítem */}
                      <button
                        style={estilos.btnEliminar}
                        onClick={() => onEliminar(item.id)}
                        aria-label="Eliminar producto"
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Separador */}
              <div style={estilos.separador} />

              {/* Totales */}
              <div style={estilos.totales}>
                <div style={estilos.totalFila}>
                  <span style={estilos.totalLabel}>Total</span>
                  <span style={estilos.totalValor}>{fmt(totalFinal)}</span>
                </div>
                <div style={estilos.totalFila}>
                  <span style={estilos.totalLabel}>Ahorrás</span>
                  <span style={estilos.ahorroValor}>{fmt(totalAhorrado)}</span>
                </div>
              </div>

              {/* Botón vaciar carrito */}
              <button style={estilos.btnVaciar} onClick={onVaciar}>
                Vaciar carrito
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const estilos: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 1000,
    padding: "0 0 0 0",
  },
  modal: {
    background: "#161b22",
    borderRadius: "20px 20px 0 0",
    width: "100%",
    maxWidth: 480,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 -4px 40px rgba(0,0,0,0.5)",
    border: "1px solid #30363d",
    animation: "subirModal 0.28s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 20px 16px",
    borderBottom: "1px solid #30363d",
    flexShrink: 0,
  },
  titulo: {
    margin: 0,
    color: "#e6edf3",
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "'Nunito', sans-serif",
  },
  btnCerrar: {
    background: "none",
    border: "none",
    color: "#8b949e",
    fontSize: 18,
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 8,
    lineHeight: 1,
  },
  cuerpo: {
    overflowY: "auto",
    padding: "16px 20px 24px",
    flex: 1,
  },
  vacio: {
    color: "#8b949e",
    textAlign: "center",
    fontSize: 14,
    margin: "32px 0",
    fontFamily: "'Nunito', sans-serif",
  },
  lista: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  itemFila: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#21262d",
    borderRadius: 12,
    padding: "12px 14px",
    border: "1px solid #30363d",
  },
  itemInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  itemNumero: {
    color: "#8b949e",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "'Nunito', sans-serif",
    flexShrink: 0,
  },
  itemPrecios: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  precioOriginal: {
    color: "#8b949e",
    fontSize: 12,
    textDecoration: "line-through",
    fontFamily: "'Nunito', sans-serif",
  },
  precioFinal: {
    color: "#e6edf3",
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "'Nunito', sans-serif",
  },
  ahorroBadge: {
    color: "#3fb950",
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "'Nunito', sans-serif",
  },
  btnEliminar: {
    background: "none",
    border: "none",
    color: "#8b949e",
    fontSize: 14,
    cursor: "pointer",
    padding: "4px 6px",
    borderRadius: 6,
    flexShrink: 0,
    marginLeft: 8,
    lineHeight: 1,
  },
  separador: {
    height: 1,
    background: "#30363d",
    margin: "16px 0",
  },
  totales: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 20,
  },
  totalFila: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: "#8b949e",
    fontSize: 14,
    fontFamily: "'Nunito', sans-serif",
  },
  totalValor: {
    color: "#e6edf3",
    fontSize: 18,
    fontWeight: 900,
    fontFamily: "'Nunito', sans-serif",
  },
  ahorroValor: {
    color: "#3fb950",
    fontSize: 18,
    fontWeight: 900,
    fontFamily: "'Nunito', sans-serif",
  },
  btnVaciar: {
    width: "100%",
    padding: "12px",
    background: "rgba(248,81,73,0.12)",
    border: "1px solid rgba(248,81,73,0.4)",
    borderRadius: 12,
    color: "#f85149",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
  },
};
