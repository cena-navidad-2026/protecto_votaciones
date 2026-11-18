
import { useEffect, useState } from 'react'

const INICIO = new Date('2026-11-17T00:00:00-05:00').getTime()
const EVENTO = new Date('2026-12-10T00:00:00-05:00').getTime()

const etapas = [
  { nombre: 'Preparando', fecha: '17 nov', progreso: 0 },
  { nombre: 'En camino', fecha: '24 nov', progreso: 30.43 },
  { nombre: 'Ya casi', fecha: '03 dic', progreso: 69.57 },
  { nombre: '¡La cena!', fecha: '10 dic', progreso: 100 },
]

function calcularTiempo() {
  const ahora = Date.now()
  const restante = Math.max(0, EVENTO - ahora)

  return {
    dias: Math.floor(restante / 86400000),
    horas: Math.floor((restante % 86400000) / 3600000),
    minutos: Math.floor((restante % 3600000) / 60000),
    progreso: Math.min(
      100,
      Math.max(0, ((ahora - INICIO) / (EVENTO - INICIO)) * 100)
    ),
    terminado: restante === 0,
  }
}

export default function CuentaRegresiva() {
  const [tiempo, setTiempo] = useState(calcularTiempo)

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setTiempo(calcularTiempo())
    }, 1000)

    return () => window.clearInterval(intervalo)
  }, [])

  return (
    <section className="rounded-2xl border border-[#dce8ec] bg-white/95 p-5 shadow-sm backdrop-blur-sm md:px-8 md:py-6">

      {/* Encabezado y contador */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00a9a7]">
            Cuenta regresiva · Cena navideña
          </span>

          <h2 className="mt-1 text-xl font-extrabold text-[#062b54] md:text-2xl">
            {tiempo.terminado
              ? '¡Hoy celebramos juntos! 🎄'
              : '¡Ya falta poco para celebrar juntos! 🎄'}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jueves 10 de diciembre de 2026
          </p>
        </div>

        {/* Días restantes */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#c8eeee] bg-[#e9f9f8] px-4 py-3">

          <div className="text-center">
            <span className="block text-3xl font-extrabold leading-none tabular-nums text-[#008d91]">
              {tiempo.dias}
            </span>
            <span className="text-[10px] font-bold text-[#008d91]">
              DÍAS
            </span>
          </div>

          <div className="h-9 w-px bg-[#b6dddd]" />

          <div className="text-center">
            <span className="block text-xl font-bold leading-none tabular-nums text-[#063660]">
              {String(tiempo.horas).padStart(2, '0')}
              :
              {String(tiempo.minutos).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-slate-500">
              HORAS : MIN
            </span>
          </div>

        </div>
      </div>

      {/* Recorrido */}
      <div className="mt-6">

        <div className="relative">

          {/* Barra de fondo */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[16px] h-[5px] rounded-full bg-[#e0eaf0]" />

          {/* Barra de progreso */}
          <div
            className="absolute left-[12.5%] top-[16px] h-[5px] rounded-full bg-gradient-to-r from-[#00aaa9] to-[#37c9bb] transition-all duration-1000"
            style={{
              width: `${tiempo.progreso * 0.75}%`,
            }}
          />

          <div className="relative grid grid-cols-4 gap-1">

            {etapas.map((etapa, index) => {
              const completado = tiempo.progreso >= etapa.progreso

              return (
                <div
                  key={etapa.nombre}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white text-sm font-bold shadow-sm transition-colors ${
                      completado
                        ? 'bg-[#00aaa9] text-white'
                        : 'bg-[#e8f0f4] text-slate-500'
                    }`}
                  >
                    {completado ? '✓' : index === 3 ? '★' : index + 1}
                  </div>

                  <span className="mt-2 text-[11px] font-semibold text-[#062b54] sm:text-xs">
                    {etapa.nombre}
                  </span>

                  <span className="mt-0.5 text-[10px] text-slate-400">
                    {etapa.fecha}
                  </span>
                </div>
              )
            })}

          </div>
        </div>
      </div>

      {/* Mensaje inferior */}
      <div className="mt-5 rounded-lg bg-[#f0f9f9] px-4 py-2 text-center">
        <p className="text-xs font-medium text-[#087f85]">
          {tiempo.terminado
            ? '🎉 ¡Llegó el gran día de nuestra celebración!'
            : tiempo.dias <= 3
              ? '🎅 ¡Ya casi llegamos! Prepara tu espíritu navideño.'
              : '✨ Cada día estamos más cerca de nuestra celebración navideña.'}
        </p>
      </div>

    </section>
  )
}
