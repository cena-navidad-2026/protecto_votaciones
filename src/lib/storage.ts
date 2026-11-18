
import { supabase } from './supabase'

const BUCKET = 'locales'

export function obtenerUrlImagen(
  ruta: string | null | undefined
): string | null {
  if (!ruta) return null

  // Compatibilidad con URLs completas existentes
  if (/^https?:\/\//i.test(ruta)) {
    return ruta
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(ruta)

  return data.publicUrl
}
