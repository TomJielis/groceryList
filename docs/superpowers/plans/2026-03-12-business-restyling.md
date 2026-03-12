# Business Restyling Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle de volledige GroceryList app naar een business-applicatie stijl met een gecentraliseerde PrimeVue custom preset, minder inline Tailwind, en maximaal gebruik van PrimeVue componenten.

**Architecture:** Alle kleuren en design tokens worden gedefinieerd in één PrimeVue custom preset (`assets/theme/business.ts`). Custom CSS voor niet-PrimeVue elementen (Navbar, BottomBar, auth shell) staat in `assets/css/app-theme.css` en gebruikt uitsluitend CSS variabelen. Tailwind wordt alleen gebruikt voor layout utilities (flex, grid, spacing).

**Tech Stack:** Nuxt 4, Vue 3, PrimeVue 4.5.4 (Aura preset base), Tailwind CSS 3, DM Sans font

---

## Chunk 1: Foundation — Preset, CSS, Config

### Task 1: Maak de custom PrimeVue preset aan

**Files:**
- Create: `assets/theme/business.ts`

- [ ] **Stap 1: Maak de theme directory en preset bestand aan**

```bash
mkdir -p assets/theme
```

Maak `assets/theme/business.ts` aan met deze inhoud:

```ts
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

export default definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
    colorScheme: {
      light: {
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        primary: {
          color:         '#f97316',
          contrastColor: '#ffffff',
          hoverColor:    '#ea580c',
          activeColor:   '#c2410c',
        },
        highlight: {
          background:      '#fff7ed',
          focusBackground: '#ffedd5',
          color:           '#c2410c',
          focusColor:      '#9a3412',
        },
      },
    },
    formField: {
      borderRadius: '4px',
      focusRing: {
        width:  '0',
        style:  'none',
        color:  'transparent',
        offset: '0',
        shadow: '0 0 0 3px rgba(30,58,95,0.12)',
      },
    },
  },
  components: {
    button: {
      root: {
        borderRadius: '4px',
        paddingX:     '1rem',
        paddingY:     '0.6rem',
        sm: {
          fontSize: '0.75rem',
          paddingX: '0.75rem',
          paddingY: '0.45rem',
        },
      },
    },
    inputtext: {
      root: {
        borderColor:      '{surface.300}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '#1e3a5f',
        background:       '{surface.50}',
        color:            '{surface.900}',
        placeholderColor: '{surface.400}',
        borderRadius:     '4px',
      },
    },
    select: {
      root: {
        borderColor:      '{surface.300}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '#1e3a5f',
        background:       '{surface.50}',
        borderRadius:     '4px',
      },
    },
    checkbox: {
      root: {
        borderColor:            '{surface.300}',
        checkedBackground:      '#1e3a5f',
        checkedBorderColor:     '#1e3a5f',
        checkedHoverBackground: '#16304f',
        borderRadius:           '3px',
      },
      icon: {
        checkedColor: '#ffffff',
      },
    },
    card: {
      root: {
        background:   '{surface.0}',
        color:        '{surface.900}',
        borderRadius: '4px',
        shadow:       '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
      },
    },
    dialog: {
      root: {
        background:   '{surface.0}',
        color:        '{surface.900}',
        borderRadius: '4px',
        shadow:       '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
    progressbar: {
      root: {
        background:   '{surface.200}',
        borderRadius: '2px',
        height:       '4px',
      },
      value: {
        background: '{primary.color}',
      },
    },
    datatable: {
      headerCell: {
        background:  '{surface.50}',
        color:       '{surface.500}',
        borderColor: '{surface.200}',
      },
      row: {
        background:      '{surface.0}',
        hoverBackground: '{surface.50}',
        borderColor:     '{surface.100}',
      },
      bodyCell: {
        borderColor: '{surface.100}',
      },
    },
  },
})
```

- [ ] **Stap 2: Verifieer dat het bestand correct is aangemaakt**

```bash
ls assets/theme/business.ts
```

Verwacht: bestand bestaat

---

### Task 2: Maak de centrale custom CSS aan

**Files:**
- Create: `assets/css/app-theme.css`

- [ ] **Stap 1: Maak `assets/css/app-theme.css` aan**

```css
/* ============================================================
   App Theme — custom styles buiten PrimeVue componenten
   Gebruik uitsluitend var(--p-*) of var(--app-*) tokens.
   Geen hardcoded hexwaarden buiten :root.
   ============================================================ */

:root {
  --app-bg:       #f0f4f8;
  --app-bg-auth:  #e8ecf2;
  --app-navy:     #1e3a5f;
  --app-navy-dark:#16304f;
  --app-success:  #10b981;
  --app-error:    #ef4444;
  --app-warning:  #f59e0b;
  --app-info:     #3b82f6;
}

/* ----- Globaal ----- */
body {
  background-color: var(--app-bg);
  color: var(--p-surface-900);
}

/* ----- Navbar (desktop) ----- */
.app-navbar {
  background: var(--app-navy);
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
}

.app-navbar-logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--p-primary-color);
  flex-shrink: 0;
}

.app-navbar-brand {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.app-navbar-link {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  padding: 5px 10px;
  border-radius: 3px;
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}

.app-navbar-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.app-navbar-link.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

/* ----- BottomBar (mobile) ----- */
.app-bottombar {
  background: var(--p-surface-0);
  border-top: 1px solid var(--p-surface-200);
}

.app-bottombar-tab {
  color: var(--p-surface-400);
  transition: color 0.15s;
}

.app-bottombar-tab.active {
  color: var(--app-navy);
}

.app-bottombar-tab-icon.active {
  background: var(--app-navy);
  color: #fff;
}

/* ----- Auth pagina's ----- */
.auth-page {
  background: var(--app-bg-auth);
}

.auth-card-header {
  background: var(--app-navy);
  color: #fff;
  border-radius: 4px 4px 0 0;
  padding: 1.75rem 2rem 1.5rem;
}

.auth-card-header .auth-logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--p-primary-color);
  display: inline-block;
  margin-right: 6px;
}

.auth-card-header .auth-brand {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.auth-card-header .auth-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  margin-top: 0.75rem;
  line-height: 1.2;
}

.auth-card-header .auth-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 4px;
}

/* ----- Stat kaarten (list detail + admin) ----- */
.stat-card-item {
  background: var(--p-surface-0);
  border-radius: 4px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
}

.stat-card-accent-orange { border-left: 3px solid var(--p-primary-color); }
.stat-card-accent-blue   { border-left: 3px solid var(--app-info); }
.stat-card-accent-green  { border-left: 3px solid var(--app-success); }

.stat-card-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--p-surface-400);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.stat-card-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--p-surface-900);
  letter-spacing: -0.02em;
}

/* ----- List item rijen ----- */
.list-item-row {
  background: var(--p-surface-0);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* ----- Pagina sectie headers ----- */
.page-eyebrow {
  font-size: 10px;
  font-weight: 600;
  color: var(--p-surface-400);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.page-heading {
  font-size: 20px;
  font-weight: 700;
  color: var(--p-surface-900);
  letter-spacing: -0.02em;
}

/* ----- Notification kleuren ----- */
.notification-success { background: var(--app-success); }
.notification-error   { background: var(--app-error); }
.notification-warning { background: var(--app-warning); }
.notification-info    { background: var(--app-info); }
```

