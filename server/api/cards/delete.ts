// server/api/cards/store.ts
import { readBody, getCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'

interface CardInput {
    id: number
}

interface Card {
    id: number
}

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const body = await readBody<CardInput>(event)

    const { id   } = body

    if (!id ) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Id is missing',
        })
    }

    try {
        const response = await apiClient<Card>(
            '/cards/' + id + '/delete',
            {
                method: 'DELETE',
                body: {
                    id,
                },
            },
            token
        )

        return response // response: TApiResponse<Card>
    } catch (error: any) {
        console.error('[API] Fout bij verwijderen kaart :', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Kaart verwijderen mislukt: ${error.message}`,
        })
    }
})
