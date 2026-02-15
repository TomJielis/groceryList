// typescript
export default defineNuxtPlugin(() => {
    if (!import.meta.client) return;

    const LIGHT = '#ffffff';
    const DARK = '#0f172a';

    function ensureMeta(name: string) {
        let m = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
        if (!m) {
            m = document.createElement('meta');
            m.setAttribute('name', name);
            document.head.appendChild(m);
        }
        return m;
    }

    const themeMeta = ensureMeta('theme-color');
    const appleMeta = ensureMeta('apple-mobile-web-app-status-bar-style');

    const apply = (isDark: boolean) => {
        themeMeta.setAttribute('content', isDark ? DARK : LIGHT);
        appleMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
    };

    // Check if dark mode is active based on html class (Tailwind dark mode)
    const checkDarkMode = () => {
        return document.documentElement.classList.contains('dark');
    };

    // Apply initial state
    apply(checkDarkMode());

    // Watch for class changes on html element using MutationObserver
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                apply(checkDarkMode());
            }
        }
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });

    // Also listen to system preference as fallback
    if (window.matchMedia) {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = () => {
            setTimeout(() => apply(checkDarkMode()), 50);
        };
        mql.addEventListener('change', listener);

        const cleanup = () => {
            try {
                mql.removeEventListener('change', listener);
                observer.disconnect();
            } catch {}
        };

        window.addEventListener('beforeunload', cleanup);
        window.addEventListener('pagehide', cleanup);
    }
});