- [ ] **Stap 2: Verifieer dat het bestand correct is aangemaakt**

```bash
ls assets/css/app-theme.css
```

Verwacht: bestand bestaat

---

### Task 3: Update `nuxt.config.ts`

**Files:**
- Modify: `nuxt.config.ts`

- [ ] **Stap 1: Vervang de Aura import door de BusinessPreset import**

Zoek in `nuxt.config.ts`:
```ts
import Aura from '@primevue/themes/aura'
```

Vervang door:
```ts
import BusinessPreset from './assets/theme/business'
```

- [ ] **Stap 2: Update de primevue preset configuratie**

Zoek:
```ts
theme: {
    preset: Aura
}
```

Vervang door:
```ts
theme: {
    preset: BusinessPreset
}
```

- [ ] **Stap 3: Voeg app-theme.css toe aan de css array**

Zoek:
```ts
css: ['@/assets/css/tailwind.css', '@/assets/css/main.css', 'primeicons/primeicons.css'],
```

Vervang door:
```ts
css: ['@/assets/css/tailwind.css', '@/assets/css/main.css', '@/assets/css/app-theme.css', 'primeicons/primeicons.css'],
```

- [ ] **Stap 4: Start de dev server en verifieer dat de app opstart zonder fouten**

```bash
npm run dev
```

Verwacht: server start op zonder TypeScript- of import-fouten. PrimeVue knoppen zijn nu oranje in plaats van blauw/grijs.

- [ ] **Stap 5: Commit**

```bash
git add assets/theme/business.ts assets/css/app-theme.css nuxt.config.ts
git commit -m "feat: add business preset and app-theme CSS"
```

---

### Task 4: Update `app.vue` — verwijder inline body styling

**Files:**
- Modify: `app.vue`

- [ ] **Stap 1: Lees het huidige `app.vue`**

Open `app.vue` en zoek de `<style>` sectie. Verwijder of vervang de inline `background-color: #18181b` en `color: #fafafa` op `html, body` — deze worden nu gestuurd door `app-theme.css`.

De stijlregel in `app.vue` die verwijderd moet worden:
```css
html, body {
  background-color: #18181b;
  ...
}
```

Vervang door (of verwijder als `app-theme.css` alles afdekt):
```css
html, body {
  font-family: 'DM Sans', system-ui, sans-serif;
  overflow: hidden;
  height: 100%;
}
```

- [ ] **Stap 2: Verifieer in de browser**

Open de app. De pagina achtergrond is nu lichtgrijs (`#f0f4f8`) in plaats van donker. Tekst is donker.

- [ ] **Stap 3: Commit**

```bash
git add app.vue
git commit -m "feat: remove dark theme from app.vue, use app-theme.css"
```

---

## Chunk 2: Gedeelde componenten — form/, Loader, NotificationBar

### Task 5: Update `form/formInput.vue`

**Files:**
- Modify: `components/form/formInput.vue`

- [ ] **Stap 1: Lees het huidige bestand**

Open `components/form/formInput.vue`. Zoek alle `unstyled` props en inline kleurklassen.

- [ ] **Stap 2: Verwijder `unstyled` en `pt` kleur-overrides van InputText**

Verwijder de `unstyled` prop van de `<InputText>` component. Verwijder `pt` overrides die `bg-[#...]`, `text-[#...]`, `border-[#...]` classes bevatten. Bewaar `pt` keys voor positie/structuur (zoals `root`, `input` display/width).

- [ ] **Stap 3: Vervang inline Tailwind kleurklassen door CSS variabelen**

Zoek klassen als `text-[#fafafa]`, `border-[#27272a]`, `bg-transparent`. Vervang door:
- Tekst: `style="color: var(--p-surface-900)"`
- Of verwijder volledig als de preset het afhandelt

- [ ] **Stap 4: Verifieer visueel in de browser**

Navigeer naar een pagina met een formulier. Het invoerveld heeft nu een lichtgrijze achtergrond, zichtbare border, en donkere tekst.

- [ ] **Stap 5: Commit**

```bash
git add components/form/formInput.vue
git commit -m "feat: restyle formInput to business theme"
```

---

### Task 6: Update `form/addButton.vue` en `form/backButton.vue`

**Files:**
- Modify: `components/form/addButton.vue`
- Modify: `components/form/backButton.vue`

- [ ] **Stap 1: Update `addButton.vue`**

Open `components/form/addButton.vue`. Verwijder `unstyled` prop. Voeg `severity="primary"` toe aan de `<Button>` als dat er nog niet op staat. Verwijder inline kleurklassen van de button wrapper.

- [ ] **Stap 2: Update `backButton.vue`**

Open `components/form/backButton.vue`. Verwijder `unstyled` prop. Zet de button op `severity="secondary"` of `text` variant (kies `text` als het een teruglink is). Verwijder inline kleurklassen.

