
import { supabase } from '../lib/supabase'

export interface ResultadoVoto {
  exito: boolean
  voto_id: number
  local: string
  mensaje: string
}

export async function registrarVotoLocal(
  localId: number,
  correo: string,
  codigo: string
): Promise<ResultadoVoto> {

  const { data, error } = await supabase.rpc(
    'registrar_voto_local_simple',
    {
      p_local_id: localId,
      p_correo: correo.trim().toLowerCase(),
      p_codigo: codigo.trim().toUpperCase(),
    }
  )

  if (error) {
    console.error('Error al registrar voto:', error)

    if (error.message.includes('YA_VOTASTE')) {
      throw new Error(
        'Ya existe un voto registrado con este correo o código de trabajador.'
      )
    }

    if (error.message.includes('VOTACION_CERRADA')) {
      throw new Error('La votación está cerrada.')
    }

    if (error.message.includes('CORREO_INVALIDO')) {
      throw new Error('El correo institucional no es válido.')
    }

    if (error.message.includes('CODIGO_INVALIDO')) {
      throw new Error('El código de trabajador no es válido.')
    }

    if (error.message.includes('LOCAL_NO_DISPONIBLE')) {
      throw new Error('Este restaurante no está disponible.')
    }

    throw new Error(error.message)
  }

  if (!data?.exito) {
    throw new Error('No se pudo confirmar el registro del voto.')
  }

  return data as ResultadoVoto
}
