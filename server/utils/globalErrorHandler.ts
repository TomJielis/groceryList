import { createError } from 'h3';

/**
 * Global error handler that catches all errors and converts Unauthorized errors to 401 status
 */
export default defineNitroErrorHandler((error, event) => {
  // Check if error message contains "Unauthorized"
  if (error?.message?.includes('Unauthorized')) {
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Unauthorized',
      fatal: false
    });
  }

  // Let other errors pass through
  throw error;
});