- [ ] **Stap 3: Verifieer visueel**

Controleer dat addButton oranje is en backButton subtiel/ghost.

- [ ] **Stap 4: Commit**

```bash
git add components/form/addButton.vue components/form/backButton.vue
git commit -m "feat: restyle form buttons to business theme"
```

---

### Task 7: Update `Loader.vue`

**Files:**
- Modify: `components/Loader.vue`

- [ ] **Stap 1: Lees het huidige bestand**

Open `components/Loader.vue`. Bekijk de huidige spinner implementatie.

- [ ] **Stap 2: Vervang door PrimeVue ProgressSpinner**

Vervang de huidige spinner door:
```vue
<template>
  <div class="flex items-center justify-center w-full h-full">
    <ProgressSpinner
      style="width: 40px; height: 40px"
      strokeWidth="3"
      animationDuration=".8s"
    />
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
</script>
```

- [ ] **Stap 3: Verifieer**

Trigger een laadstaat in de app. De spinner is zichtbaar en gebruikt de primaire oranje kleur.

- [ ] **Stap 4: Commit**

```bash
git add components/Loader.vue
git commit -m "feat: replace custom spinner with PrimeVue ProgressSpinner"
```

---

### Task 8: Update `NotificationBar.vue`

**Files:**
- Modify: `components/NotificationBar.vue`

- [ ] **Stap 1: Lees het huidige bestand**

Open `components/NotificationBar.vue`. Zoek de inline kleurvariabelen voor success/error states.

- [ ] **Stap 2: Vervang hardcoded kleuren door CSS variabelen**

Zoek hardcoded hex kleuren in de template en style sectie (bijv. `#f87171`, `#1f0a0a`, `#fafafa`). Vervang door:

Voor success states: `var(--app-success)`
Voor error states: `var(--app-error)`
Voor warning states: `var(--app-warning)`
Voor info states: `var(--app-info)`
Voor tekst op gekleurde achtergrond: `#ffffff`

Voeg toe aan de wrapper klasse-logica (bv. via `:class`):
```vue
:class="{
  'notification-success': type === 'success',
  'notification-error': type === 'error',
  'notification-warning': type === 'warning',
  'notification-info': type === 'info',
}"
```

De notification CSS klassen zijn al gedefinieerd in `app-theme.css`.

- [ ] **Stap 3: Zorg dat tekst leesbaar blijft**

Controleer dat de tekstkleur op gekleurde achtergrond wit is (`color: #fff`).

- [ ] **Stap 4: Verifieer**

Trigger een success en error notificatie. Kleuren zijn groen resp. rood.

- [ ] **Stap 5: Commit**

```bash
git add components/NotificationBar.vue
git commit -m "feat: restyle NotificationBar with CSS variables"
```

---

## Chunk 3: Navbar en BottomBar

### Task 9: Update `Navbar.vue`

**Files:**
- Modify: `components/Navbar.vue`

- [ ] **Stap 1: Lees het huidige bestand**

Open `components/Navbar.vue`. Noteer de huidige structuur, nav links, en taal dropdown implementatie.

- [ ] **Stap 2: Voeg `app-navbar` class toe aan de root wrapper**

Vervang de huidige achtergrond-styling op de navbar wrapper door class `app-navbar`:
```vue
<nav class="app-navbar hidden md:flex ...">
```
Verwijder eventuele `bg-[#...]` of `bg-zinc-*` kleurklassen van de wrapper.

- [ ] **Stap 3: Update logo sectie**

Voeg een logo dot toe voor de merknaam:
```vue
<div class="flex items-center gap-2">
  <span class="app-navbar-logo-dot"></span>
  <span class="app-navbar-brand">GroceryList</span>
</div>
```

- [ ] **Stap 4: Update nav links**

Voeg `app-navbar-link` class toe aan alle navigatielinks. Voeg `:class="{ active: route.path === '...' }"` toe voor de actieve staat. Verwijder inline kleurklassen.

```vue
<NuxtLink to="/" class="app-navbar-link" :class="{ active: route.path === '/' }">
  {{ t('nav.lists') }}
</NuxtLink>
```

- [ ] **Stap 5: Update taal dropdown naar PrimeVue Select**

Vervang de bestaande taal dropdown implementatie door een PrimeVue `Select` component:
```vue
<Select
  v-model="selectedLocale"
  :options="localeOptions"
  optionLabel="label"
  optionValue="value"
  class="app-navbar-lang-select"
  @change="switchLocale"
/>
```

Zorg dat `selectedLocale` en `localeOptions` de bestaande locale switching logica bewaren (geen gedragswijziging).

- [ ] **Stap 6: Verwijder overbodige inline stijlklassen**

Verwijder alle `text-[#...]`, `bg-[#...]`, `border-[#...]` klassen van de navbar template.

- [ ] **Stap 7: Verifieer in browser (desktop)**

Open de app op desktop-breedte. Navbar is donkerblauw met oranje dot, witte links. Actieve link heeft lichte achtergrond highlight.

- [ ] **Stap 8: Commit**

```bash
git add components/Navbar.vue
git commit -m "feat: restyle Navbar to business theme with navy background"
```

---

### Task 10: Update `BottomBar.vue`

**Files:**
- Modify: `components/BottomBar.vue`

- [ ] **Stap 1: Lees het huidige bestand**

Open `components/BottomBar.vue`. Noteer de tab structuur en actieve staat logica.

- [ ] **Stap 2: Voeg `app-bottombar` class toe aan de root wrapper**

```vue
<div class="app-bottombar fixed bottom-0 left-0 right-0 flex md:hidden ...">
```
Verwijder `bg-[#...]` kleurklassen van de wrapper.

- [ ] **Stap 3: Update tab items met `app-bottombar-tab` klassen**

Voor elk tab item:
```vue
<button
  class="app-bottombar-tab flex flex-col items-center gap-1 flex-1 py-2"
  :class="{ active: route.path === tab.path }"
>
  <span
    class="app-bottombar-tab-icon w-6 h-6 flex items-center justify-center rounded"
    :class="{ active: route.path === tab.path }"
  >
    <i :class="tab.icon"></i>
  </span>
  <span class="text-[8px] font-medium">{{ tab.label }}</span>
</button>
```

