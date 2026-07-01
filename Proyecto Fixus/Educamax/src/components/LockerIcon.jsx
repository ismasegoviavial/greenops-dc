// SVG locker icon que parece casillero de colegio
export default function LockerIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cuerpo del casillero */}
      <rect x="4" y="2" width="16" height="20" rx="1.5" />
      {/* División horizontal en el medio */}
      <line x1="4" y1="12" x2="20" y2="12" />
      {/* Ventilación superior */}
      <line x1="9" y1="5" x2="15" y2="5" />
      <line x1="9" y1="7" x2="15" y2="7" />
      {/* Ventilación inferior */}
      <line x1="9" y1="15" x2="15" y2="15" />
      <line x1="9" y1="17" x2="15" y2="17" />
      {/* Manilla superior */}
      <circle cx="12" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
      {/* Manilla inferior */}
      <circle cx="12" cy="19.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
