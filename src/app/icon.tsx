import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#2C2C2C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#F5C400',
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: '-0.5px',
            lineHeight: 1,
          }}
        >
          sa
        </span>
      </div>
    ),
    { ...size }
  )
}
