
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import ArbolNavidad from '../components/intercambio/ArbolNavidad'
import RegaloNavideno from '../components/intercambio/RegaloNavideno'

import {
  obtenerRegalosIntercambio,
  guardarDeseosIntercambio,
  type ParticipanteIntercambio,
} from '../services/intercambioService'

import './IntercambioPage.css'

// =====================================================
// CONFIGURACIÓN
// =====================================================

const MAX_PARTICIPANTES = 14
const PARTICIPANTES_VISIBLES = 12
const MAX_DESEOS = 8
const INTERVALO_ACTUALIZACION = 30000

// Cada participante tiene una posición fija según
// el campo "orden" registrado en Supabase.

const posiciones = [
  { izquierda: 16, arriba: 75 },
  { izquierda: 30, arriba: 76 },
  { izquierda: 44, arriba: 75 },
  { izquierda: 58, arriba: 76 },
  { izquierda: 72, arriba: 75 },
  { izquierda: 86, arriba: 76 },
  { izquierda: 9, arriba: 87 },
  { izquierda: 23, arriba: 87 },
  { izquierda: 37, arriba: 87 },
  { izquierda: 51, arriba: 87 },
  { izquierda: 65, arriba: 87 },
  { izquierda: 79, arriba: 87 },
  { izquierda: 93, arriba: 87 },
  { izquierda: 50, arriba: 64 },
]

// =====================================================
// NORMALIZAR RESULTADOS DE SUPABASE
// =====================================================

