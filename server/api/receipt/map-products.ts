import {getCookie} from 'h3';
import {$fetch} from 'ofetch';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token');
  let body: any = await readBody(event);
  const config = useRuntimeConfig();

  // Body kan een string zijn als er dubbel ge-JSON-stringified is
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.warn('[map-products] Body was string but could not parse JSON');
    }
  }

  const { new_products, updated_products } = body || {};

  console.log('[map-products] Raw body:', body);
  console.log('[map-products] new_products:', Array.isArray(new_products) ? new_products.length : new_products);
  console.log('[map-products] updated_products:', Array.isArray(updated_products) ? updated_products.length : updated_products);

  if (!Array.isArray(new_products) && !Array.isArray(updated_products)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No product data provided (expected new_products or updated_products arrays)'
    });
  }

  const baseUrl = config.api.url + config.api.basePath;
  const mapProductsUrl = baseUrl + '/receipt/update-items';

  try {
    const response = await $fetch(mapProductsUrl, {
      method: 'POST',
      body: {
        new_products: Array.isArray(new_products) ? new_products : [],
        updated_products: Array.isArray(updated_products) ? updated_products : []
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response;
  } catch (err: any) {
    console.error('[map-products] Error forwarding to backend:', err);
    if (err.response) {
      throw createError({
        statusCode: err.response.status || 500,
        statusMessage: err.data?.message || 'Failed to map products'
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Failed to map products'
    });
  }
});
