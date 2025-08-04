export function WigPlaceholder({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="200" height="200" fill="#F3F4F6" />
      <path
        d="M100 40C70 40 45 55 45 85C45 95 47 104 50 112C48 118 47 124 47 130C47 155 70 175 100 175C130 175 153 155 153 130C153 124 152 118 150 112C153 104 155 95 155 85C155 55 130 40 100 40Z"
        fill="#D1D5DB"
      />
      <path
        d="M100 50C75 50 55 62 55 85C55 92 56 99 58 105C57 109 56 114 56 120C56 140 75 155 100 155C125 155 144 140 144 120C144 114 143 109 142 105C144 99 145 92 145 85C145 62 125 50 100 50Z"
        fill="#9CA3AF"
      />
      <path
        d="M85 70C85 70 82 80 82 90C82 100 85 110 85 110M100 70C100 70 100 80 100 90C100 100 100 110 100 110M115 70C115 70 118 80 118 90C118 100 115 110 115 110"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="100"
        y="185"
        textAnchor="middle"
        fill="#6B7280"
        fontSize="12"
        fontFamily="sans-serif"
      >
        No Image
      </text>
    </svg>
  )
}