- [ ] **Stap 4: Verwijder inline kleurklassen**

Verwijder alle `text-[#...]`, `bg-[#...]`, `border-[#...]` uit de BottomBar template.

- [ ] **Stap 5: Verifieer op mobiele viewport**

Verklein het browservenster naar mobiele breedte. BottomBar heeft witte achtergrond, grijze inactieve tabs, marineblauwe actieve tab.

- [ ] **Stap 6: Commit**

```bash
git add components/BottomBar.vue
git commit -m "feat: restyle BottomBar to business theme"
```

---

## Chunk 4: Modals

### Task 11: Update `deleteModal.vue`

**Files:**
- Modify: `components/deleteModal.vue`

- [ ] **Stap 1: Lees het huidige bestand**

Open `components/deleteModal.vue`. Noteer hoe de modal wordt geopend/gesloten (`:visible`, `v-model`, emit).

- [ ] **Stap 2: Vervang modal structuur door PrimeVue Dialog**

Vervang de huidige overlay/modal div structuur door een `<Dialog>` component. Behoud de bestaande open/close logica exact:

```vue
<Dialog
  v-model:visible="isVisible"
  :header="title"
  modal
  :style="{ width: '400px' }"
>
  <p class="text-sm" style="color: var(--p-surface-600)">{{ message }}</p>

  <!-- Bevestigingsveld (indien aanwezig in huidige implementatie) -->
  <InputText
    v-if="requiresConfirmation"
    v-model="confirmationInput"
    :placeholder="confirmationPlaceholder"
    class="w-full mt-4"
  />

  <template #footer>
    <Button
      :label="t('common.cancel')"
      severity="secondary"
      @click="cancel"
    />
    <Button
      :label="t('common.delete')"
      severity="danger"
      :disabled="requiresConfirmation && confirmationInput !== confirmationValue"
      @click="confirm"
    />
  </template>
</Dialog>
```

Pas de prop-namen aan zodat ze overeenkomen met wat de parent components doorgeven. Wijzig geen `emit` namen.

- [ ] **Stap 3: Verifieer open/close gedrag**

Trigger de delete modal. De modal opent, de bevestigingsknop is rood, annuleren sluit de modal. Gedrag is identiek aan voor de wijziging.

- [ ] **Stap 4: Commit**

```bash
git add components/deleteModal.vue
git commit -m "feat: replace deleteModal with PrimeVue Dialog"
```

---

### Task 12: Update `DeleteListModal.vue` en `ShareListModal.vue`

**Files:**
- Modify: `components/DeleteListModal.vue`
- Modify: `components/ShareListModal.vue`

- [ ] **Stap 1: Update `DeleteListModal.vue`**

Zelfde aanpak als Task 11. Vervang modal structuur door `<Dialog>`. Behoud alle props en emits ongewijzigd. Knoppen: `Button severity="secondary"` (annuleren) en `Button severity="danger"` (verwijderen).

- [ ] **Stap 2: Update `ShareListModal.vue`**

Vervang modal structuur door `<Dialog>`. Behoud e-mail input logica. Gebruik `InputText` voor het e-mailveld. Knoppen: `Button severity="secondary"` (annuleren) en `Button severity="primary"` (delen).

```vue
<Dialog v-model:visible="isVisible" :header="t('share.title')" modal :style="{ width: '400px' }">
  <div class="flex flex-col gap-3">
    <label class="page-eyebrow">{{ t('share.emailLabel') }}</label>
    <InputText
      v-model="emailInput"
      type="email"
      :placeholder="t('share.emailPlaceholder')"
      class="w-full"
    />
    <p v-if="errorMessage" class="text-sm" style="color: var(--app-error)">{{ errorMessage }}</p>
  </div>
  <template #footer>
    <Button :label="t('common.cancel')" severity="secondary" @click="close" />
    <Button :label="t('share.send')" severity="primary" @click="share" />
  </template>
</Dialog>
```

- [ ] **Stap 3: Verifieer beide modals**

Test de delete en share flow. Modals openen en sluiten correct. Validatie werkt nog.

- [ ] **Stap 4: Commit**

```bash
git add components/DeleteListModal.vue components/ShareListModal.vue
git commit -m "feat: replace list modals with PrimeVue Dialog"
```

---

### Task 13: Update `profile/DeactivateAccountModal.vue`

**Files:**
- Modify: `components/profile/DeactivateAccountModal.vue`

- [ ] **Stap 1: Vervang modal door PrimeVue Dialog**

Zelfde aanpak als Task 11. Vervang de modal structuur door `<Dialog>`. Behoud de "DELETE" tekstveld validatie logica exact. Knoppen: `Button severity="secondary"` (annuleren) en `Button severity="danger"` (deactiveren, disabled totdat tekstveld overeenkomt).

- [ ] **Stap 2: Verifieer**

Open de deactivatie modal. De knop is disabled tot "DELETE" ingetypt is. Gedrag identiek aan voor.

- [ ] **Stap 3: Commit**

```bash
git add components/profile/DeactivateAccountModal.vue
git commit -m "feat: replace DeactivateAccountModal with PrimeVue Dialog"
```

---

## Chunk 5: Auth pagina's

### Task 14: Update auth pagina's — gedeeld patroon

**Files:**
- Modify: `pages/auth/login.vue`
- Modify: `pages/auth/register.vue`
- Modify: `pages/auth/password/reset.vue`
- Modify: `pages/auth/password/[id].vue`
- Modify: `pages/auth/[id].vue`

Alle vijf auth pagina's volgen hetzelfde patroon. Implementeer ze één voor één.

- [ ] **Stap 1: Update `pages/auth/login.vue`**

**Wrapper:** Voeg class `auth-page` toe aan de pagina wrapper div. Verwijder `bg-[#18181b]` van de wrapper.

**Card structuur:** Vervang de huidige card div door een PrimeVue `Card` met een custom header slot:

