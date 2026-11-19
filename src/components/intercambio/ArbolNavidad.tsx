
const adornos = [
  [470, 188, 10, '#e7bb55'],
  [535, 208, 12, '#e9ca78'],
  [445, 270, 12, '#b9384c'],
  [550, 291, 12, '#e8b955'],
  [498, 320, 14, '#f8d47b'],
  [408, 362, 13, '#d8aa57'],
  [582, 368, 14, '#be3448'],
  [458, 418, 15, '#c43b53'],
  [545, 437, 15, '#f1c76b'],
  [365, 470, 15, '#e9b957'],
  [622, 474, 15, '#ce3c50'],
  [430, 525, 17, '#f2cb73'],
  [515, 558, 16, '#c73f52'],
  [589, 539, 17, '#dbb665'],
  [345, 564, 14, '#c74358'],
  [659, 577, 15, '#eac86c'],
]

const luces = [
  [490, 220], [520, 257], [462, 296],
  [565, 343], [420, 386], [505, 394],
  [601, 433], [389, 449], [473, 486],
  [543, 512], [650, 535], [353, 533],
  [454, 568], [576, 590], [506, 612],
]

export default function ArbolNavidad() {
  return (
    <svg
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid meet"
      className="arbol-svg"
      role="img"
      aria-label="Árbol navideño decorado con luces y estrella"
    >
      <defs>
        <linearGradient id="pino" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#215e47" />
          <stop offset="48%" stopColor="#0b4336" />
          <stop offset="100%" stopColor="#042b29" />
        </linearGradient>

        <linearGradient id="pinoLuz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#388262" />
          <stop offset="100%" stopColor="#0b4438" />
        </linearGradient>

        <radialGradient id="estrellaLuz">
          <stop offset="0%" stopColor="#fff8c3" />
          <stop offset="45%" stopColor="#f8cd63" />
          <stop offset="100%" stopColor="#e3a839" />
        </radialGradient>

        <filter id="resplandor">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* Resplandor detrás del árbol */}
      <ellipse
        cx="500"
        cy="390"
        rx="300"
        ry="310"
        fill="#e2bd70"
        opacity=".08"
        filter="url(#resplandor)"
      />

      {/* Tronco */}
      <rect
        x="469"
        y="548"
        width="62"
        height="112"
        rx="8"
        fill="#69432b"
      />

      {/* Capas del árbol */}
      <path
        d="M500 92 L355 325 Q500 298 645 325 Z"
        fill="url(#pinoLuz)"
      />
      <path
        d="M500 174 L280 442 Q500 407 720 442 Z"
        fill="url(#pino)"
      />
      <path
        d="M500 275 L205 599 Q500 551 795 599 Z"
        fill="url(#pinoLuz)"
      />
      <path
        d="M500 345 L165 635 Q500 595 835 635 Z"
        fill="url(#pino)"
      />

      {/* Guirnaldas doradas */}
      <path
        d="M426 275 Q500 326 575 270"
        fill="none"
        stroke="#d8b25d"
        strokeWidth="5"
        opacity=".8"
      />
      <path
        d="M362 394 Q500 493 637 394"
        fill="none"
        stroke="#d8b25d"
        strokeWidth="6"
        opacity=".75"
      />
      <path
        d="M283 524 Q500 644 717 524"
        fill="none"
        stroke="#d8b25d"
        strokeWidth="7"
        opacity=".7"
      />

      {/* Esferas navideñas */}
      {adornos.map(([x, y, r, color], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={r}
            fill={color as string}
          />
          <circle
            cx={Number(x) - Number(r) / 3}
            cy={Number(y) - Number(r) / 3}
            r={Number(r) / 4}
            fill="#ffffff"
            opacity=".7"
          />
        </g>
      ))}

      {/* Luces */}
      {luces.map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r="14"
            fill="#ffde85"
            opacity=".32"
            filter="url(#resplandor)"
          />
          <circle
            cx={x}
            cy={y}
            r="4"
            fill="#fff5c2"
            className="luz-arbol"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        </g>
      ))}

      {/* Estrella */}
      <circle
        cx="500"
        cy="88"
        r="42"
        fill="#f4cf73"
        opacity=".4"
        filter="url(#resplandor)"
      />

      <path
        d="M500 43
           L512 75
           L548 78
           L521 101
           L529 136
           L500 117
           L471 136
           L479 101
           L452 78
           L488 75 Z"
        fill="url(#estrellaLuz)"
        stroke="#ffe9a6"
        strokeWidth="3"
      />
    </svg>
  )
}
