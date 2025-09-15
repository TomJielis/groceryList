import { ref } from 'vue';

export function useIsMobile() {
    const isMobile = ref(window.innerWidth <= 768);

    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 768;
    });

    return { isMobile };
}