```vue
<Card class="w-full max-w-xs overflow-hidden" :pt="{ body: { class: 'p-0' } }">
  <template #header>
    <div class="auth-card-header">
      <div class="flex items-center gap-2 mb-4">
        <span class="auth-logo-dot"></span>
        <span class="auth-brand">GroceryList</span>
      </div>
      <div class="auth-title">{{ t('auth.loginTitle') }}</div>
      <div class="auth-subtitle">{{ t('auth.loginSubtitle') }}</div>
    </div>
  </template>
  <template #content>
    <div class="p-8">
      <!-- form inhoud hier -->
    </div>
  </template>
</Card>
```

**Inputs:** Verwijder `unstyled` prop en alle `pt` kleur-overrides van `InputText` en `Password`. Behoud `v-model`, `type`, `placeholder`, en structurele `pt` keys.

**Knoppen:** Verwijder `unstyled` prop van alle `Button` components. Voeg `severity="primary"` toe aan de login knop. Voeg `severity="secondary"` of `outlined` toe aan de registreer knop.

**Taalwisseling:** Verwijder `unstyled` en `pt` van `SelectButton`.

**Inline kleurklassen:** Verwijder alle `text-[#...]`, `bg-[#...]`, `border-[#...]` klassen. Vervang `text-[#52525b]` door `style="color: var(--p-surface-500)"` etc. waar nodig.

- [ ] **Stap 2: Verifieer login.vue visueel**

Open `/auth/login`. Pagina heeft lichtgrijze achtergrond, kaart met donkerblauwe header. Inputs hebben zichtbare borders. Login knop is oranje. Formulier werkt nog (log in met testaccount).

- [ ] **Stap 3: Update `pages/auth/register.vue`**

Pagina wrapper: voeg class `auth-page` toe, verwijder `bg-[#18181b]`.

Vervang kaartstructuur door `Card` met donkerblauwe header slot (zelfde structuur als login):
```vue
<Card class="w-full max-w-xs overflow-hidden" :pt="{ body: { class: 'p-0' } }">
  <template #header>
    <div class="auth-card-header">
      <div class="flex items-center gap-2 mb-4">
        <span class="auth-logo-dot"></span>
        <span class="auth-brand">GroceryList</span>
      </div>
      <div class="auth-title">{{ t('auth.registerTitle') }}</div>
      <div class="auth-subtitle">{{ t('auth.registerSubtitle') }}</div>
    </div>
  </template>
  <template #content>
    <div class="p-8"><!-- form inhoud --></div>
  </template>
</Card>
```

Specifieke aandachtspunten:
- `SelectButton` voor taalwisseling: verwijder `unstyled` + `pt`
- `Checkbox` voor terms: verwijder `unstyled` + `pt`
- Alle `InputText` velden: verwijder `unstyled` + `pt` kleur-overrides
- `Button` registreer: `severity="primary"`, verwijder `unstyled`
- Terugknop naar login: `severity="secondary"`, verwijder `unstyled`
- Verwijder alle `text-[#...]`, `bg-[#...]`, `border-[#...]` klassen

- [ ] **Stap 4: Verifieer register.vue**

Open `/auth/register`. Pagina heeft lichtgrijze achtergrond, kaart met donkerblauwe header. Alle velden, taalwisseling en checkbox werken.

- [ ] **Stap 5: Update `pages/auth/password/reset.vue`** (wachtwoord reset — e-mail invoer)

Pagina wrapper: voeg class `auth-page` toe.

Vervang kaartstructuur door `Card` met header slot:
```vue
<Card class="w-full max-w-xs overflow-hidden" :pt="{ body: { class: 'p-0' } }">
  <template #header>
    <div class="auth-card-header">
      <div class="flex items-center gap-2 mb-4">
        <span class="auth-logo-dot"></span>
        <span class="auth-brand">GroceryList</span>
      </div>
      <div class="auth-title">{{ t('auth.resetTitle') }}</div>
      <div class="auth-subtitle">{{ t('auth.resetSubtitle') }}</div>
    </div>
  </template>
  <template #content>
    <div class="p-8"><!-- e-mail input + verstuur knop --></div>
  </template>
</Card>
```

- `InputText` voor e-mail: verwijder `unstyled` + `pt`
- Verstuur knop: `Button severity="primary"`, verwijder `unstyled`
- Verwijder inline kleurklassen

- [ ] **Stap 6: Verifieer password/reset.vue**

Open `/auth/password/reset`. Pagina correct gestyled. E-mail invoer en versturen werkt.

- [ ] **Stap 7: Update `pages/auth/password/[id].vue`** (nieuw wachtwoord invullen)

Pagina wrapper: voeg class `auth-page` toe.

Vervang kaartstructuur door `Card` met header slot (zelfde patroon):
```vue
<div class="auth-card-header">
  <div class="flex items-center gap-2 mb-4">
    <span class="auth-logo-dot"></span>
    <span class="auth-brand">GroceryList</span>
  </div>
  <div class="auth-title">{{ t('auth.newPasswordTitle') }}</div>
  <div class="auth-subtitle">{{ t('auth.newPasswordSubtitle') }}</div>
</div>
```

- Wachtwoord velden (`Password`): verwijder `unstyled` + `pt` kleur-overrides
- Opslaan knop: `Button severity="primary"`, verwijder `unstyled`
- Verwijder inline kleurklassen

- [ ] **Stap 8: Verifieer password/[id].vue**

Open `/auth/password/[token]`. Pagina correct gestyled. Nieuw wachtwoord opslaan werkt.

- [ ] **Stap 9: Update `pages/auth/[id].vue`** (e-mail verificatie)

Pagina wrapper: voeg class `auth-page` toe.

Vervang kaartstructuur door `Card` met header slot:
```vue
<div class="auth-card-header">
  <div class="flex items-center gap-2 mb-4">
    <span class="auth-logo-dot"></span>
    <span class="auth-brand">GroceryList</span>
  </div>
  <div class="auth-title">{{ t('auth.verifyTitle') }}</div>
  <div class="auth-subtitle">{{ t('auth.verifySubtitle') }}</div>
</div>
```

- Verwijder inline kleurklassen
- Knoppen: verwijder `unstyled`, voeg severity toe

