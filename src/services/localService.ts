
import { supabase } from '../lib/supabase'
import type { Local } from '../types/local'

export async function obtenerLocales(): Promise<Local[]> {

  const { data, error } = await supabase
    .from('locales')
    .select(`
      id,
      nombre,
      descripcion,
      direccion,
      imagen_url,
      carta_url,
      estado,
      orden,
      propuestas (
        id,
        nombre,
        descripcion,
        precio,
        moneda,
        orden,
        imagen_url,
        propuesta_detalles (
          id,
          categoria,
          descripcion,
          orden
        )
      )
    `)
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (error) {
    console.error('Error al obtener locales:', error)
    throw error
  }

  const locales = (data ?? []) as unknown as Local[]

  return locales.map(local => ({
    ...local,
    propuestas: [...(local.propuestas ?? [])]
      .sort((a, b) => a.orden - b.orden)
      .map(propuesta => ({
        ...propuesta,
        propuesta_detalles: [
          ...(propuesta.propuesta_detalles ?? [])
        ].sort((a, b) => a.orden - b.orden)
      }))
  }))
}
