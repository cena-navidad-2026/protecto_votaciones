
function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-indigo-700">
          Sistema de Votaciones
        </h1>

        <p className="mt-4 text-gray-600">
          Bienvenido a nuestro sistema de votaciones
          y sorteos.
        </p>

        <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition">
          Comenzar votación
        </button>
      </div>
    </div>
  )
}

export default App
