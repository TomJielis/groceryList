import { useNotification } from '~/composables/useNotification';

export function useReceiptUpload() {
  const { showSuccess, showError } = useNotification();

  async function uploadReceipt(file: File) {
    try {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showError('Alleen PNG, JPG, JPEG of PDF bestanden zijn toegestaan.');
        throw new Error('Alleen PNG, JPG, JPEG of PDF bestanden zijn toegestaan.');
      }
      const formData = new FormData();
      // Controleer of het bestand een geldige extensie heeft
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        showError('Alleen PNG, JPG, JPEG of PDF bestanden zijn toegestaan.');
        throw new Error('Alleen PNG, JPG, JPEG of PDF bestanden zijn toegestaan.');
      }
      // Voeg het bestand als echte file toe aan FormData
      formData.append('receipt', file, file.name);
      // Gebruik een native fetch-call zonder extra headers, zodat de browser multipart/form-data correct aanmaakt
      const response = await fetch('/api/receipt/upload', {
        method: 'POST',
        body: formData,
        // Zet GEEN Content-Type header, browser doet dit automatisch
        // Zet GEEN credentials of andere headers
      });
      if (!response.ok) {
        throw new Error('Upload mislukt');
      }
      showSuccess('Kassabon succesvol geüpload!');
      return await response.json();
    } catch (e: any) {
      showError(e.message || 'Er is iets misgegaan bij het uploaden. Probeer het opnieuw.');
      throw e;
    }
  }

  async function updateItemsFromReceipt(newProductMappings:any, oldProductMappings:any) {
      const response = await fetch('/api/receipt/map-products', {
          method: 'POST',
          body: JSON.stringify({
              new_products: newProductMappings,
              updated_products: oldProductMappings
          }),
      });
      if (!response.ok) {
          throw new Error('Upload mislukt');
      }
      showSuccess('Kassabon succesvol geüpload!');
      return await response.json();
  }

  return { uploadReceipt, updateItemsFromReceipt };
}
