
import type { CSSProperties } from 'react'

import type {
  ParticipanteIntercambio,
} from '../../services/intercambioService'

// =============================================
// PROPIEDADES DEL COMPONENTE
// =============================================

interface Props {
  participante: ParticipanteIntercambio
  izquierda: number
  arriba: number
  onClick: () => void
}

// =============================================
// REGALO NAVIDEÑO
// =============================================

export default function RegaloNavideno({
  participante,
  izquierda,
  arriba,
  onClick,
}: Props) {

  const estilos = {
    left: `${izquierda}%`,
    top: `${arriba}%`,
    '--color-regalo': participante.color,
  } as CSSProperties

  return (
    <button
      type="button"
      className="regalo-navideno"
      style={estilos}
      onClick={onClick}
      title={`Ver deseos de ${participante.nombre}`}
      aria-label={`Abrir regalo de ${participante.nombre}`}
    >

      {/* MOÑO */}
      <span
        className="regalo-mono"
        aria-hidden="true"
      >
        <span className="regalo-lazo-izq" />
        <span className="regalo-lazo-der" />
      </span>

      {/* TAPA */}
      <span
        className="regalo-tapa"
        aria-hidden="true"
      />

      {/* CAJA */}
      <span
        className="regalo-caja"
        aria-hidden="true"
      >
        <span className="regalo-cinta" />
      </span>

      {/* NOMBRE DEL PARTICIPANTE */}
      <span className="regalo-nombre">
        {participante.nombre}
      </span>

    </button>
  )
}
