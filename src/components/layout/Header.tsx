
export default function Header() {
  return (
    <header className="bg-[#04274f] border-b-2 border-[#00b8b5] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <img
              src="/assets/logo-caja.png"
              alt="Caja Arequipa"
              className="h-16 w-auto object-contain mb-5"
            />

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Elige tu Cena Navideña
            </h1>

            <p className="mt-2 text-blue-100">
              Vota por tu local favorito para celebrar juntos este fin de año.
            </p>
          </div>

          <span className="self-start rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold">
            Votación abierta
          </span>
        </div>
      </div>
    </header>
  )
}