function normalizarParticipantes(
  datos: ParticipanteIntercambio[]
): ParticipanteIntercambio[] {
  return datos
    .filter(participante =>
      Array.isArray(participante.deseos) &&
      participante.deseos.length > 0 &&
      Number.isInteger(participante.orden) &&
      participante.orden >= 1 &&
      participante.orden <= MAX_PARTICIPANTES
    )
    .sort((a, b) => a.orden - b.orden)
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function IntercambioPage() {

  // ===================================================
  // PARTICIPANTES
  // ===================================================

  const [participantes, setParticipantes] =
    useState<ParticipanteIntercambio[]>([])

  const [cargando, setCargando] = useState(true)

  const [errorCarga, setErrorCarga] =
    useState<string | null>(null)

  // ===================================================
  // MODALES
  // ===================================================

  const [seleccionado, setSeleccionado] =
    useState<ParticipanteIntercambio | null>(null)

  const [formularioAbierto, setFormularioAbierto] =
    useState(false)

  // ===================================================
  // FORMULARIO
  // ===================================================

  const [nombre, setNombre] = useState('')

  const [codigoTrabajador, setCodigoTrabajador] =
    useState('')

  const [deseosTexto, setDeseosTexto] =
    useState('')

  const [guardando, setGuardando] =
    useState(false)

  const [errorGuardado, setErrorGuardado] =
    useState<string | null>(null)

  const [mensajeExito, setMensajeExito] =
    useState<string | null>(null)

  const modalAbierto =
    seleccionado !== null || formularioAbierto

  // ===================================================
  // CARGAR REGALOS DESDE SUPABASE
  // ===================================================

  useEffect(() => {

    let activo = true

    async function cargarRegalos() {

      try {

        const datos =
          await obtenerRegalosIntercambio()

        if (!activo) return

        setParticipantes(
          normalizarParticipantes(datos)
        )

        setErrorCarga(null)

      } catch (error) {

        if (!activo) return

        console.error(
          'Error al consultar regalos:',
          error
        )

        setErrorCarga(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los regalos.'
        )

      } finally {

        if (activo) {
          setCargando(false)
        }

      }
    }

    // Primera consulta
    void cargarRegalos()

    // Actualización automática cada 30 segundos
    const intervalo = window.setInterval(
      () => {
        void cargarRegalos()
      },
      INTERVALO_ACTUALIZACION
    )

    return () => {
      activo = false
      window.clearInterval(intervalo)
    }

  }, [])

  // ===================================================
  // BLOQUEAR SCROLL AL ABRIR MODALES
  // ===================================================

  useEffect(() => {

    if (!modalAbierto) return

    const overflowAnterior =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    function manejarTeclado(
      event: KeyboardEvent
    ) {

      if (event.key === 'Escape' && !guardando) {

        setSeleccionado(null)
        setFormularioAbierto(false)

      }
    }

    window.addEventListener(
      'keydown',
      manejarTeclado
    )

    return () => {

      document.body.style.overflow =
        overflowAnterior

      window.removeEventListener(
        'keydown',
        manejarTeclado
      )

    }

  }, [modalAbierto, guardando])

  // ===================================================
  // ABRIR Y CERRAR MODAL DE DESEOS
  // ===================================================

  function abrirDeseos(
    participante: ParticipanteIntercambio
  ) {

    setSeleccionado(participante)
    setFormularioAbierto(false)

  }

  function cerrarDeseos() {

    setSeleccionado(null)

  }

  // ===================================================
  // ABRIR FORMULARIO
  // ===================================================

  function abrirFormulario() {

    setSeleccionado(null)
    setErrorGuardado(null)
    setMensajeExito(null)
    setFormularioAbierto(true)

  }

  // ===================================================
  // CERRAR FORMULARIO
  // ===================================================

  function cerrarFormulario() {

    if (guardando) return

    setFormularioAbierto(false)

    setNombre('')
    setCodigoTrabajador('')
    setDeseosTexto('')

    setErrorGuardado(null)

  }

  // ===================================================
  // VALIDAR Y GUARDAR DESEOS EN SUPABASE
  // ===================================================

  async function guardarDeseos(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault()

    if (guardando) return

    setErrorGuardado(null)
    setMensajeExito(null)

    // Normalizar información del trabajador

    const nombreLimpio = nombre.trim()

    const codigoLimpio =
      codigoTrabajador.trim().toUpperCase()

    // Cada línea representa un deseo

    const deseos = deseosTexto
      .split('\n')
      .map(deseo => deseo.trim())
      .filter(Boolean)

    // ===============================================
    // VALIDACIONES
    // ===============================================

    if (
      nombreLimpio.length < 2 ||
      nombreLimpio.length > 120
    ) {

      setErrorGuardado(
        'Ingresa un nombre válido.'
      )

      return
    }

    if (
      !/^[A-Z0-9-]{2,20}$/.test(codigoLimpio)
    ) {

      setErrorGuardado(
        'Ingresa un código de trabajador válido.'
      )

      return
    }

    if (
      deseos.length === 0 ||
      deseos.length > MAX_DESEOS
    ) {

      setErrorGuardado(
        `Debes registrar entre 1 y ${MAX_DESEOS} deseos.`
      )

      return
    }

    if (
      deseos.some(deseo =>
        deseo.length === 0 ||
        deseo.length > 200
      )
    ) {

      setErrorGuardado(
        'Cada deseo debe tener como máximo 200 caracteres.'
      )

      return
    }

    // ===============================================
    // GUARDAR EN SUPABASE
    // ===============================================

    try {

      setGuardando(true)

      const resultado =
        await guardarDeseosIntercambio(
          nombreLimpio,
          codigoLimpio,
          deseos
        )

      if (!resultado?.exito) {

        throw new Error(
          'Supabase no confirmó el registro.'
        )

      }

      // El registro ya fue confirmado en Supabase.
      // Cerramos el formulario antes de recargar.

      setNombre('')
      setCodigoTrabajador('')
      setDeseosTexto('')

      setFormularioAbierto(false)

      setMensajeExito(
        `¡Los deseos de ${resultado.nombre} ya están bajo el árbol! 🎁`
      )

      // Actualizar los regalos visibles

      try {

        const datos =
          await obtenerRegalosIntercambio()

        setParticipantes(
          normalizarParticipantes(datos)
        )

        setErrorCarga(null)

      } catch (error) {

        console.error(
          'Los deseos se guardaron, pero no se pudo actualizar el árbol:',
          error
        )

        setErrorCarga(
          'Los deseos se guardaron correctamente. ' +
          'Actualiza la página para ver el regalo.'
        )

      }

    } catch (error) {

      console.error(
        'Error al registrar deseos:',
        error
      )

      setErrorGuardado(
        error instanceof Error
          ? error.message
          : 'No se pudieron guardar los deseos.'
      )

    } finally {

      setGuardando(false)

    }
  }

  // ===================================================
  // RENDER PRINCIPAL
  // ===================================================

  return (

    <div className="intercambio-pagina">

      {/* ============================================= */}
      {/* ENCABEZADO */}
      {/* ============================================= */}

      <header className="intercambio-encabezado">

        <a
          href={import.meta.env.BASE_URL}
          className="intercambio-volver"
        >
          ← Volver a votaciones
        </a>

        <span className="intercambio-etiqueta">
          CAJA AREQUIPA · NAVIDAD 2026
        </span>

        <h1>
          🎄 Intercambio Navideño
        </h1>

        <p>
          Cada regalo esconde una lista de deseos.
          ¡Descubre qué le gustaría recibir!
        </p>

      </header>

      {/* ============================================= */}
      {/* CONTENIDO */}
      {/* ============================================= */}

      <main className="intercambio-contenido">

        {/* TÍTULO Y CONTADOR */}

        <div className="intercambio-informacion">

          <div>

            <span className="intercambio-subtitulo">
              NUESTRO ÁRBOL DE DESEOS
            </span>

            <h2>
              Los deseos se convierten en regalos
            </h2>

          </div>

          <span className="intercambio-contador">
            🎁 {participantes.length} / {PARTICIPANTES_VISIBLES} regalos
          </span>

        </div>

        {/* =========================================== */}
        {/* MENSAJES */}
        {/* =========================================== */}

        {cargando && (

          <p className="mb-4 text-center text-amber-200">
            🎄 Cargando regalos navideños...
          </p>

        )}

        {errorCarga && (

          <p
            role="alert"
            className="mb-4 text-center text-red-300"
          >
            {errorCarga}
          </p>

        )}

        {mensajeExito && (

          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-center text-sm font-semibold text-emerald-200"
          >
            {mensajeExito}
          </div>

        )}

        {/* =========================================== */}
        {/* ESCENA NAVIDEÑA */}
        {/* =========================================== */}

        <section
          className="intercambio-escena"
          aria-label="Árbol navideño con regalos de los participantes"
        >

          {/* ILUMINACIÓN */}

          <div className="intercambio-luz-fondo" />

          {/* NIEVE */}

          <div
            className="intercambio-nieve"
            aria-hidden="true"
          >

            {Array.from(
              { length: 24 },
              (_, i) => (

                <span
                  key={i}
                  style={{
                    left: `${(i * 43 + 11) % 100}%`,
                    top: `${(i * 29 + 7) % 90}%`,
                    animationDelay: `${(i % 7) * 0.4}s`,
                  }}
                />

              )
            )}

          </div>

          {/* ÁRBOL */}

          <div className="intercambio-arbol">
            <ArbolNavidad />
          </div>

          {/* SUELO */}

          <div className="intercambio-suelo" />

          {/* ========================================= */}
          {/* REGALOS DINÁMICOS DE SUPABASE */}
          {/* ========================================= */}

          {participantes.map(participante => {

            const posicion =
              posiciones[participante.orden - 1]

            if (!posicion) return null

            return (

              <RegaloNavideno
                key={participante.id}
                participante={participante}
                izquierda={posicion.izquierda}
                arriba={posicion.arriba}
                onClick={() =>
                  abrirDeseos(participante)
                }
              />

            )

          })}

          {/* INSTRUCCIÓN */}

          <div className="intercambio-instruccion">
            ✨ Haz clic en un regalo para descubrir sus deseos
          </div>

        </section>

        {/* =========================================== */}
        {/* AGREGAR DESEOS */}
        {/* =========================================== */}

        <div className="intercambio-acciones">

          <div>

            <h3>
              ¿Qué te gustaría recibir esta Navidad?
            </h3>

            <p>
              Comparte tus ideas para ayudar a quien
              te entregará tu regalo.
            </p>

          </div>

          <button
            type="button"
            onClick={abrirFormulario}
            className="intercambio-boton"
          >
            🎁 Agregar mis deseos
          </button>

        </div>

        <p className="intercambio-aviso">
          Cada regalo contiene los deseos de un participante.
          Puedes consultarlos libremente seleccionando su caja.
        </p>

      </main>

      {/* ============================================= */}
      {/* MODAL: CONSULTAR DESEOS */}
      {/* ============================================= */}

      {seleccionado && (

        <div
          className="intercambio-overlay"
          onMouseDown={event => {

            if (event.target === event.currentTarget) {
              cerrarDeseos()
            }

          }}
        >

          <div
            className="intercambio-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-deseos"
          >

            <button
              type="button"
              className="intercambio-cerrar"
              onClick={cerrarDeseos}
              aria-label="Cerrar ventana"
            >
              ×
            </button>

            <span className="intercambio-subtitulo">
              UNA SORPRESA BAJO EL ÁRBOL
            </span>

            <div className="intercambio-modal-icono">
              🎁
            </div>

            <h2 id="titulo-deseos">
              Los deseos de {seleccionado.nombre}
            </h2>

            <p className="intercambio-modal-descripcion">
              Estas son algunas ideas de lo que
              le gustaría recibir esta Navidad.
            </p>

            {/* LISTA DE DESEOS */}

            <div className="intercambio-lista-deseos">

              {seleccionado.deseos.map(
                (deseo, indice) => (

                  <div
                    key={`${seleccionado.id}-${indice}`}
                    className="intercambio-deseo"
                  >

                    <span>🎄</span>

                    <p>{deseo}</p>

                  </div>

                )
              )}

            </div>

            <button
              type="button"
              className="intercambio-boton"
              onClick={cerrarDeseos}
            >
              Cerrar regalo
            </button>

          </div>

        </div>

      )}

      {/* ============================================= */}
      {/* MODAL: AGREGAR O MODIFICAR DESEOS */}
      {/* ============================================= */}

      {formularioAbierto && (

        <div
          className="intercambio-overlay"
          onMouseDown={event => {

            if (event.target === event.currentTarget) {
              cerrarFormulario()
            }

          }}
        >

          <div
            className="intercambio-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-agregar"
          >

            {/* CERRAR */}

            <button
              type="button"
              className="intercambio-cerrar"
              onClick={cerrarFormulario}
              disabled={guardando}
              aria-label="Cerrar formulario"
            >
              ×
            </button>

            {/* ENCABEZADO */}

            <span className="intercambio-subtitulo">
              ÁRBOL DE DESEOS
            </span>

            <div className="intercambio-modal-icono">
              🎁
            </div>

            <h2 id="titulo-agregar">
              Agregar mis deseos
            </h2>

            <p className="intercambio-modal-descripcion">
              Ingresa tu nombre, código de trabajador
              y los regalos que te gustaría recibir.
            </p>

            {/* ======================================= */}
            {/* FORMULARIO */}
            {/* ======================================= */}

            <form
              onSubmit={guardarDeseos}
              className="intercambio-formulario"
            >

              {/* NOMBRE */}

              <label htmlFor="nombre-participante">
                Nombre del participante
              </label>

              <input
                id="nombre-participante"
                type="text"
                value={nombre}
                onChange={event =>
                  setNombre(event.target.value)
                }
                placeholder="Su nombre"
                maxLength={120}
                autoComplete="name"
                required
                disabled={guardando}
              />

              {/* CÓDIGO DE TRABAJADOR */}

              <label htmlFor="codigo-trabajador">
                Código de trabajador
              </label>

              <input
                id="codigo-trabajador"
                type="text"
                value={codigoTrabajador}
                onChange={event =>
                  setCodigoTrabajador(
                    event.target.value
                  )
                }
                placeholder="Ej. R1265"
                maxLength={20}
                autoComplete="off"
                required
                disabled={guardando}
              />

              <p className="text-xs text-slate-500">
                El nombre y código permiten identificar
                tu registro y evitar regalos duplicados.
              </p>

              {/* LISTA DE DESEOS */}

              <label htmlFor="deseos-participante">
                ¿Qué te gustaría recibir?
              </label>

              <textarea
                id="deseos-participante"
                value={deseosTexto}
                onChange={event =>
                  setDeseosTexto(event.target.value)
                }
                placeholder={
                  'Un libro\nAudífonos inalámbricos\nUna taza térmica'
                }
                rows={6}
                maxLength={1607}
                required
                disabled={guardando}
              />

              <p className="text-xs text-slate-500">
                Escribe un deseo por línea.
                Máximo {MAX_DESEOS} deseos.
              </p>

              <p className="text-xs text-slate-500">
                Si ya habías registrado una lista,
                al guardar se reemplazarán tus deseos
                anteriores por los nuevos.
              </p>

              {/* ERROR DE GUARDADO */}

              {errorGuardado && (

                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {errorGuardado}
                </p>

              )}

              {/* BOTÓN GUARDAR */}

              <button
                className="intercambio-boton"
                type="submit"
                disabled={guardando}
              >

                {guardando
                  ? 'Guardando deseos...'
                  : 'Guardar y colocar mi regalo 🎁'}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  )
}
