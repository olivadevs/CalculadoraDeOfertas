import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

// Intervalo de verificación de actualizaciones: 1 hora en milisegundos
const INTERVALO_VERIFICACION = 60 * 60 * 1000

export default function ReloadPrompt() {
  const {
    needRefresh: [necesitaActualizar],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registro) {
      // Verifica actualizaciones cada hora mientras la app está abierta
      if (registro) {
        setInterval(() => registro.update(), INTERVALO_VERIFICACION)
      }
    },
  })

  // No renderiza nada si no hay actualización disponible
  if (!necesitaActualizar) return null

  return (
    <div style={estilos.contenedor}>
      <span style={estilos.texto}>Nueva versión disponible</span>
      <button
        style={estilos.boton}
        onClick={() => updateServiceWorker(true)}
      >
        Actualizar
      </button>
    </div>
  )
}

// Estilos alineados con el design system: fondo oscuro #0d1117, acento verde #3fb950
const estilos: Record<string, React.CSSProperties> = {
  contenedor: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#0d1117',
    border: '1.5px solid #3fb950',
    borderRadius: 12,
    padding: '12px 18px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    zIndex: 9999,
    whiteSpace: 'nowrap',
  },
  texto: {
    color: '#e6edf3',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Nunito', sans-serif",
  },
  boton: {
    background: '#3fb950',
    color: '#0d1117',
    border: 'none',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    transition: 'opacity 0.15s',
  },
}
