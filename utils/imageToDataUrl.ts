// A photo the user picked, made smaller (at most 1600 px wide or high) and sent as a JPEG data URL, the way the API
// takes recipe photos ("data:image/jpeg;base64,…"). The API makes the small copy for the tiles itself.
const MAX_SIZE = 1600

export async function imageToDataUrl(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
        throw new Error('Not an image')
    }

    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    return canvas.toDataURL('image/jpeg', 0.85)
}