- [ ] **Stap 10: Verifieer auth/[id].vue**

Open de verificatiepagina. Correct gestyled.

- [ ] **Stap 11: Verifieer alle auth pagina's**

Doorloop alle auth routes: login, register, password/reset, password/[token], en verificatie. Elk heeft lichtgrijze achtergrond en consistente kaart stijl met donkerblauwe header.

- [ ] **Stap 12: Commit**

```bash
git add pages/auth/login.vue pages/auth/register.vue pages/auth/password/reset.vue pages/auth/password/'[id]'.vue pages/auth/'[id]'.vue
git commit -m "feat: restyle all auth pages to business theme"
```

---

## Chunk 6: Dashboard en Lijstpagina's

### Task 15: Update `pages/index.vue` (Dashboard)

**Files:**
- Modify: `pages/index.vue`

- [ ] **Stap 1: Lees het huidige bestand**

Open `pages/index.vue`. Noteer de tabel wrapper structuur, actieknoppen, en DataTable configuratie.

- [ ] **Stap 2: Vervang tabel wrapper door PrimeVue Card**

Vervang de custom card div die de DataTable omhult:
```vue
<Card>
  <template #content>
    <DataTable ... />
  </template>
</Card>
```

- [ ] **Stap 3: Verwijder `unstyled`/`pt` kleur-overrides van DataTable**

Verwijder `pt` overrides die `bg-[#...]`, `text-[#...]`, `border-[#...]` bevatten. Bewaar structurele `pt` keys.

- [ ] **Stap 4: Update ProgressBar**

Verwijder `unstyled` prop van alle `ProgressBar` componenten op deze pagina.

- [ ] **Stap 5: Update knoppen**

- "Nieuwe lijst" knop: voeg `severity="primary"` toe, verwijder `unstyled`
- Actieknoppen (bewerken, verwijderen, etc.): `severity="secondary"` of `text`

- [ ] **Stap 6: Verwijder inline kleurklassen**

Verwijder alle `text-[#...]`, `bg-[#...]`, `border-[#...]` van de template.

- [ ] **Stap 7: Voeg pagina header classes toe**

```vue
<p class="page-eyebrow">{{ t('dashboard.eyebrow') }}</p>
<h1 class="page-heading">{{ t('dashboard.title') }}</h1>
```

- [ ] **Stap 8: Verifieer**

Open de dashboard pagina. Tabel is zichtbaar in een witte kaart op lichtgrijze achtergrond. Sorteer, filter, en navigeer — functionaliteit intact.

- [ ] **Stap 9: Commit**

```bash
git add pages/index.vue
git commit -m "feat: restyle dashboard to business theme"
```

---

### Task 16: Update `pages/list/[id].vue` en list/ componenten

**Files:**
- Modify: `pages/list/[id].vue`
- Modify: `components/list/groceryListItem.vue`
- Modify: `components/list/ListForm.vue`
- Modify: `components/list/AddItemListForm.vue`
- Modify: `components/list/PendingGroceryList.vue`
- Modify: `components/list/SharedUsersList.vue`

- [ ] **Stap 1: Update `pages/list/[id].vue` — stat blokken**

Vervang custom stat card divs door de CSS klassen uit `app-theme.css`:
```vue
<div class="stat-card-item stat-card-accent-orange">
  <div class="stat-card-label">{{ t('list.total') }}</div>
  <div class="stat-card-value">{{ formatPrice(totalPrice) }}</div>
</div>
```

- [ ] **Stap 2: Update item rijen in `pages/list/[id].vue`**

Voeg `list-item-row` class toe aan item rij wrappers. Verwijder inline kleurklassen.

- [ ] **Stap 3: Update knoppen en ProgressBar in `pages/list/[id].vue`**

- "Item toevoegen": `Button severity="primary"`, verwijder `unstyled`
- Terugknop: `Button` text variant (of gebruik `backButton` component)
- `ProgressBar`: verwijder `unstyled`

- [ ] **Stap 4: Update `components/list/groceryListItem.vue`**

- `Checkbox`: verwijder `unstyled` + `pt` kleur-overrides
- Inline kleurklassen (`text-[#...]` etc.) → CSS variabelen via `style` attribuut of verwijder als preset het afhandelt
- Layout Tailwind classes behouden

- [ ] **Stap 5: Update `components/list/ListForm.vue`**

- `InputText`: verwijder `unstyled`
- Knoppen: verwijder `unstyled`, voeg severity toe
- Inline kleurklassen verwijderen

- [ ] **Stap 6: Update `components/list/AddItemListForm.vue`**

- Zoek `InputText`: verwijder `unstyled`
- Knoppen: verwijder `unstyled`, voeg severity toe
- Inline kleurklassen verwijderen

- [ ] **Stap 7: Update `components/list/PendingGroceryList.vue`**

- Lijst items: voeg `list-item-row` class toe
- Accept knop: `Button severity="success"`
- Decline knop: `Button severity="danger"`
- Inline kleurklassen verwijderen

- [ ] **Stap 8: Update `components/list/SharedUsersList.vue`**

- Inline kleurklassen → CSS variabelen of verwijderen

- [ ] **Stap 9: Verifieer volledig**

Open een lijstpagina. Stat blokken hebben gekleurde linker borders. Items zijn zichtbaar. Checkbox aanvinken werkt. Item toevoegen werkt. Voortgangsbalk toont.

- [ ] **Stap 10: Commit**

```bash
git add pages/list/'[id]'.vue components/list/groceryListItem.vue components/list/ListForm.vue components/list/AddItemListForm.vue components/list/PendingGroceryList.vue components/list/SharedUsersList.vue
git commit -m "feat: restyle list detail page and list components"
```

---

### Task 17: Update `components/DataTable.vue` (custom wrapper)

**Files:**
- Modify: `components/DataTable.vue`

- [ ] **Stap 1: Lees het huidige bestand**

Open `components/DataTable.vue`. Zoek inline kleurklassen en `pt` kleur-overrides.

- [ ] **Stap 2: Verwijder kleur-overrides**

