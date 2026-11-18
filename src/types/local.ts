
export interface PropuestaDetalle {
  id: number
  categoria: string
  descripcion: string
  orden: number
}

export interface Propuesta {
  id: number
  nombre: string
  descripcion: string | null
  precio: number | null
  moneda: string
  orden: number

  // Imagen individual de cada plato
  imagen_url: string | null

  propuesta_detalles: PropuestaDetalle[]
}

export interface Local {
  id: number
  nombre: string
  descripcion: string | null
  direccion: string | null
  imagen_url: string | null
  carta_url: string | null
  estado: string
  orden: number
  propuestas: Propuesta[]
}
