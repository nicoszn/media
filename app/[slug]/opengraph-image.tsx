import { ImageResponse } from 'next/og'

// Required exports for Next.js to understand this is an OG image generator
export const runtime = 'edge' // Optional: faster generation
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Helper to format slug into readable title
function formatTitle(slug: string) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const toolName = formatTitle(slug)

  // Optional: fetch tool-specific data here if needed
  // const tool = await getToolData(slug)

  return new ImageResponse(
    (
      // The outer div must use TW classes or inline styles
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
          padding: '60px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Emoji / Icon */}
        <div
          style={{
            fontSize: '80px',
            marginBottom: '20px',
          }}
        >
          🛠️
        </div>

        {/* Dynamic Tool Name */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            margin: '0 0 10px 0',
            letterSpacing: '-1px',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {toolName}
        </h1>

        {/* Subtitle / Value Prop */}
        <p
          style={{
            fontSize: '28px',
            color: '#94b8d4',
            textAlign: 'center',
            margin: '0',
            maxWidth: '80%',
          }}
        >
          Free • No Upload • 100% Private
        </p>

        {/* Bottom brand text */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontSize: '20px',
            color: '#5a7a9a',
            fontWeight: 'bold',
          }}
        >
          yourtoolname.com
        </div>
      </div>
    ),
    {
      ...size,
      // Optional: load custom fonts here
      // fonts: [
      //   {
      //     name: 'Inter',
      //     data: await fetch('https://.../Inter-Bold.ttf').then(r => r.arrayBuffer()),
      //     style: 'normal',
      //     weight: 700,
      //   },
      // ],
    }
  )
}
