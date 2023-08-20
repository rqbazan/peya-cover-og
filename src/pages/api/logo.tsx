import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

const fontPromise = fetch(
  new URL(`../../assets/Lato-Bold.ttf`, import.meta.url),
).then(res => res.arrayBuffer())

const peyaLogoPromise = fetch(
  new URL(`../../assets/peya-logo.png`, import.meta.url),
).then(res => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  try {
    const [fontData, logoData] = await Promise.all([
      fontPromise,
      peyaLogoPromise,
    ])

    const url = new URL(req.url)

    const undertext = url.searchParams.get('undertext')
    const fontSize = url.searchParams.get('fontSize') ?? 14.5

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Lato',
          }}
        >
          <div tw="flex">
            <img
              // @ts-expect-error - buffer is not a valid src
              src={logoData}
              width={175}
              height={40}
            />
          </div>
          <div tw="flex justify-center mt-[4px]">
            <span
              tw="text-black font-bold h-4"
              style={{ fontSize: Number(fontSize) }}
            >
              {undertext}
            </span>
          </div>
        </div>
      ),
      {
        width: 175,
        height: 62,
        fonts: [
          {
            name: 'Lato',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      },
    )
  } catch (e: any) {
    console.log(e)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
