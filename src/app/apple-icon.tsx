import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#2C2C2C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#F5C400',
            fontSize: 80,
            fontWeight: 900,
            letterSpacing: '-3px',
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
