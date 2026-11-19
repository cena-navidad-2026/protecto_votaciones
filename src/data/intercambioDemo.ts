
export interface ParticipanteIntercambio {
  id: number
  nombre: string
  color: string
  deseos: string[]
}

export const participantesDemo: ParticipanteIntercambio[] = [
  {
    id: 1,
    nombre: 'María',
    color: '#b72b49',
    deseos: ['Perfume', 'Audífonos', 'Taza térmica'],
  },
  {
    id: 2,
    nombre: 'Carlos',
    color: '#087c76',
    deseos: ['Mouse inalámbrico', 'Billetera'],
  },
  {
    id: 3,
    nombre: 'Andrea',
    color: '#b58832',
    deseos: ['Libro', 'Chocolates', 'Mochila'],
  },
  {
    id: 4,
    nombre: 'Luis',
    color: '#315eaf',
    deseos: ['Polo deportivo', 'Termo'],
  },
  {
    id: 5,
    nombre: 'Lucía',
    color: '#80509e',
    deseos: ['Crema corporal', 'Agenda'],
  },
  {
    id: 6,
    nombre: 'Pedro',
    color: '#c05639',
    deseos: ['Gorra', 'Parlante Bluetooth'],
  },
]
