import {getCookie} from 'h3';
import {$fetch} from 'ofetch';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token');
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const { new_products, updated_products } = body;

  if (!new_products && !updated_products) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No product data provided'
    });
  }

  const baseUrl = config.api.url + config.api.basePath;
  const mapProductsUrl = baseUrl + '/receipt/map-products';

  try {
    // Stuur de gemapte producten naar de Laravel backend
    const response = await $fetch(mapProductsUrl, {
      method: 'POST',
      body: {
        new_products: new_products || [],
        updated_products: updated_products || []
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response;
  } catch (err: any) {
    console.error('Error mapping products:', err);
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

