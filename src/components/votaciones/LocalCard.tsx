
export interface Local {
  id: number
  nombre: string
  descripcion: string
  ubicacion: string
  precio: string
  imagen: string
}

interface Props {
  local: Local
}

export default function LocalCard({ local }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <img
        src={local.imagen}
        alt={local.nombre}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <div className="flex justify-between gap-3 text-xs font-medium text-slate-500">
          <span>📍 {local.ubicacion}</span>
          <span>{local.precio}</span>
        </div>

        <h3 className="mt-3 text-xl font-bold text-[#062c59]">
          {local.nombre}
        </h3>

        <p className="mt-2 min-h-12 text-sm text-slate-500">
          {local.descripcion}
        </p>

        <button
          type="button"
          className="mt-5 w-full rounded-lg bg-[#00aaa9] py-3 font-semibold text-white transition hover:bg-[#008d8c]"
        >
          Votar por este local
        </button>
      </div>
    </article>
  )
}
