import { ref } from 'vue';

const message = ref('');
const visible = ref(false);

export function useNotification() {
    function showNotification(msg: string, duration = 2000) {
        message.value = msg;
        visible.value = true;

        setTimeout(() => {
            visible.value = false;
            setTimeout(() => (message.value = ''), 300); // Clear message after animation
        }, duration);
    }

    return {
        message,
        visible,
        showNotification,
    };
}