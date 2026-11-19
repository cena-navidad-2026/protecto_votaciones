
import { useEffect, useState } from 'react'

import Header from '../components/layout/Header'
import LocalCard from '../components/votaciones/LocalCard'
import CuentaRegresiva from '../components/comunes/CuentaRegresiva'

import { obtenerLocales } from '../services/localService'
import type { Local } from '../types/local'

export default function HomePage() {
  const [locales, setLocales] = useState<Local[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarLocales() {
      try {
        setCargando(true)
        setError(null)

        const resultado = await obtenerLocales()

        console.log('Locales cargados:', resultado)

        setLocales(resultado)
      } catch (err) {
        console.error('Error:', err)
        setError('No se pudieron cargar los locales.')
      } finally {
        setCargando(false)
      }
    }

    cargarLocales()
  }, [])

  return (
    <div className="min-h-screen">
      {/* ENCABEZADO */}
      <Header />

      <main className="relative mx-auto max-w-7xl px-6 py-10">

        {/* CUENTA REGRESIVA */}
        <section className="mb-7">
          <CuentaRegresiva />
          <div className="mt-5 flex justify-center">
            <a
              href={`${import.meta.env.BASE_URL}?vista=intercambio`}
              className="rounded-xl bg-[#062b54] px-6 py-3 font-bold text-white shadow-lg transition hover:bg-[#00aaa9]"
            >
              🎁 Visitar el Árbol de Deseos
            </a>
          </div>
        </section>

        {/* LOCALES CANDIDATOS */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00aaa9]">
              Fase 1 · Elección de local
            </span>

            <h2 className="mt-2 text-3xl font-extrabold text-[#062c59]">
              Locales candidatos
            </h2>

            <p className="mt-2 text-slate-500">
              Conoce las propuestas navideñas y elige
              tu local favorito.
            </p>
          </div>

          {cargando && (
            <div className="py-12 text-center text-slate-500">
              Cargando locales desde Supabase...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
              {error}
            </div>
          )}

          {!cargando && !error && locales.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No hay locales disponibles.
            </div>
          )}

          {!cargando && !error && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {locales.map((local) => (
                <LocalCard
                  key={local.id}
                  local={local}
                />
              ))}
            </div>
          )}

        </section>
      </main>
    </div>
  )
}
