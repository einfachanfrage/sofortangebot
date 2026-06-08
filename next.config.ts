import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Dem Client mitteilen ob Vision verfügbar ist (OpenAI = ja, Groq = nein)
    NEXT_PUBLIC_VISION_ENABLED: process.env.AI_PROVIDER !== 'groq' ? 'true' : 'false',
  },
};

export default nextConfig;
