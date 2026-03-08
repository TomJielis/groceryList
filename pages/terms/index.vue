<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
const config = useRuntimeConfig()

const i18n = useI18nStore();
</script>

<style scoped>
section p,
section ul {
  @apply text-slate-700 dark:text-slate-300;
}

section h2 {
  @apply text-xl font-bold text-slate-900 dark:text-white mb-3;
}

section h3 {
  @apply text-lg font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2;
}

section h4 {
  @apply text-base font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-2;
}

section ul {
  @apply list-disc pl-6 mb-3 space-y-1;
}

section ul li {
  @apply text-slate-700 dark:text-slate-300;
}
</style>

<template>
  <div class="fixed inset-0 flex items-start justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 px-4 pt-4 pb-24 md:pt-20 md:pb-8 overflow-y-auto">
    <div class="w-full max-w-3xl my-4 md:my-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-8 text-center border-b border-slate-200 dark:border-slate-700">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-4">
            <span class="text-4xl">📄</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Terms of Use & Privacy Policy</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Laatste versie: 1.2 | Laatst bijgewerkt: 10-11-2025</p>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8 flex flex-col gap-6">
          <hr class="border-slate-200 dark:border-slate-700" />
      <section>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Over deze applicatie</h2>
        <p class="text-slate-700 dark:text-slate-300">Deze applicatie ("Grocery List") is een persoonlijke webapplicatie waarmee gebruikers boodschappenlijsten kunnen aanmaken, bekijken, delen, bewerken en verwijderen. De applicatie is ontwikkeld voor persoonlijk gebruik en heeft als doel het beheren van boodschappen overzichtelijker te maken.</p>
      </section>
      <hr class="my-4 border-slate-200 dark:border-slate-700" />
      <section>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Beheerder van de applicatie</h2>
        <p class="text-slate-700 dark:text-slate-300">De applicatie wordt beheerd door de ontwikkelaar van Grocery List ("Beheerder"). Voor vragen kun je contact opnemen via het e-mailadres dat in de applicatie wordt vermeld.</p>
      </section>
      <hr class="my-4 border-slate-200 dark:border-slate-700" />
      <section>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">🔒 Privacy Policy</h2>
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">3. Welke gegevens worden verzameld</h3>
        <ul class="list-disc pl-6 mb-2">
          <li>Naam</li>
          <li>E-mailadres</li>
          <li>Wachtwoord (veilig gehasht met een cryptografisch algoritme)</li>
        </ul>
        <ul class="list-disc pl-6 mb-2">
          <li>Boodschappenlijsten (en gedeelde lijsten)</li>
          <li>Producten die je toevoegt</li>
          <li>Foto’s die je uploadt (optioneel)</li>
        </ul>
        <h3 class="font-semibold mt-2">4. Doeleinden van gegevensverwerking</h3>
        <ul class="list-disc pl-6 mb-2">
          <li>gebruikers veilig te laten inloggen via Laravel Sanctum</li>
          <li>gedeelde lijsten correct aan de juiste gebruikers toe te wijzen</li>
          <li>de werking van de boodschappenlijstfunctionaliteit te garanderen</li>
          <li>notificaties binnen de app te tonen</li>
        </ul>
        <p class="mb-2 font-semibold">Er worden <span class="underline">geen gegevens verkocht, gedeeld of doorgegeven aan derden</span>.</p>
        <h3 class="font-semibold mt-2">5. Gegevensbeveiliging</h3>
        <ul class="list-disc pl-6 mb-2">
          <li>Wachtwoorden worden nooit in platte tekst opgeslagen, maar veilig gehasht met Laravel’s ingebouwde hashingmechanismen (bcrypt/argon2).</li>
          <li>Gegevensverkeer tussen frontend (Nuxt) en backend (Laravel Sanctum API) is versleuteld via HTTPS.</li>
          <li>Alleen geautoriseerde gebruikers hebben toegang tot hun eigen gegevens.</li>
          <li>Uploads (zoals foto’s) worden veilig opgeslagen en zijn enkel zichtbaar voor gebruikers met toegang tot de betreffende lijst.</li>
        </ul>
        <h3 class="font-semibold mt-2">6. Verantwoordelijkheid voor foto’s</h3>
        <p>Gebruikers zijn zelf verantwoordelijk voor de inhoud van de foto’s die zij uploaden. Het is niet toegestaan om foto’s te uploaden die:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>auteursrechtelijk beschermd zijn zonder toestemming</li>
          <li>beledigend, discriminerend of aanstootgevend zijn</li>
          <li>persoonsgegevens van derden bevatten zonder hun toestemming</li>
        </ul>
        <p>De Beheerder behoudt zich het recht voor om inhoud te verwijderen bij misbruik.</p>
        <h3 class="font-semibold mt-2">7. Delen van lijsten</h3>
        <p>De applicatie maakt het mogelijk om lijsten te delen met andere geregistreerde gebruikers. Alleen gebruikers die jij expliciet toevoegt, hebben toegang tot die lijst. Je kunt op elk moment stoppen met delen of de lijst verwijderen.</p>
        <h3 class="font-semibold mt-2">8. Bewaartermijn en verwijdering van gegevens</h3>
        <p>Gebruikers kunnen hun account en alle bijbehorende gegevens op elk moment verwijderen. Na verwijdering worden alle gegevens (lijsten, producten, foto’s en gedeelde gegevens) permanent uit de database verwijderd. Alleen reeds verzonden e-mails via het Gmail-account van de beheerder kunnen niet worden verwijderd, omdat deze buiten de applicatie vallen.</p>
        <h3 class="font-semibold mt-2">9. Cookies en lokale opslag</h3>
        <p>De applicatie gebruikt alleen technische cookies of localStorage om sessie-informatie te bewaren (zoals authenticatie via Sanctum of voorkeuren). Er worden <span class="underline">geen tracking- of advertentiecookies</span> gebruikt.</p>
        <h3 class="font-semibold mt-2">10. Jouw rechten</h3>
        <ul class="list-disc pl-6 mb-2">
          <li>inzage te vragen in je opgeslagen gegevens</li>
          <li>je gegevens te corrigeren of te verwijderen</li>
          <li>je account te beëindigen</li>
        </ul>
        <p>Voor vragen kun je contact opnemen met de beheerder via het contactadres in de applicatie.</p>
        <h3 class="font-semibold mt-2">11. Wijzigingen</h3>
        <p>De beheerder kan deze voorwaarden en privacyverklaring wijzigen wanneer de werking van de applicatie verandert. Bij belangrijke wijzigingen word je binnen de applicatie geïnformeerd en kun je de nieuwe voorwaarden opnieuw accepteren.</p>
      </section>
      <hr class="my-4 border-slate-200 dark:border-slate-700" />
      <section>
        <h2 class="text-lg font-bold mb-2">⚖️ Terms of Use</h2>
        <h3 class="font-semibold mt-2">12. Gebruik van de applicatie</h3>
        <ul class="list-disc pl-6 mb-2">
          <li>Je mag de applicatie uitsluitend gebruiken voor persoonlijk, niet-commercieel gebruik.</li>
          <li>Je bent verantwoordelijk voor de inhoud die je toevoegt.</li>
          <li>De beheerder is niet aansprakelijk voor verlies van gegevens, storingen of misbruik van inloggegevens door derden.</li>
        </ul>
        <h3 class="font-semibold mt-2">13. Acceptatie</h3>
        <p>Door een account aan te maken of in te loggen, verklaar je dat je:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>deze Gebruiksvoorwaarden en Privacyverklaring hebt gelezen</li>
          <li>hiermee akkoord gaat</li>
          <li>ouder bent dan 16 jaar (of toestemming hebt van een ouder/voogd)</li>
        </ul>
        <h3 class="font-semibold mt-2">14. Toepasselijk recht</h3>
        <p>Op deze voorwaarden is Nederlands recht van toepassing. Eventuele geschillen worden uitsluitend voorgelegd aan de bevoegde rechter te Amsterdam, Nederland.</p>
        <h3 class="font-semibold mt-2">14a. Internationale gebruikers</h3>
        <p>De applicatie is ontwikkeld en gehost in Nederland en valt onder Nederlands en Europees (AVG) recht. Gebruikers die de applicatie gebruiken vanuit andere landen doen dit op eigen initiatief en verantwoordelijkheid. Door gebruik te maken van de applicatie verklaren zij zich akkoord dat uitsluitend Nederlands recht van toepassing is en dat geen beroep kan worden gedaan op lokale wetgeving of consumentenbescherming buiten Nederland of de Europese Unie.</p>
      </section>
      <hr class="my-4 border-slate-200 dark:border-slate-700" />
      <section>
        <h2 class="text-lg font-bold mb-2">🔐 Aanvullende bepalingen</h2>
        <h3 class="font-semibold mt-2">15. Beperking van aansprakelijkheid</h3>
        <p>De Beheerder is niet verantwoordelijk of aansprakelijk voor:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>enig verlies van gegevens, beschadiging van gegevens of onbeschikbaarheid van de applicatie, ongeacht de oorzaak (inclusief technische storingen, onderhoud of onderbrekingen van externe diensten);</li>
          <li>indirecte, incidentele of gevolgschade, waaronder verlies van gegevens of winst;</li>
          <li>ongeoorloofde toegang tot je account door zwakke wachtwoorden, apparaatcompromittering of nalatigheid van de gebruiker.</li>
        </ul>
        <p>Het gebruik van de applicatie is volledig voor eigen risico. De applicatie wordt aangeboden “zoals ze is”, zonder enige garantie van ononderbroken of foutloze werking.</p>
        <h3 class="font-semibold mt-2">16. Opschorting en verwijdering van accounts</h3>
        <p>De Beheerder behoudt zich het recht voor om:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>accounts te schorsen of te verwijderen die deze voorwaarden of toepasselijke wetgeving overtreden,</li>
          <li>inhoud te verwijderen die onwettig, aanstootgevend of schadelijk is,</li>
          <li>toegang tot de applicatie (tijdelijk of permanent) te beëindigen om technische, onderhouds- of veiligheidsredenen, of in geval van misbruik.</li>
        </ul>
        <p>In dergelijke gevallen is de Beheerder niet verplicht om verwijderde of verloren gegevens te herstellen.</p>
        <h3 class="font-semibold mt-2">17. Beëindiging van de dienst</h3>
        <p>De Beheerder mag de applicatie of onderdelen daarvan op elk moment wijzigen, opschorten of permanent stopzetten, met of zonder voorafgaande kennisgeving. Indien de dienst wordt beëindigd, worden alle gebruikersgegevens permanent verwijderd overeenkomstig de Privacy Policy.</p>
        <h3 class="font-semibold mt-2">18. Disclaimer</h3>
        <p>Hoewel de Beheerder zich inspant om een goed functionerende en veilige applicatie te bieden, wordt geen garantie gegeven dat de applicatie ononderbroken, foutloos of volledig compatibel is met alle apparaten of browsers. Gebruikers erkennen dat technische problemen of storingen kunnen optreden en dat de Beheerder niet aansprakelijk is voor enig ongemak of dataverlies dat hieruit voortvloeit.</p>
        <h3 class="font-semibold mt-2">19. Inhoud toegevoegd door gebruikers</h3>
        <p>Gebruikers zijn volledig verantwoordelijk voor alle gegevens, teksten, productnamen, foto’s of andere inhoud die zij aan de applicatie toevoegen (“gebruikersinhoud”). De Beheerder controleert of modereert deze inhoud niet vooraf en kan niet aansprakelijk worden gesteld voor de juistheid, wettigheid of geschiktheid ervan.</p>
        <p>De Beheerder behoudt zich het recht voor om gebruikersinhoud te verwijderen of te blokkeren wanneer deze:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>in strijd is met wet- of regelgeving,</li>
          <li>inbreuk maakt op auteursrechten of privacy van derden, of</li>
          <li>naar oordeel van de Beheerder ongepast, beledigend of misleidend is.</li>
        </ul>
        <p>De gebruiker vrijwaart de Beheerder voor alle aanspraken van derden die voortvloeien uit de door de gebruiker toegevoegde inhoud.</p>
        <h3 class="font-semibold mt-2">20. Vrijwaring</h3>
        <p>Door gebruik te maken van de applicatie stemt de gebruiker ermee in de Beheerder te vrijwaren en te verdedigen tegen alle aanspraken, schadevergoedingen, verliezen, kosten of aansprakelijkheden die voortvloeien uit:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>schending van deze voorwaarden,</li>
          <li>het uploaden of delen van onrechtmatige of inbreukmakende inhoud,</li>
          <li>misbruik van de applicatie, of</li>
          <li>schending van rechten van derden.</li>
        </ul>
        <h3 class="font-semibold mt-2">21. Externe verwerkers</h3>
        <p>Voor de werking van de applicatie maakt de Beheerder gebruik van vertrouwde externe diensten, zoals hostingproviders en e-maildiensten. Deze partijen verwerken gegevens uitsluitend in opdracht van de Beheerder en in overeenstemming met de AVG. De Beheerder blijft verantwoordelijk voor een zorgvuldige omgang met deze gegevens.</p>
      </section>
      <hr class="my-6 border-slate-300 dark:border-slate-700" />
      <section>
        <h2 class="text-lg font-bold mb-2">🇬🇧 English version</h2>
        <div class="text-sm text-slate-500 mb-4">Latest version: 1.2<br>Last updated: 10-11-2025 16:30</div>
        <h3 class="font-semibold mt-2">1. About this application</h3>
        <p>This application ("Grocery List") is a personal web application that allows users to create, view, share, edit, and delete grocery lists. The application is developed for personal use and aims to make managing groceries more organized.</p>
        <h3 class="font-semibold mt-2">2. Application administrator</h3>
        <p>The application is managed by the developer of Grocery List ("Administrator"). For questions, you can contact the email address listed in the application.</p>
        <h3 class="font-semibold mt-2">🔒 Privacy Policy</h3>
        <h4 class="font-semibold mt-2">3. What data is collected</h4>
        <ul class="list-disc pl-6 mb-2">
          <li>Name</li>
          <li>Email address</li>
          <li>Password (securely hashed with a cryptographic algorithm)</li>
        </ul>
        <ul class="list-disc pl-6 mb-2">
          <li>Grocery lists (and shared lists)</li>
          <li>Products you add</li>
          <li>Photos you upload (optional)</li>
        </ul>
        <h4 class="font-semibold mt-2">4. Purposes of data processing</h4>
        <ul class="list-disc pl-6 mb-2">
          <li>to allow users to log in securely via Laravel Sanctum</li>
          <li>to correctly assign shared lists to the right users</li>
          <li>to guarantee the operation of the grocery list functionality</li>
          <li>to display notifications within the app</li>
        </ul>
        <p class="mb-2 font-semibold">No data is <span class="underline">sold, shared, or passed on to third parties</span>.</p>
        <h4 class="font-semibold mt-2">5. Data security</h4>
        <ul class="list-disc pl-6 mb-2">
          <li>Passwords are never stored in plain text, but securely hashed using Laravel’s built-in hashing mechanisms (bcrypt/argon2).</li>
          <li>Data traffic between frontend (Nuxt) and backend (Laravel Sanctum API) is encrypted via HTTPS.</li>
          <li>Only authorized users have access to their own data.</li>
          <li>Uploads (such as photos) are securely stored and are only visible to users with access to the relevant list.</li>
        </ul>
        <h4 class="font-semibold mt-2">6. Responsibility for photos</h4>
        <p>Users are responsible for the content of the photos they upload. It is not allowed to upload photos that:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>are copyright protected without permission</li>
          <li>are offensive, discriminatory, or insulting</li>
          <li>contain personal data of third parties without their consent</li>
        </ul>
        <p>The Administrator reserves the right to remove content in case of abuse.</p>
        <h4 class="font-semibold mt-2">7. Sharing lists</h4>
        <p>The application allows you to share lists with other registered users. Only users you explicitly add have access to that list. You can stop sharing or delete the list at any time.</p>
        <h4 class="font-semibold mt-2">8. Retention period and deletion of data</h4>
        <p>Users can delete their account and all associated data at any time. After deletion, all data (lists, products, photos, and shared data) is permanently removed from the database. Only emails already sent via the administrator’s Gmail account cannot be deleted, as they are outside the application.</p>
        <h4 class="font-semibold mt-2">9. Cookies and local storage</h4>
        <p>The application only uses technical cookies or localStorage to retain session information (such as authentication via Sanctum or preferences). No <span class="underline">tracking or advertising cookies</span> are used.</p>
        <h4 class="font-semibold mt-2">10. Your rights</h4>
        <ul class="list-disc pl-6 mb-2">
          <li>request access to your stored data</li>
          <li>correct or delete your data</li>
          <li>terminate your account</li>
        </ul>
        <p>For questions, you can contact the administrator via the contact address in the application.</p>
        <h4 class="font-semibold mt-2">11. Changes</h4>
        <p>The administrator may change these terms and privacy policy when the operation of the application changes. For important changes, you will be informed within the application and can accept the new terms again.</p>
        <h3 class="font-semibold mt-2">⚖️ Terms of Use</h3>
        <h4 class="font-semibold mt-2">12. Use of the application</h4>
        <ul class="list-disc pl-6 mb-2">
          <li>You may only use the application for personal, non-commercial use.</li>
          <li>You are responsible for the content you add.</li>
          <li>The administrator is not liable for data loss, malfunctions, or misuse of login details by third parties.</li>
        </ul>
        <h4 class="font-semibold mt-2">13. Acceptance</h4>
        <p>By creating an account or logging in, you declare that you:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>have read these Terms of Use and Privacy Policy</li>
          <li>agree to them</li>
          <li>are over 16 years old (or have permission from a parent/guardian)</li>
        </ul>
        <h4 class="font-semibold mt-2">14. Applicable law</h4>
        <p>These terms are governed by Dutch law. Any disputes will be submitted exclusively to the competent court in Amsterdam, the Netherlands.</p>
        <h4 class="font-semibold mt-2">14a. International users</h4>
        <p>The application is developed and hosted in the Netherlands and is subject to Dutch and European (GDPR) law. Users who use the application from other countries do so on their own initiative and responsibility. By using the application, they agree that only Dutch law applies and that no appeal can be made to local legislation or consumer protection outside the Netherlands or the European Union.</p>
        <h3 class="font-semibold mt-2">🔐 Supplementary provisions</h3>
        <h4 class="font-semibold mt-2">15. Limitation of liability</h4>
        <p>The Administrator is not responsible or liable for:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>any loss of data, corruption of data, or unavailability of the application, regardless of the cause (including technical failures, maintenance, or interruptions of external services);</li>
          <li>indirect, incidental, or consequential damages, including loss of data or profits;</li>
          <li>unauthorized access to your account due to weak passwords, device compromise, or user negligence.</li>
        </ul>
        <p>Use of the application is entirely at your own risk. The application is provided “as is,” without any guarantee of uninterrupted or error-free operation.</p>
        <h4 class="font-semibold mt-2">16. Suspension and deletion of accounts</h4>
        <p>The Administrator reserves the right to:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>suspend or delete accounts that violate these terms or applicable law,</li>
          <li>remove content that is illegal, offensive, or harmful,</li>
          <li>terminate access to the application (temporarily or permanently) for technical, maintenance, or security reasons, or in case of abuse.</li>
        </ul>
        <p>In such cases, the Administrator is not obliged to restore or recover user data that has been deleted or lost as a result.</p>
        <h4 class="font-semibold mt-2">17. Termination of the service</h4>
        <p>The Administrator may modify, suspend, or permanently discontinue the application or any of its features at any time, with or without notice. If the service is discontinued, all user data will be permanently deleted from the database in accordance with the Privacy Policy.</p>
        <h4 class="font-semibold mt-2">18. Disclaimer</h4>
        <p>While the Administrator strives to ensure that the application functions correctly and securely, no guarantee is given that it will be uninterrupted, error-free, or fully compatible with all devices or browsers. Users acknowledge that technical issues or outages may occur and that the Administrator cannot be held liable for any resulting inconvenience or data loss.</p>
        <h4 class="font-semibold mt-2">19. User generated content</h4>
        <p>Users are fully responsible for all data, texts, product names, photos, or other content they add to the application (“user content”). The Administrator does not pre-moderate or check this content and cannot be held liable for its accuracy, legality, or suitability.</p>
        <p>The Administrator reserves the right to remove or block user content when it:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>violates laws or regulations,</li>
          <li>infringes copyrights or privacy of third parties, or</li>
          <li>is, in the Administrator's opinion, inappropriate, offensive, or misleading.</li>
        </ul>
        <p>The user indemnifies the Administrator against all claims from third parties arising from user content added by the user.</p>
        <h4 class="font-semibold mt-2">20. Indemnity</h4>
        <p>By using the application, the user agrees to indemnify and defend the Administrator against all claims, damages, losses, costs, or liabilities arising from:</p>
        <ul class="list-disc pl-6 mb-2">
          <li>violation of these terms,</li>
          <li>uploading or sharing unlawful or infringing content,</li>
          <li>misuse of the application, or</li>
          <li>violation of third-party rights.</li>
        </ul>
        <h4 class="font-semibold mt-2">21. External processors</h4>
        <p>For the operation of the application, the Administrator uses trusted external services, such as hosting providers and email services. These parties process data only on behalf of the Administrator and in accordance with the GDPR. The Administrator remains responsible for careful handling of this data.</p>
      </section>
        </div>
      </div>
    </div>
  </div>
</template>
