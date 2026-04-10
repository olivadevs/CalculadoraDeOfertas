interface BotonFlotanteCarritoProps {
  cantidadItems: number;
  onClick: () => void;
}

export default function BotonFlotanteCarrito({ cantidadItems, onClick }: BotonFlotanteCarritoProps) {
  const tieneItems = cantidadItems > 0;

  return (
    <button
      style={{
        ...estilos.boton,
        background: tieneItems ? "#3fb950" : "#30363d",
        boxShadow: tieneItems
          ? "0 4px 20px rgba(63,185,80,0.4)"
          : "0 4px 16px rgba(0,0,0,0.3)",
      }}
      onClick={onClick}
      aria-label={`Carrito de compras, ${cantidadItems} productos`}
    >
      {/* Ícono del carrito */}
      <span style={estilos.icono}>🛒</span>

      {/* Badge con cantidad — solo visible cuando hay ítems */}
      {tieneItems && (
        <span style={estilos.badge}>{cantidadItems}</span>
      )}
    </button>
  );
}

const estilos: Record<string, React.CSSProperties> = {
  boton: {
    position: "fixed",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 900,
    transition: "background 0.25s, box-shadow 0.25s, transform 0.15s",
  },
  icono: {
    fontSize: 24,
    lineHeight: 1,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "#f5c842",
    color: "#0f4c35",
    fontSize: 11,
    fontWeight: 900,
    fontFamily: "'Nunito', sans-serif",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5px",
    border: "2px solid #0d1117",
  },
};
