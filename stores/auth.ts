import {defineStore} from 'pinia';
import {useI18nStore} from '~/stores/i18n';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any | null,
        token: null as string | null,
    }),
    actions: {
        setUser(user: any) {
            this.user = user;
            const i18n = useI18nStore();
            if (user?.language) {
                i18n.setLocale(user.language === 'nl' ? 'nl' : 'en');
            }
        },
        setLanguage(language: string) {
            if (this.user) {
                this.user.language = language;
                const i18n = useI18nStore();
                i18n.setLocale(language === 'nl' ? 'nl' : 'en');
            }
        },
        setDarkMode(darkMode: boolean) {
            if (this.user) {
                this.user.dark_mode = darkMode;
            }
        },
        setToken(token: string) {
            this.token = token;
        },
        clearAuth() {
            this.user = null;
            this.token = null;
            const i18n = useI18nStore();
            i18n.setLocale('en'); // reset to English when logged out
        },
    },
    persist: true,
})
