
import Header from '../components/layout/Header'
import LocalCard from '../components/votaciones/LocalCard'
import { localesDemo } from '../data/localesDemo'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="relative mx-auto max-w-7xl px-6 py-10">
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00aaa9]">
              Fase 1 · Elección de local
            </span>

            <h2 className="mt-2 text-3xl font-extrabold text-[#062c59]">
              Locales candidatos
            </h2>

            <p className="mt-2 text-slate-500">
              Conoce las opciones disponibles y elige
              tu local favorito.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localesDemo.map((local) => (
              <LocalCard key={local.id} local={local} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
