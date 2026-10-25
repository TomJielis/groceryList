import { setHeader } from 'h3'

// The web app manifest (/manifest.json), served from here instead of public/ so it uses the configured app name
export default defineEventHandler((event) => {
    const { appName } = useRuntimeConfig().public

    setHeader(event, 'Content-Type', 'application/manifest+json')
    return {
        name: appName,
        short_name: appName,
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
            { src: '/icons/app-icon-3.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/app-icon-3.png', sizes: '512x512', type: 'image/png' },
        ],
    }
})
