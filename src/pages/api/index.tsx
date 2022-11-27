import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

const backgroundImgSrc = new URL(
  `../../assets/repo-cover-bg.png`,
  import.meta.url
).toString()

const fontPromise = fetch(
  new URL(`../../assets/Lato-Bold.ttf`, import.meta.url)
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  try {
    const font = await fontPromise

    const url = new URL(req.url)

    const title = url.searchParams.get('title')
    const subtitle = url.searchParams.get('subtitle')

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Lato',
            justifyContent: 'center',
          }}
        >
          <img
            alt="avatar"
            src={backgroundImgSrc}
            tw="w-full h-full inset-0 absolute"
          />
          <div tw="flex flex-col px-[120px] w-full items-end">
            <h1 tw="text-white text-[88px] font-bold text-right">{title}</h1>
            <h2 tw="text-white text-[32px] font-bold -mt-[16px] text-right">
              {subtitle}
            </h2>
          </div>
        </div>
      ),
      {
        width: 1250,
        height: 703,
        fonts: [
          {
            name: 'Lato',
            data: font,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    )
  } catch (e: any) {
    console.log(e)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
