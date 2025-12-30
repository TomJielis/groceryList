// typescript
export default defineNuxtPlugin(() => {
    if (!import.meta.client || !window.matchMedia) return;

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

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    apply(mql.matches);
    const listener = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener('change', listener);

    const cleanup = () => {
        try { mql.removeEventListener('change', listener); } catch {}
    };

    // remove listener on page unload / hide (client-side safe)
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);
});