- Verwijder `bg-[#...]`, `text-[#...]`, `border-[#...]` klassen uit de wrapper template
- Verwijder `pt` props die kleur/achtergrond aansturen op de binnenste DataTable
- Behoud layout classes en structurele `pt` keys

- [ ] **Stap 3: Verifieer**

Open een pagina die de `DataTable` wrapper gebruikt (bijv. dashboard of admin). Tabel toont correct, kleuren komen van de preset.

- [ ] **Stap 4: Commit**

```bash
git add components/DataTable.vue
git commit -m "feat: remove color overrides from DataTable wrapper"
```

---

## Chunk 7: Profiel pagina's

### Task 18: Update profiel pagina's en sub-componenten

**Files:**
- Modify: `pages/profile/index.vue`
- Modify: `pages/profile/stats.vue`
- Modify: `components/profile/ProfileInformation.vue`
- Modify: `components/profile/LanguageSettings.vue`
- Modify: `components/profile/AccountActions.vue`
- Modify: `components/profile/MonthSelector.vue`
- Modify: `components/profile/ProfileItemsActivity.vue`
- Modify: `components/profile/ProfileTopItems.vue`

- [ ] **Stap 1: Update `pages/profile/index.vue` (shell)**

- Sectie headers: voeg `page-eyebrow` en `page-heading` classes toe
- Voeg `Card` wrappers toe rondom ProfileInformation, AccountActions secties
- Verwijder inline kleurklassen

- [ ] **Stap 2: Update `components/profile/ProfileInformation.vue`**

Display mode (weergave): voeg `Card` wrapper toe rondom de weergave-sectie. Vervang `text-[#...]` kleurklassen door `style="color: var(--p-surface-500)"` etc.:
```vue
<Card>
  <template #content>
    <div class="flex items-center justify-between gap-3">
      <!-- naam, e-mail weergave elementen — structuur ongewijzigd -->
    </div>
  </template>
</Card>
```

Edit mode (bewerken): `InputText` velden — verwijder `unstyled`. Opslaan knop: `Button severity="primary"`, verwijder `unstyled`. Annuleren knop: `Button severity="secondary"`, verwijder `unstyled`. Inline kleurklassen verwijderen.

- [ ] **Stap 3: Update `components/profile/LanguageSettings.vue`**

- `SelectButton`: verwijder `unstyled` + `pt` kleur-overrides

- [ ] **Stap 4: Update `components/profile/AccountActions.vue`**

- Uitloggen: `Button severity="secondary"`, verwijder `unstyled`
- Account deactiveren: `Button severity="danger"`, verwijder `unstyled`

- [ ] **Stap 5: Update `components/profile/MonthSelector.vue`**

- `Select` component: verwijder `unstyled` + `pt` kleur-overrides

- [ ] **Stap 6: Update `components/profile/ProfileItemsActivity.vue`**

- Voeg `Card` wrapper toe rondom de chart
- Update Chart.js kleurarray:
  ```ts
  const chartColors = {
    added:   '#f97316',
    checked: '#1e3a5f',
  }
  ```
- Verwijder inline kleurklassen van de wrapper

- [ ] **Stap 7: Update `components/profile/ProfileTopItems.vue`**

- Voeg `Card` wrapper toe
- Tabel rijen: inline kleurklassen → CSS variabelen of verwijderen

- [ ] **Stap 8: Update `pages/profile/stats.vue`**

- `Card` wrappers voor de chart secties
- Grafiek kleuren:
  ```ts
  const chartColors = ['#f97316', '#1e3a5f', '#10b981']
  ```
- Tabel rijen: inline kleurklassen verwijderen
- Pagina header: `page-eyebrow` + `page-heading` classes

- [ ] **Stap 9: Verifieer volledig**

Open profielpagina. Secties zijn zichtbaar in witte kaarten. Taalwisseling werkt. Charts tonen met de nieuwe kleuren.

- [ ] **Stap 10: Commit**

```bash
git add pages/profile/index.vue pages/profile/stats.vue components/profile/ProfileInformation.vue components/profile/LanguageSettings.vue components/profile/AccountActions.vue components/profile/MonthSelector.vue components/profile/ProfileItemsActivity.vue components/profile/ProfileTopItems.vue
git commit -m "feat: restyle profile pages and sub-components"
```

---

## Chunk 8: Cards, Admin, en overige pagina's

### Task 19: Update cards pagina's

**Files:**
- Modify: `pages/cards/index.vue`
- Modify: `pages/cards/upload.vue`
- Modify: `components/dashboard/cards.vue`
- Modify: `components/cards/CardUploadPanel.vue`

- [ ] **Stap 1: Update `components/dashboard/cards.vue`**

- Card items: vervang custom card divs door `Card` component (PrimeVue)
- Delete knop: `Button severity="danger"` text variant
- View knop: `Button severity="secondary"`
- Verwijder inline kleurklassen

- [ ] **Stap 2: Update `pages/cards/index.vue`**

- Pagina header: `page-eyebrow` + `page-heading` classes
- Inline kleurklassen verwijderen

- [ ] **Stap 3: Update `pages/cards/upload.vue`**

- Pagina header: voeg `page-eyebrow` + `page-heading` classes toe
- Upload knop op pagina niveau: `Button severity="primary"`, verwijder `unstyled`
- Inline kleurklassen verwijderen

- [ ] **Stap 4: Update `components/cards/CardUploadPanel.vue`**

- Bestaande upload structuur behouden (geen FileUpload swap)
- Upload/bevestig knoppen in het panel: `Button severity="primary"`, verwijder `unstyled`
- Annuleer knop: `Button severity="secondary"`, verwijder `unstyled`
- Inline kleurklassen → CSS variabelen

- [ ] **Stap 5: Verifieer**

Open `/cards`. Cards zijn zichtbaar. Delete en view knoppen werken. Upload navigeert correct.

- [ ] **Stap 6: Commit**

```bash
git add pages/cards/index.vue pages/cards/upload.vue components/dashboard/cards.vue components/cards/CardUploadPanel.vue
git commit -m "feat: restyle cards pages and components"
```

---

