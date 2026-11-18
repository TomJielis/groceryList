import { ref } from 'vue';

export type NotificationType = 'success' | 'error';

// A button in the message, e.g. "Undo": clicking it runs onClick and closes the message
export type NotificationAction = { label: string; onClick: () => void };

// With a button: long enough to read it and reach for it
export const ACTION_DURATION_MS = 5000;

const message = ref('');
const visible = ref(false);
const type = ref<NotificationType>('error');
const action = ref<NotificationAction | null>(null);
// One message at a time: a new one restarts the timer, so an older one's timer doesn't close it early
let hideTimer: ReturnType<typeof setTimeout> | undefined;
let clearTimer: ReturnType<typeof setTimeout> | undefined;

function hide() {
    clearTimeout(hideTimer);
    visible.value = false;
    clearTimer = setTimeout(() => {
        message.value = '';
        action.value = null;
    }, 300); // Clear message after animation
}

export function useNotification() {
    function showNotification(msg: string, notificationType: NotificationType = 'error', duration = 2000, withAction?: NotificationAction) {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
        message.value = msg;
        type.value = notificationType;
        action.value = withAction ?? null;
        visible.value = true;
        hideTimer = setTimeout(hide, withAction ? Math.max(duration, ACTION_DURATION_MS) : duration);
    }

    function showSuccess(msg: string, duration = 2000, withAction?: NotificationAction) {
        showNotification(msg, 'success', duration, withAction);
    }

    function showError(msg: string, duration = 2000) {
        showNotification(msg, 'error', duration);
    }

    // The message's button was clicked
    function runAction() {
        const current = action.value;
        hide();
        current?.onClick();
    }

    return {
        message,
        visible,
        type,
        action,
        showNotification,
        showSuccess,
        showError,
        runAction,
    };
}
