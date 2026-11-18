
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Local } from '../../types/local'
import { registrarVotoLocal } from '../../services/votacionService'
import { obtenerUrlImagen } from '../../lib/storage'

interface Props {
    local: Local
    fase: 1 | 2
    onClose: () => void
}

export default function VotacionModal({
    local,
    fase,
    onClose
}: Props) {
    const [propuestaId, setPropuestaId] = useState<number | null>(null)
    const [correo, setCorreo] = useState('')
    const [codigo, setCodigo] = useState('')
    const [paso, setPaso] = useState<'seleccion' | 'confirmacion'>(
        'seleccion'
    )

    const propuesta = local.propuestas.find(
        p => p.id === propuestaId
    )

    const esFaseLocal = fase === 1
    const [registrando, setRegistrando] = useState(false)
    const [errorVoto, setErrorVoto] = useState<string | null>(null)
    const [votoRegistrado, setVotoRegistrado] = useState(false)
    useEffect(() => {
        const cerrar = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        const overflowAnterior = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        window.addEventListener('keydown', cerrar)

        return () => {
            document.body.style.overflow = overflowAnterior
            window.removeEventListener('keydown', cerrar)
        }
    }, [onClose])

    function continuar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!esFaseLocal && !propuesta) return

        if (!correo.trim() || !codigo.trim()) return

        setPaso('confirmacion')
    }

    function precio(valor: number | null) {
        return valor === null
            ? 'Por confirmar'
            : `S/ ${valor.toFixed(2)}`
    }
    async function confirmarVoto() {
        if (fase !== 1 || registrando) return

        try {
            setRegistrando(true)
            setErrorVoto(null)

            const resultado = await registrarVotoLocal(
                local.id,
                correo,
                codigo
            )

            if (resultado.exito) {
                setVotoRegistrado(true)
            }
        } catch (error) {
            setErrorVoto(
                error instanceof Error
                    ? error.message
                    : 'No se pudo registrar el voto.'
            )
        } finally {
            setRegistrando(false)
        }
    }
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#061b35]/75 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={e => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-votacion"
                className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                {/* ENCABEZADO */}
                <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#cde9e9] bg-gradient-to-r from-white to-[#b7ecec] px-5 py-5 sm:px-7">

                    <div>
                        <span className="text-[10px] font-bold tracking-widest text-[#00a7a7]">
                            FASE {fase} · CENA NAVIDEÑA 2026
                        </span>

                        <h2
                            id="titulo-votacion"
                            className="mt-1 text-xl font-extrabold text-[#062b54] sm:text-2xl"
                        >
                            {paso === 'confirmacion'
                                ? 'Confirmar tu votación'
                                : esFaseLocal
                                    ? 'Conoce nuestras propuestas'
                                    : 'Elige tu menú navideño'}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {local.nombre}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar ventana"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl text-[#062b54] hover:bg-slate-100"
                    >
                        ×
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="overflow-y-auto px-4 py-5 sm:px-7">
                    {paso === 'seleccion' ? (
                        <form onSubmit={continuar} className="space-y-6">

                            <section>
                                <div className="mb-4">
                                    <h3 className="font-bold text-[#062b54]">
                                        {esFaseLocal
                                            ? 'Explora los platos disponibles'
                                            : 'Selecciona tu plato favorito'}
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {esFaseLocal
                                            ? 'En esta fase votarás por el restaurante, no por un plato específico.'
                                            : 'Selecciona una propuesta para tu cena navideña.'}
                                    </p>
                                </div>

                                {/* CATÁLOGO */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {local.propuestas.map(p => {
                                        const seleccionado = propuestaId === p.id

                                        return (
                                            <div
                                                key={p.id}
                                                className={`overflow-hidden rounded-xl border-2 bg-white transition ${seleccionado && !esFaseLocal
                                                        ? 'border-[#00aaa9] shadow-md'
                                                        : 'border-slate-200'
                                                    }`}
                                            >
                                                {/* IMAGEN */}
                                                {obtenerUrlImagen(p.imagen_url) ? (
                                                <img
                                                    src={obtenerUrlImagen(p.imagen_url)!}
                                                    alt={p.nombre}
                                                    className="h-40 w-full object-cover"
                                                />
                                                ) : (
                                                <div className="flex h-40 items-center justify-center bg-slate-100">
                                                    <span className="text-sm text-slate-500">
                                                    🍽️ Imagen próximamente
                                                    </span>
                                                </div>
                                                )}

                                                {/* INFORMACIÓN */}
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="text-sm font-bold text-[#062b54]">
                                                            {p.nombre}
                                                        </h4>

                                                        <span className="shrink-0 text-sm font-extrabold text-[#00a5a5]">
                                                            {precio(p.precio)}
                                                        </span>
                                                    </div>

                                                    {p.descripcion && (
                                                        <p className="mt-2 text-xs text-slate-500">
                                                            {p.descripcion}
                                                        </p>
                                                    )}

                                                    {/* DETALLES DEL MENÚ */}
                                                    <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                                                        {p.propuesta_detalles.map(detalle => (
                                                            <p
                                                                key={detalle.id}
                                                                className="text-xs leading-relaxed text-slate-600"
                                                            >
                                                                <strong className="text-[#062b54]">
                                                                    {detalle.categoria}:
                                                                </strong>{' '}
                                                                {detalle.descripcion}
                                                            </p>
                                                        ))}
                                                    </div>

                                                    {/* BOTÓN SOLO PARA FASE 2 */}
                                                    {!esFaseLocal && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setPropuestaId(p.id)}
                                                            className={`mt-4 w-full rounded-lg px-3 py-2.5 text-xs font-bold transition ${seleccionado
                                                                    ? 'bg-[#00aaa9] text-white'
                                                                    : 'bg-slate-100 text-[#062b54] hover:bg-[#e8f6f6]'
                                                                }`}
                                                        >
                                                            {seleccionado
                                                                ? '✓ Plato seleccionado'
                                                                : 'Elegir este plato'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>

                            {/* DATOS DEL TRABAJADOR */}
                            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="mb-4 font-bold text-[#062b54]">
                                    Datos del trabajador
                                </h3>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="correo-votacion"
                                            className="mb-2 block text-sm font-semibold text-[#062b54]"
                                        >
                                            Correo institucional *
                                        </label>

                                        <input
                                            id="correo-votacion"
                                            type="email"
                                            required
                                            value={correo}
                                            onChange={e => setCorreo(e.target.value)}
                                            placeholder="usuario@cajaarequipa.pe"
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#00aaa9]"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="codigo-votacion"
                                            className="mb-2 block text-sm font-semibold text-[#062b54]"
                                        >
                                            Código de trabajador *
                                        </label>

                                        <input
                                            id="codigo-votacion"
                                            type="text"
                                            required
                                            value={codigo}
                                            onChange={e => setCodigo(e.target.value)}
                                            placeholder="Ej. 84920"
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#00aaa9]"
                                        />
                                    </div>

                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={!esFaseLocal && !propuestaId}
                                className="w-full rounded-xl bg-[#00aaa9] px-5 py-3.5 font-bold text-white hover:bg-[#008d91] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {esFaseLocal
                                    ? `Votar por ${local.nombre}`
                                    : 'Continuar con mi menú'}
                            </button>
                        </form>
                    ) : (

                        /* CONFIRMACIÓN */

                        <div className="space-y-5">

                            {votoRegistrado ? (

                                /* VOTO REGISTRADO CORRECTAMENTE */
                                <div className="py-6 text-center">

                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
                                        ✓
                                    </div>

                                    <h3 className="mt-5 text-2xl font-extrabold text-[#062b54]">
                                        ¡Tu voto fue registrado!
                                    </h3>

                                    <p className="mt-3 text-sm text-slate-600">
                                        Has votado correctamente por
                                        <strong className="text-[#00aaa9]">
                                            {' '}{local.nombre}
                                        </strong>.
                                    </p>

                                    <div className="mt-5 rounded-xl bg-[#effafa] p-5 text-left">
                                        <p className="text-sm font-semibold text-[#062b54]">
                                            Resumen de participación
                                        </p>

                                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                                            <p><strong>Fase:</strong> Elección de restaurante</p>
                                            <p><strong>Local:</strong> {local.nombre}</p>
                                            <p><strong>Correo:</strong> {correo.trim().toLowerCase()}</p>
                                            <p><strong>Código:</strong> {codigo.trim()}</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-6 w-full rounded-xl bg-[#00aaa9] px-5 py-3 font-bold text-white hover:bg-[#008d91]"
                                    >
                                        Finalizar
                                    </button>

                                </div>

                            ) : (

                                /* CONFIRMACIÓN ANTES DE REGISTRAR */
                                <>
                                    <div className="rounded-xl bg-[#effafa] p-5">
                                        <h3 className="mb-4 text-lg font-bold text-[#062b54]">
                                            Resumen de tu elección
                                        </h3>

                                        <div className="space-y-3 text-sm text-slate-700">
                                            <p>
                                                <strong>Fase:</strong>{' '}
                                                {esFaseLocal
                                                    ? 'Elección de local'
                                                    : 'Elección de menú'}
                                            </p>

                                            <p>
                                                <strong>Restaurante:</strong> {local.nombre}
                                            </p>

                                            {!esFaseLocal && (
                                                <p>
                                                    <strong>Plato:</strong> {propuesta?.nombre}
                                                </p>
                                            )}

                                            <p>
                                                <strong>Correo:</strong> {correo.trim().toLowerCase()}
                                            </p>

                                            <p>
                                                <strong>Código:</strong> {codigo.trim()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-[#bde5e5] bg-[#f0fafa] p-4">
                                        <p className="text-sm text-[#087f85]">
                                            Al confirmar, se registrará tu voto por
                                            <strong> {local.nombre}</strong>.
                                            Solo se permite un voto por correo
                                            institucional o código de trabajador
                                            durante esta fase.
                                        </p>
                                    </div>

                                    {/* ERROR DEVUELTO POR SUPABASE */}
                                    {errorVoto && (
                                        <div
                                            role="alert"
                                            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                                        >
                                            {errorVoto}
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            disabled={registrando}
                                            onClick={() => setPaso('seleccion')}
                                            className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-bold text-[#062b54] disabled:opacity-50"
                                        >
                                            Modificar
                                        </button>

                                        <button
                                            type="button"
                                            disabled={registrando || !esFaseLocal}
                                            onClick={confirmarVoto}
                                            className="flex-1 rounded-xl bg-[#00aaa9] px-5 py-3 font-bold text-white hover:bg-[#008d91] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {registrando
                                                ? 'Registrando voto...'
                                                : 'Confirmar mi voto'}
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>

                    )}
                </div>
            </div>
        </div>
    )
}
