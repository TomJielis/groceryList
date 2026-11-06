// An API error (thrown by apiClient) as this server's answer: the same status, and the API's own message (validation,
// "only the creator…") for the page to show. Shared by the recipe and cookbook routes.
export function apiError(error: any) {
    return createError({
        statusCode: error?.status || 500,
        statusMessage: error?.status === 401 ? 'Unauthorized' : undefined,
        message: error?.data?.message,
        data: error?.data?.errors ? { errors: error.data.errors } : undefined,
    })
}

// A numeric route parameter (a recipe's or cookbook's id), or a 400
export function idParam(value: string | undefined): number {
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
    }
    return id
}
