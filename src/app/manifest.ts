import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sofortangebot',
    short_name: 'Sofortangebot',
    description: 'Angebote per Spracheingabe erstellen',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#2C2C2C',
    theme_color: '#2C2C2C',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
