import { createError } from 'h3';

/**
 * Global middleware that catches all errors and converts Unauthorized errors to 401 status
 */
export default defineEventHandler((event) => {
  // Hook into the error handling
  const originalThrow = event._handled;

  // Handle errors thrown in the route
  event.node.res.on('error', (err: any) => {
    if (err.message?.includes('Unauthorized')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }
  });
});

// Also hook into Nitro's error handling
export const errorHandler = (err: any, event: any) => {
  if (err?.message?.includes('Unauthorized')) {
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
  return err;
};

