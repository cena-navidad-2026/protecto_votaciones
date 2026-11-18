
import { useState, useCallback } from 'react'
import type { Local } from '../../types/local'
import VotacionModal from './VotacionModal'
import { obtenerUrlImagen } from '../../lib/storage'
interface Props {
  local: Local
}

export default function LocalCard({ local }: Props) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const cerrarModal = useCallback(() => setModalAbierto(false), [])
const imagenLocal = obtenerUrlImagen(local.imagen_url)
  const precios = local.propuestas
    .map(p => p.precio)
    .filter((p): p is number => p !== null)

  const precioTexto = precios.length === 0
    ? 'Por confirmar'
    : Math.min(...precios) === Math.max(...precios)
      ? `S/ ${precios[0].toFixed(2)}`
      : `S/ ${Math.min(...precios).toFixed(2)} - ${Math.max(...precios).toFixed(2)}`

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">

        {imagenLocal ? (
          <img
            src={imagenLocal}
            alt={local.nombre}
            className="h-48 w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-48 flex-col items-center justify-center bg-gradient-to-br from-[#062b54] to-[#008d91] text-white">
            <span className="text-4xl">🍽️</span>
            <p className="mt-2 text-sm">Fotografía pendiente</p>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[#00aaa9]">
              {local.estado === 'pendiente'
                ? 'Pendiente de confirmar'
                : 'Propuesta recibida'}
            </span>

            <span className="text-xs font-bold text-[#062b54]">
              {precioTexto}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-bold text-[#062b54]">
            {local.nombre}
          </h3>

          <p className="mt-2 min-h-12 text-sm text-slate-500">
            {local.descripcion}
          </p>

          <p className="mt-3 text-xs text-slate-400">
            {local.propuestas.length} propuestas disponibles
          </p>

          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            className="mt-5 w-full rounded-xl bg-[#00aaa9] px-4 py-3 font-bold text-white transition hover:bg-[#008d91]"
          >
            Ver propuestas
          </button>
        </div>
      </article>
        {modalAbierto && (
          <VotacionModal
            local={local}
            fase={1}
            onClose={cerrarModal}
          />
        )}
    </>
  )
}
