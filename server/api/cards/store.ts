// server/api/cards/store.ts
import { readBody, getCookie } from 'h3'
import { apiClient } from '../utils/apiClient'

interface CardInput {
    title: string
    attachment: string
}

interface Card {
    id?: number
    title: string
    attachment: string
}

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const body = await readBody<CardInput>(event)

    const { title, attachment } = body

    if (!title  || !attachment) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields',
        })
    }

    try {
        const response = await apiClient<Card>(
            '/cards/store',
            {
                method: 'POST',
                body: {
                    title,
                    attachment,
                },
            },
            token
        )

        return response // response: TApiResponse<Card>
    } catch (error: any) {
        console.error('[API] Fout bij kaart opslaan:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Kaart opslaan mislukt: ${error.message}`,
        })
    }
})
