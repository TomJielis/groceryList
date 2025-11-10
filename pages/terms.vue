<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import BackButton from "~/components/form/backButton.vue";
const config = useRuntimeConfig()

const i18n = useI18nStore();
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition flex flex-col gap-4">
      <h1 class="text-2xl font-bold text-primary-dark dark:text-accent-light mb-2">Algemene Voorwaarden & Privacyverklaring – Grocery List</h1>
      <div class="text-sm text-slate-500 mb-4">Laatst bijgewerkt: {{ config.public.lastUpdatedTerms }}</div>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">1. Over deze applicatie</h2>
        <p>Deze applicatie (“Grocery List”) is een persoonlijke webapplicatie waarmee gebruikers boodschappenlijsten kunnen aanmaken, bekijken, delen, bewerken en verwijderen. De applicatie is ontwikkeld voor persoonlijk gebruik en heeft als doel het beheren van boodschappen overzichtelijker te maken.</p>
      </section>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">2. Beheerder van de applicatie</h2>
        <p>De applicatie wordt beheerd door de ontwikkelaar van Grocery List (“Beheerder”). Voor vragen kun je contact opnemen via het e-mailadres dat in de applicatie wordt vermeld.</p>
      </section>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">🔒 Privacy Policy</h2>
        <h3 class="font-semibold mt-2">3. Welke gegevens worden verzameld</h3>
        <p>Bij het aanmaken van een account worden de volgende persoonsgegevens opgeslagen:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>Naam</li>
          <li>E-mailadres</li>
          <li>Wachtwoord (veilig gehasht met een cryptografisch algoritme)</li>
        </ul>
        <p>Daarnaast worden de volgende gegevens opgeslagen die je zelf toevoegt:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>Boodschappenlijsten (en gedeelde lijsten)</li>
          <li>Producten die je toevoegt</li>
          <li>Foto’s die je uploadt (optioneel)</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">4. Doeleinden van gegevensverwerking</h3>
        <p>De gegevens worden uitsluitend verwerkt om:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>gebruikers veilig te laten inloggen via Laravel Sanctum,</li>
          <li>gedeelde lijsten correct aan de juiste gebruikers toe te wijzen,</li>
          <li>de werking van de boodschappenlijstfunctionaliteit te garanderen,</li>
          <li>notificaties binnen de app te tonen.</li>
        </ul>
        <p>Er worden geen gegevens verkocht, gedeeld of doorgegeven aan derden.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">5. Gegevensbeveiliging</h3>
        <ul class="list-disc pl-6 mb-2">
          <li>Wachtwoorden worden nooit in platte tekst opgeslagen, maar veilig gehasht met Laravel’s ingebouwde hashingmechanismen (bcrypt/argon2).</li>
          <li>Gegevensverkeer tussen frontend (Nuxt) en backend (Laravel Sanctum API) is versleuteld via HTTPS.</li>
          <li>Alleen geautoriseerde gebruikers hebben toegang tot hun eigen gegevens.</li>
          <li>Uploads (zoals foto’s) worden veilig opgeslagen en zijn enkel zichtbaar voor gebruikers met toegang tot de betreffende lijst.</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">6. Verantwoordelijkheid voor foto’s</h3>
        <p>Gebruikers zijn zelf verantwoordelijk voor de inhoud van de foto’s die zij uploaden. Het is niet toegestaan om foto’s te uploaden die:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>auteursrechtelijk beschermd zijn zonder toestemming,</li>
          <li>beledigend, discriminerend of aanstootgevend zijn,</li>
          <li>persoonsgegevens van derden bevatten zonder hun toestemming.</li>
        </ul>
        <p>De Beheerder behoudt zich het recht voor om inhoud te verwijderen bij misbruik.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">7. Delen van lijsten</h3>
        <p>De applicatie maakt het mogelijk om lijsten te delen met andere geregistreerde gebruikers. Alleen gebruikers die jij expliciet toevoegt, hebben toegang tot die lijst. Je kunt op elk moment stoppen met delen of de lijst verwijderen.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">8. Bewaartermijn en verwijdering van gegevens</h3>
        <p>Gebruikers kunnen hun account en alle bijbehorende gegevens op elk moment verwijderen. Na verwijdering worden alle gegevens (lijsten, producten, foto’s en gedeelde gegevens) permanent uit de database verwijderd. Alleen reeds verzonden e-mails via het Gmail-account van de beheerder kunnen niet worden verwijderd, omdat deze buiten de applicatie vallen.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">9. Cookies en lokale opslag</h3>
        <p>De applicatie gebruikt alleen technische cookies of localStorage om sessie-informatie te bewaren (zoals authenticatie via Sanctum of voorkeuren). Er worden geen tracking- of advertentiecookies gebruikt.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">10. Jouw rechten</h3>
        <ul class="list-disc pl-6 mb-2">
          <li>inzage te vragen in je opgeslagen gegevens,</li>
          <li>je gegevens te corrigeren of te verwijderen,</li>
          <li>je account te beëindigen.</li>
        </ul>
        <p>Voor vragen kun je contact opnemen met de beheerder via het contactadres in de applicatie.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">11. Wijzigingen</h3>
        <p>De beheerder kan deze voorwaarden en privacyverklaring wijzigen wanneer de werking van de applicatie verandert. Bij belangrijke wijzigingen word je binnen de applicatie geïnformeerd en kun je de nieuwe voorwaarden opnieuw accepteren.</p>
      </section>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">⚖️ Terms of Use</h2>
        <h3 class="font-semibold mt-2">12. Gebruik van de applicatie</h3>
        <ul class="list-disc pl-6 mb-2">
          <li>Je mag de applicatie uitsluitend gebruiken voor persoonlijk, niet-commercieel gebruik.</li>
          <li>Je bent verantwoordelijk voor de inhoud die je toevoegt.</li>
          <li>De beheerder is niet aansprakelijk voor verlies van gegevens, storingen of misbruik van inloggegevens door derden.</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">13. Acceptatie</h3>
        <p>Door een account aan te maken of in te loggen, verklaar je dat je:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>deze Gebruiksvoorwaarden en Privacyverklaring hebt gelezen,</li>
          <li>hiermee akkoord gaat, en</li>
          <li>ouder bent dan 16 jaar (of toestemming hebt van een ouder/voogd).</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">14. Toepasselijk recht</h3>
        <p>Op deze voorwaarden is Nederlands recht van toepassing. Eventuele geschillen worden uitsluitend voorgelegd aan de bevoegde rechter te Amsterdam, Nederland.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">14a. Internationale gebruikers</h3>
        <p>De applicatie is ontwikkeld en gehost in Nederland en valt onder Nederlands en Europees (AVG) recht. Gebruikers die de applicatie gebruiken vanuit andere landen doen dit op eigen initiatief en verantwoordelijkheid. Door gebruik te maken van de applicatie verklaren zij zich akkoord dat uitsluitend Nederlands recht van toepassing is en dat geen beroep kan worden gedaan op lokale wetgeving of consumentenbescherming buiten Nederland of de Europese Unie.</p>
      </section>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">🔐 Aanvullende bepalingen</h2>
        <h3 class="font-semibold mt-2">15. Beperking van aansprakelijkheid</h3>
        <p>De Beheerder is niet verantwoordelijk of aansprakelijk voor:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>enig verlies van gegevens, beschadiging van gegevens of onbeschikbaarheid van de applicatie, ongeacht de oorzaak (inclusief technische storingen, onderhoud of onderbrekingen van externe diensten);</li>
          <li>indirecte, incidentele of gevolgschade, waaronder verlies van gegevens of winst;</li>
          <li>ongeoorloofde toegang tot je account door zwakke wachtwoorden, apparaatcompromittering of nalatigheid van de gebruiker.</li>
        </ul>
        <p>Het gebruik van de applicatie is volledig voor eigen risico. De applicatie wordt aangeboden “zoals ze is”, zonder enige garantie van ononderbroken of foutloze werking.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">16. Opschorting en verwijdering van accounts</h3>
        <p>De Beheerder behoudt zich het recht voor om:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>accounts te schorsen of te verwijderen die deze voorwaarden of toepasselijke wetgeving overtreden,</li>
          <li>inhoud te verwijderen die onwettig, aanstootgevend of schadelijk is,</li>
          <li>toegang tot de applicatie (tijdelijk of permanent) te beëindigen om technische, onderhouds- of veiligheidsredenen, of in geval van misbruik.</li>
        </ul>
        <p>In dergelijke gevallen is de Beheerder niet verplicht om verwijderde of verloren gegevens te herstellen.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">17. Beëindiging van de dienst</h3>
        <p>De Beheerder mag de applicatie of onderdelen daarvan op elk moment wijzigen, opschorten of permanent stopzetten, met of zonder voorafgaande kennisgeving. Indien de dienst wordt beëindigd, worden alle gebruikersgegevens permanent verwijderd overeenkomstig de Privacy Policy.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">18. Disclaimer</h3>
        <p>Hoewel de Beheerder zich inspant om een goed functionerende en veilige applicatie te bieden, wordt geen garantie gegeven dat de applicatie ononderbroken, foutloos of volledig compatibel is met alle apparaten of browsers. Gebruikers erkennen dat technische problemen of storingen kunnen optreden en dat de Beheerder niet aansprakelijk is voor enig ongemak of dataverlies dat hieruit voortvloeit.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">19. Inhoud toegevoegd door gebruikers</h3>
        <p>Gebruikers zijn volledig verantwoordelijk voor alle gegevens, teksten, productnamen, foto’s of andere inhoud die zij aan de applicatie toevoegen (“gebruikersinhoud”). De Beheerder controleert of modereert deze inhoud niet vooraf en kan niet aansprakelijk worden gesteld voor de juistheid, wettigheid of geschiktheid ervan.</p>
        <p>De Beheerder behoudt zich het recht voor om gebruikersinhoud te verwijderen of te blokkeren wanneer deze:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>in strijd is met wet- of regelgeving,</li>
          <li>inbreuk maakt op auteursrechten of privacy van derden, of</li>
          <li>naar oordeel van de Beheerder ongepast, beledigend of misleidend is.</li>
        </ul>
        <p>De gebruiker vrijwaart de Beheerder voor alle aanspraken van derden die voortvloeien uit de door de gebruiker toegevoegde inhoud.</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">20. Vrijwaring</h3>
        <p>Door gebruik te maken van de applicatie stemt de gebruiker ermee in de Beheerder te vrijwaren en te verdedigen tegen alle aanspraken, schadevergoedingen, verliezen, kosten of aansprakelijkheden die voortvloeien uit:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>schending van deze voorwaarden,</li>
          <li>het uploaden of delen van onrechtmatige of inbreukmakende inhoud,</li>
          <li>misbruik van de applicatie, of</li>
          <li>schending van rechten van derden.</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">21. Externe verwerkers</h3>
        <p>Voor de werking van de applicatie maakt de Beheerder gebruik van vertrouwde externe diensten, zoals hostingproviders en e-maildiensten. Deze partijen verwerken gegevens uitsluitend in opdracht van de Beheerder en in overeenstemming met de AVG. De Beheerder blijft verantwoordelijk voor een zorgvuldige omgang met deze gegevens.</p>
      </section>
    </div>
  </div>
  <BackButton :label="i18n.t('common.back')" @click="$router.back()" />
</template>

<style scoped>
h1, h2, h3 {
}
</style>