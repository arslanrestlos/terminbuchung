import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignoriert ESLint-Fehler beim Build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignoriert TypeScript-Fehler beim Build
  },
}

export default nextConfig
