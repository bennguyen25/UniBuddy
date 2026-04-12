export default function PriorioLogo({ size = 120 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Calendar body */}
      <rect x="5" y="12" width="90" height="84" rx="11" fill="#1e3a6e" />

      {/* Binding rings (on top of calendar) */}
      <rect x="25" y="3" width="13" height="22" rx="6.5" fill="#1e3a6e" />
      <rect x="62" y="3" width="13" height="22" rx="6.5" fill="#1e3a6e" />

      {/* White inner panel */}
      <rect x="13" y="20" width="74" height="68" rx="6" fill="white" />

      {/* P stem */}
      <rect x="35" y="31" width="8" height="38" rx="4" fill="#1e3a6e" />

      {/* P bowl — thick arc from top of stem curving right and back */}
      <path
        d="M 43 31 C 68 31 68 55 43 55"
        stroke="#1e3a6e"
        strokeWidth="8"
        fill="none"
        strokeLinecap="butt"
      />

      {/* Arrowhead at bottom of stem */}
      <path d="M 31 63 L 39 76 L 47 63" fill="#1e3a6e" />
    </svg>
  )
}
