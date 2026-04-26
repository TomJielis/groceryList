import { setResponseStatus, setHeader, send } from 'h3';

export default defineNitroErrorHandler(async (error, event) => {
  setHeader(event, 'Content-Type', 'application/json');

  if (error?.message?.includes('Unauthorized') || error?.statusCode === 401) {
    setResponseStatus(event, 401, 'Unauthorized');
    return send(event, JSON.stringify({ statusCode: 401, statusMessage: 'Unauthorized' }));
  }

  const statusCode = error.statusCode || 500;
  setResponseStatus(event, statusCode, error.statusMessage || 'Internal Server Error');
  return send(event, JSON.stringify({
    statusCode,
    statusMessage: error.statusMessage || 'Internal Server Error',
    message: error.message,
  }));
});