### Task 20: Update admin pagina's

**Files:**
- Modify: `pages/admin/index.vue`
- Modify: `pages/admin/top-items.vue`
- Modify: `pages/admin/users/index.vue`
- Modify: `pages/admin/users/[id].vue`
- Modify: `components/admin/AdminStatsCard.vue`
- Modify: `components/admin/AdminLineChart.vue`
- Modify: `components/admin/AdminDoughnutChart.vue`

- [ ] **Stap 1: Update `components/admin/AdminStatsCard.vue`**

Vervang custom stat card div door CSS klassen:
```vue
<div class="stat-card-item" :class="`stat-card-accent-${accent}`">
  <div class="stat-card-label">{{ label }}</div>
  <div class="stat-card-value">{{ value }}</div>
</div>
```
Voeg `accent` prop toe (waarden: `'orange'`, `'blue'`, `'green'`). Verwijder inline kleurklassen.

- [ ] **Stap 2: Update `components/admin/AdminLineChart.vue`**

Update de Chart.js dataset kleurconfiguratie:
```ts
// Zoek de datasets array in de chart config
datasets: [
  {
    label: t('admin.added'),
    borderColor: '#f97316',
    backgroundColor: 'rgba(249,115,22,0.1)',
    // ... overige chart opties behouden
  },
  {
    label: t('admin.checked'),
    borderColor: '#1e3a5f',
    backgroundColor: 'rgba(30,58,95,0.1)',
    // ... overige chart opties behouden
  },
]
```

- [ ] **Stap 3: Update `components/admin/AdminDoughnutChart.vue`**

Update de kleurarray:
```ts
backgroundColor: ['#f97316', '#1e3a5f', '#10b981', '#94a3b8']
```

- [ ] **Stap 4: Update `pages/admin/index.vue`**

- Pagina header: `page-eyebrow` + `page-heading` classes
- DataTable: verwijder `pt` kleur-overrides
- Knoppen: verwijder `unstyled`
- Inline kleurklassen verwijderen

- [ ] **Stap 5: Update `pages/admin/top-items.vue`**

Maand toggle knoppen: vervang de huidige knop-implementatie door `SelectButton`:
```vue
<SelectButton
  v-model="selectedMonth"
  :options="monthOptions"
  optionLabel="label"
  optionValue="value"
/>
```
Zorg dat `selectedMonth` de bestaande geselecteerde maand waarde behoudt en `monthOptions` de bestaande opties lijst gebruikt. Gedrag ongewijzigd.

Inline kleurklassen (`text-[#...]`, etc.) → verwijderen of vervangen door CSS variabelen.

- [ ] **Stap 6: Update `pages/admin/users/index.vue`**

- DataTable: verwijder `pt` kleur-overrides
- Knoppen: verwijder `unstyled`

- [ ] **Stap 7: Update `pages/admin/users/[id].vue`**

- `Card` wrappers voor secties
- Inline kleurklassen verwijderen

- [ ] **Stap 8: Verifieer admin pagina's**

Open `/admin`. Stats kaarten tonen met gekleurde accenten. Charts tonen met oranje/navy kleuren. DataTable sorteert correct.

- [ ] **Stap 9: Commit**

```bash
git add pages/admin/index.vue pages/admin/top-items.vue pages/admin/users/index.vue pages/admin/users/'[id]'.vue components/admin/AdminStatsCard.vue components/admin/AdminLineChart.vue components/admin/AdminDoughnutChart.vue
git commit -m "feat: restyle admin pages and components"
```

---

### Task 21: Update overige pagina's

**Files:**
- Modify: `pages/information.vue`
- Modify: `pages/terms/index.vue`
- Modify: `pages/terms/approve.vue`

- [ ] **Stap 1: Update `pages/information.vue`**

- Feature blokken: vervang custom divs door `Card` component
- CTA knop: `Button severity="primary"`, verwijder `unstyled`
- Inline kleurklassen → CSS variabelen of verwijderen

- [ ] **Stap 2: Update `pages/terms/index.vue`**

- `Card` wrapper toevoegen
- Inline kleurklassen verwijderen

- [ ] **Stap 3: Update `pages/terms/approve.vue`**

- `Card` wrapper
- `Checkbox`: verwijder `unstyled` + `pt`
- `Button severity="primary"`: verwijder `unstyled`

- [ ] **Stap 4: Verifieer**

Open `/information` en `/terms`. Pagina's tonen correct.

- [ ] **Stap 5: Commit**

```bash
git add pages/information.vue pages/terms/index.vue pages/terms/approve.vue
git commit -m "feat: restyle information and terms pages"
```

---

### Task 22: Eindverificatie en opruimen

**Files:**
- Check: alle bestanden

- [ ] **Stap 1: Zoek resterende hardcoded kleurklassen**

```bash
grep -r "bg-\[#" pages/ components/ --include="*.vue" | grep -v "node_modules"
grep -r "text-\[#" pages/ components/ --include="*.vue" | grep -v "node_modules"
grep -r "border-\[#" pages/ components/ --include="*.vue" | grep -v "node_modules"
```

Verwacht: geen of minimale resultaten (alleen uitzonderingen die bewust zijn).

- [ ] **Stap 2: Zoek resterende `unstyled` props**

```bash
grep -r "unstyled" pages/ components/ --include="*.vue"
```

Verwacht: geen resultaten.

- [ ] **Stap 3: Controleer de app op alle hoofdroutes**

Doorloop handmatig:
- `/` — dashboard
- `/list/[id]` — lijstdetail
- `/auth/login` — inloggen (functioneel testen)
- `/profile` — profiel
- `/cards` — bonnen
- `/admin` — admin (indien beschikbaar)
- `/information` — informatiepagina

Controleer per pagina: geen console errors, layout klopt, interacties werken.

- [ ] **Stap 4: Verwijder `.superpowers/` van git tracking indien niet in .gitignore**

```bash
echo ".superpowers/" >> .gitignore
git add .gitignore
```

- [ ] **Stap 5: Finale commit**

```bash
git add .gitignore
git commit -m "feat: complete business restyling — all pages and components updated"
```
