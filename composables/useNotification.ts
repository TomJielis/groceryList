import { ref } from 'vue';

export type NotificationType = 'success' | 'error';

const message = ref('');
const visible = ref(false);
const type = ref<NotificationType>('error');

export function useNotification() {
    function showNotification(msg: string, notificationType: NotificationType = 'error', duration = 2000) {
        message.value = msg;
        type.value = notificationType;
        visible.value = true;

        setTimeout(() => {
            visible.value = false;
            setTimeout(() => (message.value = ''), 300); // Clear message after animation
        }, duration);
    }

    function showSuccess(msg: string, duration = 2000) {
        showNotification(msg, 'success', duration);
    }

    function showError(msg: string, duration = 2000) {
        showNotification(msg, 'error', duration);
    }

    return {
        message,
        visible,
        type,
        showNotification,
        showSuccess,
        showError,
    };
}