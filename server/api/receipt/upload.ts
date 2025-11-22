import {readMultipartFormData} from 'h3';
import {getCookie} from 'h3';
import {$fetch} from 'ofetch';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token');
    const form = await readMultipartFormData(event);
    const config = useRuntimeConfig();

    if (!form || !form.length) throw new Error('No file uploaded');
    const file = form.find(f => f.name === 'receipt');
    if (!file) throw new Error('No receipt file found');

    // In plaats van multipart: stuur base64 naar de backend API
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Alleen PNG, JPG, JPEG of PDF bestanden zijn toegestaan.');
    }
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf'];
    const fileExtension = file.filename.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new Error('Alleen PNG, JPG, JPEG of PDF bestanden zijn toegestaan.');
    }
    const base64Data = file.data.toString('base64');
    const payload = {
        file: {
            name: file.filename,
            type: file.type,
            data: base64Data,
        }
    };
    // Haal de backend URL uit de environment variabelen
    const baseUrl = config.api.url + config.api.basePath;
    const uploadUrl = baseUrl + '/receipt/upload';
    console.log(uploadUrl);
    try {
        const response = await $fetch(uploadUrl, {
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response;
    } catch (err) {
        if (err.response) {
            throw new Error(`API request failed with status ${err.response.status}: ${err.data ? JSON.stringify(err.data) : err.message}`);
        }
        throw err;
    }
});
