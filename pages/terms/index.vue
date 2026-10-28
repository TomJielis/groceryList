<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import Card from 'primevue/card'

const { appName, supportEmail } = useRuntimeConfig().public

const i18n = useI18nStore();
</script>

<style scoped>
.terms-shell {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: transparent;
}

section p,
section ul {
  color: var(--p-text-muted-color);
}

section h2 {
  @apply text-base font-semibold mb-3;
  color: var(--p-text-color);
}

section h3 {
  @apply text-sm font-medium mt-4 mb-2;
  color: var(--p-text-muted-color);
}

section h4 {
  @apply text-sm font-medium mt-3 mb-2;
  color: var(--p-text-muted-color);
}

section ul {
  @apply list-disc pl-5 mb-3 space-y-1 text-sm;
}

section ul li {
  color: var(--p-text-muted-color);
}

section p {
  @apply text-sm;
}

hr {
  border-color: var(--p-surface-200);
}
</style>

<template>
  <div class="terms-shell px-4 py-6">
    <div class="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <Card>
        <template #content>
          <!-- Header -->
          <div class="py-4 border-b border-surface-200 mb-6">
            <h1 class="text-xl font-semibold">Terms of Use &amp; Privacy Policy</h1>
            <p class="text-xs text-color-secondary mt-1">Laatste versie: 1.2 | Laatst bijgewerkt: 28-10-2026</p>
          </div>

          <!-- Content -->
          <div>
            <section class="border-t border-surface-200 py-4">
              <h2>1. Over deze applicatie</h2>
              <p>Deze applicatie ("{{ appName }}") is een persoonlijke webapplicatie waarmee gebruikers boodschappenlijsten kunnen aanmaken, bekijken, delen, bewerken en verwijderen. De applicatie is ontwikkeld voor persoonlijk gebruik en heeft als doel het beheren van boodschappen overzichtelijker te maken.</p>
            </section>
            <section class="border-t border-surface-200 py-4">
              <h2>2. Beheerder van de applicatie</h2>
              <p>De applicatie wordt beheerd door de ontwikkelaar van {{ appName }} ("Beheerder"). Voor vragen kun je contact opnemen via <a class="underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>.</p>
            </section>
            <section class="border-t border-surface-200 py-4">
              <h2>Privacy Policy</h2>
              <h3>3. Welke gegevens worden verzameld</h3>
              <p>Je account:</p>
              <ul>
                <li>Naam</li>
                <li>E-mailadres</li>
                <li>Wachtwoord (veilig gehasht met een cryptografisch algoritme)</li>
                <li>Taal, meldingsinstellingen en wanneer je de voorwaarden hebt geaccepteerd</li>
              </ul>
              <p>Wat je in de applicatie zet:</p>
              <ul>
                <li>Boodschappenlijsten (en gedeelde lijsten)</li>
                <li>Producten die je toevoegt, met aantal en prijs, en wie ze heeft toegevoegd of afgevinkt</li>
                <li>Klantenkaarten: een titel met een foto of een barcode die uit het ingevoerde nummer wordt gemaakt</li>
                <li>E-mailadressen van mensen die je uitnodigt voor een lijst</li>
                <li>Supportvragen: je naam, je e-mailadres en de berichten die je ons stuurt via de app</li>
              </ul>
              <p>Technische gegevens, voor beveiliging en de werking van de applicatie:</p>
              <ul>
                <li>Bij elke geslaagde login: het tijdstip, je IP-adres, het apparaat of de browser (user agent), de app-versie en of je via de app of de website inlogde</li>
                <li>Bij een mislukte inlogpoging: het tijdstip, het IP-adres en het ingevoerde e-mailadres</li>
                <li>Wanneer je voor het laatst actief was</li>
                <li>Als je meldingen toestaat: de pushtoken van je apparaat</li>
                <li>Een logboek van de e-mails die de applicatie stuurt (activatie, wachtwoord herstellen, uitnodigingen): ontvanger, onderwerp, inhoud en of het verzenden lukte</li>
              </ul>
              <h3>4. Doeleinden van gegevensverwerking</h3>
              <p>Deze gegevens worden gebruikt om:</p>
              <ul>
                <li>gebruikers veilig te laten inloggen via Laravel Sanctum</li>
                <li>gedeelde lijsten correct aan de juiste gebruikers toe te wijzen</li>
                <li>de werking van de boodschappenlijst functionaliteit te garanderen</li>
                <li>meldingen te tonen, in de app en als pushmelding op je apparaat</li>
                <li>e-mails te sturen die bij je account horen, en te controleren of ze aankomen</li>
                <li>misbruik te voorkomen en je account te beschermen: het aantal inlogpogingen beperken en ongebruikelijke logins herkennen (hiervoor worden IP-adressen gebruikt)</li>
                <li>de beheerder overzicht te geven van het gebruik (zoals het aantal actieve gebruikers) en ondersteuning te bieden bij problemen</li>
              </ul>
              <p>Alleen de beheerder kan de inloggegevens en het e-maillogboek inzien, en alleen voor beveiliging en ondersteuning.</p>
              <p>Er worden <span class="underline">geen gegevens verkocht</span> of voor advertenties gebruikt. Gegevens gaan alleen naar de externe verwerkers in artikel 21, voor zover nodig om de applicatie te laten werken.</p>
              <h3>5. Gegevensbeveiliging</h3>
              <ul>
                <li>Wachtwoorden worden nooit in platte tekst opgeslagen, maar veilig gehasht met Laravel's ingebouwde hashingmechanismen (bcrypt/argon2).</li>
                <li>Gegevensverkeer tussen de app, de website (Nuxt) en de backend (Laravel Sanctum API) is versleuteld via HTTPS.</li>
                <li>Alleen geautoriseerde gebruikers hebben toegang tot hun eigen gegevens.</li>
                <li>Lijsten en producten zijn alleen zichtbaar voor gebruikers met toegang tot de betreffende lijst. Klantenkaarten zijn alleen zichtbaar voor jou.</li>
              </ul>
              <h3>6. Verantwoordelijkheid voor foto's</h3>
              <p>Gebruikers zijn zelf verantwoordelijk voor de inhoud van de foto's die zij uploaden. Het is niet toegestaan om foto's te uploaden die:</p>
              <ul>
                <li>auteursrechtelijk beschermd zijn zonder toestemming</li>
                <li>beledigend, discriminerend of aanstootgevend zijn</li>
                <li>persoonsgegevens van derden bevatten zonder hun toestemming</li>
              </ul>
              <p>De Beheerder behoudt zich het recht voor om inhoud te verwijderen bij misbruik.</p>
              <h3>7. Delen van lijsten</h3>
              <p>De applicatie maakt het mogelijk om lijsten te delen met andere geregistreerde gebruikers. Alleen gebruikers die jij expliciet toevoegt, hebben toegang tot die lijst. Je kunt op elk moment stoppen met delen of de lijst verwijderen.</p>
              <h3>8. Bewaartermijn en verwijdering van gegevens</h3>
              <p>Zolang je account bestaat, worden je account en wat je in de applicatie zet bewaard.</p>
              <p>Je inloggeschiedenis, mislukte inlogpogingen en het e-maillogboek (met IP-adressen en e-mailadressen) worden maximaal 12 maanden bewaard en daarna automatisch verwijderd. Een supportgesprek wordt automatisch verwijderd 12 maanden na het laatste bericht.</p>
              <p>Je kunt je account op elk moment verwijderen. Daarmee worden direct en permanent uit de database verwijderd: je account, je lijsten met hun producten, je klantenkaarten, je uitnodigingen, je inloggeschiedenis, mislukte inlogpogingen met jouw e-mailadres, de e-mails aan jou in het e-maillogboek, je supportvragen en de pushtokens van je apparaten.</p>
              <p>Al verzonden e-mails staan ook in de mailbox van de ontvanger en het verzendaccount van de beheerder (Gmail); die vallen buiten de applicatie en kunnen daar niet worden verwijderd.</p>
              <h3>9. Cookies en lokale opslag</h3>
              <p>De website gebruikt alleen technische cookies en localStorage, en de app de opslag op je apparaat, om je ingelogd te houden en je voorkeuren (zoals je taal) te bewaren. Er worden <span class="underline">geen analyse-, tracking- of advertentiecookies</span> gebruikt en je wordt niet gevolgd op andere websites of apps. Wel worden je logins vastgelegd voor de beveiliging van je account (zie artikel 3, 4 en 8).</p>
              <h3>10. Jouw rechten</h3>
              <p>Je hebt het recht om:</p>
              <ul>
                <li>inzage te vragen in je opgeslagen gegevens</li>
                <li>je gegevens te corrigeren of te verwijderen</li>
                <li>je account te beëindigen</li>
              </ul>
              <p>Mail hiervoor, of met andere vragen, naar <a class="underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>. Je account verwijderen kan ook zelf, via je profiel.</p>
              <h3>11. Wijzigingen</h3>
              <p>De beheerder kan deze voorwaarden en privacyverklaring wijzigen wanneer de werking van de applicatie verandert. Bij belangrijke wijzigingen word je binnen de applicatie geïnformeerd en kun je de nieuwe voorwaarden opnieuw accepteren.</p>
            </section>
            <section class="border-t border-surface-200 py-4">
              <h2>Terms of Use</h2>
              <h3>12. Gebruik van de applicatie</h3>
              <ul>
                <li>Je mag de applicatie uitsluitend gebruiken voor persoonlijk, niet-commercieel gebruik.</li>
                <li>Je bent verantwoordelijk voor de inhoud die je toevoegt.</li>
                <li>De beheerder is niet aansprakelijk voor verlies van gegevens, storingen of misbruik van inloggegevens door derden.</li>
              </ul>
              <h3>13. Acceptatie</h3>
              <p>Door een account aan te maken of in te loggen, verklaar je dat je:</p>
              <ul>
                <li>deze Gebruiksvoorwaarden en Privacyverklaring hebt gelezen</li>
                <li>hiermee akkoord gaat</li>
                <li>ouder bent dan 16 jaar (of toestemming hebt van een ouder/voogd)</li>
              </ul>
              <h3>14. Toepasselijk recht</h3>
              <p>Op deze voorwaarden is Nederlands recht van toepassing. Eventuele geschillen worden uitsluitend voorgelegd aan de bevoegde rechter te Amsterdam, Nederland.</p>
              <h3>14a. Internationale gebruikers</h3>
              <p>De applicatie is ontwikkeld en gehost in Nederland en valt onder Nederlands en Europees (AVG) recht. Gebruikers die de applicatie gebruiken vanuit andere landen doen dit op eigen initiatief en verantwoordelijkheid. Door gebruik te maken van de applicatie verklaren zij zich akkoord dat uitsluitend Nederlands recht van toepassing is en dat geen beroep kan worden gedaan op lokale wetgeving of consumentenbescherming buiten Nederland of de Europese Unie.</p>
            </section>
            <section class="border-t border-surface-200 py-4">
              <h2>Aanvullende bepalingen</h2>
              <h3>15. Beperking van aansprakelijkheid</h3>
              <p>De Beheerder is niet verantwoordelijk of aansprakelijk voor:</p>
              <ul>
                <li>enig verlies van gegevens, beschadiging van gegevens of onbeschikbaarheid van de applicatie, ongeacht de oorzaak (inclusief technische storingen, onderhoud of onderbrekingen van externe diensten);</li>
                <li>indirecte, incidentele of gevolgschade, waaronder verlies van gegevens of winst;</li>
                <li>ongeoorloofde toegang tot je account door zwakke wachtwoorden, apparaatcompromittering of nalatigheid van de gebruiker.</li>
              </ul>
              <p>Het gebruik van de applicatie is volledig voor eigen risico. De applicatie wordt aangeboden "zoals ze is", zonder enige garantie van ononderbroken of foutloze werking.</p>
              <h3>16. Opschorting en verwijdering van accounts</h3>
              <p>De Beheerder behoudt zich het recht voor om:</p>
              <ul>
                <li>accounts te schorsen of te verwijderen die deze voorwaarden of toepasselijke wetgeving overtreden,</li>
                <li>inhoud te verwijderen die onwettig, aanstootgevend of schadelijk is,</li>
                <li>toegang tot de applicatie (tijdelijk of permanent) te beëindigen om technische, onderhouds- of veiligheidsredenen, of in geval van misbruik.</li>
              </ul>
              <p>In dergelijke gevallen is de Beheerder niet verplicht om verwijderde of verloren gegevens te herstellen.</p>
              <h3>17. Beëindiging van de dienst</h3>
              <p>De Beheerder mag de applicatie of onderdelen daarvan op elk moment wijzigen, opschorten of permanent stopzetten, met of zonder voorafgaande kennisgeving. Indien de dienst wordt beëindigd, worden alle gebruikersgegevens permanent verwijderd overeenkomstig de Privacy Policy.</p>
              <h3>18. Disclaimer</h3>
              <p>Hoewel de Beheerder zich inspant om een goed functionerende en veilige applicatie te bieden, wordt geen garantie gegeven dat de applicatie ononderbroken, foutloos of volledig compatibel is met alle apparaten of browsers. Gebruikers erkennen dat technische problemen of storingen kunnen optreden en dat de Beheerder niet aansprakelijk is voor enig ongemak of dataverlies dat hieruit voortvloeit.</p>
              <h3>19. Inhoud toegevoegd door gebruikers</h3>
              <p>Gebruikers zijn volledig verantwoordelijk voor alle gegevens, teksten, productnamen, foto's of andere inhoud die zij aan de applicatie toevoegen ("gebruikersinhoud"). De Beheerder controleert of modereert deze inhoud niet vooraf en kan niet aansprakelijk worden gesteld voor de juistheid, wettigheid of geschiktheid ervan.</p>
              <p>De Beheerder behoudt zich het recht voor om gebruikersinhoud te verwijderen of te blokkeren wanneer deze:</p>
              <ul>
                <li>in strijd is met wet- of regelgeving,</li>
                <li>inbreuk maakt op auteursrechten of privacy van derden, of</li>
                <li>naar oordeel van de Beheerder ongepast, beledigend of misleidend is.</li>
              </ul>
              <p>De gebruiker vrijwaart de Beheerder voor alle aanspraken van derden die voortvloeien uit de door de gebruiker toegevoegde inhoud.</p>
              <h3>20. Vrijwaring</h3>
              <p>Door gebruik te maken van de applicatie stemt de gebruiker ermee in de Beheerder te vrijwaren en te verdedigen tegen alle aanspraken, schadevergoedingen, verliezen, kosten of aansprakelijkheden die voortvloeien uit:</p>
              <ul>
                <li>schending van deze voorwaarden,</li>
                <li>het uploaden of delen van onrechtmatige of inbreukmakende inhoud,</li>
                <li>misbruik van de applicatie, of</li>
                <li>schending van rechten van derden.</li>
              </ul>
              <h3>21. Externe verwerkers</h3>
              <p>Voor de werking van de applicatie maakt de Beheerder gebruik van vertrouwde externe diensten. Zij verwerken gegevens uitsluitend in opdracht van de Beheerder en alleen voor zover nodig:</p>
              <ul>
                <li>Hosting: de server waarop de applicatie en de database draaien</li>
                <li>E-mail (Gmail): voor activatie-, herstel- en uitnodigingsmails, en voor antwoorden op supportvragen</li>
                <li>Pushmeldingen (Expo en Apple Push Notification service): ontvangen de pushtoken van je apparaat en de tekst van de melding, zoals de naam van een lijst en van wie er iets aan heeft gedaan</li>
              </ul>
              <p>De Beheerder blijft verantwoordelijk voor een zorgvuldige omgang met deze gegevens, in overeenstemming met de AVG.</p>
            </section>
            <section class="border-t border-surface-200 py-4">
              <h2>English version</h2>
              <p class="text-xs text-color-secondary mb-4">Latest version: 1.2 — Last updated: 28-10-2026</p>
              <h3>1. About this application</h3>
              <p>This application ("{{ appName }}") is a personal web application that allows users to create, view, share, edit, and delete grocery lists. The application is developed for personal use and aims to make managing groceries more organized.</p>
              <h3>2. Application administrator</h3>
              <p>The application is managed by the developer of {{ appName }} ("Administrator"). For questions, you can contact <a class="underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>.</p>
              <h3>Privacy Policy</h3>
              <h4>3. What data is collected</h4>
              <p>Your account:</p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Password (securely hashed with a cryptographic algorithm)</li>
                <li>Language, notification settings and when you accepted the terms</li>
              </ul>
              <p>What you put in the application:</p>
              <ul>
                <li>Grocery lists (and shared lists)</li>
                <li>Products you add, with quantity and price, and who added or checked them off</li>
                <li>Loyalty cards: a title with a photo or a barcode made from the number you enter</li>
                <li>Email addresses of people you invite to a list</li>
                <li>Support questions: your name, your email address and the messages you send us through the app</li>
              </ul>
              <p>Technical data, for security and for the application to work:</p>
              <ul>
                <li>For every successful login: the time, your IP address, the device or browser (user agent), the app version and whether you logged in through the app or the website</li>
                <li>For a failed login attempt: the time, the IP address and the email address entered</li>
                <li>When you were last active</li>
                <li>If you allow notifications: the push token of your device</li>
                <li>A log of the emails the application sends (activation, password reset, invitations): recipient, subject, content and whether sending succeeded</li>
              </ul>
              <h4>4. Purposes of data processing</h4>
              <p>This data is used to:</p>
              <ul>
                <li>allow users to log in securely via Laravel Sanctum</li>
                <li>correctly assign shared lists to the right users</li>
                <li>guarantee the operation of the grocery list functionality</li>
                <li>show notifications, in the app and as push notifications on your device</li>
                <li>send the emails that belong to your account, and check that they arrive</li>
                <li>prevent abuse and protect your account: limiting login attempts and recognising unusual logins (IP addresses are used for this)</li>
                <li>give the administrator an overview of usage (such as the number of active users) and help with problems</li>
              </ul>
              <p>Only the administrator can see the login data and the email log, and only for security and support.</p>
              <p>No data is <span class="underline">sold</span> or used for advertising. Data only goes to the external processors in article 21, as far as needed for the application to work.</p>
              <h4>5. Data security</h4>
              <ul>
                <li>Passwords are never stored in plain text, but securely hashed using Laravel's built-in hashing mechanisms (bcrypt/argon2).</li>
                <li>Data traffic between the app, the website (Nuxt) and the backend (Laravel Sanctum API) is encrypted via HTTPS.</li>
                <li>Only authorized users have access to their own data.</li>
                <li>Lists and products are only visible to users with access to the list in question. Loyalty cards are only visible to you.</li>
              </ul>
              <h4>6. Responsibility for photos</h4>
              <p>Users are responsible for the content of the photos they upload. It is not allowed to upload photos that:</p>
              <ul>
                <li>are copyright protected without permission</li>
                <li>are offensive, discriminatory, or insulting</li>
                <li>contain personal data of third parties without their consent</li>
              </ul>
              <p>The Administrator reserves the right to remove content in case of abuse.</p>
              <h4>7. Sharing lists</h4>
              <p>The application allows you to share lists with other registered users. Only users you explicitly add have access to that list. You can stop sharing or delete the list at any time.</p>
              <h4>8. Retention period and deletion of data</h4>
              <p>As long as your account exists, your account and what you put in the application are kept.</p>
              <p>Your login history, failed login attempts and the email log (with IP addresses and email addresses) are kept for at most 12 months and are then removed automatically. A support conversation is removed automatically 12 months after its last message.</p>
              <p>You can delete your account at any time. This immediately and permanently removes from the database: your account, your lists with their products, your loyalty cards, your invitations, your login history, failed login attempts with your email address, the emails to you in the email log, your support questions and the push tokens of your devices.</p>
              <p>Emails already sent are also in the recipient's mailbox and the administrator's sending account (Gmail); those are outside the application and cannot be removed there.</p>
              <h4>9. Cookies and local storage</h4>
              <p>The website only uses technical cookies and localStorage, and the app your device's storage, to keep you logged in and to remember your preferences (such as your language). No <span class="underline">analytics, tracking or advertising cookies</span> are used, and you are not followed on other websites or apps. Your logins are recorded to protect your account (see articles 3, 4 and 8).</p>
              <h4>10. Your rights</h4>
              <p>You have the right to:</p>
              <ul>
                <li>request access to your stored data</li>
                <li>correct or delete your data</li>
                <li>terminate your account</li>
              </ul>
              <p>Email <a class="underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a> for this, or with any other question. You can also delete your account yourself, from your profile.</p>
              <h4>11. Changes</h4>
              <p>The administrator may change these terms and privacy policy when the operation of the application changes. For important changes, you will be informed within the application and can accept the new terms again.</p>
              <h3>Terms of Use</h3>
              <h4>12. Use of the application</h4>
              <ul>
                <li>You may only use the application for personal, non-commercial use.</li>
                <li>You are responsible for the content you add.</li>
                <li>The administrator is not liable for data loss, malfunctions, or misuse of login details by third parties.</li>
              </ul>
              <h4>13. Acceptance</h4>
              <p>By creating an account or logging in, you declare that you:</p>
              <ul>
                <li>have read these Terms of Use and Privacy Policy</li>
                <li>agree to them</li>
                <li>are over 16 years old (or have permission from a parent/guardian)</li>
              </ul>
              <h4>14. Applicable law</h4>
              <p>These terms are governed by Dutch law. Any disputes will be submitted exclusively to the competent court in Amsterdam, the Netherlands.</p>
              <h4>14a. International users</h4>
              <p>The application is developed and hosted in the Netherlands and is subject to Dutch and European (GDPR) law. Users who use the application from other countries do so on their own initiative and responsibility. By using the application, they agree that only Dutch law applies and that no appeal can be made to local legislation or consumer protection outside the Netherlands or the European Union.</p>
              <h3>Supplementary provisions</h3>
              <h4>15. Limitation of liability</h4>
              <p>The Administrator is not responsible or liable for:</p>
              <ul>
                <li>any loss of data, corruption of data, or unavailability of the application, regardless of the cause (including technical failures, maintenance, or interruptions of external services);</li>
                <li>indirect, incidental, or consequential damages, including loss of data or profits;</li>
                <li>unauthorized access to your account due to weak passwords, device compromise, or user negligence.</li>
              </ul>
              <p>Use of the application is entirely at your own risk. The application is provided "as is," without any guarantee of uninterrupted or error-free operation.</p>
              <h4>16. Suspension and deletion of accounts</h4>
              <p>The Administrator reserves the right to:</p>
              <ul>
                <li>suspend or delete accounts that violate these terms or applicable law,</li>
                <li>remove content that is illegal, offensive, or harmful,</li>
                <li>terminate access to the application (temporarily or permanently) for technical, maintenance, or security reasons, or in case of abuse.</li>
              </ul>
              <p>In such cases, the Administrator is not obliged to restore or recover user data that has been deleted or lost as a result.</p>
              <h4>17. Termination of the service</h4>
              <p>The Administrator may modify, suspend, or permanently discontinue the application or any of its features at any time, with or without notice. If the service is discontinued, all user data will be permanently deleted from the database in accordance with the Privacy Policy.</p>
              <h4>18. Disclaimer</h4>
              <p>While the Administrator strives to ensure that the application functions correctly and securely, no guarantee is given that it will be uninterrupted, error-free, or fully compatible with all devices or browsers. Users acknowledge that technical issues or outages may occur and that the Administrator cannot be held liable for any resulting inconvenience or data loss.</p>
              <h4>19. User generated content</h4>
              <p>Users are fully responsible for all data, texts, product names, photos, or other content they add to the application ("user content"). The Administrator does not pre-moderate or check this content and cannot be held liable for its accuracy, legality, or suitability.</p>
              <p>The Administrator reserves the right to remove or block user content when it:</p>
              <ul>
                <li>violates laws or regulations,</li>
                <li>infringes copyrights or privacy of third parties, or</li>
                <li>is, in the Administrator's opinion, inappropriate, offensive, or misleading.</li>
              </ul>
              <p>The user indemnifies the Administrator against all claims from third parties arising from user content added by the user.</p>
              <h4>20. Indemnity</h4>
              <p>By using the application, the user agrees to indemnify and defend the Administrator against all claims, damages, losses, costs, or liabilities arising from:</p>
              <ul>
                <li>violation of these terms,</li>
                <li>uploading or sharing unlawful or infringing content,</li>
                <li>misuse of the application, or</li>
                <li>violation of third-party rights.</li>
              </ul>
              <h4>21. External processors</h4>
              <p>For the application to work, the Administrator uses trusted external services. They process data only on behalf of the Administrator and only as far as needed:</p>
              <ul>
                <li>Hosting: the server that runs the application and the database</li>
                <li>Email (Gmail): for activation, password reset and invitation emails, and for answers to support questions</li>
                <li>Push notifications (Expo and Apple Push Notification service): receive the push token of your device and the text of the notification, such as the name of a list and of who did something on it</li>
              </ul>
              <p>The Administrator remains responsible for handling this data carefully, in accordance with the GDPR.</p>
            </section>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
