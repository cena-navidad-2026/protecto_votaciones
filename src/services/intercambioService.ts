
import { supabase } from '../lib/supabase'

// =============================================
// TIPOS DE DATOS
// =============================================

export interface ParticipanteIntercambio {
  id: number
  nombre: string
  orden: number
  color: string
  deseos: string[]
}

export interface ResultadoGuardarDeseos {
  exito: boolean
  participante_id: number
  nombre: string
  mensaje: string
}

// =============================================
// OBTENER REGALOS
// =============================================

export async function obtenerRegalosIntercambio():
  Promise<ParticipanteIntercambio[]> {

  const { data, error } = await supabase.rpc(
    'obtener_regalos_intercambio'
  )

  if (error) {
    console.error(
      'Error al consultar regalos:',
      error
    )

    throw new Error(
      'No se pudieron cargar los regalos.'
    )
  }

  if (!Array.isArray(data)) {
    throw new Error(
      'La respuesta de Supabase no tiene el formato esperado.'
    )
  }

  return data.map(participante => ({
    id: Number(participante.id),
    nombre: String(participante.nombre),
    orden: Number(participante.orden),
    color: String(participante.color ?? '#b72b49'),
    deseos: Array.isArray(participante.deseos)
      ? participante.deseos.map(String)
      : [],
  }))
}

// =============================================
// GUARDAR O ACTUALIZAR DESEOS
// =============================================

export async function guardarDeseosIntercambio(
  nombre: string,
  codigoTrabajador: string,
  deseos: string[]
): Promise<ResultadoGuardarDeseos> {

  const { data, error } = await supabase.rpc(
    'registrar_deseos_intercambio',
    {
      p_nombre: nombre.trim(),
      p_codigo_trabajador: codigoTrabajador.trim().toUpperCase(),
      p_deseos: deseos,
    }
  )

  if (error) {
    console.error('Error al guardar deseos:', error)

    if (error.message.includes('DATOS_NO_COINCIDEN')) {
      throw new Error(
        'Este nombre ya está asociado a otro código de trabajador.'
      )
    }

    if (error.message.includes('CODIGO_YA_REGISTRADO')) {
      throw new Error(
        'Este código ya está registrado con otro nombre.'
      )
    }

    if (error.message.includes('CUPO_COMPLETO')) {
      throw new Error('Ya se registraron los 14 participantes.')
    }

    if (error.message.includes('LISTA_INVALIDA')) {
      throw new Error('Debes registrar entre 1 y 8 deseos.')
    }

    throw new Error('No se pudieron guardar los deseos.')
  }

  return data as ResultadoGuardarDeseos
}