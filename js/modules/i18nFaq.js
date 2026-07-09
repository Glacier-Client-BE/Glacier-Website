'use strict';

// FAQ (assets/data/faq.json), mods-count, and launcher-loading translation
// strings. Kept in a separate module and merged into STRINGS in i18n.js so
// the huge FAQ HTML blobs don't have to be inserted into that literal by
// hand. Languages not listed here fall back to English via t().

export const FAQ_STRINGS = {
    en: {
        'faq.allQuestions': 'All Questions',
        'dl.loadingLauncher': 'Loading launcher releases...',
        'mods.countOf': '{shown} of {total} mods',
        'dl.tagLatest': 'Latest',
        'dl.tagArchived': 'Archived',
        'dl.downloadsWord': 'downloads',
        'dl.changelogLabel': 'Changelog',
        'dl.extOne': '{n} compatible extension',
        'dl.extMany': '{n} compatible extensions',
        'dl.noLauncherReleases': 'No launcher releases found.',
        'dl.failedLoadLauncher': 'Failed to load launcher releases.',
        'dl.viewOnGithub': 'View on GitHub',
        'dl.alsoAvailableOn': 'Also available on',
        'dl.mirrorPending': 'Not yet updated to the latest hotfix',
        'update.available': 'A new version of this site is available.',
        'update.refresh': 'Refresh',
        'update.dismiss': 'Dismiss',

        'toast.announcement': 'Announcement',
        'toast.available': 'Glacier {version} is now available!',
        'toast.dismiss': 'Dismiss announcement',
        'donate.toastTitle': 'Support Glacier',
        'donate.toastText': 'Glacier is free forever. A small donation keeps it that way.',
        'donate.dismiss': 'Dismiss donation prompt',

        'changelog.v6.2.title': 'HUD Hotfix and more: Restores compatibility with Minecraft Bedrock v26.30.',
        'changelog.v6.2.note0': 'Fixed errors when enabling the resource pack on MCBE v26.30.',
        'changelog.v6.2.note1': 'Fixed HUD elements not rendering or functioning correctly.',
        'changelog.v6.2.note2': 'Fixed the Mod Menu not opening after activation.',
        'changelog.v6.2.note3': 'Restored full HUD functionality and compatibility with the latest Minecraft update.',
        'changelog.v6.2.note4': 'Fixed an error with the Hand Model on Java x Bedrock crossplay servers.',
        'changelog.v6.2.note5': 'Fixed issues with texture missing.',

        'license.title': 'Glacier Client License',
        'license.prohibited': 'Prohibited Use',
        'license.permitted.body': '<li><strong>Reviews and Content Creation:</strong> You may create videos, streams, or written reviews featuring Glacier Client, provided you link only to our <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">official Discord invite</a>. Links to Mediafire or other unofficial third-party mirrors are not permitted.</li><li><strong>Private Modification:</strong> You may modify and use Glacier Client\'s code or content within your own private, non-public resource packs for personal use.</li>',
        'license.prohibited.body': '<li><strong>Misinformation:</strong> Spreading false claims or engaging in defamatory conduct against Glacier Client or its developers is prohibited.</li><li><strong>Redistribution:</strong> Publicly distributing Glacier Client\'s assets or code, in original or modified form, without prior written permission is strictly forbidden.</li><li><strong>Uncredited Use:</strong> Incorporating Glacier Client\'s proprietary systems, such as the draggable mods saving method, into another public project without the attribution required below is prohibited.</li>',
        'license.attribution': 'Attribution Requirements',
        'license.attribution.body': 'Any public project that incorporates Glacier Client\'s proprietary systems, including the draggable mods saving method, must clearly credit Glacier Client and include a link to our official Discord server. Failure to comply constitutes a violation of this license and may result in <strong style="color:var(--red);">legal action</strong> and a DMCA takedown request against the infringing project.',
        'license.ownership': 'Ownership',
        'license.ownership.body': 'Glacier Client, including its source code, textures, UI assets, branding, and the "Glacier Client" and "Glacier Productions" names, is the intellectual property of Glacier Productions. This license grants you a limited, revocable right to use the client as described above; it does not transfer ownership of any underlying assets or code to you.',
        'license.thirdParty': 'Third-Party Assets',
        'license.thirdParty.body': 'Glacier Client is an independent resource pack built for Minecraft Bedrock Edition and is not affiliated with, endorsed by, or sponsored by Mojang Studios or Microsoft. Minecraft is a trademark of Mojang Synergies AB. Any third-party libraries or assets bundled with Glacier Client remain the property of their respective owners and are used under their own applicable licenses.',
        'license.warranty': 'No Warranty & Termination',
        'license.warranty.body': 'Glacier Client is provided <strong>"as is"</strong> without warranty of any kind, express or implied. We reserve the right to revoke the rights granted under this license, at our discretion, from any individual or project found to be in violation of these terms.',

        'tos.s1': '1. Acceptance of Terms',
        'tos.s1.body': 'By downloading, installing, or using Glacier Client, or by joining our Discord server, you agree to be bound by these Terms of Service and our <a href="/privacy" data-section="privacy">Privacy Policy</a>. If you do not agree, do not use Glacier Client or its associated services.',
        'tos.s2': '2. Nature of the Service',
        'tos.s2.body': 'Glacier Client is a free, community-developed resource pack and companion launcher for Minecraft Bedrock Edition. It is provided for personal, non-commercial use and does not modify Minecraft\'s game logic, grant unfair multiplayer advantages, or interact with servers in ways prohibited by Mojang\'s End User License Agreement.',
        'tos.s3': '3. Acceptable Use',
        'tos.s3.body': '<li>You must be old enough to use Discord and Minecraft under their respective terms of service, or have parental consent to do so.</li><li>You will not use Glacier Client or our Discord server to harass others, distribute malware, or violate any applicable law.</li><li>You will not attempt to resell, rebrand, or misrepresent Glacier Client as your own work.</li><li>Use of Glacier Client is also subject to the <a href="/license" data-section="license">Glacier Client License</a>, which governs redistribution and attribution.</li>',
        'tos.s4': '4. Downloads & Third-Party Links',
        'tos.s4.body': 'Some download links are routed through third-party services (such as Linkvertise) to help fund development. We do not control the content of these intermediary pages and are not responsible for ads or content displayed on them. Always download Glacier Client through links posted in our official Discord server or on this website.',
        'tos.s5': '5. Disclaimer of Warranty & Liability',
        'tos.s5.body': 'Glacier Client is provided <strong>"as is"</strong> without warranties of any kind. We do not guarantee uninterrupted operation, compatibility with every device or server, or that the client will be free of bugs. To the fullest extent permitted by law, Glacier Productions is not liable for any indirect, incidental, or consequential damages arising from your use of Glacier Client, including but not limited to account restrictions imposed by third parties such as Mojang, Microsoft, or individual Minecraft servers.',
        'tos.s6': '6. Donations',
        'tos.s6.body': 'Donations made via PayPal or Ko-fi are voluntary contributions to support ongoing development and do not purchase any good, service, feature, or entitlement. Donations are generally non-refundable except where required by law or platform policy.',
        'tos.s7': '7. Changes to These Terms',
        'tos.s7.body': 'We may update these Terms of Service from time to time to reflect changes in the project or applicable law. Continued use of Glacier Client after changes are posted constitutes acceptance of the revised terms. Material changes will be announced in our Discord server.',
        'tos.s8': '8. Contact',
        'tos.s8.body': 'Questions about these terms can be directed to our team through the <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">official Discord server</a>.',

        'privacy.s1': 'Information We Collect',
        'privacy.s1.body': '<li><strong>Client Configuration:</strong> Glacier Client stores your preferences (toggles, opacity, HUD positions) locally in <code>config.json</code> on your own device. This data never leaves your device and is not transmitted to us.</li><li><strong>Website Preferences:</strong> This website stores a theme preference (light/dark) in your browser\'s local storage to remember your choice between visits.</li><li><strong>Aggregate Download Counts:</strong> When you download a client version, an anonymous counter is incremented via our Cloudflare Worker so we can display approximate download totals. No personal or device-identifying information is collected as part of this count.</li><li><strong>Discord Activity:</strong> If you join our Discord server, your interactions there are governed by <a href="https://discord.com/privacy" target="_blank" rel="noopener">Discord\'s own Privacy Policy</a>, not this one.</li>',
        'privacy.s2': 'How We Use Information',
        'privacy.s2.body': 'Any data described above is used solely to operate and improve Glacier Client and this website, for example, to track aggregate download popularity across versions. We do not sell, rent, or share your information with third parties for marketing purposes.',
        'privacy.s3': 'Third-Party Services',
        'privacy.s3.body': 'This website relies on a small number of third-party services to function, including Cloudflare (hosting and download counters), Discord (community widget and invites), and Linkvertise (monetized download links). These services may independently collect data, such as IP address, under their own privacy policies, which we encourage you to review.',
        'privacy.s4': 'Cookies & Local Storage',
        'privacy.s4.body': 'We use browser local storage, not tracking cookies, to remember your theme preference. We do not use advertising or cross-site tracking cookies on glacierclient.xyz. Third-party services embedded on this site, such as Linkvertise, may set their own cookies as described in their respective policies.',
        'privacy.s5': 'Children\'s Privacy',
        'privacy.s5.body': 'Glacier Client is not directed at children under the age required by Discord\'s and Minecraft\'s own terms of service. We do not knowingly collect personal information from children under that age.',
        'privacy.s6': 'Changes to This Policy',
        'privacy.s6.body': 'We may update this Privacy Policy periodically to reflect changes in our practices or for legal reasons. Material changes will be announced in our Discord server, and the "Last updated" date above will be revised accordingly.',
        'privacy.s7': 'Contact',
        'privacy.s7.body': 'For privacy-related questions or requests, reach out via our <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">official Discord server</a>.',

        'faqcat.Getting Started': 'Getting Started',
        'faqcat.Installation & Setup': 'Installation & Setup',
        'faqcat.Troubleshooting': 'Troubleshooting',
        'faqcat.Features & Compatibility': 'Features & Compatibility',
        'faqcat.Community & Content': 'Community & Content',
        'faqcat.Legal & Privacy': 'Legal & Privacy',

        'faqq.what-is-glacier': 'What is Glacier Client?',
        'faqa.what-is-glacier': '<p>Glacier Client is a free resource pack for Minecraft Bedrock Edition that adds a customizable HUD, a draggable mod menu with 37+ modules, and quality-of-life features, without modifying game logic or giving players an unfair advantage. It installs like any other resource pack and works on Mobile, PC, and Console.</p>',

        'faqq.is-free': 'Is Glacier Client free?',
        'faqa.is-free': '<p>Yes. Glacier Client is free and always will be. Some download links are routed through Linkvertise to help fund development and hosting costs, but the client itself is never sold or gated behind a paywall. If you\'d like to support development directly, see our <a href="/donate" data-section="donate">Donate</a> page.</p>',

        'faqq.open-mod-menu': 'How do I open the Mod Menu?',
        'faqa.open-mod-menu': '<ol><li>Open the <strong>Pause Menu</strong> while in-game.</li><li>Locate the <strong>Grid Icon</strong> button in the bottom-left corner of your screen.</li><li><strong>Double-click</strong> this button to toggle the Mod Menu.</li></ol>',

        'faqq.see-everything': 'Where can I see everything Glacier Client can do?',
        'faqa.see-everything': '<p>Check the <a href="/features" data-section="features">Features</a> page for an overview, the <a href="/mods" data-section="mods">All Mods</a> page for the full list of modules, and the <a href="/gallery" data-section="gallery">Gallery</a> and <a href="/community" data-section="community">Showcases</a> for screenshots and video walkthroughs from the community.</p>',

        'faqq.import-client': 'How do I import Glacier Client?',
        'faqa.import-client': '<ol><li><strong>Locate the File:</strong> Find the downloaded Glacier Client <code>.zip</code> file on your device.</li><li><strong>Open with ZArchiver:</strong> Tap the file and select ZArchiver from the options.</li><li><strong>Rename the File:</strong> Long-press the file inside ZArchiver, select Rename, and remove the <code>.zip</code> extension so the filename ends in <code>.mcpack</code>.</li><li><strong>Import to Minecraft:</strong> Tap the renamed file once, tap the arrow icon next to "View", then select Minecraft to automatically import and launch the game.</li></ol><p>Once Minecraft loads, activate Glacier Client in your <strong>Global Resources</strong> settings.</p>',

        'faqq.bypass-linkvertise': 'How do I bypass Linkvertise to download?',
        'faqa.bypass-linkvertise': '<ol><li>Go to the downloads channel in our Discord server and click your chosen version link.</li><li>On the Linkvertise page, scroll down and click <strong>"Get Glacier Client"</strong>.</li><li>An "Access Options" popup appears wait for the countdown (typically 10 seconds).</li><li>Once the timer reaches zero, the button becomes active. Click it to be redirected to the download page.</li><li>Click the blue <strong>"Download"</strong> button to save the <code>.mcpack</code> file.</li></ol>',

        'faqq.configure-client': 'How do I configure Glacier Client?',
        'faqa.configure-client': '<p>You can edit <code>config.json</code> directly or use the online Config Editor at <a href="https://config.glacierclient.xyz/" target="_blank" rel="noopener">config.glacierclient.xyz</a>.</p><p><strong>Recommended Editors:</strong></p><ul><li><strong>Android:</strong> MT Manager or QuickEdit</li><li><strong>iOS:</strong> Documents by Readdle</li><li><strong>PC:</strong> VS Code or Notepad++</li></ul><p><strong>Finding config.json on Mobile (Android &amp; iOS):</strong></p><ol><li>Open your device\'s Files app.</li><li>Navigate to: <code>Android/data/com.mojang.minecraftpe/files/games/com.mojang/resource_packs/</code></li><li>Open the <code>Glacier</code> folder and locate <code>config.json</code>.</li></ol><p><strong>Finding config.json on Windows:</strong></p><ol><li>Press <kbd>Win + R</kbd> and paste: <code>%userprofile%\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\resource_packs</code></li><li>For GDK users: <code>%userprofile%\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang\\resource_packs</code></li><li>Open the <code>Glacier</code> folder and locate <code>config.json</code>.</li></ol><p><strong>Value types:</strong> Toggles use <code>true</code>/<code>false</code> · Opacity uses <code>0.0</code>&ndash;<code>1.0</code> · Offset (X, Y) adjusts HUD element positions.</p><p><strong>Video Tutorials:</strong> <a href="https://youtu.be/RrTHx6V-zp4" target="_blank" rel="noopener">Android / ChromeOS</a> · <a href="https://youtu.be/oaQCtVdNUXg" target="_blank" rel="noopener">iPadOS / iOS</a></p>',

        'faqq.reimport-after-update': 'Do I need to re-import Glacier Client after every update?',
        'faqa.reimport-after-update': '<p>Yes, resource packs update by replacing the file, not patching in place. Download the new version, import it the same way as before, and re-activate it in Global Resources. Your <code>config.json</code> settings are stored separately and are not affected by re-importing, so your customization carries over automatically.</p>',

        'faqq.use-with-other-packs': 'Can I use Glacier Client alongside other resource packs?',
        'faqa.use-with-other-packs': '<p>Yes, as long as the other pack doesn\'t edit the same UI files. Place Glacier Client at the top of your Global Resources stack for the best results. See <strong>Why isn\'t Glacier Client working correctly?</strong> below for a list of common conflicts.</p>',

        'faqq.uninstall': 'How do I uninstall Glacier Client?',
        'faqa.uninstall': '<ol><li>Open Minecraft and go to a world\'s <strong>Settings → Global Resources</strong> (or a world\'s own resource pack settings).</li><li>Find <strong>Glacier Client</strong> in the Active list and move it back to My Packs, or remove it entirely.</li><li>To fully remove the files, delete the <strong>Glacier</strong> pack from your <code>resource_packs</code> folder (see the config guide above for the folder path on your platform).</li></ol><p>Uninstalling does not affect your Minecraft worlds, saves, or account in any way.</p>',

        'faqq.not-working-correctly': 'Why isn\'t Glacier Client working correctly?',
        'faqa.not-working-correctly': '<p>The most common causes are conflicting packs or server restrictions:</p><ul><li><strong>Conflicting Packs:</strong> Any pack or add-on that modifies <code>player.entity.json</code> (e.g., Actions &amp; Stuff) or <code>hud_screen.json</code> (e.g., Better Bedrock) will conflict with Glacier Client. Disable those packs first.</li><li><strong>Server-Side Restrictions:</strong> Some servers block custom UI overrides entirely, which is common on Minecraft event servers. Glacier\'s features will not appear on those servers, and this cannot be resolved on our end.</li></ul>',

        'faqq.mod-menu-not-appearing': 'The Mod Menu button doesn\'t appear. What do I do?',
        'faqa.mod-menu-not-appearing': '<ol><li>Confirm Glacier Client is <strong>above</strong> other resource packs in Global Resources, and that it is actually active (not just installed).</li><li>Fully close and reopen Minecraft, this refreshes the loaded resource packs.</li><li>Check for a conflicting pack, as described in <strong>Why isn\'t Glacier Client working correctly?</strong> above.</li><li>If it still doesn\'t appear, ask in the bug-reports channel on Discord with your device model and Minecraft version.</li></ol>',

        'faqq.settings-reset': 'My settings reset after an update. Why?',
        'faqa.settings-reset': '<p>This usually happens when <code>config.json</code> is deleted or overwritten during import, for example, if you extracted the new version into a fresh folder instead of updating in place. Back up your <code>config.json</code> before updating if you have heavily customized your setup, then paste it back into the new version\'s folder afterward.</p>',

        'faqq.safe-to-use': 'Is Glacier Client safe to use, and can it get me banned?',
        'faqa.safe-to-use': '<p>Glacier Client is a resource pack, it changes textures and UI, it does not inject code, modify game logic, or grant gameplay advantages such as reach, aim assist, or automated combat. It works within Minecraft Bedrock\'s official resource pack system.</p><ul><li><strong>Vanilla and Realms:</strong> Safe to use. Resource packs are a supported, client-side feature of Minecraft Bedrock.</li><li><strong>Third-party servers:</strong> Some servers explicitly prohibit any custom resource packs, including cosmetic ones, in their own rules. Always check a server\'s rules before joining with any modified UI.</li></ul><p>We do not distribute cheat clients, and we do not support or endorse using Glacier Client to violate a server\'s terms of service.</p>',

        'faqq.compatible-devices': 'Which devices and versions are compatible?',
        'faqa.compatible-devices': '<p>Glacier Client supports all devices running the <strong>Official Release</strong> of Minecraft Bedrock Edition.</p><ul><li><strong>Previews / Betas:</strong> The client may function on Preview builds, but stability is not guaranteed, as Mojang frequently changes core UI code in Preview versions.</li><li><strong>Console (Xbox &amp; PlayStation):</strong> Supported via the Realms method. Install on Mobile or PC first, activate it on a Realm, then download it on your console through Realm Settings → Resource Packs → Download, and activate it under Global Resources.</li></ul><p><a href="https://www.youtube.com/watch?v=1f7P9J-W8aM" target="_blank" rel="noopener">Watch the console install tutorial →</a></p>',

        'faqq.boost-fps': 'Does Glacier Client boost FPS?',
        'faqa.boost-fps': '<p>Glacier Client is designed for <strong>utility and customization</strong>, not as an FPS booster.</p><ul><li>Minecraft Bedrock is already a highly optimized engine.</li><li>Most "FPS booster" packs do not actually improve performance. They often add extra processing overhead without reducing actual engine load, which can <em>decrease</em> FPS.</li><li>Many such packs found online are clickbait designed for views rather than genuine technical improvement.</li></ul><p>Glacier focuses on providing a stable, high-quality experience with features that genuinely enhance gameplay.</p>',

        'faqq.impossible-features': 'What features are impossible or not planned?',
        'faqa.impossible-features': '<p><strong>Technically impossible</strong> due to engine limitations:</p><ul><li><strong>HUD:</strong> Armor durability on HUD, accurate CPS/Combo counters, Reach counters, Quick Drop on HUD.</li><li><strong>Visuals:</strong> Full Bright, Motion Blur, No Hurt Cam, Item Physics, Shaders.</li><li><strong>Tools:</strong> Minimaps, Keystrokes, Replay Mod, Shulker Previews, Pie Charts, 3rd-person Nametags.</li><li><strong>Automation:</strong> Auto GG, Auto Totem, Autosprint, Toggle Crouch, Toggle Sprint.</li><li><strong>Systems:</strong> Friend Lists, Voice Mod, In-Game Resource Pack switchers.</li></ul><p><strong>Not planned:</strong></p><ul><li>Zoom, ESP, View Modals, 3D player models, any form of cheats or hacks, custom textures for the general GUI (excluding Hotbar and EXP bar).</li></ul>',

        'faqq.works-with-shaders': 'Does Glacier Client work with shaders or other visual mods?',
        'faqa.works-with-shaders': '<p>Glacier Client only edits UI and HUD files, it does not touch lighting or rendering, so it is generally compatible with shader packs and other purely visual add-ons. Conflicts only arise with packs that edit the same HUD/menu files Glacier uses; see the compatibility notes above.</p>',

        'faqq.java-dll-version': 'Is there a version for Minecraft Java Edition or a native DLL client?',
        'faqa.java-dll-version': '<p>Both are in active development. Track progress and release announcements in the <a href="/downloads" data-section="downloads">Downloads</a> page and our Discord server, they will appear there as soon as a build is ready.</p>',

        'faqq.report-bugs': 'How do I report bugs or suggest features?',
        'faqa.report-bugs': '<p>We value community input. Please follow this process:</p><ol><li><strong>Check Existing Reports:</strong> Browse the bug-reports channel in Discord to see if the issue has already been logged.</li><li><strong>Provide Details:</strong> Include your <strong>device model</strong> and a <strong>video or screenshot</strong> of the issue.</li><li><strong>Submit Suggestions:</strong> Post new ideas in the suggestions channel. Check the "Impossible" list in the FAQ before posting to ensure your idea is technically achievable.</li></ol>',

        'faqq.review-content': 'Can I review or create content featuring Glacier Client?',
        'faqa.review-content': '<p>Yes, provided you follow these rules. Violating them may result in a server ban or strike:</p><ul><li><strong>Official Links Only:</strong> Always link to our <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">official Discord invite</a>, never Mediafire or other third-party mirrors.</li><li><strong>No Misinformation:</strong> Do not spread false claims or engage in defamatory activity.</li><li><strong>No Asset Theft:</strong> Do not publicly distribute pack content without explicit permission.</li><li><strong>Attribution Required:</strong> If you use our draggable mods saving method, you must credit Glacier Client and include our server link. Unauthorized use will result in legal action and a DMCA takedown.</li><li><strong>Private Use OK:</strong> You may use code or content in your own private, non-public packs.</li></ul><p>Full terms are available in our <a href="/license" data-section="license">License</a> and <a href="/tos" data-section="tos">Terms of Service</a>.</p>',

        'faqq.watch-in-action': 'Where can I watch Glacier Client in action?',
        'faqa.watch-in-action': '<p>See our <a href="/community" data-section="community">Showcases</a> section for hand-picked community videos, or search "Glacier Client" on YouTube for the latest independent reviews and tutorials from the Minecraft Bedrock community.</p>',

        'faqq.get-involved': 'How can I get involved beyond reporting bugs?',
        'faqa.get-involved': '<p>Join our Discord and introduce yourself. We regularly look for community members to help with translations, testing pre-release builds, and moderating the server. Announcements for these roles are posted in Discord when open.</p>',

        'faqq.data-collected': 'What information does Glacier Client collect about me?',
        'faqa.data-collected': '<p>Very little. Your configuration choices are stored locally on your own device and are never sent to us. The website only tracks anonymous, aggregate download counts to display version popularity, no personal data is attached to that count.</p><p>Full details are available in our <a href="/privacy" data-section="privacy">Privacy Policy</a>.</p>',

        'faqq.donations-refundable': 'Are donations refundable, and what do they support?',
        'faqa.donations-refundable': '<p>Donations made via PayPal or Ko-fi are voluntary and directly fund continued development, hosting costs, and new features. They are not payments for a product or subscription and are generally non-refundable, except where required by law or the payment platform\'s own policy.</p><p>See our <a href="/tos" data-section="tos">Terms of Service</a> for full details.</p>',

        'faqq.who-owns-client': 'Who owns Glacier Client, and can I redistribute it?',
        'faqa.who-owns-client': '<p>Glacier Client and its assets are the property of Glacier Productions. Redistribution, rebranding, or reselling the pack without permission is not allowed. See our <a href="/license" data-section="license">License</a> for the full terms on permitted and prohibited use.</p>'
    },

    de: {
        'faq.allQuestions': 'Alle Fragen',
        'dl.loadingLauncher': 'Launcher-Releases werden geladen...',
        'mods.countOf': '{shown} von {total} Mods',
        'dl.tagLatest': 'Neueste',
        'dl.tagArchived': 'Archiviert',
        'dl.downloadsWord': 'Downloads',
        'dl.changelogLabel': 'Änderungsprotokoll',
        'dl.extOne': '{n} kompatible Erweiterung',
        'dl.extMany': '{n} kompatible Erweiterungen',
        'dl.noLauncherReleases': 'Keine Launcher-Releases gefunden.',
        'dl.failedLoadLauncher': 'Launcher-Releases konnten nicht geladen werden.',
        'dl.viewOnGithub': 'Auf GitHub ansehen',
        'dl.alsoAvailableOn': 'Auch verfügbar auf',
        'dl.mirrorPending': 'Noch nicht auf den neuesten Hotfix aktualisiert',
        'update.available': 'Eine neue Version dieser Website ist verfügbar.',
        'update.refresh': 'Aktualisieren',
        'update.dismiss': 'Schließen',

        'toast.announcement': 'Ankündigung',
        'toast.available': 'Glacier {version} ist jetzt verfügbar!',
        'toast.dismiss': 'Ankündigung schließen',
        'donate.toastTitle': 'Glacier unterstützen',
        'donate.toastText': 'Glacier ist für immer kostenlos. Eine kleine Spende hält es so.',
        'donate.dismiss': 'Spendenhinweis schließen',

        'changelog.v6.2.title': 'HUD-Hotfix und mehr: Stellt die Kompatibilität mit Minecraft Bedrock v26.30 wieder her.',
        'changelog.v6.2.note0': 'Fehler beim Aktivieren des Resource Packs auf MCBE v26.30 behoben.',
        'changelog.v6.2.note1': 'HUD-Elemente, die nicht korrekt gerendert wurden oder funktionierten, behoben.',
        'changelog.v6.2.note2': 'Behoben, dass sich das Mod-Menü nach der Aktivierung nicht öffnete.',
        'changelog.v6.2.note3': 'Volle HUD-Funktionalität und Kompatibilität mit dem neuesten Minecraft-Update wiederhergestellt.',
        'changelog.v6.2.note4': 'Einen Fehler mit dem Handmodell auf Java-x-Bedrock-Crossplay-Servern behoben.',
        'changelog.v6.2.note5': 'Probleme mit fehlenden Texturen behoben.',

        'license.title': 'Glacier Client Lizenz',
        'license.prohibited': 'Verbotene Nutzung',
        'license.permitted.body': '<li><strong>Rezensionen und Content-Erstellung:</strong> Du darfst Videos, Streams oder schriftliche Rezensionen über Glacier Client erstellen, sofern du ausschließlich auf unsere <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">offizielle Discord-Einladung</a> verlinkst. Links zu Mediafire oder anderen inoffiziellen Drittanbieter-Mirrors sind nicht gestattet.</li><li><strong>Private Modifikation:</strong> Du darfst den Code oder Inhalt von Glacier Client innerhalb deiner eigenen privaten, nicht öffentlichen Resource Packs für den persönlichen Gebrauch verändern und nutzen.</li>',
        'license.prohibited.body': '<li><strong>Fehlinformation:</strong> Die Verbreitung falscher Behauptungen oder verleumderisches Verhalten gegenüber Glacier Client oder seinen Entwicklern ist untersagt.</li><li><strong>Weiterverbreitung:</strong> Die öffentliche Verbreitung von Glacier Clients Assets oder Code, in ursprünglicher oder veränderter Form, ohne vorherige schriftliche Erlaubnis ist strengstens untersagt.</li><li><strong>Nutzung ohne Namensnennung:</strong> Die Einbindung von Glacier Clients proprietären Systemen, wie der Methode zum Speichern verschiebbarer Mods, in ein anderes öffentliches Projekt ohne die unten geforderte Namensnennung ist untersagt.</li>',
        'license.attribution': 'Anforderungen zur Namensnennung',
        'license.attribution.body': 'Jedes öffentliche Projekt, das Glacier Clients proprietäre Systeme einbindet, einschließlich der Methode zum Speichern verschiebbarer Mods, muss Glacier Client deutlich nennen und einen Link zu unserem offiziellen Discord-Server enthalten. Eine Nichteinhaltung stellt einen Verstoß gegen diese Lizenz dar und kann zu <strong style="color:var(--red);">rechtlichen Schritten</strong> und einer DMCA-Löschungsanfrage gegen das verletzende Projekt führen.',
        'license.ownership': 'Eigentum',
        'license.ownership.body': 'Glacier Client, einschließlich seines Quellcodes, seiner Texturen, UI-Assets, Markenzeichen sowie der Namen „Glacier Client" und „Glacier Productions", ist geistiges Eigentum von Glacier Productions. Diese Lizenz gewährt dir ein begrenztes, widerrufliches Recht, den Client wie oben beschrieben zu nutzen; sie überträgt dir kein Eigentum an den zugrunde liegenden Assets oder dem Code.',
        'license.thirdParty': 'Assets von Drittanbietern',
        'license.thirdParty.body': 'Glacier Client ist ein unabhängiges Resource Pack für Minecraft Bedrock Edition und steht in keiner Verbindung zu, wird nicht unterstützt von und ist nicht gesponsert von Mojang Studios oder Microsoft. Minecraft ist eine Marke von Mojang Synergies AB. Alle mit Glacier Client gebündelten Bibliotheken oder Assets von Drittanbietern bleiben Eigentum ihrer jeweiligen Inhaber und werden unter deren eigenen geltenden Lizenzen genutzt.',
        'license.warranty': 'Keine Gewährleistung & Beendigung',
        'license.warranty.body': 'Glacier Client wird <strong>„wie besehen"</strong> ohne jegliche ausdrückliche oder stillschweigende Gewährleistung bereitgestellt. Wir behalten uns das Recht vor, die im Rahmen dieser Lizenz gewährten Rechte nach eigenem Ermessen von jeder Person oder jedem Projekt zu widerrufen, das gegen diese Bedingungen verstößt.',

        'tos.s1': '1. Annahme der Bedingungen',
        'tos.s1.body': 'Durch das Herunterladen, Installieren oder Nutzen von Glacier Client oder den Beitritt zu unserem Discord-Server erklärst du dich mit diesen Nutzungsbedingungen und unserer <a href="/privacy" data-section="privacy">Datenschutzerklärung</a> einverstanden. Wenn du nicht einverstanden bist, nutze Glacier Client oder die zugehörigen Dienste nicht.',
        'tos.s2': '2. Art des Dienstes',
        'tos.s2.body': 'Glacier Client ist ein kostenloses, von der Community entwickeltes Resource Pack und Begleit-Launcher für Minecraft Bedrock Edition. Es ist für den persönlichen, nicht-kommerziellen Gebrauch bestimmt und verändert nicht Minecrafts Spiellogik, gewährt keine unfairen Mehrspielervorteile und interagiert nicht mit Servern auf eine Weise, die durch Mojangs Endbenutzer-Lizenzvertrag verboten ist.',
        'tos.s3': '3. Akzeptable Nutzung',
        'tos.s3.body': '<li>Du musst alt genug sein, um Discord und Minecraft gemäß deren jeweiligen Nutzungsbedingungen zu verwenden, oder die elterliche Zustimmung dazu haben.</li><li>Du wirst Glacier Client oder unseren Discord-Server nicht nutzen, um andere zu belästigen, Malware zu verbreiten oder geltendes Recht zu verletzen.</li><li>Du wirst nicht versuchen, Glacier Client weiterzuverkaufen, umzubenennen oder als deine eigene Arbeit darzustellen.</li><li>Die Nutzung von Glacier Client unterliegt zudem der <a href="/license" data-section="license">Glacier Client Lizenz</a>, welche Weiterverbreitung und Namensnennung regelt.</li>',
        'tos.s4': '4. Downloads & Links von Drittanbietern',
        'tos.s4.body': 'Einige Download-Links werden über Dienste von Drittanbietern (wie Linkvertise) geleitet, um die Entwicklung zu finanzieren. Wir haben keine Kontrolle über den Inhalt dieser zwischengeschalteten Seiten und sind nicht verantwortlich für dort angezeigte Werbung oder Inhalte. Lade Glacier Client immer über Links herunter, die in unserem offiziellen Discord-Server oder auf dieser Website veröffentlicht wurden.',
        'tos.s5': '5. Haftungs- und Gewährleistungsausschluss',
        'tos.s5.body': 'Glacier Client wird <strong>„wie besehen"</strong> ohne jegliche Gewährleistung bereitgestellt. Wir garantieren keinen unterbrechungsfreien Betrieb, keine Kompatibilität mit jedem Gerät oder Server und keine Fehlerfreiheit des Clients. Im gesetzlich zulässigen Umfang haftet Glacier Productions nicht für indirekte, beiläufige oder Folgeschäden, die aus deiner Nutzung von Glacier Client entstehen, einschließlich, aber nicht beschränkt auf Kontobeschränkungen durch Dritte wie Mojang, Microsoft oder einzelne Minecraft-Server.',
        'tos.s6': '6. Spenden',
        'tos.s6.body': 'Über PayPal oder Ko-fi getätigte Spenden sind freiwillige Beiträge zur Unterstützung der laufenden Entwicklung und stellen keinen Kauf von Waren, Dienstleistungen, Funktionen oder Ansprüchen dar. Spenden sind generell nicht erstattungsfähig, außer wenn dies gesetzlich oder durch die Richtlinien der Plattform vorgeschrieben ist.',
        'tos.s7': '7. Änderungen dieser Bedingungen',
        'tos.s7.body': 'Wir können diese Nutzungsbedingungen von Zeit zu Zeit aktualisieren, um Änderungen im Projekt oder geltendem Recht widerzuspiegeln. Die fortgesetzte Nutzung von Glacier Client nach Veröffentlichung von Änderungen stellt die Annahme der überarbeiteten Bedingungen dar. Wesentliche Änderungen werden auf unserem Discord-Server bekannt gegeben.',
        'tos.s8': '8. Kontakt',
        'tos.s8.body': 'Fragen zu diesen Bedingungen können über unseren <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">offiziellen Discord-Server</a> an unser Team gerichtet werden.',

        'privacy.s1': 'Von uns erfasste Informationen',
        'privacy.s1.body': '<li><strong>Client-Konfiguration:</strong> Glacier Client speichert deine Einstellungen (Schalter, Deckkraft, HUD-Positionen) lokal in <code>config.json</code> auf deinem eigenen Gerät. Diese Daten verlassen niemals dein Gerät und werden nicht an uns übertragen.</li><li><strong>Website-Einstellungen:</strong> Diese Website speichert eine Theme-Präferenz (hell/dunkel) im lokalen Speicher deines Browsers, um deine Wahl zwischen Besuchen zu merken.</li><li><strong>Aggregierte Download-Zahlen:</strong> Wenn du eine Client-Version herunterlädst, wird ein anonymer Zähler über unseren Cloudflare Worker erhöht, damit wir ungefähre Download-Zahlen anzeigen können. Es werden keine persönlichen oder gerätespezifischen Informationen als Teil dieser Zählung erfasst.</li><li><strong>Discord-Aktivität:</strong> Wenn du unserem Discord-Server beitrittst, unterliegen deine dortigen Interaktionen <a href="https://discord.com/privacy" target="_blank" rel="noopener">Discords eigener Datenschutzerklärung</a>, nicht dieser hier.</li>',
        'privacy.s2': 'Wie wir Informationen nutzen',
        'privacy.s2.body': 'Alle oben beschriebenen Daten werden ausschließlich verwendet, um Glacier Client und diese Website zu betreiben und zu verbessern, zum Beispiel um die aggregierte Download-Beliebtheit über Versionen hinweg zu verfolgen. Wir verkaufen, vermieten oder teilen deine Informationen nicht mit Dritten zu Marketingzwecken.',
        'privacy.s3': 'Dienste von Drittanbietern',
        'privacy.s3.body': 'Diese Website ist auf eine kleine Anzahl von Diensten Dritter angewiesen, um zu funktionieren, darunter Cloudflare (Hosting und Download-Zähler), Discord (Community-Widget und Einladungen) und Linkvertise (monetarisierte Download-Links). Diese Dienste können unabhängig Daten wie die IP-Adresse gemäß ihren eigenen Datenschutzrichtlinien erfassen, die wir dir zu prüfen empfehlen.',
        'privacy.s4': 'Cookies & lokaler Speicher',
        'privacy.s4.body': 'Wir verwenden den lokalen Speicher des Browsers, keine Tracking-Cookies, um deine Theme-Präferenz zu merken. Wir verwenden keine Werbe- oder seitenübergreifenden Tracking-Cookies auf glacierclient.xyz. Dienste Dritter, die auf dieser Website eingebettet sind, wie Linkvertise, können ihre eigenen Cookies gemäß ihren jeweiligen Richtlinien setzen.',
        'privacy.s5': 'Datenschutz für Kinder',
        'privacy.s5.body': 'Glacier Client richtet sich nicht an Kinder unter dem von Discords und Minecrafts eigenen Nutzungsbedingungen geforderten Alter. Wir erfassen wissentlich keine persönlichen Informationen von Kindern unter diesem Alter.',
        'privacy.s6': 'Änderungen dieser Richtlinie',
        'privacy.s6.body': 'Wir können diese Datenschutzerklärung regelmäßig aktualisieren, um Änderungen in unseren Praktiken oder aus rechtlichen Gründen widerzuspiegeln. Wesentliche Änderungen werden auf unserem Discord-Server bekannt gegeben, und das Datum „Zuletzt aktualisiert" oben wird entsprechend angepasst.',
        'privacy.s7': 'Kontakt',
        'privacy.s7.body': 'Für datenschutzbezogene Fragen oder Anfragen wende dich bitte über unseren <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">offiziellen Discord-Server</a> an uns.',

        'faqcat.Getting Started': 'Erste Schritte',
        'faqcat.Installation & Setup': 'Installation & Einrichtung',
        'faqcat.Troubleshooting': 'Fehlerbehebung',
        'faqcat.Features & Compatibility': 'Funktionen & Kompatibilität',
        'faqcat.Community & Content': 'Community & Inhalte',
        'faqcat.Legal & Privacy': 'Recht & Datenschutz',

        'faqq.what-is-glacier': 'Was ist Glacier Client?',
        'faqa.what-is-glacier': '<p>Glacier Client ist ein kostenloses Resource Pack für Minecraft Bedrock Edition, das ein anpassbares HUD, ein verschiebbares Mod-Menü mit 37+ Modulen und Komfortfunktionen hinzufügt, ohne die Spiellogik zu verändern oder Spielern einen unfairen Vorteil zu verschaffen. Es wird wie jedes andere Resource Pack installiert und funktioniert auf Mobile, PC und Konsole.</p>',

        'faqq.is-free': 'Ist Glacier Client kostenlos?',
        'faqa.is-free': '<p>Ja. Glacier Client ist kostenlos und wird es immer bleiben. Einige Download-Links werden über Linkvertise geleitet, um die Entwicklungs- und Hosting-Kosten zu finanzieren, aber der Client selbst wird nie verkauft oder hinter einer Bezahlschranke versteckt. Wenn du die Entwicklung direkt unterstützen möchtest, besuche unsere <a href="/donate" data-section="donate">Spenden</a>-Seite.</p>',

        'faqq.open-mod-menu': 'Wie öffne ich das Mod-Menü?',
        'faqa.open-mod-menu': '<ol><li>Öffne das <strong>Pausenmenü</strong> während des Spiels.</li><li>Suche den <strong>Raster-Symbol</strong>-Button in der unteren linken Ecke deines Bildschirms.</li><li><strong>Doppelklicke</strong> auf diesen Button, um das Mod-Menü umzuschalten.</li></ol>',

        'faqq.see-everything': 'Wo kann ich alles sehen, was Glacier Client kann?',
        'faqa.see-everything': '<p>Sieh dir die <a href="/features" data-section="features">Funktionen</a>-Seite für einen Überblick an, die <a href="/mods" data-section="mods">Alle Mods</a>-Seite für die vollständige Liste der Module und die <a href="/gallery" data-section="gallery">Galerie</a> sowie <a href="/community" data-section="community">Showcases</a> für Screenshots und Video-Anleitungen aus der Community.</p>',

        'faqq.import-client': 'Wie importiere ich Glacier Client?',
        'faqa.import-client': '<ol><li><strong>Datei finden:</strong> Suche die heruntergeladene Glacier-Client-<code>.zip</code>-Datei auf deinem Gerät.</li><li><strong>Mit ZArchiver öffnen:</strong> Tippe auf die Datei und wähle ZArchiver aus den Optionen.</li><li><strong>Datei umbenennen:</strong> Halte die Datei in ZArchiver lange gedrückt, wähle Umbenennen, und entferne die <code>.zip</code>-Endung, sodass der Dateiname mit <code>.mcpack</code> endet.</li><li><strong>In Minecraft importieren:</strong> Tippe einmal auf die umbenannte Datei, tippe auf das Pfeil-Symbol neben „Ansehen", und wähle dann Minecraft, um das Spiel automatisch zu importieren und zu starten.</li></ol><p>Sobald Minecraft geladen ist, aktiviere Glacier Client in deinen <strong>Globale Ressourcen</strong>-Einstellungen.</p>',

        'faqq.bypass-linkvertise': 'Wie umgehe ich Linkvertise zum Herunterladen?',
        'faqa.bypass-linkvertise': '<ol><li>Gehe zum Download-Kanal in unserem Discord-Server und klicke auf den Link deiner gewählten Version.</li><li>Scrolle auf der Linkvertise-Seite nach unten und klicke auf <strong>„Get Glacier Client"</strong>.</li><li>Ein „Access Options"-Popup erscheint warte auf den Countdown (normalerweise 10 Sekunden).</li><li>Sobald der Timer null erreicht, wird der Button aktiv. Klicke darauf, um zur Download-Seite weitergeleitet zu werden.</li><li>Klicke auf den blauen <strong>„Download"</strong>-Button, um die <code>.mcpack</code>-Datei zu speichern.</li></ol>',

        'faqq.configure-client': 'Wie konfiguriere ich Glacier Client?',
        'faqa.configure-client': '<p>Du kannst <code>config.json</code> direkt bearbeiten oder den Online-Konfigurationseditor unter <a href="https://config.glacierclient.xyz/" target="_blank" rel="noopener">config.glacierclient.xyz</a> verwenden.</p><p><strong>Empfohlene Editoren:</strong></p><ul><li><strong>Android:</strong> MT Manager oder QuickEdit</li><li><strong>iOS:</strong> Documents von Readdle</li><li><strong>PC:</strong> VS Code oder Notepad++</li></ul><p><strong>config.json auf Mobile finden (Android &amp; iOS):</strong></p><ol><li>Öffne die Dateien-App deines Geräts.</li><li>Navigiere zu: <code>Android/data/com.mojang.minecraftpe/files/games/com.mojang/resource_packs/</code></li><li>Öffne den Ordner <code>Glacier</code> und suche <code>config.json</code>.</li></ol><p><strong>config.json unter Windows finden:</strong></p><ol><li>Drücke <kbd>Win + R</kbd> und füge ein: <code>%userprofile%\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\resource_packs</code></li><li>Für GDK-Nutzer: <code>%userprofile%\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang\\resource_packs</code></li><li>Öffne den Ordner <code>Glacier</code> und suche <code>config.json</code>.</li></ol><p><strong>Werttypen:</strong> Schalter verwenden <code>true</code>/<code>false</code> · Deckkraft verwendet <code>0.0</code>&ndash;<code>1.0</code> · Offset (X, Y) passt die Position der HUD-Elemente an.</p><p><strong>Video-Tutorials:</strong> <a href="https://youtu.be/RrTHx6V-zp4" target="_blank" rel="noopener">Android / ChromeOS</a> · <a href="https://youtu.be/oaQCtVdNUXg" target="_blank" rel="noopener">iPadOS / iOS</a></p>',

        'faqq.reimport-after-update': 'Muss ich Glacier Client nach jedem Update erneut importieren?',
        'faqa.reimport-after-update': '<p>Ja, Resource Packs werden aktualisiert, indem die Datei ersetzt wird, nicht durch Patches an Ort und Stelle. Lade die neue Version herunter, importiere sie genauso wie zuvor, und aktiviere sie erneut in Globale Ressourcen. Deine <code>config.json</code>-Einstellungen werden separat gespeichert und sind von der erneuten Installation nicht betroffen, sodass deine Anpassungen automatisch erhalten bleiben.</p>',

        'faqq.use-with-other-packs': 'Kann ich Glacier Client zusammen mit anderen Resource Packs verwenden?',
        'faqa.use-with-other-packs': '<p>Ja, solange das andere Pack nicht dieselben UI-Dateien bearbeitet. Platziere Glacier Client für die besten Ergebnisse ganz oben in deinem Stapel der Globalen Ressourcen. Siehe <strong>Warum funktioniert Glacier Client nicht richtig?</strong> weiter unten für eine Liste häufiger Konflikte.</p>',

        'faqq.uninstall': 'Wie deinstalliere ich Glacier Client?',
        'faqa.uninstall': '<ol><li>Öffne Minecraft und gehe zu den <strong>Einstellungen → Globale Ressourcen</strong> einer Welt (oder den eigenen Resource-Pack-Einstellungen einer Welt).</li><li>Finde <strong>Glacier Client</strong> in der Liste Aktiv und verschiebe es zurück zu Meine Packs, oder entferne es vollständig.</li><li>Um die Dateien vollständig zu entfernen, lösche das <strong>Glacier</strong>-Pack aus deinem <code>resource_packs</code>-Ordner (siehe die Konfigurationsanleitung oben für den Ordnerpfad auf deiner Plattform).</li></ol><p>Die Deinstallation wirkt sich in keiner Weise auf deine Minecraft-Welten, Spielstände oder dein Konto aus.</p>',

        'faqq.not-working-correctly': 'Warum funktioniert Glacier Client nicht richtig?',
        'faqa.not-working-correctly': '<p>Die häufigsten Ursachen sind widersprüchliche Packs oder Serverbeschränkungen:</p><ul><li><strong>Widersprüchliche Packs:</strong> Jedes Pack oder Add-on, das <code>player.entity.json</code> (z. B. Actions &amp; Stuff) oder <code>hud_screen.json</code> (z. B. Better Bedrock) verändert, steht im Konflikt mit Glacier Client. Deaktiviere zuerst diese Packs.</li><li><strong>Serverseitige Beschränkungen:</strong> Manche Server blockieren benutzerdefinierte UI-Überschreibungen vollständig, was auf Minecraft-Event-Servern üblich ist. Glaciers Funktionen erscheinen auf diesen Servern nicht, und das kann nicht von unserer Seite gelöst werden.</li></ul>',

        'faqq.mod-menu-not-appearing': 'Der Mod-Menü-Button erscheint nicht. Was soll ich tun?',
        'faqa.mod-menu-not-appearing': '<ol><li>Bestätige, dass Glacier Client in Globale Ressourcen <strong>über</strong> anderen Resource Packs steht und tatsächlich aktiv ist (nicht nur installiert).</li><li>Schließe Minecraft vollständig und öffne es erneut, dies aktualisiert die geladenen Resource Packs.</li><li>Prüfe auf ein widersprüchliches Pack, wie oben unter <strong>Warum funktioniert Glacier Client nicht richtig?</strong> beschrieben.</li><li>Erscheint es weiterhin nicht, frage im bug-reports-Kanal auf Discord mit deinem Gerätemodell und deiner Minecraft-Version.</li></ol>',

        'faqq.settings-reset': 'Meine Einstellungen werden nach einem Update zurückgesetzt. Warum?',
        'faqa.settings-reset': '<p>Dies passiert normalerweise, wenn <code>config.json</code> beim Import gelöscht oder überschrieben wird, zum Beispiel wenn du die neue Version in einen neuen Ordner statt an Ort und Stelle entpackt hast. Sichere deine <code>config.json</code> vor dem Update, wenn du dein Setup stark angepasst hast, und füge sie danach wieder in den Ordner der neuen Version ein.</p>',

        'faqq.safe-to-use': 'Ist Glacier Client sicher, und kann es zu einer Sperre führen?',
        'faqa.safe-to-use': '<p>Glacier Client ist ein Resource Pack, es verändert Texturen und UI, es injiziert keinen Code, verändert keine Spiellogik und gewährt keine Spielvorteile wie Reichweite, Zielhilfe oder automatisierten Kampf. Es funktioniert innerhalb des offiziellen Resource-Pack-Systems von Minecraft Bedrock.</p><ul><li><strong>Vanilla und Realms:</strong> Sicher zu verwenden. Resource Packs sind eine unterstützte, clientseitige Funktion von Minecraft Bedrock.</li><li><strong>Drittanbieter-Server:</strong> Manche Server verbieten in ihren eigenen Regeln ausdrücklich jegliche benutzerdefinierten Resource Packs, auch kosmetische. Prüfe immer die Regeln eines Servers, bevor du mit einer modifizierten UI beitrittst.</li></ul><p>Wir verbreiten keine Cheat-Clients, und wir unterstützen oder befürworten nicht die Nutzung von Glacier Client zur Verletzung der Nutzungsbedingungen eines Servers.</p>',

        'faqq.compatible-devices': 'Welche Geräte und Versionen sind kompatibel?',
        'faqa.compatible-devices': '<p>Glacier Client unterstützt alle Geräte, auf denen die <strong>offizielle Version</strong> von Minecraft Bedrock Edition läuft.</p><ul><li><strong>Previews / Betas:</strong> Der Client kann auf Preview-Builds funktionieren, aber Stabilität ist nicht garantiert, da Mojang häufig den zentralen UI-Code in Preview-Versionen ändert.</li><li><strong>Konsole (Xbox &amp; PlayStation):</strong> Unterstützt über die Realms-Methode. Installiere zuerst auf Mobile oder PC, aktiviere es auf einem Realm, lade es dann auf deiner Konsole über Realm-Einstellungen → Resource Packs → Herunterladen herunter, und aktiviere es unter Globale Ressourcen.</li></ul><p><a href="https://www.youtube.com/watch?v=1f7P9J-W8aM" target="_blank" rel="noopener">Schau dir das Konsolen-Installationstutorial an →</a></p>',

        'faqq.boost-fps': 'Verbessert Glacier Client die FPS?',
        'faqa.boost-fps': '<p>Glacier Client ist für <strong>Nützlichkeit und Anpassung</strong> konzipiert, nicht als FPS-Booster.</p><ul><li>Minecraft Bedrock ist bereits eine hochoptimierte Engine.</li><li>Die meisten „FPS-Booster"-Packs verbessern die Leistung nicht wirklich. Sie fügen oft zusätzlichen Verarbeitungsaufwand hinzu, ohne die tatsächliche Engine-Last zu reduzieren, was die FPS sogar <em>senken</em> kann.</li><li>Viele solcher online gefundenen Packs sind Clickbait, das auf Aufrufe statt auf echte technische Verbesserung ausgelegt ist.</li></ul><p>Glacier konzentriert sich darauf, ein stabiles, hochwertiges Erlebnis mit Funktionen zu bieten, die das Gameplay wirklich verbessern.</p>',

        'faqq.impossible-features': 'Welche Funktionen sind unmöglich oder nicht geplant?',
        'faqa.impossible-features': '<p><strong>Technisch unmöglich</strong> aufgrund von Engine-Beschränkungen:</p><ul><li><strong>HUD:</strong> Rüstungshaltbarkeit im HUD, genaue CPS/Combo-Zähler, Reichweitenzähler, Quick Drop im HUD.</li><li><strong>Visuals:</strong> Full Bright, Motion Blur, kein Schadenscam, Item-Physik, Shader.</li><li><strong>Tools:</strong> Minikarten, Keystrokes, Replay Mod, Shulker-Vorschauen, Kreisdiagramme, Namensschilder in der 3rd-Person.</li><li><strong>Automatisierung:</strong> Auto GG, Auto Totem, Autosprint, Ducken umschalten, Sprinten umschalten.</li><li><strong>Systeme:</strong> Freundeslisten, Voice Mod, Resource-Pack-Umschalter im Spiel.</li></ul><p><strong>Nicht geplant:</strong></p><ul><li>Zoom, ESP, Ansichtsmodals, 3D-Spielermodelle, jede Form von Cheats oder Hacks, benutzerdefinierte Texturen für die allgemeine GUI (ausgenommen Hotbar und EXP-Leiste).</li></ul>',

        'faqq.works-with-shaders': 'Funktioniert Glacier Client mit Shadern oder anderen visuellen Mods?',
        'faqa.works-with-shaders': '<p>Glacier Client bearbeitet nur UI- und HUD-Dateien, es berührt weder Beleuchtung noch Rendering, daher ist es im Allgemeinen mit Shader-Packs und anderen rein visuellen Add-ons kompatibel. Konflikte entstehen nur bei Packs, die dieselben HUD/Menü-Dateien bearbeiten, die Glacier verwendet; siehe die Kompatibilitätshinweise oben.</p>',

        'faqq.java-dll-version': 'Gibt es eine Version für Minecraft Java Edition oder einen nativen DLL-Client?',
        'faqa.java-dll-version': '<p>Beide befinden sich in aktiver Entwicklung. Verfolge den Fortschritt und Release-Ankündigungen auf der <a href="/downloads" data-section="downloads">Downloads</a>-Seite und unserem Discord-Server, sie erscheinen dort, sobald ein Build fertig ist.</p>',

        'faqq.report-bugs': 'Wie melde ich Fehler oder schlage Funktionen vor?',
        'faqa.report-bugs': '<p>Wir schätzen das Feedback der Community. Bitte folge diesem Prozess:</p><ol><li><strong>Bestehende Meldungen prüfen:</strong> Durchsuche den bug-reports-Kanal auf Discord, um zu sehen, ob das Problem bereits gemeldet wurde.</li><li><strong>Details angeben:</strong> Füge dein <strong>Gerätemodell</strong> und ein <strong>Video oder Screenshot</strong> des Problems hinzu.</li><li><strong>Vorschläge einreichen:</strong> Poste neue Ideen im suggestions-Kanal. Prüfe die „Unmöglich"-Liste in den FAQ, bevor du postest, um sicherzustellen, dass deine Idee technisch umsetzbar ist.</li></ol>',

        'faqq.review-content': 'Darf ich Inhalte über Glacier Client rezensieren oder erstellen?',
        'faqa.review-content': '<p>Ja, sofern du diese Regeln befolgst. Verstöße können zu einer Server-Sperre oder Verwarnung führen:</p><ul><li><strong>Nur offizielle Links:</strong> Verlinke immer auf unsere <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">offizielle Discord-Einladung</a>, niemals Mediafire oder andere Drittanbieter-Mirrors.</li><li><strong>Keine Fehlinformationen:</strong> Verbreite keine falschen Behauptungen und beteilige dich nicht an verleumderischen Aktivitäten.</li><li><strong>Kein Asset-Diebstahl:</strong> Verbreite Pack-Inhalte nicht öffentlich ohne ausdrückliche Erlaubnis.</li><li><strong>Namensnennung erforderlich:</strong> Wenn du unsere Methode zum Speichern verschiebbarer Mods verwendest, musst du Glacier Client nennen und unseren Server-Link angeben. Unbefugte Nutzung führt zu rechtlichen Schritten und einer DMCA-Löschung.</li><li><strong>Private Nutzung erlaubt:</strong> Du darfst Code oder Inhalte in deinen eigenen privaten, nicht öffentlichen Packs verwenden.</li></ul><p>Die vollständigen Bedingungen findest du in unserer <a href="/license" data-section="license">Lizenz</a> und den <a href="/tos" data-section="tos">Nutzungsbedingungen</a>.</p>',

        'faqq.watch-in-action': 'Wo kann ich Glacier Client in Aktion sehen?',
        'faqa.watch-in-action': '<p>Siehe unseren Bereich <a href="/community" data-section="community">Showcases</a> für handverlesene Community-Videos, oder suche „Glacier Client" auf YouTube nach den neuesten unabhängigen Rezensionen und Tutorials aus der Minecraft-Bedrock-Community.</p>',

        'faqq.get-involved': 'Wie kann ich mich über Fehlermeldungen hinaus beteiligen?',
        'faqa.get-involved': '<p>Tritt unserem Discord bei und stelle dich vor. Wir suchen regelmäßig Community-Mitglieder zur Unterstützung bei Übersetzungen, dem Testen von Vorab-Builds und der Moderation des Servers. Ankündigungen für diese Rollen werden auf Discord veröffentlicht, sobald sie offen sind.</p>',

        'faqq.data-collected': 'Welche Informationen sammelt Glacier Client über mich?',
        'faqa.data-collected': '<p>Sehr wenige. Deine Konfigurationsentscheidungen werden lokal auf deinem eigenen Gerät gespeichert und niemals an uns gesendet. Die Website erfasst nur anonyme, aggregierte Download-Zahlen, um die Beliebtheit von Versionen anzuzeigen, keine persönlichen Daten sind mit dieser Zahl verknüpft.</p><p>Vollständige Details findest du in unserer <a href="/privacy" data-section="privacy">Datenschutzerklärung</a>.</p>',

        'faqq.donations-refundable': 'Sind Spenden erstattungsfähig, und was unterstützen sie?',
        'faqa.donations-refundable': '<p>Über PayPal oder Ko-fi getätigte Spenden sind freiwillig und finanzieren direkt die laufende Entwicklung, Hosting-Kosten und neue Funktionen. Sie sind keine Zahlungen für ein Produkt oder Abonnement und generell nicht erstattungsfähig, außer wenn dies gesetzlich oder durch die Richtlinien der Zahlungsplattform selbst vorgeschrieben ist.</p><p>Siehe unsere <a href="/tos" data-section="tos">Nutzungsbedingungen</a> für vollständige Details.</p>',

        'faqq.who-owns-client': 'Wem gehört Glacier Client, und darf ich es weiterverbreiten?',
        'faqa.who-owns-client': '<p>Glacier Client und seine Assets sind Eigentum von Glacier Productions. Weiterverbreitung, Rebranding oder Weiterverkauf des Packs ohne Erlaubnis ist nicht gestattet. Siehe unsere <a href="/license" data-section="license">Lizenz</a> für die vollständigen Bedingungen zur erlaubten und verbotenen Nutzung.</p>'
    },

    es: {
        'faq.allQuestions': 'Todas las preguntas',
        'dl.loadingLauncher': 'Cargando lanzamientos del launcher...',
        'mods.countOf': '{shown} de {total} mods',
        'dl.tagLatest': 'Más reciente',
        'dl.tagArchived': 'Archivado',
        'dl.downloadsWord': 'descargas',
        'dl.changelogLabel': 'Registro de cambios',
        'dl.extOne': '{n} extensión compatible',
        'dl.extMany': '{n} extensiones compatibles',
        'dl.noLauncherReleases': 'No se encontraron lanzamientos del launcher.',
        'dl.failedLoadLauncher': 'No se pudieron cargar los lanzamientos del launcher.',
        'dl.viewOnGithub': 'Ver en GitHub',
        'dl.alsoAvailableOn': 'También disponible en',
        'dl.mirrorPending': 'Aún no actualizado al último hotfix',
        'update.available': 'Hay una nueva versión de este sitio disponible.',
        'update.refresh': 'Actualizar',
        'update.dismiss': 'Descartar',

        'toast.announcement': 'Anuncio',
        'toast.available': '¡Glacier {version} ya está disponible!',
        'toast.dismiss': 'Descartar anuncio',
        'donate.toastTitle': 'Apoya a Glacier',
        'donate.toastText': 'Glacier es gratis para siempre. Una pequeña donación ayuda a que siga siéndolo.',
        'donate.dismiss': 'Descartar aviso de donación',

        'changelog.v6.2.title': 'Corrección del HUD y más: Restaura la compatibilidad con Minecraft Bedrock v26.30.',
        'changelog.v6.2.note0': 'Corregidos errores al activar el resource pack en MCBE v26.30.',
        'changelog.v6.2.note1': 'Corregidos elementos del HUD que no se renderizaban o funcionaban correctamente.',
        'changelog.v6.2.note2': 'Corregido que el Menú de Mods no se abriera tras la activación.',
        'changelog.v6.2.note3': 'Restaurada la funcionalidad completa del HUD y la compatibilidad con la última actualización de Minecraft.',
        'changelog.v6.2.note4': 'Corregido un error con el modelo de mano en servidores multiplataforma Java x Bedrock.',
        'changelog.v6.2.note5': 'Corregidos problemas con texturas faltantes.',

        'license.title': 'Licencia de Glacier Client',
        'license.prohibited': 'Uso Prohibido',
        'license.permitted.body': '<li><strong>Reseñas y creación de contenido:</strong> Puedes crear vídeos, streams o reseñas escritas con Glacier Client, siempre que enlaces únicamente a nuestra <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">invitación oficial de Discord</a>. No se permiten enlaces a Mediafire u otros espejos no oficiales de terceros.</li><li><strong>Modificación privada:</strong> Puedes modificar y usar el código o contenido de Glacier Client dentro de tus propios resource packs privados y no públicos para uso personal.</li>',
        'license.prohibited.body': '<li><strong>Desinformación:</strong> Está prohibido difundir afirmaciones falsas o participar en conductas difamatorias contra Glacier Client o sus desarrolladores.</li><li><strong>Redistribución:</strong> Está estrictamente prohibido distribuir públicamente los assets o el código de Glacier Client, en forma original o modificada, sin permiso previo por escrito.</li><li><strong>Uso sin atribución:</strong> Está prohibido incorporar los sistemas propietarios de Glacier Client, como el método de guardado de mods arrastrables, en otro proyecto público sin la atribución requerida a continuación.</li>',
        'license.attribution': 'Requisitos de Atribución',
        'license.attribution.body': 'Cualquier proyecto público que incorpore los sistemas propietarios de Glacier Client, incluido el método de guardado de mods arrastrables, debe acreditar claramente a Glacier Client e incluir un enlace a nuestro servidor oficial de Discord. El incumplimiento constituye una violación de esta licencia y puede resultar en <strong style="color:var(--red);">acción legal</strong> y una solicitud de retirada DMCA contra el proyecto infractor.',
        'license.ownership': 'Propiedad',
        'license.ownership.body': 'Glacier Client, incluyendo su código fuente, texturas, assets de UI, marca, y los nombres "Glacier Client" y "Glacier Productions", es propiedad intelectual de Glacier Productions. Esta licencia te otorga un derecho limitado y revocable a usar el cliente como se describe anteriormente; no te transfiere la propiedad de ningún asset o código subyacente.',
        'license.thirdParty': 'Assets de Terceros',
        'license.thirdParty.body': 'Glacier Client es un resource pack independiente creado para Minecraft Bedrock Edition y no está afiliado con, respaldado por, ni patrocinado por Mojang Studios o Microsoft. Minecraft es una marca registrada de Mojang Synergies AB. Cualquier biblioteca o asset de terceros incluido con Glacier Client sigue siendo propiedad de sus respectivos dueños y se usa bajo sus propias licencias aplicables.',
        'license.warranty': 'Sin Garantía & Terminación',
        'license.warranty.body': 'Glacier Client se proporciona <strong>"tal cual"</strong> sin garantía de ningún tipo, expresa o implícita. Nos reservamos el derecho de revocar los derechos otorgados bajo esta licencia, a nuestra discreción, a cualquier individuo o proyecto que se encuentre en violación de estos términos.',

        'tos.s1': '1. Aceptación de los Términos',
        'tos.s1.body': 'Al descargar, instalar o usar Glacier Client, o al unirte a nuestro servidor de Discord, aceptas quedar vinculado por estos Términos de Servicio y nuestra <a href="/privacy" data-section="privacy">Política de Privacidad</a>. Si no estás de acuerdo, no uses Glacier Client ni sus servicios asociados.',
        'tos.s2': '2. Naturaleza del Servicio',
        'tos.s2.body': 'Glacier Client es un resource pack gratuito, desarrollado por la comunidad, y un launcher complementario para Minecraft Bedrock Edition. Se proporciona para uso personal y no comercial, y no modifica la lógica del juego de Minecraft, no otorga ventajas injustas en multijugador, ni interactúa con servidores de formas prohibidas por el Acuerdo de Licencia de Usuario Final de Mojang.',
        'tos.s3': '3. Uso Aceptable',
        'tos.s3.body': '<li>Debes tener la edad suficiente para usar Discord y Minecraft según sus respectivos términos de servicio, o tener el consentimiento parental para hacerlo.</li><li>No usarás Glacier Client ni nuestro servidor de Discord para acosar a otros, distribuir malware, o violar cualquier ley aplicable.</li><li>No intentarás revender, cambiar la marca, ni tergiversar Glacier Client como tu propio trabajo.</li><li>El uso de Glacier Client también está sujeto a la <a href="/license" data-section="license">Licencia de Glacier Client</a>, que rige la redistribución y la atribución.</li>',
        'tos.s4': '4. Descargas y Enlaces de Terceros',
        'tos.s4.body': 'Algunos enlaces de descarga se enrutan a través de servicios de terceros (como Linkvertise) para ayudar a financiar el desarrollo. No controlamos el contenido de estas páginas intermediarias y no somos responsables de los anuncios o contenido mostrados en ellas. Descarga siempre Glacier Client a través de enlaces publicados en nuestro servidor oficial de Discord o en este sitio web.',
        'tos.s5': '5. Renuncia de Garantía y Responsabilidad',
        'tos.s5.body': 'Glacier Client se proporciona <strong>"tal cual"</strong> sin garantías de ningún tipo. No garantizamos un funcionamiento ininterrumpido, compatibilidad con todos los dispositivos o servidores, ni que el cliente esté libre de errores. En la máxima medida permitida por la ley, Glacier Productions no es responsable de ningún daño indirecto, incidental o consecuente derivado de tu uso de Glacier Client, incluyendo, entre otros, restricciones de cuenta impuestas por terceros como Mojang, Microsoft, o servidores individuales de Minecraft.',
        'tos.s6': '6. Donaciones',
        'tos.s6.body': 'Las donaciones realizadas a través de PayPal o Ko-fi son contribuciones voluntarias para apoyar el desarrollo continuo y no compran ningún bien, servicio, función o derecho. Las donaciones generalmente no son reembolsables, excepto cuando lo exija la ley o la política de la plataforma.',
        'tos.s7': '7. Cambios a Estos Términos',
        'tos.s7.body': 'Podemos actualizar estos Términos de Servicio periódicamente para reflejar cambios en el proyecto o en la ley aplicable. El uso continuado de Glacier Client después de la publicación de cambios constituye la aceptación de los términos revisados. Los cambios importantes se anunciarán en nuestro servidor de Discord.',
        'tos.s8': '8. Contacto',
        'tos.s8.body': 'Las preguntas sobre estos términos pueden dirigirse a nuestro equipo a través del <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">servidor oficial de Discord</a>.',

        'privacy.s1': 'Información que Recopilamos',
        'privacy.s1.body': '<li><strong>Configuración del cliente:</strong> Glacier Client almacena tus preferencias (interruptores, opacidad, posiciones del HUD) localmente en <code>config.json</code> en tu propio dispositivo. Estos datos nunca salen de tu dispositivo y no se nos transmiten.</li><li><strong>Preferencias del sitio web:</strong> Este sitio web almacena una preferencia de tema (claro/oscuro) en el almacenamiento local de tu navegador para recordar tu elección entre visitas.</li><li><strong>Recuentos agregados de descargas:</strong> Cuando descargas una versión del cliente, un contador anónimo se incrementa a través de nuestro Cloudflare Worker para que podamos mostrar totales aproximados de descargas. No se recopila información personal ni identificativa del dispositivo como parte de este recuento.</li><li><strong>Actividad en Discord:</strong> Si te unes a nuestro servidor de Discord, tus interacciones allí se rigen por la <a href="https://discord.com/privacy" target="_blank" rel="noopener">Política de Privacidad propia de Discord</a>, no esta.</li>',
        'privacy.s2': 'Cómo Usamos la Información',
        'privacy.s2.body': 'Cualquier dato descrito anteriormente se usa únicamente para operar y mejorar Glacier Client y este sitio web, por ejemplo, para rastrear la popularidad agregada de descargas entre versiones. No vendemos, alquilamos ni compartimos tu información con terceros con fines de marketing.',
        'privacy.s3': 'Servicios de Terceros',
        'privacy.s3.body': 'Este sitio web depende de un pequeño número de servicios de terceros para funcionar, incluyendo Cloudflare (alojamiento y contadores de descargas), Discord (widget de comunidad e invitaciones), y Linkvertise (enlaces de descarga monetizados). Estos servicios pueden recopilar independientemente datos, como la dirección IP, bajo sus propias políticas de privacidad, que te recomendamos revisar.',
        'privacy.s4': 'Cookies y Almacenamiento Local',
        'privacy.s4.body': 'Usamos el almacenamiento local del navegador, no cookies de rastreo, para recordar tu preferencia de tema. No usamos cookies de publicidad ni de rastreo entre sitios en glacierclient.xyz. Los servicios de terceros incrustados en este sitio, como Linkvertise, pueden establecer sus propias cookies según se describe en sus respectivas políticas.',
        'privacy.s5': 'Privacidad de los Menores',
        'privacy.s5.body': 'Glacier Client no está dirigido a menores por debajo de la edad requerida por los propios términos de servicio de Discord y Minecraft. No recopilamos conscientemente información personal de menores por debajo de esa edad.',
        'privacy.s6': 'Cambios a Esta Política',
        'privacy.s6.body': 'Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas o por razones legales. Los cambios importantes se anunciarán en nuestro servidor de Discord, y la fecha de "Última actualización" anterior se revisará en consecuencia.',
        'privacy.s7': 'Contacto',
        'privacy.s7.body': 'Para preguntas o solicitudes relacionadas con la privacidad, contáctanos a través de nuestro <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">servidor oficial de Discord</a>.',

        'faqcat.Getting Started': 'Primeros Pasos',
        'faqcat.Installation & Setup': 'Instalación y Configuración',
        'faqcat.Troubleshooting': 'Solución de Problemas',
        'faqcat.Features & Compatibility': 'Funciones y Compatibilidad',
        'faqcat.Community & Content': 'Comunidad y Contenido',
        'faqcat.Legal & Privacy': 'Legal y Privacidad',

        'faqq.what-is-glacier': '¿Qué es Glacier Client?',
        'faqa.what-is-glacier': '<p>Glacier Client es un resource pack gratuito para Minecraft Bedrock Edition que añade un HUD personalizable, un menú de mods arrastrable con más de 37 módulos, y funciones de calidad de vida, sin modificar la lógica del juego ni dar a los jugadores una ventaja injusta. Se instala como cualquier otro resource pack y funciona en Móvil, PC y Consola.</p>',

        'faqq.is-free': '¿Es gratis Glacier Client?',
        'faqa.is-free': '<p>Sí. Glacier Client es gratis y siempre lo será. Algunos enlaces de descarga se enrutan a través de Linkvertise para ayudar a financiar el desarrollo y los costos de hosting, pero el cliente en sí nunca se vende ni se limita tras un muro de pago. Si quieres apoyar el desarrollo directamente, visita nuestra página de <a href="/donate" data-section="donate">Donar</a>.</p>',

        'faqq.open-mod-menu': '¿Cómo abro el Menú de Mods?',
        'faqa.open-mod-menu': '<ol><li>Abre el <strong>Menú de Pausa</strong> mientras estás en el juego.</li><li>Localiza el botón de <strong>Icono de Cuadrícula</strong> en la esquina inferior izquierda de tu pantalla.</li><li><strong>Haz doble clic</strong> en este botón para alternar el Menú de Mods.</li></ol>',

        'faqq.see-everything': '¿Dónde puedo ver todo lo que Glacier Client puede hacer?',
        'faqa.see-everything': '<p>Consulta la página de <a href="/features" data-section="features">Funciones</a> para una visión general, la página de <a href="/mods" data-section="mods">Todos los Mods</a> para la lista completa de módulos, y la <a href="/gallery" data-section="gallery">Galería</a> y <a href="/community" data-section="community">Vídeos de la comunidad</a> para capturas de pantalla y tutoriales en vídeo de la comunidad.</p>',

        'faqq.import-client': '¿Cómo importo Glacier Client?',
        'faqa.import-client': '<ol><li><strong>Localiza el archivo:</strong> Encuentra el archivo <code>.zip</code> descargado de Glacier Client en tu dispositivo.</li><li><strong>Abre con ZArchiver:</strong> Toca el archivo y selecciona ZArchiver entre las opciones.</li><li><strong>Renombra el archivo:</strong> Mantén pulsado el archivo dentro de ZArchiver, selecciona Renombrar, y elimina la extensión <code>.zip</code> para que el nombre del archivo termine en <code>.mcpack</code>.</li><li><strong>Importa a Minecraft:</strong> Toca el archivo renombrado una vez, toca el icono de flecha junto a "Ver", y luego selecciona Minecraft para importar y abrir el juego automáticamente.</li></ol><p>Una vez que Minecraft cargue, activa Glacier Client en tu configuración de <strong>Recursos globales</strong>.</p>',

        'faqq.bypass-linkvertise': '¿Cómo evito Linkvertise para descargar?',
        'faqa.bypass-linkvertise': '<ol><li>Ve al canal de descargas en nuestro servidor de Discord y haz clic en el enlace de la versión elegida.</li><li>En la página de Linkvertise, desplázate hacia abajo y haz clic en <strong>"Get Glacier Client"</strong>.</li><li>Aparece una ventana emergente de "Access Options" espera a la cuenta regresiva (normalmente 10 segundos).</li><li>Cuando el temporizador llegue a cero, el botón se activará. Haz clic para ser redirigido a la página de descarga.</li><li>Haz clic en el botón azul <strong>"Download"</strong> para guardar el archivo <code>.mcpack</code>.</li></ol>',

        'faqq.configure-client': '¿Cómo configuro Glacier Client?',
        'faqa.configure-client': '<p>Puedes editar <code>config.json</code> directamente o usar el Editor de Configuración en línea en <a href="https://config.glacierclient.xyz/" target="_blank" rel="noopener">config.glacierclient.xyz</a>.</p><p><strong>Editores recomendados:</strong></p><ul><li><strong>Android:</strong> MT Manager o QuickEdit</li><li><strong>iOS:</strong> Documents de Readdle</li><li><strong>PC:</strong> VS Code o Notepad++</li></ul><p><strong>Encontrar config.json en móvil (Android e iOS):</strong></p><ol><li>Abre la app de Archivos de tu dispositivo.</li><li>Navega a: <code>Android/data/com.mojang.minecraftpe/files/games/com.mojang/resource_packs/</code></li><li>Abre la carpeta <code>Glacier</code> y localiza <code>config.json</code>.</li></ol><p><strong>Encontrar config.json en Windows:</strong></p><ol><li>Pulsa <kbd>Win + R</kbd> y pega: <code>%userprofile%\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\resource_packs</code></li><li>Para usuarios de GDK: <code>%userprofile%\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang\\resource_packs</code></li><li>Abre la carpeta <code>Glacier</code> y localiza <code>config.json</code>.</li></ol><p><strong>Tipos de valores:</strong> Los interruptores usan <code>true</code>/<code>false</code> · La opacidad usa <code>0.0</code>&ndash;<code>1.0</code> · El desplazamiento (X, Y) ajusta la posición de los elementos del HUD.</p><p><strong>Tutoriales en vídeo:</strong> <a href="https://youtu.be/RrTHx6V-zp4" target="_blank" rel="noopener">Android / ChromeOS</a> · <a href="https://youtu.be/oaQCtVdNUXg" target="_blank" rel="noopener">iPadOS / iOS</a></p>',

        'faqq.reimport-after-update': '¿Necesito volver a importar Glacier Client después de cada actualización?',
        'faqa.reimport-after-update': '<p>Sí, los resource packs se actualizan reemplazando el archivo, no aplicando parches. Descarga la nueva versión, impórtala de la misma manera que antes, y vuelve a activarla en Recursos Globales. Tu configuración de <code>config.json</code> se almacena por separado y no se ve afectada al reimportar, por lo que tu personalización se mantiene automáticamente.</p>',

        'faqq.use-with-other-packs': '¿Puedo usar Glacier Client junto con otros resource packs?',
        'faqa.use-with-other-packs': '<p>Sí, siempre que el otro pack no edite los mismos archivos de UI. Coloca Glacier Client en la parte superior de tu pila de Recursos Globales para obtener los mejores resultados. Consulta <strong>¿Por qué Glacier Client no funciona correctamente?</strong> más abajo para ver una lista de conflictos comunes.</p>',

        'faqq.uninstall': '¿Cómo desinstalo Glacier Client?',
        'faqa.uninstall': '<ol><li>Abre Minecraft y ve a <strong>Configuración → Recursos Globales</strong> de un mundo (o la configuración de resource packs propia de un mundo).</li><li>Encuentra <strong>Glacier Client</strong> en la lista Activos y muévelo de vuelta a Mis Packs, o elimínalo por completo.</li><li>Para eliminar completamente los archivos, borra el pack <strong>Glacier</strong> de tu carpeta <code>resource_packs</code> (consulta la guía de configuración anterior para la ruta de la carpeta en tu plataforma).</li></ol><p>Desinstalar no afecta a tus mundos, partidas guardadas o cuenta de Minecraft de ninguna manera.</p>',

        'faqq.not-working-correctly': '¿Por qué Glacier Client no funciona correctamente?',
        'faqa.not-working-correctly': '<p>Las causas más comunes son packs en conflicto o restricciones del servidor:</p><ul><li><strong>Packs en conflicto:</strong> Cualquier pack o add-on que modifique <code>player.entity.json</code> (p. ej., Actions &amp; Stuff) o <code>hud_screen.json</code> (p. ej., Better Bedrock) entrará en conflicto con Glacier Client. Desactiva esos packs primero.</li><li><strong>Restricciones del lado del servidor:</strong> Algunos servidores bloquean completamente las sobrescrituras de UI personalizadas, algo común en servidores de eventos de Minecraft. Las funciones de Glacier no aparecerán en esos servidores, y esto no se puede resolver de nuestro lado.</li></ul>',

        'faqq.mod-menu-not-appearing': 'El botón del Menú de Mods no aparece. ¿Qué hago?',
        'faqa.mod-menu-not-appearing': '<ol><li>Confirma que Glacier Client esté <strong>por encima</strong> de otros resource packs en Recursos Globales, y que esté realmente activo (no solo instalado).</li><li>Cierra completamente y vuelve a abrir Minecraft, esto actualiza los resource packs cargados.</li><li>Comprueba si hay un pack en conflicto, como se describe en <strong>¿Por qué Glacier Client no funciona correctamente?</strong> más arriba.</li><li>Si sigue sin aparecer, pregunta en el canal de reportes de errores en Discord con el modelo de tu dispositivo y la versión de Minecraft.</li></ol>',

        'faqq.settings-reset': 'Mi configuración se reinicia después de una actualización. ¿Por qué?',
        'faqa.settings-reset': '<p>Esto suele ocurrir cuando <code>config.json</code> se elimina o se sobrescribe durante la importación, por ejemplo, si extrajiste la nueva versión en una carpeta nueva en lugar de actualizar en el mismo lugar. Haz una copia de seguridad de tu <code>config.json</code> antes de actualizar si has personalizado mucho tu configuración, y luego pégala de nuevo en la carpeta de la nueva versión después.</p>',

        'faqq.safe-to-use': '¿Es seguro usar Glacier Client, y puede hacer que me baneen?',
        'faqa.safe-to-use': '<p>Glacier Client es un resource pack, cambia texturas y la UI, no inyecta código, no modifica la lógica del juego ni otorga ventajas de juego como alcance, asistencia de puntería o combate automatizado. Funciona dentro del sistema oficial de resource packs de Minecraft Bedrock.</p><ul><li><strong>Vanilla y Realms:</strong> Seguro de usar. Los resource packs son una función del lado del cliente compatible y soportada de Minecraft Bedrock.</li><li><strong>Servidores de terceros:</strong> Algunos servidores prohíben explícitamente cualquier resource pack personalizado, incluidos los cosméticos, en sus propias reglas. Comprueba siempre las reglas de un servidor antes de unirte con cualquier UI modificada.</li></ul><p>No distribuimos clientes de trampas, y no apoyamos ni respaldamos el uso de Glacier Client para violar los términos de servicio de un servidor.</p>',

        'faqq.compatible-devices': '¿Qué dispositivos y versiones son compatibles?',
        'faqa.compatible-devices': '<p>Glacier Client es compatible con todos los dispositivos que ejecutan la <strong>versión Oficial</strong> de Minecraft Bedrock Edition.</p><ul><li><strong>Previews / Betas:</strong> El cliente puede funcionar en compilaciones Preview, pero la estabilidad no está garantizada, ya que Mojang cambia con frecuencia el código central de la UI en las versiones Preview.</li><li><strong>Consola (Xbox y PlayStation):</strong> Compatible mediante el método de Realms. Instálalo primero en Móvil o PC, actívalo en un Realm, luego descárgalo en tu consola a través de Configuración del Realm → Resource Packs → Descargar, y actívalo en Recursos Globales.</li></ul><p><a href="https://www.youtube.com/watch?v=1f7P9J-W8aM" target="_blank" rel="noopener">Mira el tutorial de instalación en consola →</a></p>',

        'faqq.boost-fps': '¿Glacier Client mejora los FPS?',
        'faqa.boost-fps': '<p>Glacier Client está diseñado para <strong>utilidad y personalización</strong>, no como un potenciador de FPS.</p><ul><li>Minecraft Bedrock ya es un motor altamente optimizado.</li><li>La mayoría de los packs "potenciadores de FPS" no mejoran realmente el rendimiento. A menudo añaden sobrecarga de procesamiento adicional sin reducir la carga real del motor, lo que puede <em>disminuir</em> los FPS.</li><li>Muchos de estos packs encontrados en línea son clickbait diseñados para conseguir visitas en lugar de una mejora técnica genuina.</li></ul><p>Glacier se centra en ofrecer una experiencia estable y de alta calidad con funciones que realmente mejoran el juego.</p>',

        'faqq.impossible-features': '¿Qué funciones son imposibles o no están planeadas?',
        'faqa.impossible-features': '<p><strong>Técnicamente imposibles</strong> debido a limitaciones del motor:</p><ul><li><strong>HUD:</strong> Durabilidad de la armadura en el HUD, contadores precisos de CPS/Combo, contadores de alcance, Quick Drop en el HUD.</li><li><strong>Visuales:</strong> Full Bright, Motion Blur, sin cámara de daño, física de objetos, shaders.</li><li><strong>Herramientas:</strong> Minimapas, Keystrokes, Replay Mod, vistas previas de shulkers, gráficos circulares, etiquetas de nombre en tercera persona.</li><li><strong>Automatización:</strong> Auto GG, Auto Totem, Autosprint, alternar agacharse, alternar correr.</li><li><strong>Sistemas:</strong> Listas de amigos, mod de voz, cambiadores de resource pack dentro del juego.</li></ul><p><strong>No planeadas:</strong></p><ul><li>Zoom, ESP, modales de vista, modelos de jugador 3D, cualquier forma de trampas o hacks, texturas personalizadas para la UI general (excluyendo la barra de acceso rápido y la barra de experiencia).</li></ul>',

        'faqq.works-with-shaders': '¿Glacier Client funciona con shaders u otros mods visuales?',
        'faqa.works-with-shaders': '<p>Glacier Client solo edita archivos de UI y HUD, no toca la iluminación ni el renderizado, por lo que generalmente es compatible con packs de shaders y otros complementos puramente visuales. Los conflictos solo surgen con packs que editan los mismos archivos de HUD/menú que usa Glacier; consulta las notas de compatibilidad anteriores.</p>',

        'faqq.java-dll-version': '¿Hay una versión para Minecraft Java Edition o un cliente DLL nativo?',
        'faqa.java-dll-version': '<p>Ambos están en desarrollo activo. Sigue el progreso y los anuncios de lanzamiento en la página de <a href="/downloads" data-section="downloads">Descargas</a> y en nuestro servidor de Discord, aparecerán allí en cuanto una compilación esté lista.</p>',

        'faqq.report-bugs': '¿Cómo reporto errores o sugiero funciones?',
        'faqa.report-bugs': '<p>Valoramos la opinión de la comunidad. Sigue este proceso:</p><ol><li><strong>Revisa los reportes existentes:</strong> Navega por el canal de reportes de errores en Discord para ver si el problema ya ha sido registrado.</li><li><strong>Proporciona detalles:</strong> Incluye el <strong>modelo de tu dispositivo</strong> y un <strong>vídeo o captura de pantalla</strong> del problema.</li><li><strong>Envía sugerencias:</strong> Publica nuevas ideas en el canal de sugerencias. Consulta la lista de "Imposibles" en las FAQ antes de publicar para asegurarte de que tu idea sea técnicamente viable.</li></ol>',

        'faqq.review-content': '¿Puedo reseñar o crear contenido con Glacier Client?',
        'faqa.review-content': '<p>Sí, siempre que sigas estas reglas. Violarlas puede resultar en una expulsión del servidor o una amonestación:</p><ul><li><strong>Solo enlaces oficiales:</strong> Enlaza siempre a nuestra <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">invitación oficial de Discord</a>, nunca a Mediafire u otros espejos de terceros.</li><li><strong>Sin desinformación:</strong> No difundas afirmaciones falsas ni participes en actividades difamatorias.</li><li><strong>Sin robo de assets:</strong> No distribuyas públicamente el contenido del pack sin permiso explícito.</li><li><strong>Atribución requerida:</strong> Si usas nuestro método de guardado de mods arrastrables, debes acreditar a Glacier Client e incluir el enlace de nuestro servidor. El uso no autorizado resultará en acción legal y una retirada DMCA.</li><li><strong>Uso privado permitido:</strong> Puedes usar código o contenido en tus propios packs privados y no públicos.</li></ul><p>Los términos completos están disponibles en nuestra <a href="/license" data-section="license">Licencia</a> y <a href="/tos" data-section="tos">Términos de Servicio</a>.</p>',

        'faqq.watch-in-action': '¿Dónde puedo ver Glacier Client en acción?',
        'faqa.watch-in-action': '<p>Consulta nuestra sección de <a href="/community" data-section="community">Vídeos de la comunidad</a> para ver vídeos seleccionados de la comunidad, o busca "Glacier Client" en YouTube para las últimas reseñas y tutoriales independientes de la comunidad de Minecraft Bedrock.</p>',

        'faqq.get-involved': '¿Cómo puedo involucrarme más allá de reportar errores?',
        'faqa.get-involved': '<p>Únete a nuestro Discord y preséntate. Regularmente buscamos miembros de la comunidad para ayudar con traducciones, pruebas de compilaciones pre-lanzamiento y moderación del servidor. Los anuncios para estos roles se publican en Discord cuando están disponibles.</p>',

        'faqq.data-collected': '¿Qué información recopila Glacier Client sobre mí?',
        'faqa.data-collected': '<p>Muy poca. Tus opciones de configuración se almacenan localmente en tu propio dispositivo y nunca se nos envían. El sitio web solo rastrea recuentos de descargas anónimos y agregados para mostrar la popularidad de las versiones, no se adjuntan datos personales a ese recuento.</p><p>Los detalles completos están disponibles en nuestra <a href="/privacy" data-section="privacy">Política de Privacidad</a>.</p>',

        'faqq.donations-refundable': '¿Son reembolsables las donaciones, y qué apoyan?',
        'faqa.donations-refundable': '<p>Las donaciones realizadas a través de PayPal o Ko-fi son voluntarias y financian directamente el desarrollo continuo, los costos de hosting y las nuevas funciones. No son pagos por un producto o suscripción y generalmente no son reembolsables, excepto cuando lo exija la ley o la propia política de la plataforma de pago.</p><p>Consulta nuestros <a href="/tos" data-section="tos">Términos de Servicio</a> para más detalles.</p>',

        'faqq.who-owns-client': '¿Quién es dueño de Glacier Client, y puedo redistribuirlo?',
        'faqa.who-owns-client': '<p>Glacier Client y sus assets son propiedad de Glacier Productions. No se permite la redistribución, el cambio de marca o la reventa del pack sin permiso. Consulta nuestra <a href="/license" data-section="license">Licencia</a> para conocer los términos completos sobre el uso permitido y prohibido.</p>'
    },

    fr: {
        'faq.allQuestions': 'Toutes les questions',
        'dl.loadingLauncher': 'Chargement des versions du launcher...',
        'mods.countOf': '{shown} sur {total} mods',
        'dl.tagLatest': 'Dernière',
        'dl.tagArchived': 'Archivée',
        'dl.downloadsWord': 'téléchargements',
        'dl.changelogLabel': 'Journal des modifications',
        'dl.extOne': '{n} extension compatible',
        'dl.extMany': '{n} extensions compatibles',
        'dl.noLauncherReleases': 'Aucune version du launcher trouvée.',
        'dl.failedLoadLauncher': 'Échec du chargement des versions du launcher.',
        'dl.viewOnGithub': 'Voir sur GitHub',
        'dl.alsoAvailableOn': 'Également disponible sur',
        'dl.mirrorPending': 'Pas encore mis à jour avec le dernier correctif',
        'update.available': 'Une nouvelle version de ce site est disponible.',
        'update.refresh': 'Actualiser',
        'update.dismiss': 'Ignorer',

        'toast.announcement': 'Annonce',
        'toast.available': 'Glacier {version} est maintenant disponible !',
        'toast.dismiss': 'Ignorer l\'annonce',
        'donate.toastTitle': 'Soutenir Glacier',
        'donate.toastText': 'Glacier est gratuit pour toujours. Un petit don aide à le maintenir ainsi.',
        'donate.dismiss': 'Ignorer l\'invite de don',

        'changelog.v6.2.title': 'Correctif HUD et plus : Restaure la compatibilité avec Minecraft Bedrock v26.30.',
        'changelog.v6.2.note0': 'Correction d\'erreurs lors de l\'activation du pack de ressources sur MCBE v26.30.',
        'changelog.v6.2.note1': 'Correction d\'éléments du HUD qui ne s\'affichaient pas ou ne fonctionnaient pas correctement.',
        'changelog.v6.2.note2': 'Correction du Menu des Mods qui ne s\'ouvrait pas après activation.',
        'changelog.v6.2.note3': 'Rétablissement de la fonctionnalité complète du HUD et de la compatibilité avec la dernière mise à jour de Minecraft.',
        'changelog.v6.2.note4': 'Correction d\'une erreur avec le modèle de main sur les serveurs multiplateformes Java x Bedrock.',
        'changelog.v6.2.note5': 'Correction de problèmes de textures manquantes.',

        'license.title': 'Licence Glacier Client',
        'license.prohibited': 'Utilisation Interdite',
        'license.permitted.body': '<li><strong>Critiques et création de contenu :</strong> Vous pouvez créer des vidéos, des streams ou des critiques écrites mettant en vedette Glacier Client, à condition de ne lier que vers notre <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">invitation Discord officielle</a>. Les liens vers Mediafire ou d\'autres miroirs tiers non officiels ne sont pas autorisés.</li><li><strong>Modification privée :</strong> Vous pouvez modifier et utiliser le code ou le contenu de Glacier Client dans vos propres packs de ressources privés et non publics pour un usage personnel.</li>',
        'license.prohibited.body': '<li><strong>Désinformation :</strong> Il est interdit de répandre de fausses affirmations ou de se livrer à des actes diffamatoires envers Glacier Client ou ses développeurs.</li><li><strong>Redistribution :</strong> Il est strictement interdit de distribuer publiquement les assets ou le code de Glacier Client, sous forme originale ou modifiée, sans autorisation écrite préalable.</li><li><strong>Utilisation sans attribution :</strong> Il est interdit d\'intégrer les systèmes propriétaires de Glacier Client, tels que la méthode de sauvegarde des mods déplaçables, dans un autre projet public sans l\'attribution requise ci-dessous.</li>',
        'license.attribution': 'Exigences d\'Attribution',
        'license.attribution.body': 'Tout projet public qui intègre les systèmes propriétaires de Glacier Client, y compris la méthode de sauvegarde des mods déplaçables, doit clairement créditer Glacier Client et inclure un lien vers notre serveur Discord officiel. Le non-respect de cette règle constitue une violation de cette licence et peut entraîner une <strong style="color:var(--red);">action en justice</strong> et une demande de retrait DMCA contre le projet contrevenant.',
        'license.ownership': 'Propriété',
        'license.ownership.body': 'Glacier Client, y compris son code source, ses textures, ses assets d\'interface, son image de marque, et les noms « Glacier Client » et « Glacier Productions », est la propriété intellectuelle de Glacier Productions. Cette licence vous accorde un droit limité et révocable d\'utiliser le client comme décrit ci-dessus ; elle ne vous transfère pas la propriété des assets ou du code sous-jacents.',
        'license.thirdParty': 'Assets de Tiers',
        'license.thirdParty.body': 'Glacier Client est un pack de ressources indépendant conçu pour Minecraft Bedrock Edition et n\'est ni affilié à, ni approuvé par, ni sponsorisé par Mojang Studios ou Microsoft. Minecraft est une marque déposée de Mojang Synergies AB. Toute bibliothèque ou asset tiers intégré à Glacier Client reste la propriété de ses détenteurs respectifs et est utilisé sous leurs propres licences applicables.',
        'license.warranty': 'Aucune Garantie & Résiliation',
        'license.warranty.body': 'Glacier Client est fourni <strong>« tel quel »</strong> sans garantie d\'aucune sorte, expresse ou implicite. Nous nous réservons le droit de révoquer les droits accordés en vertu de cette licence, à notre discrétion, à toute personne ou tout projet reconnu en violation de ces conditions.',

        'tos.s1': '1. Acceptation des Conditions',
        'tos.s1.body': 'En téléchargeant, installant ou utilisant Glacier Client, ou en rejoignant notre serveur Discord, vous acceptez d\'être lié par ces Conditions de Service et notre <a href="/privacy" data-section="privacy">Politique de Confidentialité</a>. Si vous n\'êtes pas d\'accord, n\'utilisez pas Glacier Client ou ses services associés.',
        'tos.s2': '2. Nature du Service',
        'tos.s2.body': 'Glacier Client est un pack de ressources gratuit, développé par la communauté, et un launcher compagnon pour Minecraft Bedrock Edition. Il est fourni pour un usage personnel et non commercial et ne modifie pas la logique du jeu de Minecraft, n\'accorde pas d\'avantages multijoueurs injustes, et n\'interagit pas avec les serveurs de manières interdites par le Contrat de Licence Utilisateur Final de Mojang.',
        'tos.s3': '3. Utilisation Acceptable',
        'tos.s3.body': '<li>Vous devez avoir l\'âge requis pour utiliser Discord et Minecraft selon leurs conditions de service respectives, ou avoir le consentement parental pour le faire.</li><li>Vous n\'utiliserez pas Glacier Client ou notre serveur Discord pour harceler autrui, distribuer des logiciels malveillants, ou enfreindre toute loi applicable.</li><li>Vous ne tenterez pas de revendre, rebrander ou présenter à tort Glacier Client comme votre propre travail.</li><li>L\'utilisation de Glacier Client est également soumise à la <a href="/license" data-section="license">Licence Glacier Client</a>, qui régit la redistribution et l\'attribution.</li>',
        'tos.s4': '4. Téléchargements et Liens de Tiers',
        'tos.s4.body': 'Certains liens de téléchargement passent par des services tiers (comme Linkvertise) pour aider à financer le développement. Nous ne contrôlons pas le contenu de ces pages intermédiaires et ne sommes pas responsables des publicités ou du contenu qui y est affiché. Téléchargez toujours Glacier Client via des liens publiés sur notre serveur Discord officiel ou sur ce site web.',
        'tos.s5': '5. Exclusion de Garantie et de Responsabilité',
        'tos.s5.body': 'Glacier Client est fourni <strong>« tel quel »</strong> sans garanties d\'aucune sorte. Nous ne garantissons pas un fonctionnement ininterrompu, une compatibilité avec tous les appareils ou serveurs, ni que le client sera exempt de bugs. Dans toute la mesure permise par la loi, Glacier Productions n\'est pas responsable des dommages indirects, accessoires ou consécutifs découlant de votre utilisation de Glacier Client, y compris, sans s\'y limiter, les restrictions de compte imposées par des tiers tels que Mojang, Microsoft, ou des serveurs Minecraft individuels.',
        'tos.s6': '6. Dons',
        'tos.s6.body': 'Les dons effectués via PayPal ou Ko-fi sont des contributions volontaires pour soutenir le développement continu et n\'achètent aucun bien, service, fonctionnalité ou droit. Les dons ne sont généralement pas remboursables, sauf lorsque la loi ou la politique de la plateforme l\'exige.',
        'tos.s7': '7. Modifications de Ces Conditions',
        'tos.s7.body': 'Nous pouvons mettre à jour ces Conditions de Service de temps à autre pour refléter des changements dans le projet ou la loi applicable. L\'utilisation continue de Glacier Client après la publication de modifications constitue l\'acceptation des conditions révisées. Les changements importants seront annoncés sur notre serveur Discord.',
        'tos.s8': '8. Contact',
        'tos.s8.body': 'Les questions concernant ces conditions peuvent être adressées à notre équipe via l\'<a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">serveur Discord officiel</a>.',

        'privacy.s1': 'Informations que Nous Collectons',
        'privacy.s1.body': '<li><strong>Configuration du client :</strong> Glacier Client stocke vos préférences (bascules, opacité, positions du HUD) localement dans <code>config.json</code> sur votre propre appareil. Ces données ne quittent jamais votre appareil et ne nous sont pas transmises.</li><li><strong>Préférences du site web :</strong> Ce site web stocke une préférence de thème (clair/sombre) dans le stockage local de votre navigateur pour se souvenir de votre choix entre les visites.</li><li><strong>Comptes de téléchargement agrégés :</strong> Lorsque vous téléchargez une version du client, un compteur anonyme est incrémenté via notre Cloudflare Worker afin que nous puissions afficher des totaux de téléchargement approximatifs. Aucune information personnelle ou identifiant l\'appareil n\'est collectée dans le cadre de ce comptage.</li><li><strong>Activité Discord :</strong> Si vous rejoignez notre serveur Discord, vos interactions y sont régies par la <a href="https://discord.com/privacy" target="_blank" rel="noopener">Politique de Confidentialité propre à Discord</a>, pas celle-ci.</li>',
        'privacy.s2': 'Comment Nous Utilisons les Informations',
        'privacy.s2.body': 'Toutes les données décrites ci-dessus sont utilisées uniquement pour exploiter et améliorer Glacier Client et ce site web, par exemple pour suivre la popularité agrégée des téléchargements entre les versions. Nous ne vendons, ne louons ni ne partageons vos informations avec des tiers à des fins marketing.',
        'privacy.s3': 'Services de Tiers',
        'privacy.s3.body': 'Ce site web s\'appuie sur un petit nombre de services tiers pour fonctionner, notamment Cloudflare (hébergement et compteurs de téléchargement), Discord (widget communautaire et invitations), et Linkvertise (liens de téléchargement monétisés). Ces services peuvent collecter indépendamment des données, telles que l\'adresse IP, selon leurs propres politiques de confidentialité, que nous vous encourageons à consulter.',
        'privacy.s4': 'Cookies & Stockage Local',
        'privacy.s4.body': 'Nous utilisons le stockage local du navigateur, et non des cookies de suivi, pour mémoriser votre préférence de thème. Nous n\'utilisons pas de cookies publicitaires ou de suivi intersites sur glacierclient.xyz. Les services tiers intégrés à ce site, comme Linkvertise, peuvent définir leurs propres cookies comme décrit dans leurs politiques respectives.',
        'privacy.s5': 'Confidentialité des Mineurs',
        'privacy.s5.body': 'Glacier Client ne s\'adresse pas aux enfants n\'ayant pas l\'âge requis par les conditions de service propres à Discord et Minecraft. Nous ne collectons pas sciemment d\'informations personnelles auprès d\'enfants n\'ayant pas cet âge.',
        'privacy.s6': 'Modifications de Cette Politique',
        'privacy.s6.body': 'Nous pouvons mettre à jour périodiquement cette Politique de Confidentialité pour refléter des changements dans nos pratiques ou pour des raisons légales. Les changements importants seront annoncés sur notre serveur Discord, et la date de « Dernière mise à jour » ci-dessus sera révisée en conséquence.',
        'privacy.s7': 'Contact',
        'privacy.s7.body': 'Pour toute question ou demande liée à la confidentialité, contactez-nous via notre <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">serveur Discord officiel</a>.',

        'faqcat.Getting Started': 'Premiers Pas',
        'faqcat.Installation & Setup': 'Installation et Configuration',
        'faqcat.Troubleshooting': 'Dépannage',
        'faqcat.Features & Compatibility': 'Fonctionnalités et Compatibilité',
        'faqcat.Community & Content': 'Communauté et Contenu',
        'faqcat.Legal & Privacy': 'Mentions Légales et Confidentialité',

        'faqq.what-is-glacier': 'Qu\'est-ce que Glacier Client ?',
        'faqa.what-is-glacier': '<p>Glacier Client est un pack de ressources gratuit pour Minecraft Bedrock Edition qui ajoute un HUD personnalisable, un menu de mods déplaçable avec plus de 37 modules, et des fonctionnalités de confort, sans modifier la logique du jeu ni donner aux joueurs un avantage injuste. Il s\'installe comme n\'importe quel autre pack de ressources et fonctionne sur Mobile, PC et Console.</p>',

        'faqq.is-free': 'Glacier Client est-il gratuit ?',
        'faqa.is-free': '<p>Oui. Glacier Client est gratuit et le restera toujours. Certains liens de téléchargement passent par Linkvertise pour aider à financer le développement et les coûts d\'hébergement, mais le client lui-même n\'est jamais vendu ni restreint derrière un mur payant. Si vous souhaitez soutenir directement le développement, consultez notre page <a href="/donate" data-section="donate">Faire un don</a>.</p>',

        'faqq.open-mod-menu': 'Comment ouvrir le Menu des Mods ?',
        'faqa.open-mod-menu': '<ol><li>Ouvrez le <strong>Menu Pause</strong> en jeu.</li><li>Repérez le bouton <strong>Icône de Grille</strong> dans le coin inférieur gauche de votre écran.</li><li><strong>Double-cliquez</strong> sur ce bouton pour basculer le Menu des Mods.</li></ol>',

        'faqq.see-everything': 'Où puis-je voir tout ce que Glacier Client peut faire ?',
        'faqa.see-everything': '<p>Consultez la page <a href="/features" data-section="features">Fonctionnalités</a> pour un aperçu, la page <a href="/mods" data-section="mods">Tous les Mods</a> pour la liste complète des modules, et la <a href="/gallery" data-section="gallery">Galerie</a> ainsi que les <a href="/community" data-section="community">Showcases</a> pour des captures d\'écran et des tutoriels vidéo de la communauté.</p>',

        'faqq.import-client': 'Comment importer Glacier Client ?',
        'faqa.import-client': '<ol><li><strong>Localisez le fichier :</strong> Trouvez le fichier <code>.zip</code> téléchargé de Glacier Client sur votre appareil.</li><li><strong>Ouvrez avec ZArchiver :</strong> Appuyez sur le fichier et sélectionnez ZArchiver parmi les options.</li><li><strong>Renommez le fichier :</strong> Appui long sur le fichier dans ZArchiver, sélectionnez Renommer, et retirez l\'extension <code>.zip</code> pour que le nom de fichier se termine par <code>.mcpack</code>.</li><li><strong>Importez dans Minecraft :</strong> Appuyez une fois sur le fichier renommé, appuyez sur l\'icône de flèche à côté de « Voir », puis sélectionnez Minecraft pour importer et lancer automatiquement le jeu.</li></ol><p>Une fois Minecraft chargé, activez Glacier Client dans vos paramètres <strong>Ressources globales</strong>.</p>',

        'faqq.bypass-linkvertise': 'Comment contourner Linkvertise pour télécharger ?',
        'faqa.bypass-linkvertise': '<ol><li>Allez dans le canal de téléchargements sur notre serveur Discord et cliquez sur le lien de la version choisie.</li><li>Sur la page Linkvertise, faites défiler vers le bas et cliquez sur <strong>« Get Glacier Client »</strong>.</li><li>Une fenêtre « Access Options » apparaît attendez le compte à rebours (généralement 10 secondes).</li><li>Une fois le minuteur à zéro, le bouton devient actif. Cliquez dessus pour être redirigé vers la page de téléchargement.</li><li>Cliquez sur le bouton bleu <strong>« Download »</strong> pour enregistrer le fichier <code>.mcpack</code>.</li></ol>',

        'faqq.configure-client': 'Comment configurer Glacier Client ?',
        'faqa.configure-client': '<p>Vous pouvez modifier <code>config.json</code> directement, ou utiliser l\'Éditeur de Configuration en ligne sur <a href="https://config.glacierclient.xyz/" target="_blank" rel="noopener">config.glacierclient.xyz</a>.</p><p><strong>Éditeurs recommandés :</strong></p><ul><li><strong>Android :</strong> MT Manager ou QuickEdit</li><li><strong>iOS :</strong> Documents by Readdle</li><li><strong>PC :</strong> VS Code ou Notepad++</li></ul><p><strong>Trouver config.json sur mobile (Android &amp; iOS) :</strong></p><ol><li>Ouvrez l\'application Fichiers de votre appareil.</li><li>Naviguez vers : <code>Android/data/com.mojang.minecraftpe/files/games/com.mojang/resource_packs/</code></li><li>Ouvrez le dossier <code>Glacier</code> et repérez <code>config.json</code>.</li></ol><p><strong>Trouver config.json sous Windows :</strong></p><ol><li>Appuyez sur <kbd>Win + R</kbd> et collez : <code>%userprofile%\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\resource_packs</code></li><li>Pour les utilisateurs GDK : <code>%userprofile%\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang\\resource_packs</code></li><li>Ouvrez le dossier <code>Glacier</code> et repérez <code>config.json</code>.</li></ol><p><strong>Types de valeurs :</strong> Les bascules utilisent <code>true</code>/<code>false</code> · L\'opacité utilise <code>0.0</code>&ndash;<code>1.0</code> · Le décalage (X, Y) ajuste la position des éléments du HUD.</p><p><strong>Tutoriels vidéo :</strong> <a href="https://youtu.be/RrTHx6V-zp4" target="_blank" rel="noopener">Android / ChromeOS</a> · <a href="https://youtu.be/oaQCtVdNUXg" target="_blank" rel="noopener">iPadOS / iOS</a></p>',

        'faqq.reimport-after-update': 'Dois-je réimporter Glacier Client après chaque mise à jour ?',
        'faqa.reimport-after-update': '<p>Oui, les packs de ressources se mettent à jour en remplaçant le fichier, pas en appliquant un correctif sur place. Téléchargez la nouvelle version, importez-la de la même manière qu\'avant, et réactivez-la dans Ressources Globales. Vos paramètres <code>config.json</code> sont stockés séparément et ne sont pas affectés par la réimportation, donc votre personnalisation est conservée automatiquement.</p>',

        'faqq.use-with-other-packs': 'Puis-je utiliser Glacier Client avec d\'autres packs de ressources ?',
        'faqa.use-with-other-packs': '<p>Oui, tant que l\'autre pack ne modifie pas les mêmes fichiers d\'interface. Placez Glacier Client en haut de votre pile de Ressources Globales pour de meilleurs résultats. Consultez <strong>Pourquoi Glacier Client ne fonctionne-t-il pas correctement ?</strong> ci-dessous pour une liste des conflits courants.</p>',

        'faqq.uninstall': 'Comment désinstaller Glacier Client ?',
        'faqa.uninstall': '<ol><li>Ouvrez Minecraft et allez dans <strong>Paramètres → Ressources Globales</strong> d\'un monde (ou les paramètres de packs de ressources propres à un monde).</li><li>Trouvez <strong>Glacier Client</strong> dans la liste Actifs et remettez-le dans Mes Packs, ou supprimez-le entièrement.</li><li>Pour supprimer complètement les fichiers, supprimez le pack <strong>Glacier</strong> de votre dossier <code>resource_packs</code> (voir le guide de configuration ci-dessus pour le chemin du dossier sur votre plateforme).</li></ol><p>La désinstallation n\'affecte en rien vos mondes Minecraft, sauvegardes ou compte.</p>',

        'faqq.not-working-correctly': 'Pourquoi Glacier Client ne fonctionne-t-il pas correctement ?',
        'faqa.not-working-correctly': '<p>Les causes les plus courantes sont les packs en conflit ou les restrictions du serveur :</p><ul><li><strong>Packs en conflit :</strong> Tout pack ou add-on qui modifie <code>player.entity.json</code> (par ex., Actions &amp; Stuff) ou <code>hud_screen.json</code> (par ex., Better Bedrock) entrera en conflit avec Glacier Client. Désactivez d\'abord ces packs.</li><li><strong>Restrictions côté serveur :</strong> Certains serveurs bloquent entièrement les surcharges d\'interface personnalisées, ce qui est courant sur les serveurs d\'événements Minecraft. Les fonctionnalités de Glacier n\'apparaîtront pas sur ces serveurs, et cela ne peut pas être résolu de notre côté.</li></ul>',

        'faqq.mod-menu-not-appearing': 'Le bouton du Menu des Mods n\'apparaît pas. Que faire ?',
        'faqa.mod-menu-not-appearing': '<ol><li>Confirmez que Glacier Client est <strong>au-dessus</strong> des autres packs de ressources dans Ressources Globales, et qu\'il est réellement actif (pas seulement installé).</li><li>Fermez complètement et rouvrez Minecraft, cela actualise les packs de ressources chargés.</li><li>Vérifiez s\'il y a un pack en conflit, comme décrit dans <strong>Pourquoi Glacier Client ne fonctionne-t-il pas correctement ?</strong> ci-dessus.</li><li>S\'il n\'apparaît toujours pas, demandez dans le canal de rapports de bugs sur Discord avec le modèle de votre appareil et la version de Minecraft.</li></ol>',

        'faqq.settings-reset': 'Mes paramètres se réinitialisent après une mise à jour. Pourquoi ?',
        'faqa.settings-reset': '<p>Cela arrive généralement lorsque <code>config.json</code> est supprimé ou écrasé pendant l\'importation, par exemple si vous avez extrait la nouvelle version dans un nouveau dossier au lieu de mettre à jour sur place. Sauvegardez votre <code>config.json</code> avant de mettre à jour si vous avez fortement personnalisé votre configuration, puis collez-le dans le dossier de la nouvelle version après coup.</p>',

        'faqq.safe-to-use': 'Glacier Client est-il sûr, et peut-il me faire bannir ?',
        'faqa.safe-to-use': '<p>Glacier Client est un pack de ressources, il modifie les textures et l\'interface, il n\'injecte pas de code, ne modifie pas la logique du jeu, et ne confère pas d\'avantages de jeu tels que la portée, l\'assistance de visée ou le combat automatisé. Il fonctionne dans le système officiel de packs de ressources de Minecraft Bedrock.</p><ul><li><strong>Vanilla et Realms :</strong> Sûr à utiliser. Les packs de ressources sont une fonctionnalité côté client prise en charge par Minecraft Bedrock.</li><li><strong>Serveurs tiers :</strong> Certains serveurs interdisent explicitement tout pack de ressources personnalisé, y compris cosmétique, dans leurs propres règles. Vérifiez toujours les règles d\'un serveur avant de le rejoindre avec une interface modifiée.</li></ul><p>Nous ne distribuons pas de clients de triche, et nous ne soutenons ni n\'approuvons l\'utilisation de Glacier Client pour enfreindre les conditions de service d\'un serveur.</p>',

        'faqq.compatible-devices': 'Quels appareils et versions sont compatibles ?',
        'faqa.compatible-devices': '<p>Glacier Client prend en charge tous les appareils exécutant la <strong>version Officielle</strong> de Minecraft Bedrock Edition.</p><ul><li><strong>Previews / Bêtas :</strong> Le client peut fonctionner sur les versions Preview, mais la stabilité n\'est pas garantie, car Mojang modifie fréquemment le code central de l\'interface dans les versions Preview.</li><li><strong>Console (Xbox et PlayStation) :</strong> Pris en charge via la méthode Realms. Installez d\'abord sur Mobile ou PC, activez-le sur un Realm, puis téléchargez-le sur votre console via Paramètres du Realm → Packs de Ressources → Télécharger, et activez-le dans Ressources Globales.</li></ul><p><a href="https://www.youtube.com/watch?v=1f7P9J-W8aM" target="_blank" rel="noopener">Regardez le tutoriel d\'installation console →</a></p>',

        'faqq.boost-fps': 'Glacier Client augmente-t-il les FPS ?',
        'faqa.boost-fps': '<p>Glacier Client est conçu pour l\'<strong>utilité et la personnalisation</strong>, pas comme un booster de FPS.</p><ul><li>Minecraft Bedrock est déjà un moteur hautement optimisé.</li><li>La plupart des packs « booster de FPS » n\'améliorent pas réellement les performances. Ils ajoutent souvent une surcharge de traitement supplémentaire sans réduire la charge réelle du moteur, ce qui peut <em>diminuer</em> les FPS.</li><li>Beaucoup de ces packs trouvés en ligne sont du clickbait conçu pour générer des vues plutôt qu\'une véritable amélioration technique.</li></ul><p>Glacier se concentre sur la fourniture d\'une expérience stable et de haute qualité avec des fonctionnalités qui améliorent véritablement le gameplay.</p>',

        'faqq.impossible-features': 'Quelles fonctionnalités sont impossibles ou non prévues ?',
        'faqa.impossible-features': '<p><strong>Techniquement impossibles</strong> en raison des limitations du moteur :</p><ul><li><strong>HUD :</strong> Durabilité de l\'armure sur le HUD, compteurs CPS/Combo précis, compteurs de portée, Quick Drop sur le HUD.</li><li><strong>Visuels :</strong> Full Bright, flou de mouvement, pas de caméra de dégâts, physique des objets, shaders.</li><li><strong>Outils :</strong> Minicartes, Keystrokes, Replay Mod, aperçus de shulkers, graphiques circulaires, étiquettes de nom en 3e personne.</li><li><strong>Automatisation :</strong> Auto GG, Auto Totem, Autosprint, bascule accroupi, bascule sprint.</li><li><strong>Systèmes :</strong> Listes d\'amis, mod vocal, changeurs de pack de ressources en jeu.</li></ul><p><strong>Non prévues :</strong></p><ul><li>Zoom, ESP, modales de vue, modèles de joueur 3D, toute forme de triche ou de hacks, textures personnalisées pour l\'interface générale (à l\'exclusion de la barre d\'accès rapide et de la barre d\'XP).</li></ul>',

        'faqq.works-with-shaders': 'Glacier Client fonctionne-t-il avec les shaders ou d\'autres mods visuels ?',
        'faqa.works-with-shaders': '<p>Glacier Client ne modifie que les fichiers d\'interface et de HUD, il ne touche pas à l\'éclairage ni au rendu, il est donc généralement compatible avec les packs de shaders et autres add-ons purement visuels. Les conflits ne surviennent qu\'avec les packs qui modifient les mêmes fichiers HUD/menu que Glacier utilise ; voir les notes de compatibilité ci-dessus.</p>',

        'faqq.java-dll-version': 'Existe-t-il une version pour Minecraft Java Edition ou un client DLL natif ?',
        'faqa.java-dll-version': '<p>Les deux sont en développement actif. Suivez les progrès et les annonces de sorties sur la page <a href="/downloads" data-section="downloads">Téléchargements</a> et notre serveur Discord, ils y apparaîtront dès qu\'une version sera prête.</p>',

        'faqq.report-bugs': 'Comment signaler des bugs ou suggérer des fonctionnalités ?',
        'faqa.report-bugs': '<p>Nous apprécions les retours de la communauté. Veuillez suivre ce processus :</p><ol><li><strong>Vérifiez les rapports existants :</strong> Parcourez le canal de rapports de bugs sur Discord pour voir si le problème a déjà été signalé.</li><li><strong>Fournissez des détails :</strong> Incluez le <strong>modèle de votre appareil</strong> et une <strong>vidéo ou capture d\'écran</strong> du problème.</li><li><strong>Soumettez des suggestions :</strong> Publiez de nouvelles idées dans le canal de suggestions. Consultez la liste « Impossible » dans la FAQ avant de publier pour vous assurer que votre idée est techniquement réalisable.</li></ol>',

        'faqq.review-content': 'Puis-je critiquer ou créer du contenu mettant en vedette Glacier Client ?',
        'faqa.review-content': '<p>Oui, à condition de suivre ces règles. Les enfreindre peut entraîner un bannissement ou un avertissement sur le serveur :</p><ul><li><strong>Liens officiels uniquement :</strong> Faites toujours un lien vers notre <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">invitation Discord officielle</a>, jamais vers Mediafire ou d\'autres miroirs tiers.</li><li><strong>Pas de désinformation :</strong> Ne répandez pas de fausses affirmations et ne participez pas à des activités diffamatoires.</li><li><strong>Pas de vol d\'assets :</strong> Ne distribuez pas publiquement le contenu du pack sans autorisation explicite.</li><li><strong>Attribution requise :</strong> Si vous utilisez notre méthode de sauvegarde des mods déplaçables, vous devez créditer Glacier Client et inclure le lien de notre serveur. Une utilisation non autorisée entraînera une action légale et un retrait DMCA.</li><li><strong>Usage privé autorisé :</strong> Vous pouvez utiliser le code ou le contenu dans vos propres packs privés et non publics.</li></ul><p>Les conditions complètes sont disponibles dans notre <a href="/license" data-section="license">Licence</a> et nos <a href="/tos" data-section="tos">Conditions de Service</a>.</p>',

        'faqq.watch-in-action': 'Où puis-je voir Glacier Client en action ?',
        'faqa.watch-in-action': '<p>Consultez notre section <a href="/community" data-section="community">Showcases</a> pour des vidéos communautaires sélectionnées, ou recherchez « Glacier Client » sur YouTube pour les dernières critiques et tutoriels indépendants de la communauté Minecraft Bedrock.</p>',

        'faqq.get-involved': 'Comment puis-je m\'impliquer au-delà du signalement de bugs ?',
        'faqa.get-involved': '<p>Rejoignez notre Discord et présentez-vous. Nous recherchons régulièrement des membres de la communauté pour aider aux traductions, tester les versions préliminaires et modérer le serveur. Les annonces pour ces rôles sont publiées sur Discord lorsqu\'ils sont ouverts.</p>',

        'faqq.data-collected': 'Quelles informations Glacier Client collecte-t-il à mon sujet ?',
        'faqa.data-collected': '<p>Très peu. Vos choix de configuration sont stockés localement sur votre propre appareil et ne nous sont jamais envoyés. Le site web ne suit que des comptes de téléchargement anonymes et agrégés pour afficher la popularité des versions, aucune donnée personnelle n\'est associée à ce compte.</p><p>Tous les détails sont disponibles dans notre <a href="/privacy" data-section="privacy">Politique de Confidentialité</a>.</p>',

        'faqq.donations-refundable': 'Les dons sont-ils remboursables, et que soutiennent-ils ?',
        'faqa.donations-refundable': '<p>Les dons effectués via PayPal ou Ko-fi sont volontaires et financent directement le développement continu, les coûts d\'hébergement et les nouvelles fonctionnalités. Ce ne sont pas des paiements pour un produit ou un abonnement et ils sont généralement non remboursables, sauf lorsque la loi ou la politique de la plateforme de paiement l\'exige.</p><p>Consultez nos <a href="/tos" data-section="tos">Conditions de Service</a> pour tous les détails.</p>',

        'faqq.who-owns-client': 'Qui possède Glacier Client, et puis-je le redistribuer ?',
        'faqa.who-owns-client': '<p>Glacier Client et ses assets sont la propriété de Glacier Productions. La redistribution, le rebranding ou la revente du pack sans permission ne sont pas autorisés. Consultez notre <a href="/license" data-section="license">Licence</a> pour les conditions complètes sur l\'utilisation autorisée et interdite.</p>'
    },

    it: {
        'faq.allQuestions': 'Tutte le domande',
        'dl.loadingLauncher': 'Caricamento delle release del launcher...',
        'mods.countOf': '{shown} di {total} mod',
        'dl.tagLatest': 'Più recente',
        'dl.tagArchived': 'Archiviata',
        'dl.downloadsWord': 'download',
        'dl.changelogLabel': 'Changelog',
        'dl.extOne': '{n} estensione compatibile',
        'dl.extMany': '{n} estensioni compatibili',
        'dl.noLauncherReleases': 'Nessuna release del launcher trovata.',
        'dl.failedLoadLauncher': 'Impossibile caricare le release del launcher.',
        'dl.viewOnGithub': 'Vedi su GitHub',
        'dl.alsoAvailableOn': 'Disponibile anche su',
        'dl.mirrorPending': 'Non ancora aggiornato all\'ultimo hotfix',
        'update.available': 'È disponibile una nuova versione di questo sito.',
        'update.refresh': 'Aggiorna',
        'update.dismiss': 'Ignora',

        'toast.announcement': 'Annuncio',
        'toast.available': 'Glacier {version} è ora disponibile!',
        'toast.dismiss': 'Ignora annuncio',
        'donate.toastTitle': 'Sostieni Glacier',
        'donate.toastText': 'Glacier è gratuito per sempre. Una piccola donazione aiuta a mantenerlo così.',
        'donate.dismiss': 'Ignora avviso di donazione',

        'changelog.v6.2.title': 'Hotfix HUD e altro: Ripristina la compatibilità con Minecraft Bedrock v26.30.',
        'changelog.v6.2.note0': 'Corretti errori durante l\'attivazione del resource pack su MCBE v26.30.',
        'changelog.v6.2.note1': 'Corretti elementi HUD che non venivano renderizzati o non funzionavano correttamente.',
        'changelog.v6.2.note2': 'Corretto il Menu Mod che non si apriva dopo l\'attivazione.',
        'changelog.v6.2.note3': 'Ripristinata la piena funzionalità dell\'HUD e la compatibilità con l\'ultimo aggiornamento di Minecraft.',
        'changelog.v6.2.note4': 'Corretto un errore con il modello della mano sui server crossplay Java x Bedrock.',
        'changelog.v6.2.note5': 'Corretti problemi con texture mancanti.',

        'license.title': 'Licenza di Glacier Client',
        'license.prohibited': 'Uso Vietato',
        'license.permitted.body': '<li><strong>Recensioni e creazione di contenuti:</strong> Puoi creare video, stream o recensioni scritte con Glacier Client, a condizione di collegarti solo al nostro <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">invito Discord ufficiale</a>. I link a Mediafire o altri mirror non ufficiali di terze parti non sono consentiti.</li><li><strong>Modifica privata:</strong> Puoi modificare e usare il codice o il contenuto di Glacier Client all\'interno dei tuoi resource pack privati e non pubblici per uso personale.</li>',
        'license.prohibited.body': '<li><strong>Disinformazione:</strong> È vietato diffondere affermazioni false o impegnarsi in condotte diffamatorie contro Glacier Client o i suoi sviluppatori.</li><li><strong>Redistribuzione:</strong> È severamente vietato distribuire pubblicamente gli asset o il codice di Glacier Client, in forma originale o modificata, senza previa autorizzazione scritta.</li><li><strong>Uso senza attribuzione:</strong> È vietato incorporare i sistemi proprietari di Glacier Client, come il metodo di salvataggio delle mod trascinabili, in un altro progetto pubblico senza l\'attribuzione richiesta di seguito.</li>',
        'license.attribution': 'Requisiti di Attribuzione',
        'license.attribution.body': 'Qualsiasi progetto pubblico che incorpori i sistemi proprietari di Glacier Client, incluso il metodo di salvataggio delle mod trascinabili, deve accreditare chiaramente Glacier Client e includere un link al nostro server Discord ufficiale. Il mancato rispetto costituisce una violazione di questa licenza e può comportare <strong style="color:var(--red);">azioni legali</strong> e una richiesta di rimozione DMCA contro il progetto in violazione.',
        'license.ownership': 'Proprietà',
        'license.ownership.body': 'Glacier Client, incluso il suo codice sorgente, texture, asset dell\'interfaccia, branding, e i nomi "Glacier Client" e "Glacier Productions", è proprietà intellettuale di Glacier Productions. Questa licenza ti concede un diritto limitato e revocabile di usare il client come descritto sopra; non ti trasferisce la proprietà di alcun asset o codice sottostante.',
        'license.thirdParty': 'Asset di Terze Parti',
        'license.thirdParty.body': 'Glacier Client è un resource pack indipendente creato per Minecraft Bedrock Edition e non è affiliato con, approvato da, né sponsorizzato da Mojang Studios o Microsoft. Minecraft è un marchio registrato di Mojang Synergies AB. Qualsiasi libreria o asset di terze parti incluso con Glacier Client rimane di proprietà dei rispettivi titolari ed è utilizzato secondo le loro licenze applicabili.',
        'license.warranty': 'Nessuna Garanzia & Cessazione',
        'license.warranty.body': 'Glacier Client viene fornito <strong>"così com\'è"</strong> senza garanzia di alcun tipo, esplicita o implicita. Ci riserviamo il diritto di revocare i diritti concessi in base a questa licenza, a nostra discrezione, a qualsiasi individuo o progetto ritenuto in violazione di questi termini.',

        'tos.s1': '1. Accettazione dei Termini',
        'tos.s1.body': 'Scaricando, installando o usando Glacier Client, o unendoti al nostro server Discord, accetti di essere vincolato da questi Termini di Servizio e dalla nostra <a href="/privacy" data-section="privacy">Informativa sulla Privacy</a>. Se non accetti, non usare Glacier Client o i suoi servizi associati.',
        'tos.s2': '2. Natura del Servizio',
        'tos.s2.body': 'Glacier Client è un resource pack gratuito, sviluppato dalla community, e un launcher compagno per Minecraft Bedrock Edition. È fornito per uso personale e non commerciale e non modifica la logica di gioco di Minecraft, non concede vantaggi multiplayer sleali, e non interagisce con i server in modi vietati dal Contratto di Licenza con l\'Utente Finale di Mojang.',
        'tos.s3': '3. Uso Accettabile',
        'tos.s3.body': '<li>Devi avere l\'età sufficiente per usare Discord e Minecraft secondo i rispettivi termini di servizio, o avere il consenso dei genitori per farlo.</li><li>Non userai Glacier Client o il nostro server Discord per molestare altri, distribuire malware, o violare qualsiasi legge applicabile.</li><li>Non tenterai di rivendere, rebrandizzare, o presentare falsamente Glacier Client come opera tua.</li><li>L\'uso di Glacier Client è inoltre soggetto alla <a href="/license" data-section="license">Licenza di Glacier Client</a>, che disciplina la redistribuzione e l\'attribuzione.</li>',
        'tos.s4': '4. Download e Link di Terze Parti',
        'tos.s4.body': 'Alcuni link di download passano attraverso servizi di terze parti (come Linkvertise) per aiutare a finanziare lo sviluppo. Non controlliamo il contenuto di queste pagine intermedie e non siamo responsabili per pubblicità o contenuti mostrati su di esse. Scarica sempre Glacier Client tramite link pubblicati sul nostro server Discord ufficiale o su questo sito web.',
        'tos.s5': '5. Esclusione di Garanzia e Responsabilità',
        'tos.s5.body': 'Glacier Client viene fornito <strong>"così com\'è"</strong> senza garanzie di alcun tipo. Non garantiamo un funzionamento ininterrotto, la compatibilità con ogni dispositivo o server, o che il client sia privo di bug. Nella misura massima consentita dalla legge, Glacier Productions non è responsabile per danni indiretti, incidentali o consequenziali derivanti dall\'uso di Glacier Client, incluse, a titolo esemplificativo, restrizioni sull\'account imposte da terze parti come Mojang, Microsoft, o singoli server Minecraft.',
        'tos.s6': '6. Donazioni',
        'tos.s6.body': 'Le donazioni effettuate tramite PayPal o Ko-fi sono contributi volontari a sostegno dello sviluppo continuo e non acquistano alcun bene, servizio, funzionalità o diritto. Le donazioni non sono generalmente rimborsabili, salvo quando richiesto dalla legge o dalla politica della piattaforma.',
        'tos.s7': '7. Modifiche a Questi Termini',
        'tos.s7.body': 'Potremmo aggiornare periodicamente questi Termini di Servizio per riflettere cambiamenti nel progetto o nella legge applicabile. L\'uso continuato di Glacier Client dopo la pubblicazione delle modifiche costituisce accettazione dei termini rivisti. Le modifiche sostanziali saranno annunciate sul nostro server Discord.',
        'tos.s8': '8. Contatti',
        'tos.s8.body': 'Le domande su questi termini possono essere indirizzate al nostro team tramite il <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">server Discord ufficiale</a>.',

        'privacy.s1': 'Informazioni che Raccogliamo',
        'privacy.s1.body': '<li><strong>Configurazione del client:</strong> Glacier Client memorizza le tue preferenze (interruttori, opacità, posizioni HUD) localmente in <code>config.json</code> sul tuo dispositivo. Questi dati non lasciano mai il tuo dispositivo e non ci vengono trasmessi.</li><li><strong>Preferenze del sito web:</strong> Questo sito web memorizza una preferenza del tema (chiaro/scuro) nell\'archiviazione locale del tuo browser per ricordare la tua scelta tra le visite.</li><li><strong>Conteggi aggregati dei download:</strong> Quando scarichi una versione del client, un contatore anonimo viene incrementato tramite il nostro Cloudflare Worker in modo da poter mostrare totali approssimativi dei download. Nessuna informazione personale o identificativa del dispositivo viene raccolta come parte di questo conteggio.</li><li><strong>Attività su Discord:</strong> Se ti unisci al nostro server Discord, le tue interazioni lì sono regolate dall\' <a href="https://discord.com/privacy" target="_blank" rel="noopener">Informativa sulla Privacy propria di Discord</a>, non da questa.</li>',
        'privacy.s2': 'Come Usiamo le Informazioni',
        'privacy.s2.body': 'Tutti i dati descritti sopra sono utilizzati esclusivamente per gestire e migliorare Glacier Client e questo sito web, ad esempio per tracciare la popolarità aggregata dei download tra le versioni. Non vendiamo, affittiamo o condividiamo le tue informazioni con terze parti per scopi di marketing.',
        'privacy.s3': 'Servizi di Terze Parti',
        'privacy.s3.body': 'Questo sito web si affida a un piccolo numero di servizi di terze parti per funzionare, tra cui Cloudflare (hosting e contatori di download), Discord (widget della community e inviti), e Linkvertise (link di download monetizzati). Questi servizi possono raccogliere autonomamente dati, come l\'indirizzo IP, secondo le proprie politiche sulla privacy, che ti invitiamo a consultare.',
        'privacy.s4': 'Cookie & Archiviazione Locale',
        'privacy.s4.body': 'Utilizziamo l\'archiviazione locale del browser, non cookie di tracciamento, per ricordare la tua preferenza del tema. Non utilizziamo cookie pubblicitari o di tracciamento cross-site su glacierclient.xyz. I servizi di terze parti incorporati in questo sito, come Linkvertise, possono impostare i propri cookie come descritto nelle rispettive politiche.',
        'privacy.s5': 'Privacy dei Minori',
        'privacy.s5.body': 'Glacier Client non è rivolto a minori al di sotto dell\'età richiesta dai termini di servizio propri di Discord e Minecraft. Non raccogliamo consapevolmente informazioni personali da minori al di sotto di tale età.',
        'privacy.s6': 'Modifiche a Questa Informativa',
        'privacy.s6.body': 'Potremmo aggiornare periodicamente questa Informativa sulla Privacy per riflettere cambiamenti nelle nostre pratiche o per motivi legali. Le modifiche sostanziali saranno annunciate sul nostro server Discord, e la data "Ultimo aggiornamento" sopra sarà rivista di conseguenza.',
        'privacy.s7': 'Contatti',
        'privacy.s7.body': 'Per domande o richieste relative alla privacy, contattaci tramite il nostro <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">server Discord ufficiale</a>.',

        'faqcat.Getting Started': 'Per Iniziare',
        'faqcat.Installation & Setup': 'Installazione e Configurazione',
        'faqcat.Troubleshooting': 'Risoluzione dei Problemi',
        'faqcat.Features & Compatibility': 'Funzionalità e Compatibilità',
        'faqcat.Community & Content': 'Community e Contenuti',
        'faqcat.Legal & Privacy': 'Legale e Privacy',

        'faqq.what-is-glacier': 'Cos\'è Glacier Client?',
        'faqa.what-is-glacier': '<p>Glacier Client è un resource pack gratuito per Minecraft Bedrock Edition che aggiunge un HUD personalizzabile, un menu mod trascinabile con oltre 37 moduli, e funzionalità di qualità della vita, senza modificare la logica di gioco o dare ai giocatori un vantaggio sleale. Si installa come qualsiasi altro resource pack e funziona su Mobile, PC e Console.</p>',

        'faqq.is-free': 'Glacier Client è gratuito?',
        'faqa.is-free': '<p>Sì. Glacier Client è gratuito e lo sarà sempre. Alcuni link di download passano attraverso Linkvertise per aiutare a finanziare lo sviluppo e i costi di hosting, ma il client stesso non viene mai venduto o limitato da un paywall. Se vuoi supportare direttamente lo sviluppo, visita la nostra pagina <a href="/donate" data-section="donate">Dona</a>.</p>',

        'faqq.open-mod-menu': 'Come apro il Menu Mod?',
        'faqa.open-mod-menu': '<ol><li>Apri il <strong>Menu Pausa</strong> durante il gioco.</li><li>Individua il pulsante <strong>Icona Griglia</strong> nell\'angolo in basso a sinistra dello schermo.</li><li><strong>Fai doppio clic</strong> su questo pulsante per attivare il Menu Mod.</li></ol>',

        'faqq.see-everything': 'Dove posso vedere tutto ciò che Glacier Client può fare?',
        'faqa.see-everything': '<p>Consulta la pagina <a href="/features" data-section="features">Funzionalità</a> per una panoramica, la pagina <a href="/mods" data-section="mods">Tutte le Mod</a> per l\'elenco completo dei moduli, e la <a href="/gallery" data-section="gallery">Galleria</a> e gli <a href="/community" data-section="community">Showcase</a> per screenshot e tutorial video della community.</p>',

        'faqq.import-client': 'Come importo Glacier Client?',
        'faqa.import-client': '<ol><li><strong>Individua il file:</strong> Trova il file <code>.zip</code> di Glacier Client scaricato sul tuo dispositivo.</li><li><strong>Apri con ZArchiver:</strong> Tocca il file e seleziona ZArchiver tra le opzioni.</li><li><strong>Rinomina il file:</strong> Tieni premuto il file dentro ZArchiver, seleziona Rinomina, e rimuovi l\'estensione <code>.zip</code> in modo che il nome del file termini in <code>.mcpack</code>.</li><li><strong>Importa in Minecraft:</strong> Tocca una volta il file rinominato, tocca l\'icona freccia accanto a "Visualizza", quindi seleziona Minecraft per importare e avviare automaticamente il gioco.</li></ol><p>Una volta caricato Minecraft, attiva Glacier Client nelle impostazioni <strong>Risorse Globali</strong>.</p>',

        'faqq.bypass-linkvertise': 'Come aggiro Linkvertise per scaricare?',
        'faqa.bypass-linkvertise': '<ol><li>Vai al canale download nel nostro server Discord e clicca sul link della versione scelta.</li><li>Nella pagina Linkvertise, scorri verso il basso e clicca su <strong>"Get Glacier Client"</strong>.</li><li>Appare un popup "Access Options" attendi il conto alla rovescia (di solito 10 secondi).</li><li>Quando il timer raggiunge lo zero, il pulsante diventa attivo. Cliccalo per essere reindirizzato alla pagina di download.</li><li>Clicca sul pulsante blu <strong>"Download"</strong> per salvare il file <code>.mcpack</code>.</li></ol>',

        'faqq.configure-client': 'Come configuro Glacier Client?',
        'faqa.configure-client': '<p>Puoi modificare <code>config.json</code> direttamente, oppure usare l\'Editor di Configurazione online su <a href="https://config.glacierclient.xyz/" target="_blank" rel="noopener">config.glacierclient.xyz</a>.</p><p><strong>Editor consigliati:</strong></p><ul><li><strong>Android:</strong> MT Manager o QuickEdit</li><li><strong>iOS:</strong> Documents by Readdle</li><li><strong>PC:</strong> VS Code o Notepad++</li></ul><p><strong>Trovare config.json su mobile (Android e iOS):</strong></p><ol><li>Apri l\'app File del tuo dispositivo.</li><li>Naviga verso: <code>Android/data/com.mojang.minecraftpe/files/games/com.mojang/resource_packs/</code></li><li>Apri la cartella <code>Glacier</code> e individua <code>config.json</code>.</li></ol><p><strong>Trovare config.json su Windows:</strong></p><ol><li>Premi <kbd>Win + R</kbd> e incolla: <code>%userprofile%\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\resource_packs</code></li><li>Per gli utenti GDK: <code>%userprofile%\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang\\resource_packs</code></li><li>Apri la cartella <code>Glacier</code> e individua <code>config.json</code>.</li></ol><p><strong>Tipi di valori:</strong> Gli interruttori usano <code>true</code>/<code>false</code> · L\'opacità usa <code>0.0</code>&ndash;<code>1.0</code> · L\'offset (X, Y) regola la posizione degli elementi HUD.</p><p><strong>Tutorial video:</strong> <a href="https://youtu.be/RrTHx6V-zp4" target="_blank" rel="noopener">Android / ChromeOS</a> · <a href="https://youtu.be/oaQCtVdNUXg" target="_blank" rel="noopener">iPadOS / iOS</a></p>',

        'faqq.reimport-after-update': 'Devo reimportare Glacier Client dopo ogni aggiornamento?',
        'faqa.reimport-after-update': '<p>Sì, i resource pack si aggiornano sostituendo il file, non applicando patch sul posto. Scarica la nuova versione, importala come prima, e riattivala in Risorse Globali. Le tue impostazioni <code>config.json</code> sono memorizzate separatamente e non vengono influenzate dalla reimportazione, quindi la tua personalizzazione viene mantenuta automaticamente.</p>',

        'faqq.use-with-other-packs': 'Posso usare Glacier Client insieme ad altri resource pack?',
        'faqa.use-with-other-packs': '<p>Sì, purché l\'altro pack non modifichi gli stessi file dell\'interfaccia. Metti Glacier Client in cima al tuo stack di Risorse Globali per i migliori risultati. Consulta <strong>Perché Glacier Client non funziona correttamente?</strong> più sotto per un elenco dei conflitti comuni.</p>',

        'faqq.uninstall': 'Come disinstallo Glacier Client?',
        'faqa.uninstall': '<ol><li>Apri Minecraft e vai su <strong>Impostazioni → Risorse Globali</strong> di un mondo (o le impostazioni dei resource pack di un mondo specifico).</li><li>Trova <strong>Glacier Client</strong> nell\'elenco Attivi e spostalo di nuovo su I Miei Pack, oppure rimuovilo completamente.</li><li>Per rimuovere completamente i file, elimina il pack <strong>Glacier</strong> dalla tua cartella <code>resource_packs</code> (vedi la guida di configurazione sopra per il percorso della cartella sulla tua piattaforma).</li></ol><p>Disinstallare non influisce in alcun modo sui tuoi mondi Minecraft, salvataggi o account.</p>',

        'faqq.not-working-correctly': 'Perché Glacier Client non funziona correttamente?',
        'faqa.not-working-correctly': '<p>Le cause più comuni sono pack in conflitto o restrizioni del server:</p><ul><li><strong>Pack in conflitto:</strong> Qualsiasi pack o add-on che modifica <code>player.entity.json</code> (es. Actions &amp; Stuff) o <code>hud_screen.json</code> (es. Better Bedrock) entrerà in conflitto con Glacier Client. Disattiva prima quei pack.</li><li><strong>Restrizioni lato server:</strong> Alcuni server bloccano completamente le sovrascritture dell\'interfaccia personalizzata, cosa comune sui server di eventi Minecraft. Le funzionalità di Glacier non appariranno su quei server, e questo non può essere risolto da parte nostra.</li></ul>',

        'faqq.mod-menu-not-appearing': 'Il pulsante del Menu Mod non appare. Cosa faccio?',
        'faqa.mod-menu-not-appearing': '<ol><li>Conferma che Glacier Client sia <strong>sopra</strong> gli altri resource pack in Risorse Globali, e che sia effettivamente attivo (non solo installato).</li><li>Chiudi completamente e riapri Minecraft, questo aggiorna i resource pack caricati.</li><li>Controlla la presenza di un pack in conflitto, come descritto in <strong>Perché Glacier Client non funziona correttamente?</strong> sopra.</li><li>Se ancora non appare, chiedi nel canale bug-reports su Discord con il modello del tuo dispositivo e la versione di Minecraft.</li></ol>',

        'faqq.settings-reset': 'Le mie impostazioni si resettano dopo un aggiornamento. Perché?',
        'faqa.settings-reset': '<p>Questo di solito accade quando <code>config.json</code> viene eliminato o sovrascritto durante l\'importazione, ad esempio se hai estratto la nuova versione in una cartella nuova invece di aggiornare sul posto. Fai un backup del tuo <code>config.json</code> prima di aggiornare se hai personalizzato molto la tua configurazione, poi incollalo di nuovo nella cartella della nuova versione in seguito.</p>',

        'faqq.safe-to-use': 'Glacier Client è sicuro da usare, e può farmi bannare?',
        'faqa.safe-to-use': '<p>Glacier Client è un resource pack, modifica texture e interfaccia, non inietta codice, non modifica la logica di gioco né concede vantaggi di gioco come portata, mira assistita o combattimento automatizzato. Funziona all\'interno del sistema ufficiale di resource pack di Minecraft Bedrock.</p><ul><li><strong>Vanilla e Realms:</strong> Sicuro da usare. I resource pack sono una funzionalità lato client supportata da Minecraft Bedrock.</li><li><strong>Server di terze parti:</strong> Alcuni server vietano esplicitamente qualsiasi resource pack personalizzato, compresi quelli cosmetici, nelle proprie regole. Controlla sempre le regole di un server prima di unirti con qualsiasi interfaccia modificata.</li></ul><p>Non distribuiamo client di trucchi, e non supportiamo né approviamo l\'uso di Glacier Client per violare i termini di servizio di un server.</p>',

        'faqq.compatible-devices': 'Quali dispositivi e versioni sono compatibili?',
        'faqa.compatible-devices': '<p>Glacier Client supporta tutti i dispositivi che eseguono la versione <strong>Ufficiale</strong> di Minecraft Bedrock Edition.</p><ul><li><strong>Preview / Beta:</strong> Il client potrebbe funzionare sulle build Preview, ma la stabilità non è garantita, poiché Mojang modifica frequentemente il codice principale dell\'interfaccia nelle versioni Preview.</li><li><strong>Console (Xbox e PlayStation):</strong> Supportato tramite il metodo Realms. Installa prima su Mobile o PC, attivalo su un Realm, poi scaricalo sulla tua console tramite Impostazioni Realm → Resource Pack → Scarica, e attivalo in Risorse Globali.</li></ul><p><a href="https://www.youtube.com/watch?v=1f7P9J-W8aM" target="_blank" rel="noopener">Guarda il tutorial di installazione console →</a></p>',

        'faqq.boost-fps': 'Glacier Client aumenta gli FPS?',
        'faqa.boost-fps': '<p>Glacier Client è progettato per <strong>utilità e personalizzazione</strong>, non come booster di FPS.</p><ul><li>Minecraft Bedrock è già un motore altamente ottimizzato.</li><li>La maggior parte dei pack "booster FPS" non migliora realmente le prestazioni. Spesso aggiungono overhead di elaborazione extra senza ridurre il carico effettivo del motore, il che può <em>diminuire</em> gli FPS.</li><li>Molti di questi pack trovati online sono clickbait progettati per le visualizzazioni piuttosto che un genuino miglioramento tecnico.</li></ul><p>Glacier si concentra nel fornire un\'esperienza stabile e di alta qualità con funzionalità che migliorano davvero il gameplay.</p>',

        'faqq.impossible-features': 'Quali funzionalità sono impossibili o non pianificate?',
        'faqa.impossible-features': '<p><strong>Tecnicamente impossibili</strong> a causa delle limitazioni del motore:</p><ul><li><strong>HUD:</strong> Durabilità dell\'armatura sull\'HUD, contatori CPS/Combo accurati, contatori di portata, Quick Drop sull\'HUD.</li><li><strong>Visivi:</strong> Full Bright, Motion Blur, nessuna camera da danno, fisica degli oggetti, shader.</li><li><strong>Strumenti:</strong> Minimappe, Keystrokes, Replay Mod, anteprime shulker, grafici a torta, nametag in terza persona.</li><li><strong>Automazione:</strong> Auto GG, Auto Totem, Autosprint, toggle accovacciamento, toggle sprint.</li><li><strong>Sistemi:</strong> Liste amici, mod vocale, cambio resource pack in gioco.</li></ul><p><strong>Non pianificate:</strong></p><ul><li>Zoom, ESP, modali di visualizzazione, modelli giocatore 3D, qualsiasi forma di trucchi o hack, texture personalizzate per l\'interfaccia generale (escludendo la barra rapida e la barra XP).</li></ul>',

        'faqq.works-with-shaders': 'Glacier Client funziona con shader o altre mod visive?',
        'faqa.works-with-shaders': '<p>Glacier Client modifica solo i file di interfaccia e HUD, non tocca l\'illuminazione o il rendering, quindi è generalmente compatibile con i pack di shader e altri add-on puramente visivi. I conflitti sorgono solo con pack che modificano gli stessi file HUD/menu usati da Glacier; vedi le note di compatibilità sopra.</p>',

        'faqq.java-dll-version': 'C\'è una versione per Minecraft Java Edition o un client DLL nativo?',
        'faqa.java-dll-version': '<p>Entrambi sono in sviluppo attivo. Segui i progressi e gli annunci di rilascio nella pagina <a href="/downloads" data-section="downloads">Download</a> e sul nostro server Discord, appariranno lì non appena una build sarà pronta.</p>',

        'faqq.report-bugs': 'Come segnalo bug o suggerisco funzionalità?',
        'faqa.report-bugs': '<p>Apprezziamo il contributo della community. Segui questo processo:</p><ol><li><strong>Controlla le segnalazioni esistenti:</strong> Sfoglia il canale bug-reports su Discord per vedere se il problema è già stato segnalato.</li><li><strong>Fornisci dettagli:</strong> Includi il <strong>modello del tuo dispositivo</strong> e un <strong>video o screenshot</strong> del problema.</li><li><strong>Invia suggerimenti:</strong> Pubblica nuove idee nel canale suggestions. Controlla l\'elenco "Impossibile" nelle FAQ prima di pubblicare per assicurarti che la tua idea sia tecnicamente realizzabile.</li></ol>',

        'faqq.review-content': 'Posso recensire o creare contenuti su Glacier Client?',
        'faqa.review-content': '<p>Sì, a condizione di seguire queste regole. Violarle può comportare un ban dal server o un richiamo:</p><ul><li><strong>Solo link ufficiali:</strong> Collega sempre al nostro <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">invito Discord ufficiale</a>, mai a Mediafire o altri mirror di terze parti.</li><li><strong>Nessuna disinformazione:</strong> Non diffondere affermazioni false o partecipare ad attività diffamatorie.</li><li><strong>Nessun furto di asset:</strong> Non distribuire pubblicamente il contenuto del pack senza autorizzazione esplicita.</li><li><strong>Attribuzione richiesta:</strong> Se usi il nostro metodo di salvataggio delle mod trascinabili, devi accreditare Glacier Client e includere il link del nostro server. L\'uso non autorizzato comporterà azioni legali e una rimozione DMCA.</li><li><strong>Uso privato consentito:</strong> Puoi usare codice o contenuti nei tuoi pack privati e non pubblici.</li></ul><p>I termini completi sono disponibili nella nostra <a href="/license" data-section="license">Licenza</a> e nei <a href="/tos" data-section="tos">Termini di Servizio</a>.</p>',

        'faqq.watch-in-action': 'Dove posso vedere Glacier Client in azione?',
        'faqa.watch-in-action': '<p>Consulta la nostra sezione <a href="/community" data-section="community">Showcase</a> per video selezionati dalla community, oppure cerca "Glacier Client" su YouTube per le ultime recensioni e tutorial indipendenti dalla community Minecraft Bedrock.</p>',

        'faqq.get-involved': 'Come posso coinvolgermi oltre alla segnalazione di bug?',
        'faqa.get-involved': '<p>Unisciti al nostro Discord e presentati. Cerchiamo regolarmente membri della community per aiutare con traduzioni, test di build pre-rilascio e moderazione del server. Gli annunci per questi ruoli vengono pubblicati su Discord quando sono aperti.</p>',

        'faqq.data-collected': 'Quali informazioni raccoglie Glacier Client su di me?',
        'faqa.data-collected': '<p>Pochissime. Le tue scelte di configurazione sono memorizzate localmente sul tuo dispositivo e non ci vengono mai inviate. Il sito web traccia solo conteggi di download anonimi e aggregati per mostrare la popolarità delle versioni, nessun dato personale è associato a quel conteggio.</p><p>Tutti i dettagli sono disponibili nella nostra <a href="/privacy" data-section="privacy">Informativa sulla Privacy</a>.</p>',

        'faqq.donations-refundable': 'Le donazioni sono rimborsabili, e cosa sostengono?',
        'faqa.donations-refundable': '<p>Le donazioni effettuate tramite PayPal o Ko-fi sono volontarie e finanziano direttamente lo sviluppo continuo, i costi di hosting e le nuove funzionalità. Non sono pagamenti per un prodotto o un abbonamento e generalmente non sono rimborsabili, salvo quando richiesto dalla legge o dalla politica della piattaforma di pagamento stessa.</p><p>Consulta i nostri <a href="/tos" data-section="tos">Termini di Servizio</a> per tutti i dettagli.</p>',

        'faqq.who-owns-client': 'Chi possiede Glacier Client, e posso ridistribuirlo?',
        'faqa.who-owns-client': '<p>Glacier Client e i suoi asset sono di proprietà di Glacier Productions. Non è consentita la ridistribuzione, il rebranding o la rivendita del pack senza autorizzazione. Consulta la nostra <a href="/license" data-section="license">Licenza</a> per i termini completi sull\'uso consentito e vietato.</p>'
    },

    pt: {
        'faq.allQuestions': 'Todas as perguntas',
        'dl.loadingLauncher': 'A carregar lançamentos do launcher...',
        'mods.countOf': '{shown} de {total} mods',
        'dl.tagLatest': 'Mais recente',
        'dl.tagArchived': 'Arquivada',
        'dl.downloadsWord': 'transferências',
        'dl.changelogLabel': 'Registo de alterações',
        'dl.extOne': '{n} extensão compatível',
        'dl.extMany': '{n} extensões compatíveis',
        'dl.noLauncherReleases': 'Nenhum lançamento do launcher encontrado.',
        'dl.failedLoadLauncher': 'Falha ao carregar os lançamentos do launcher.',
        'dl.viewOnGithub': 'Ver no GitHub',
        'dl.alsoAvailableOn': 'Também disponível em',
        'dl.mirrorPending': 'Ainda não atualizado para o hotfix mais recente',
        'update.available': 'Está disponível uma nova versão deste site.',
        'update.refresh': 'Atualizar',
        'update.dismiss': 'Dispensar',

        'toast.announcement': 'Anúncio',
        'toast.available': 'O Glacier {version} já está disponível!',
        'toast.dismiss': 'Dispensar anúncio',
        'donate.toastTitle': 'Apoia o Glacier',
        'donate.toastText': 'O Glacier é gratuito para sempre. Um pequeno donativo ajuda a mantê-lo assim.',
        'donate.dismiss': 'Dispensar aviso de doação',

        'changelog.v6.2.title': 'Correção do HUD e mais: Restaura a compatibilidade com o Minecraft Bedrock v26.30.',
        'changelog.v6.2.note0': 'Corrigidos erros ao ativar o resource pack no MCBE v26.30.',
        'changelog.v6.2.note1': 'Corrigidos elementos do HUD que não renderizavam ou não funcionavam corretamente.',
        'changelog.v6.2.note2': 'Corrigido o Menu de Mods que não abria após a ativação.',
        'changelog.v6.2.note3': 'Restaurada a funcionalidade completa do HUD e a compatibilidade com a atualização mais recente do Minecraft.',
        'changelog.v6.2.note4': 'Corrigido um erro com o modelo de mão em servidores multiplataforma Java x Bedrock.',
        'changelog.v6.2.note5': 'Corrigidos problemas com texturas em falta.',

        'license.title': 'Licença do Glacier Client',
        'license.prohibited': 'Uso Proibido',
        'license.permitted.body': '<li><strong>Análises e Criação de Conteúdo:</strong> Podes criar vídeos, streams ou análises escritas com o Glacier Client, desde que ligues apenas para o nosso <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">convite oficial do Discord</a>. Links para o Mediafire ou outros espelhos não oficiais de terceiros não são permitidos.</li><li><strong>Modificação Privada:</strong> Podes modificar e usar o código ou conteúdo do Glacier Client dentro dos teus próprios resource packs privados e não públicos para uso pessoal.</li>',
        'license.prohibited.body': '<li><strong>Desinformação:</strong> É proibido espalhar alegações falsas ou envolver-se em condutas difamatórias contra o Glacier Client ou os seus programadores.</li><li><strong>Redistribuição:</strong> É estritamente proibido distribuir publicamente os ativos ou o código do Glacier Client, na forma original ou modificada, sem permissão prévia por escrito.</li><li><strong>Uso sem Atribuição:</strong> É proibido incorporar os sistemas proprietários do Glacier Client, como o método de guardar mods arrastáveis, noutro projeto público sem a atribuição exigida abaixo.</li>',
        'license.attribution': 'Requisitos de Atribuição',
        'license.attribution.body': 'Qualquer projeto público que incorpore os sistemas proprietários do Glacier Client, incluindo o método de guardar mods arrastáveis, deve creditar claramente o Glacier Client e incluir um link para o nosso servidor oficial de Discord. O incumprimento constitui uma violação desta licença e pode resultar em <strong style="color:var(--red);">ação legal</strong> e num pedido de remoção DMCA contra o projeto infrator.',
        'license.ownership': 'Propriedade',
        'license.ownership.body': 'O Glacier Client, incluindo o seu código-fonte, texturas, ativos de UI, marca, e os nomes "Glacier Client" e "Glacier Productions", é propriedade intelectual da Glacier Productions. Esta licença concede-te um direito limitado e revogável de usar o cliente conforme descrito acima; não te transfere a propriedade de quaisquer ativos ou código subjacentes.',
        'license.thirdParty': 'Ativos de Terceiros',
        'license.thirdParty.body': 'O Glacier Client é um resource pack independente criado para o Minecraft Bedrock Edition e não está afiliado, endossado ou patrocinado pela Mojang Studios ou Microsoft. Minecraft é uma marca registada da Mojang Synergies AB. Quaisquer bibliotecas ou ativos de terceiros incluídos no Glacier Client permanecem propriedade dos respetivos donos e são usados sob as suas próprias licenças aplicáveis.',
        'license.warranty': 'Sem Garantia & Rescisão',
        'license.warranty.body': 'O Glacier Client é fornecido <strong>"tal como está"</strong> sem garantia de qualquer tipo, expressa ou implícita. Reservamo-nos o direito de revogar os direitos concedidos ao abrigo desta licença, ao nosso critério, a qualquer indivíduo ou projeto considerado em violação destes termos.',

        'tos.s1': '1. Aceitação dos Termos',
        'tos.s1.body': 'Ao transferir, instalar ou usar o Glacier Client, ou ao entrares no nosso servidor de Discord, aceitas ficar vinculado a estes Termos de Serviço e à nossa <a href="/privacy" data-section="privacy">Política de Privacidade</a>. Se não concordares, não uses o Glacier Client nem os seus serviços associados.',
        'tos.s2': '2. Natureza do Serviço',
        'tos.s2.body': 'O Glacier Client é um resource pack gratuito, desenvolvido pela comunidade, e um launcher complementar para o Minecraft Bedrock Edition. É fornecido para uso pessoal e não comercial e não modifica a lógica de jogo do Minecraft, não concede vantagens injustas em multijogador, nem interage com servidores de formas proibidas pelo Contrato de Licença de Utilizador Final da Mojang.',
        'tos.s3': '3. Uso Aceitável',
        'tos.s3.body': '<li>Tens de ter idade suficiente para usar o Discord e o Minecraft segundo os respetivos termos de serviço, ou ter o consentimento parental para tal.</li><li>Não usarás o Glacier Client nem o nosso servidor de Discord para assediar terceiros, distribuir malware, ou violar qualquer lei aplicável.</li><li>Não tentarás revender, mudar a marca, ou apresentar falsamente o Glacier Client como sendo o teu próprio trabalho.</li><li>O uso do Glacier Client está também sujeito à <a href="/license" data-section="license">Licença do Glacier Client</a>, que rege a redistribuição e a atribuição.</li>',
        'tos.s4': '4. Transferências e Links de Terceiros',
        'tos.s4.body': 'Alguns links de transferência passam por serviços de terceiros (como o Linkvertise) para ajudar a financiar o desenvolvimento. Não controlamos o conteúdo destas páginas intermediárias e não somos responsáveis por anúncios ou conteúdo nelas exibido. Transfere sempre o Glacier Client através de links publicados no nosso servidor oficial de Discord ou neste website.',
        'tos.s5': '5. Isenção de Garantia e Responsabilidade',
        'tos.s5.body': 'O Glacier Client é fornecido <strong>"tal como está"</strong> sem garantias de qualquer tipo. Não garantimos um funcionamento ininterrupto, compatibilidade com todos os dispositivos ou servidores, ou que o cliente esteja isento de erros. Na máxima medida permitida por lei, a Glacier Productions não é responsável por quaisquer danos indiretos, incidentais ou consequenciais decorrentes do teu uso do Glacier Client, incluindo, mas não se limitando a, restrições de conta impostas por terceiros como a Mojang, Microsoft, ou servidores individuais de Minecraft.',
        'tos.s6': '6. Doações',
        'tos.s6.body': 'As doações feitas via PayPal ou Ko-fi são contribuições voluntárias para apoiar o desenvolvimento contínuo e não compram qualquer bem, serviço, funcionalidade ou direito. As doações não são geralmente reembolsáveis, exceto quando exigido por lei ou pela política da plataforma.',
        'tos.s7': '7. Alterações a Estes Termos',
        'tos.s7.body': 'Podemos atualizar estes Termos de Serviço periodicamente para refletir alterações no projeto ou na lei aplicável. O uso continuado do Glacier Client após a publicação de alterações constitui aceitação dos termos revistos. Alterações materiais serão anunciadas no nosso servidor de Discord.',
        'tos.s8': '8. Contacto',
        'tos.s8.body': 'Perguntas sobre estes termos podem ser dirigidas à nossa equipa através do <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">servidor oficial de Discord</a>.',

        'privacy.s1': 'Informação que Recolhemos',
        'privacy.s1.body': '<li><strong>Configuração do Cliente:</strong> O Glacier Client guarda as tuas preferências (interruptores, opacidade, posições do HUD) localmente em <code>config.json</code> no teu próprio dispositivo. Estes dados nunca saem do teu dispositivo e não nos são transmitidos.</li><li><strong>Preferências do Website:</strong> Este website guarda uma preferência de tema (claro/escuro) no armazenamento local do teu navegador para recordar a tua escolha entre visitas.</li><li><strong>Contagens Agregadas de Transferências:</strong> Quando transferes uma versão do cliente, um contador anónimo é incrementado através do nosso Cloudflare Worker para que possamos mostrar totais aproximados de transferências. Nenhuma informação pessoal ou identificadora do dispositivo é recolhida como parte desta contagem.</li><li><strong>Atividade no Discord:</strong> Se entrares no nosso servidor de Discord, as tuas interações aí são regidas pela <a href="https://discord.com/privacy" target="_blank" rel="noopener">Política de Privacidade própria do Discord</a>, não por esta.</li>',
        'privacy.s2': 'Como Usamos a Informação',
        'privacy.s2.body': 'Quaisquer dados descritos acima são usados exclusivamente para operar e melhorar o Glacier Client e este website, por exemplo, para acompanhar a popularidade agregada das transferências entre versões. Não vendemos, alugamos, nem partilhamos a tua informação com terceiros para fins de marketing.',
        'privacy.s3': 'Serviços de Terceiros',
        'privacy.s3.body': 'Este website depende de um pequeno número de serviços de terceiros para funcionar, incluindo Cloudflare (alojamento e contadores de transferências), Discord (widget da comunidade e convites), e Linkvertise (links de transferência monetizados). Estes serviços podem recolher independentemente dados, como o endereço IP, ao abrigo das suas próprias políticas de privacidade, que encorajamos a consultar.',
        'privacy.s4': 'Cookies & Armazenamento Local',
        'privacy.s4.body': 'Usamos o armazenamento local do navegador, não cookies de rastreio, para recordar a tua preferência de tema. Não usamos cookies de publicidade ou de rastreio entre sites em glacierclient.xyz. Serviços de terceiros incorporados neste site, como o Linkvertise, podem definir os seus próprios cookies conforme descrito nas respetivas políticas.',
        'privacy.s5': 'Privacidade de Menores',
        'privacy.s5.body': 'O Glacier Client não se destina a menores abaixo da idade exigida pelos próprios termos de serviço do Discord e do Minecraft. Não recolhemos conscientemente informação pessoal de menores abaixo dessa idade.',
        'privacy.s6': 'Alterações a Esta Política',
        'privacy.s6.body': 'Podemos atualizar esta Política de Privacidade periodicamente para refletir alterações nas nossas práticas ou por razões legais. Alterações materiais serão anunciadas no nosso servidor de Discord, e a data de "Última atualização" acima será revista em conformidade.',
        'privacy.s7': 'Contacto',
        'privacy.s7.body': 'Para perguntas ou pedidos relacionados com privacidade, contacta-nos através do nosso <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">servidor oficial de Discord</a>.',

        'faqcat.Getting Started': 'Primeiros Passos',
        'faqcat.Installation & Setup': 'Instalação e Configuração',
        'faqcat.Troubleshooting': 'Resolução de Problemas',
        'faqcat.Features & Compatibility': 'Funcionalidades e Compatibilidade',
        'faqcat.Community & Content': 'Comunidade e Conteúdo',
        'faqcat.Legal & Privacy': 'Legal e Privacidade',

        'faqq.what-is-glacier': 'O que é o Glacier Client?',
        'faqa.what-is-glacier': '<p>O Glacier Client é um resource pack gratuito para o Minecraft Bedrock Edition que adiciona um HUD personalizável, um menu de mods arrastável com mais de 37 módulos, e funcionalidades de qualidade de vida, sem modificar a lógica do jogo ou dar aos jogadores uma vantagem injusta. Instala-se como qualquer outro resource pack e funciona em Mobile, PC e Consola.</p>',

        'faqq.is-free': 'O Glacier Client é grátis?',
        'faqa.is-free': '<p>Sim. O Glacier Client é grátis e sempre será. Alguns links de transferência passam pelo Linkvertise para ajudar a financiar o desenvolvimento e os custos de alojamento, mas o cliente em si nunca é vendido nem limitado por uma barreira de pagamento. Se quiseres apoiar o desenvolvimento diretamente, consulta a nossa página de <a href="/donate" data-section="donate">Doar</a>.</p>',

        'faqq.open-mod-menu': 'Como abro o Menu de Mods?',
        'faqa.open-mod-menu': '<ol><li>Abre o <strong>Menu de Pausa</strong> durante o jogo.</li><li>Localiza o botão <strong>Ícone de Grelha</strong> no canto inferior esquerdo do teu ecrã.</li><li><strong>Faz duplo clique</strong> neste botão para alternar o Menu de Mods.</li></ol>',

        'faqq.see-everything': 'Onde posso ver tudo o que o Glacier Client pode fazer?',
        'faqa.see-everything': '<p>Consulta a página de <a href="/features" data-section="features">Funcionalidades</a> para uma visão geral, a página <a href="/mods" data-section="mods">Todos os Mods</a> para a lista completa de módulos, e a <a href="/gallery" data-section="gallery">Galeria</a> e <a href="/community" data-section="community">Vídeos da Comunidade</a> para capturas de ecrã e tutoriais em vídeo da comunidade.</p>',

        'faqq.import-client': 'Como importo o Glacier Client?',
        'faqa.import-client': '<ol><li><strong>Localiza o ficheiro:</strong> Encontra o ficheiro <code>.zip</code> transferido do Glacier Client no teu dispositivo.</li><li><strong>Abre com o ZArchiver:</strong> Toca no ficheiro e seleciona ZArchiver entre as opções.</li><li><strong>Renomeia o ficheiro:</strong> Mantém premido o ficheiro dentro do ZArchiver, seleciona Renomear, e remove a extensão <code>.zip</code> para que o nome do ficheiro termine em <code>.mcpack</code>.</li><li><strong>Importa para o Minecraft:</strong> Toca uma vez no ficheiro renomeado, toca no ícone de seta junto a "Ver", e depois seleciona Minecraft para importar e abrir o jogo automaticamente.</li></ol><p>Assim que o Minecraft carregar, ativa o Glacier Client nas tuas definições de <strong>Recursos Globais</strong>.</p>',

        'faqq.bypass-linkvertise': 'Como contorno o Linkvertise para transferir?',
        'faqa.bypass-linkvertise': '<ol><li>Vai ao canal de transferências no nosso servidor de Discord e clica no link da versão escolhida.</li><li>Na página do Linkvertise, desce e clica em <strong>"Get Glacier Client"</strong>.</li><li>Aparece uma janela "Access Options" espera pela contagem decrescente (normalmente 10 segundos).</li><li>Quando o temporizador chegar a zero, o botão fica ativo. Clica nele para seres redirecionado para a página de transferência.</li><li>Clica no botão azul <strong>"Download"</strong> para guardar o ficheiro <code>.mcpack</code>.</li></ol>',

        'faqq.configure-client': 'Como configuro o Glacier Client?',
        'faqa.configure-client': '<p>Podes editar o <code>config.json</code> diretamente, ou usar o Editor de Configuração online em <a href="https://config.glacierclient.xyz/" target="_blank" rel="noopener">config.glacierclient.xyz</a>.</p><p><strong>Editores recomendados:</strong></p><ul><li><strong>Android:</strong> MT Manager ou QuickEdit</li><li><strong>iOS:</strong> Documents by Readdle</li><li><strong>PC:</strong> VS Code ou Notepad++</li></ul><p><strong>Encontrar o config.json em Mobile (Android e iOS):</strong></p><ol><li>Abre a aplicação de Ficheiros do teu dispositivo.</li><li>Navega até: <code>Android/data/com.mojang.minecraftpe/files/games/com.mojang/resource_packs/</code></li><li>Abre a pasta <code>Glacier</code> e localiza <code>config.json</code>.</li></ol><p><strong>Encontrar o config.json no Windows:</strong></p><ol><li>Pressiona <kbd>Win + R</kbd> e cola: <code>%userprofile%\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\resource_packs</code></li><li>Para utilizadores GDK: <code>%userprofile%\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang\\resource_packs</code></li><li>Abre a pasta <code>Glacier</code> e localiza <code>config.json</code>.</li></ol><p><strong>Tipos de valores:</strong> Os interruptores usam <code>true</code>/<code>false</code> · A opacidade usa <code>0.0</code>&ndash;<code>1.0</code> · O offset (X, Y) ajusta a posição dos elementos do HUD.</p><p><strong>Tutoriais em vídeo:</strong> <a href="https://youtu.be/RrTHx6V-zp4" target="_blank" rel="noopener">Android / ChromeOS</a> · <a href="https://youtu.be/oaQCtVdNUXg" target="_blank" rel="noopener">iPadOS / iOS</a></p>',

        'faqq.reimport-after-update': 'Preciso de reimportar o Glacier Client depois de cada atualização?',
        'faqa.reimport-after-update': '<p>Sim, os resource packs atualizam-se substituindo o ficheiro, não aplicando patches no mesmo local. Transfere a nova versão, importa-a da mesma forma que antes, e reativa-a em Recursos Globais. As tuas definições de <code>config.json</code> são guardadas separadamente e não são afetadas pela reimportação, por isso a tua personalização mantém-se automaticamente.</p>',

        'faqq.use-with-other-packs': 'Posso usar o Glacier Client juntamente com outros resource packs?',
        'faqa.use-with-other-packs': '<p>Sim, desde que o outro pack não edite os mesmos ficheiros de UI. Coloca o Glacier Client no topo da tua pilha de Recursos Globais para os melhores resultados. Consulta <strong>Porque é que o Glacier Client não está a funcionar corretamente?</strong> abaixo para uma lista de conflitos comuns.</p>',

        'faqq.uninstall': 'Como desinstalo o Glacier Client?',
        'faqa.uninstall': '<ol><li>Abre o Minecraft e vai a <strong>Definições → Recursos Globais</strong> de um mundo (ou as definições de resource packs próprias de um mundo).</li><li>Encontra o <strong>Glacier Client</strong> na lista de Ativos e move-o de volta para Os Meus Packs, ou remove-o por completo.</li><li>Para remover completamente os ficheiros, apaga o pack <strong>Glacier</strong> da tua pasta <code>resource_packs</code> (consulta o guia de configuração acima para o caminho da pasta na tua plataforma).</li></ol><p>Desinstalar não afeta de forma alguma os teus mundos, jogos guardados ou conta do Minecraft.</p>',

        'faqq.not-working-correctly': 'Porque é que o Glacier Client não está a funcionar corretamente?',
        'faqa.not-working-correctly': '<p>As causas mais comuns são packs em conflito ou restrições do servidor:</p><ul><li><strong>Packs em conflito:</strong> Qualquer pack ou add-on que modifique <code>player.entity.json</code> (ex.: Actions &amp; Stuff) ou <code>hud_screen.json</code> (ex.: Better Bedrock) entrará em conflito com o Glacier Client. Desativa esses packs primeiro.</li><li><strong>Restrições do lado do servidor:</strong> Alguns servidores bloqueiam totalmente substituições de UI personalizadas, algo comum em servidores de eventos do Minecraft. As funcionalidades do Glacier não aparecerão nesses servidores, e isto não pode ser resolvido da nossa parte.</li></ul>',

        'faqq.mod-menu-not-appearing': 'O botão do Menu de Mods não aparece. O que faço?',
        'faqa.mod-menu-not-appearing': '<ol><li>Confirma que o Glacier Client está <strong>acima</strong> de outros resource packs em Recursos Globais, e que está realmente ativo (não apenas instalado).</li><li>Fecha completamente e reabre o Minecraft, isto atualiza os resource packs carregados.</li><li>Verifica se há um pack em conflito, como descrito em <strong>Porque é que o Glacier Client não está a funcionar corretamente?</strong> acima.</li><li>Se continuar sem aparecer, pergunta no canal de bug-reports no Discord com o modelo do teu dispositivo e a versão do Minecraft.</li></ol>',

        'faqq.settings-reset': 'As minhas definições reiniciam depois de uma atualização. Porquê?',
        'faqa.settings-reset': '<p>Isto geralmente acontece quando o <code>config.json</code> é apagado ou substituído durante a importação, por exemplo, se extraíste a nova versão para uma pasta nova em vez de atualizar no mesmo local. Faz uma cópia de segurança do teu <code>config.json</code> antes de atualizar se personalizaste muito a tua configuração, depois cola-o de volta na pasta da nova versão a seguir.</p>',

        'faqq.safe-to-use': 'É seguro usar o Glacier Client, e pode fazer-me ser banido?',
        'faqa.safe-to-use': '<p>O Glacier Client é um resource pack, altera texturas e UI, não injeta código, não modifica a lógica do jogo nem concede vantagens de jogo como alcance, assistência de mira ou combate automatizado. Funciona dentro do sistema oficial de resource packs do Minecraft Bedrock.</p><ul><li><strong>Vanilla e Realms:</strong> Seguro de usar. Os resource packs são uma funcionalidade do lado do cliente suportada pelo Minecraft Bedrock.</li><li><strong>Servidores de terceiros:</strong> Alguns servidores proíbem explicitamente qualquer resource pack personalizado, incluindo os cosméticos, nas suas próprias regras. Verifica sempre as regras de um servidor antes de entrares com qualquer UI modificada.</li></ul><p>Não distribuímos clientes de batota, e não apoiamos nem endossamos o uso do Glacier Client para violar os termos de serviço de um servidor.</p>',

        'faqq.compatible-devices': 'Que dispositivos e versões são compatíveis?',
        'faqa.compatible-devices': '<p>O Glacier Client suporta todos os dispositivos que executam a versão <strong>Oficial</strong> do Minecraft Bedrock Edition.</p><ul><li><strong>Previews / Betas:</strong> O cliente pode funcionar em builds Preview, mas a estabilidade não é garantida, já que a Mojang altera frequentemente o código central da UI nas versões Preview.</li><li><strong>Consola (Xbox e PlayStation):</strong> Suportado através do método Realms. Instala primeiro em Mobile ou PC, ativa-o num Realm, depois transfere-o na tua consola através de Definições do Realm → Resource Packs → Transferir, e ativa-o em Recursos Globais.</li></ul><p><a href="https://www.youtube.com/watch?v=1f7P9J-W8aM" target="_blank" rel="noopener">Vê o tutorial de instalação em consola →</a></p>',

        'faqq.boost-fps': 'O Glacier Client aumenta os FPS?',
        'faqa.boost-fps': '<p>O Glacier Client é concebido para <strong>utilidade e personalização</strong>, não como um impulsionador de FPS.</p><ul><li>O Minecraft Bedrock já é um motor altamente otimizado.</li><li>A maioria dos packs "impulsionadores de FPS" não melhora realmente o desempenho. Frequentemente adicionam sobrecarga de processamento extra sem reduzir a carga real do motor, o que pode <em>diminuir</em> os FPS.</li><li>Muitos desses packs encontrados online são clickbait concebidos para visualizações em vez de uma melhoria técnica genuína.</li></ul><p>O Glacier foca-se em fornecer uma experiência estável e de alta qualidade com funcionalidades que realmente melhoram a jogabilidade.</p>',

        'faqq.impossible-features': 'Que funcionalidades são impossíveis ou não estão planeadas?',
        'faqa.impossible-features': '<p><strong>Tecnicamente impossíveis</strong> devido a limitações do motor:</p><ul><li><strong>HUD:</strong> Durabilidade da armadura no HUD, contadores precisos de CPS/Combo, contadores de alcance, Quick Drop no HUD.</li><li><strong>Visuais:</strong> Full Bright, Motion Blur, sem câmara de dano, física de objetos, shaders.</li><li><strong>Ferramentas:</strong> Minimapas, Keystrokes, Replay Mod, pré-visualizações de shulkers, gráficos circulares, etiquetas de nome em terceira pessoa.</li><li><strong>Automação:</strong> Auto GG, Auto Totem, Autosprint, alternar agachar, alternar correr.</li><li><strong>Sistemas:</strong> Listas de amigos, mod de voz, alternadores de resource pack dentro do jogo.</li></ul><p><strong>Não planeadas:</strong></p><ul><li>Zoom, ESP, modais de visualização, modelos de jogador 3D, qualquer forma de batota ou hacks, texturas personalizadas para a UI geral (excluindo a barra de acesso rápido e a barra de XP).</li></ul>',

        'faqq.works-with-shaders': 'O Glacier Client funciona com shaders ou outros mods visuais?',
        'faqa.works-with-shaders': '<p>O Glacier Client apenas edita ficheiros de UI e HUD, não toca na iluminação nem na renderização, por isso é geralmente compatível com packs de shaders e outros add-ons puramente visuais. Os conflitos só surgem com packs que editam os mesmos ficheiros de HUD/menu que o Glacier utiliza; consulta as notas de compatibilidade acima.</p>',

        'faqq.java-dll-version': 'Existe uma versão para Minecraft Java Edition ou um cliente DLL nativo?',
        'faqa.java-dll-version': '<p>Ambos estão em desenvolvimento ativo. Segue o progresso e os anúncios de lançamento na página de <a href="/downloads" data-section="downloads">Transferências</a> e no nosso servidor de Discord, aparecerão lá assim que uma build estiver pronta.</p>',

        'faqq.report-bugs': 'Como reporto erros ou sugiro funcionalidades?',
        'faqa.report-bugs': '<p>Valorizamos o contributo da comunidade. Por favor, segue este processo:</p><ol><li><strong>Verifica reportes existentes:</strong> Consulta o canal de bug-reports no Discord para ver se o problema já foi registado.</li><li><strong>Fornece detalhes:</strong> Inclui o <strong>modelo do teu dispositivo</strong> e um <strong>vídeo ou captura de ecrã</strong> do problema.</li><li><strong>Envia sugestões:</strong> Publica novas ideias no canal de sugestões. Verifica a lista "Impossível" na FAQ antes de publicares para garantires que a tua ideia é tecnicamente viável.</li></ol>',

        'faqq.review-content': 'Posso analisar ou criar conteúdo com o Glacier Client?',
        'faqa.review-content': '<p>Sim, desde que sigas estas regras. Violá-las pode resultar num banimento do servidor ou aviso:</p><ul><li><strong>Apenas links oficiais:</strong> Faz sempre link para o nosso <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">convite oficial do Discord</a>, nunca para Mediafire ou outros espelhos de terceiros.</li><li><strong>Sem desinformação:</strong> Não espalhes alegações falsas nem participes em atividades difamatórias.</li><li><strong>Sem roubo de assets:</strong> Não distribuas publicamente o conteúdo do pack sem permissão explícita.</li><li><strong>Atribuição obrigatória:</strong> Se usares o nosso método de guardar mods arrastáveis, deves creditar o Glacier Client e incluir o link do nosso servidor. O uso não autorizado resultará em ação legal e uma remoção DMCA.</li><li><strong>Uso privado permitido:</strong> Podes usar código ou conteúdo nos teus próprios packs privados e não públicos.</li></ul><p>Os termos completos estão disponíveis na nossa <a href="/license" data-section="license">Licença</a> e <a href="/tos" data-section="tos">Termos de Serviço</a>.</p>',

        'faqq.watch-in-action': 'Onde posso ver o Glacier Client em ação?',
        'faqa.watch-in-action': '<p>Consulta a nossa secção de <a href="/community" data-section="community">Vídeos da Comunidade</a> para vídeos selecionados da comunidade, ou procura "Glacier Client" no YouTube para as últimas análises e tutoriais independentes da comunidade Minecraft Bedrock.</p>',

        'faqq.get-involved': 'Como posso envolver-me para além de reportar erros?',
        'faqa.get-involved': '<p>Junta-te ao nosso Discord e apresenta-te. Procuramos regularmente membros da comunidade para ajudar com traduções, testes de builds pré-lançamento e moderação do servidor. Os anúncios para estas funções são publicados no Discord quando estão abertos.</p>',

        'faqq.data-collected': 'Que informação recolhe o Glacier Client sobre mim?',
        'faqa.data-collected': '<p>Muito pouca. As tuas escolhas de configuração são guardadas localmente no teu próprio dispositivo e nunca nos são enviadas. O website apenas regista contagens de transferências anónimas e agregadas para mostrar a popularidade das versões, nenhum dado pessoal é associado a essa contagem.</p><p>Todos os detalhes estão disponíveis na nossa <a href="/privacy" data-section="privacy">Política de Privacidade</a>.</p>',

        'faqq.donations-refundable': 'As doações são reembolsáveis, e o que apoiam?',
        'faqa.donations-refundable': '<p>As doações feitas via PayPal ou Ko-fi são voluntárias e financiam diretamente o desenvolvimento contínuo, os custos de alojamento e novas funcionalidades. Não são pagamentos por um produto ou subscrição e geralmente não são reembolsáveis, exceto quando exigido por lei ou pela política da própria plataforma de pagamento.</p><p>Consulta os nossos <a href="/tos" data-section="tos">Termos de Serviço</a> para todos os detalhes.</p>',

        'faqq.who-owns-client': 'A quem pertence o Glacier Client, e posso redistribuí-lo?',
        'faqa.who-owns-client': '<p>O Glacier Client e os seus ativos são propriedade da Glacier Productions. Redistribuição, rebranding ou revenda do pack sem permissão não é permitida. Consulta a nossa <a href="/license" data-section="license">Licença</a> para os termos completos sobre uso permitido e proibido.</p>'
    },

    'pt-BR': {
        'faq.allQuestions': 'Todas as perguntas',
        'dl.loadingLauncher': 'Carregando lançamentos do launcher...',
        'mods.countOf': '{shown} de {total} mods',
        'dl.tagLatest': 'Mais recente',
        'dl.tagArchived': 'Arquivado',
        'dl.downloadsWord': 'downloads',
        'dl.changelogLabel': 'Changelog',
        'dl.extOne': '{n} extensão compatível',
        'dl.extMany': '{n} extensões compatíveis',
        'dl.noLauncherReleases': 'Nenhum lançamento do launcher encontrado.',
        'dl.failedLoadLauncher': 'Falha ao carregar os lançamentos do launcher.',
        'dl.viewOnGithub': 'Ver no GitHub',
        'dl.alsoAvailableOn': 'Também disponível em',
        'dl.mirrorPending': 'Ainda não atualizado para o hotfix mais recente',
        'update.available': 'Uma nova versão deste site está disponível.',
        'update.refresh': 'Atualizar',
        'update.dismiss': 'Dispensar',

        'toast.announcement': 'Anúncio',
        'toast.available': 'O Glacier {version} já está disponível!',
        'toast.dismiss': 'Dispensar anúncio',
        'donate.toastTitle': 'Apoie o Glacier',
        'donate.toastText': 'O Glacier é gratuito para sempre. Uma pequena doação ajuda a mantê-lo assim.',
        'donate.dismiss': 'Dispensar aviso de doação',

        'changelog.v6.2.title': 'Correção do HUD e mais: Restaura a compatibilidade com o Minecraft Bedrock v26.30.',
        'changelog.v6.2.note0': 'Corrigidos erros ao ativar o resource pack no MCBE v26.30.',
        'changelog.v6.2.note1': 'Corrigidos elementos do HUD que não renderizavam ou não funcionavam corretamente.',
        'changelog.v6.2.note2': 'Corrigido o Menu de Mods que não abria após a ativação.',
        'changelog.v6.2.note3': 'Restaurada a funcionalidade completa do HUD e a compatibilidade com a atualização mais recente do Minecraft.',
        'changelog.v6.2.note4': 'Corrigido um erro com o modelo de mão em servidores multiplataforma Java x Bedrock.',
        'changelog.v6.2.note5': 'Corrigidos problemas com texturas ausentes.',

        'license.title': 'Licença do Glacier Client',
        'license.prohibited': 'Uso Proibido',
        'license.permitted.body': '<li><strong>Avaliações e Criação de Conteúdo:</strong> Você pode criar vídeos, streams ou avaliações escritas com o Glacier Client, desde que faça link apenas para o nosso <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">convite oficial do Discord</a>. Links para o Mediafire ou outros mirrors não oficiais de terceiros não são permitidos.</li><li><strong>Modificação Privada:</strong> Você pode modificar e usar o código ou conteúdo do Glacier Client dentro dos seus próprios resource packs privados e não públicos para uso pessoal.</li>',
        'license.prohibited.body': '<li><strong>Desinformação:</strong> É proibido espalhar alegações falsas ou se envolver em condutas difamatórias contra o Glacier Client ou seus desenvolvedores.</li><li><strong>Redistribuição:</strong> É estritamente proibido distribuir publicamente os ativos ou o código do Glacier Client, na forma original ou modificada, sem permissão prévia por escrito.</li><li><strong>Uso sem Atribuição:</strong> É proibido incorporar os sistemas proprietários do Glacier Client, como o método de salvamento de mods arrastáveis, em outro projeto público sem a atribuição exigida abaixo.</li>',
        'license.attribution': 'Requisitos de Atribuição',
        'license.attribution.body': 'Qualquer projeto público que incorpore os sistemas proprietários do Glacier Client, incluindo o método de salvamento de mods arrastáveis, deve creditar claramente o Glacier Client e incluir um link para o nosso servidor oficial do Discord. O não cumprimento constitui uma violação desta licença e pode resultar em <strong style="color:var(--red);">ação legal</strong> e um pedido de remoção DMCA contra o projeto infrator.',
        'license.ownership': 'Propriedade',
        'license.ownership.body': 'O Glacier Client, incluindo seu código-fonte, texturas, ativos de UI, marca, e os nomes "Glacier Client" e "Glacier Productions", é propriedade intelectual da Glacier Productions. Esta licença concede a você um direito limitado e revogável de usar o cliente conforme descrito acima; ela não transfere a você a propriedade de quaisquer ativos ou código subjacentes.',
        'license.thirdParty': 'Ativos de Terceiros',
        'license.thirdParty.body': 'O Glacier Client é um resource pack independente criado para o Minecraft Bedrock Edition e não é afiliado, endossado ou patrocinado pela Mojang Studios ou Microsoft. Minecraft é uma marca registrada da Mojang Synergies AB. Quaisquer bibliotecas ou ativos de terceiros incluídos no Glacier Client permanecem propriedade de seus respectivos donos e são usados sob suas próprias licenças aplicáveis.',
        'license.warranty': 'Sem Garantia & Rescisão',
        'license.warranty.body': 'O Glacier Client é fornecido <strong>"como está"</strong> sem garantia de qualquer tipo, expressa ou implícita. Reservamo-nos o direito de revogar os direitos concedidos sob esta licença, a nosso critério, de qualquer indivíduo ou projeto considerado em violação destes termos.',

        'tos.s1': '1. Aceitação dos Termos',
        'tos.s1.body': 'Ao baixar, instalar ou usar o Glacier Client, ou ao entrar no nosso servidor do Discord, você concorda em ficar vinculado a estes Termos de Serviço e à nossa <a href="/privacy" data-section="privacy">Política de Privacidade</a>. Se você não concordar, não use o Glacier Client nem seus serviços associados.',
        'tos.s2': '2. Natureza do Serviço',
        'tos.s2.body': 'O Glacier Client é um resource pack gratuito, desenvolvido pela comunidade, e um launcher complementar para o Minecraft Bedrock Edition. É fornecido para uso pessoal e não comercial e não modifica a lógica de jogo do Minecraft, não concede vantagens injustas em multiplayer, nem interage com servidores de formas proibidas pelo Contrato de Licença de Usuário Final da Mojang.',
        'tos.s3': '3. Uso Aceitável',
        'tos.s3.body': '<li>Você deve ter idade suficiente para usar o Discord e o Minecraft de acordo com os respectivos termos de serviço, ou ter o consentimento dos pais para tal.</li><li>Você não usará o Glacier Client nem nosso servidor do Discord para assediar terceiros, distribuir malware, ou violar qualquer lei aplicável.</li><li>Você não tentará revender, rebrandear, ou apresentar falsamente o Glacier Client como sendo seu próprio trabalho.</li><li>O uso do Glacier Client também está sujeito à <a href="/license" data-section="license">Licença do Glacier Client</a>, que rege a redistribuição e a atribuição.</li>',
        'tos.s4': '4. Downloads e Links de Terceiros',
        'tos.s4.body': 'Alguns links de download passam por serviços de terceiros (como o Linkvertise) para ajudar a financiar o desenvolvimento. Não controlamos o conteúdo dessas páginas intermediárias e não somos responsáveis por anúncios ou conteúdo neles exibidos. Sempre baixe o Glacier Client através de links publicados no nosso servidor oficial do Discord ou neste site.',
        'tos.s5': '5. Isenção de Garantia e Responsabilidade',
        'tos.s5.body': 'O Glacier Client é fornecido <strong>"como está"</strong> sem garantias de qualquer tipo. Não garantimos funcionamento ininterrupto, compatibilidade com todos os dispositivos ou servidores, ou que o cliente esteja livre de bugs. Na máxima medida permitida por lei, a Glacier Productions não é responsável por quaisquer danos indiretos, incidentais ou consequenciais decorrentes do seu uso do Glacier Client, incluindo, mas não se limitando a, restrições de conta impostas por terceiros como Mojang, Microsoft, ou servidores individuais de Minecraft.',
        'tos.s6': '6. Doações',
        'tos.s6.body': 'As doações feitas via PayPal ou Ko-fi são contribuições voluntárias para apoiar o desenvolvimento contínuo e não compram nenhum bem, serviço, funcionalidade ou direito. As doações geralmente não são reembolsáveis, exceto quando exigido por lei ou pela política da plataforma.',
        'tos.s7': '7. Alterações a Estes Termos',
        'tos.s7.body': 'Podemos atualizar estes Termos de Serviço periodicamente para refletir mudanças no projeto ou na lei aplicável. O uso continuado do Glacier Client após a publicação de alterações constitui aceitação dos termos revisados. Mudanças materiais serão anunciadas no nosso servidor do Discord.',
        'tos.s8': '8. Contato',
        'tos.s8.body': 'Perguntas sobre estes termos podem ser direcionadas à nossa equipe através do <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">servidor oficial do Discord</a>.',

        'privacy.s1': 'Informações que Coletamos',
        'privacy.s1.body': '<li><strong>Configuração do Cliente:</strong> O Glacier Client armazena suas preferências (toggles, opacidade, posições do HUD) localmente em <code>config.json</code> no seu próprio dispositivo. Esses dados nunca saem do seu dispositivo e não são transmitidos para nós.</li><li><strong>Preferências do Site:</strong> Este site armazena uma preferência de tema (claro/escuro) no armazenamento local do seu navegador para lembrar sua escolha entre visitas.</li><li><strong>Contagens Agregadas de Downloads:</strong> Quando você baixa uma versão do cliente, um contador anônimo é incrementado através do nosso Cloudflare Worker para que possamos exibir totais aproximados de downloads. Nenhuma informação pessoal ou identificadora do dispositivo é coletada como parte dessa contagem.</li><li><strong>Atividade no Discord:</strong> Se você entrar no nosso servidor do Discord, suas interações lá são regidas pela <a href="https://discord.com/privacy" target="_blank" rel="noopener">Política de Privacidade própria do Discord</a>, não por esta.</li>',
        'privacy.s2': 'Como Usamos as Informações',
        'privacy.s2.body': 'Quaisquer dados descritos acima são usados exclusivamente para operar e melhorar o Glacier Client e este site, por exemplo, para acompanhar a popularidade agregada dos downloads entre versões. Não vendemos, alugamos, nem compartilhamos suas informações com terceiros para fins de marketing.',
        'privacy.s3': 'Serviços de Terceiros',
        'privacy.s3.body': 'Este site depende de um pequeno número de serviços de terceiros para funcionar, incluindo Cloudflare (hospedagem e contadores de download), Discord (widget da comunidade e convites), e Linkvertise (links de download monetizados). Esses serviços podem coletar independentemente dados, como o endereço IP, sob suas próprias políticas de privacidade, que recomendamos que você revise.',
        'privacy.s4': 'Cookies & Armazenamento Local',
        'privacy.s4.body': 'Usamos o armazenamento local do navegador, não cookies de rastreamento, para lembrar sua preferência de tema. Não usamos cookies de publicidade ou de rastreamento entre sites em glacierclient.xyz. Serviços de terceiros incorporados neste site, como o Linkvertise, podem definir seus próprios cookies conforme descrito em suas respectivas políticas.',
        'privacy.s5': 'Privacidade de Menores',
        'privacy.s5.body': 'O Glacier Client não é direcionado a menores abaixo da idade exigida pelos próprios termos de serviço do Discord e do Minecraft. Não coletamos conscientemente informações pessoais de menores abaixo dessa idade.',
        'privacy.s6': 'Alterações a Esta Política',
        'privacy.s6.body': 'Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou por razões legais. Mudanças materiais serão anunciadas no nosso servidor do Discord, e a data de "Última atualização" acima será revisada de acordo.',
        'privacy.s7': 'Contato',
        'privacy.s7.body': 'Para perguntas ou solicitações relacionadas à privacidade, entre em contato através do nosso <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">servidor oficial do Discord</a>.',

        'faqcat.Getting Started': 'Primeiros Passos',
        'faqcat.Installation & Setup': 'Instalação e Configuração',
        'faqcat.Troubleshooting': 'Solução de Problemas',
        'faqcat.Features & Compatibility': 'Recursos e Compatibilidade',
        'faqcat.Community & Content': 'Comunidade e Conteúdo',
        'faqcat.Legal & Privacy': 'Jurídico e Privacidade',

        'faqq.what-is-glacier': 'O que é o Glacier Client?',
        'faqa.what-is-glacier': '<p>O Glacier Client é um resource pack gratuito para o Minecraft Bedrock Edition que adiciona um HUD personalizável, um menu de mods arrastável com mais de 37 módulos, e recursos de qualidade de vida, sem modificar a lógica do jogo ou dar aos jogadores uma vantagem injusta. Ele é instalado como qualquer outro resource pack e funciona em Mobile, PC e Console.</p>',

        'faqq.is-free': 'O Glacier Client é grátis?',
        'faqa.is-free': '<p>Sim. O Glacier Client é grátis e sempre será. Alguns links de download passam pelo Linkvertise para ajudar a financiar o desenvolvimento e os custos de hospedagem, mas o cliente em si nunca é vendido nem limitado por um paywall. Se você quiser apoiar o desenvolvimento diretamente, veja nossa página de <a href="/donate" data-section="donate">Doar</a>.</p>',

        'faqq.open-mod-menu': 'Como abro o Menu de Mods?',
        'faqa.open-mod-menu': '<ol><li>Abra o <strong>Menu de Pausa</strong> durante o jogo.</li><li>Localize o botão <strong>Ícone de Grade</strong> no canto inferior esquerdo da sua tela.</li><li><strong>Dê um clique duplo</strong> neste botão para alternar o Menu de Mods.</li></ol>',

        'faqq.see-everything': 'Onde posso ver tudo o que o Glacier Client pode fazer?',
        'faqa.see-everything': '<p>Confira a página de <a href="/features" data-section="features">Recursos</a> para uma visão geral, a página <a href="/mods" data-section="mods">Todos os Mods</a> para a lista completa de módulos, e a <a href="/gallery" data-section="gallery">Galeria</a> e os <a href="/community" data-section="community">Vídeos da Comunidade</a> para capturas de tela e tutoriais em vídeo da comunidade.</p>',

        'faqq.import-client': 'Como importo o Glacier Client?',
        'faqa.import-client': '<ol><li><strong>Localize o arquivo:</strong> Encontre o arquivo <code>.zip</code> baixado do Glacier Client no seu dispositivo.</li><li><strong>Abra com o ZArchiver:</strong> Toque no arquivo e selecione ZArchiver entre as opções.</li><li><strong>Renomeie o arquivo:</strong> Pressione e segure o arquivo dentro do ZArchiver, selecione Renomear, e remova a extensão <code>.zip</code> para que o nome do arquivo termine em <code>.mcpack</code>.</li><li><strong>Importe para o Minecraft:</strong> Toque uma vez no arquivo renomeado, toque no ícone de seta ao lado de "Ver", e depois selecione Minecraft para importar e abrir o jogo automaticamente.</li></ol><p>Assim que o Minecraft carregar, ative o Glacier Client nas suas configurações de <strong>Recursos Globais</strong>.</p>',

        'faqq.bypass-linkvertise': 'Como contorno o Linkvertise para baixar?',
        'faqa.bypass-linkvertise': '<ol><li>Vá ao canal de downloads no nosso servidor do Discord e clique no link da versão escolhida.</li><li>Na página do Linkvertise, role para baixo e clique em <strong>"Get Glacier Client"</strong>.</li><li>Uma janela "Access Options" aparece aguarde a contagem regressiva (geralmente 10 segundos).</li><li>Quando o timer chegar a zero, o botão fica ativo. Clique nele para ser redirecionado para a página de download.</li><li>Clique no botão azul <strong>"Download"</strong> para salvar o arquivo <code>.mcpack</code>.</li></ol>',

        'faqq.configure-client': 'Como configuro o Glacier Client?',
        'faqa.configure-client': '<p>Você pode editar o <code>config.json</code> diretamente, ou usar o Editor de Configuração online em <a href="https://config.glacierclient.xyz/" target="_blank" rel="noopener">config.glacierclient.xyz</a>.</p><p><strong>Editores recomendados:</strong></p><ul><li><strong>Android:</strong> MT Manager ou QuickEdit</li><li><strong>iOS:</strong> Documents by Readdle</li><li><strong>PC:</strong> VS Code ou Notepad++</li></ul><p><strong>Encontrando o config.json no Mobile (Android e iOS):</strong></p><ol><li>Abra o app de Arquivos do seu dispositivo.</li><li>Navegue até: <code>Android/data/com.mojang.minecraftpe/files/games/com.mojang/resource_packs/</code></li><li>Abra a pasta <code>Glacier</code> e localize <code>config.json</code>.</li></ol><p><strong>Encontrando o config.json no Windows:</strong></p><ol><li>Pressione <kbd>Win + R</kbd> e cole: <code>%userprofile%\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\resource_packs</code></li><li>Para usuários GDK: <code>%userprofile%\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang\\resource_packs</code></li><li>Abra a pasta <code>Glacier</code> e localize <code>config.json</code>.</li></ol><p><strong>Tipos de valores:</strong> Os toggles usam <code>true</code>/<code>false</code> · A opacidade usa <code>0.0</code>&ndash;<code>1.0</code> · O offset (X, Y) ajusta a posição dos elementos do HUD.</p><p><strong>Tutoriais em vídeo:</strong> <a href="https://youtu.be/RrTHx6V-zp4" target="_blank" rel="noopener">Android / ChromeOS</a> · <a href="https://youtu.be/oaQCtVdNUXg" target="_blank" rel="noopener">iPadOS / iOS</a></p>',

        'faqq.reimport-after-update': 'Preciso reimportar o Glacier Client depois de cada atualização?',
        'faqa.reimport-after-update': '<p>Sim, os resource packs são atualizados substituindo o arquivo, não aplicando patches no local. Baixe a nova versão, importe-a da mesma forma que antes, e reative-a em Recursos Globais. Suas configurações de <code>config.json</code> são armazenadas separadamente e não são afetadas pela reimportação, então sua personalização é mantida automaticamente.</p>',

        'faqq.use-with-other-packs': 'Posso usar o Glacier Client junto com outros resource packs?',
        'faqa.use-with-other-packs': '<p>Sim, desde que o outro pack não edite os mesmos arquivos de UI. Coloque o Glacier Client no topo da sua pilha de Recursos Globais para os melhores resultados. Veja <strong>Por que o Glacier Client não está funcionando corretamente?</strong> abaixo para uma lista de conflitos comuns.</p>',

        'faqq.uninstall': 'Como desinstalo o Glacier Client?',
        'faqa.uninstall': '<ol><li>Abra o Minecraft e vá em <strong>Configurações → Recursos Globais</strong> de um mundo (ou as configurações de resource packs próprias de um mundo).</li><li>Encontre <strong>Glacier Client</strong> na lista de Ativos e mova-o de volta para Meus Packs, ou remova-o completamente.</li><li>Para remover completamente os arquivos, exclua o pack <strong>Glacier</strong> da sua pasta <code>resource_packs</code> (veja o guia de configuração acima para o caminho da pasta na sua plataforma).</li></ol><p>Desinstalar não afeta de forma alguma seus mundos, jogos salvos ou conta do Minecraft.</p>',

        'faqq.not-working-correctly': 'Por que o Glacier Client não está funcionando corretamente?',
        'faqa.not-working-correctly': '<p>As causas mais comuns são packs em conflito ou restrições do servidor:</p><ul><li><strong>Packs em conflito:</strong> Qualquer pack ou add-on que modifique <code>player.entity.json</code> (ex.: Actions &amp; Stuff) ou <code>hud_screen.json</code> (ex.: Better Bedrock) entrará em conflito com o Glacier Client. Desative esses packs primeiro.</li><li><strong>Restrições do lado do servidor:</strong> Alguns servidores bloqueiam totalmente sobreposições de UI personalizadas, algo comum em servidores de eventos do Minecraft. Os recursos do Glacier não aparecerão nesses servidores, e isso não pode ser resolvido do nosso lado.</li></ul>',

        'faqq.mod-menu-not-appearing': 'O botão do Menu de Mods não aparece. O que faço?',
        'faqa.mod-menu-not-appearing': '<ol><li>Confirme que o Glacier Client está <strong>acima</strong> de outros resource packs em Recursos Globais, e que está realmente ativo (não apenas instalado).</li><li>Feche completamente e reabra o Minecraft, isso atualiza os resource packs carregados.</li><li>Verifique se há um pack em conflito, conforme descrito em <strong>Por que o Glacier Client não está funcionando corretamente?</strong> acima.</li><li>Se ainda não aparecer, pergunte no canal de bug-reports no Discord com o modelo do seu dispositivo e a versão do Minecraft.</li></ol>',

        'faqq.settings-reset': 'Minhas configurações são redefinidas depois de uma atualização. Por quê?',
        'faqa.settings-reset': '<p>Isso geralmente acontece quando o <code>config.json</code> é excluído ou sobrescrito durante a importação, por exemplo, se você extraiu a nova versão em uma pasta nova em vez de atualizar no mesmo local. Faça backup do seu <code>config.json</code> antes de atualizar se você personalizou bastante sua configuração, depois cole-o de volta na pasta da nova versão em seguida.</p>',

        'faqq.safe-to-use': 'O Glacier Client é seguro de usar, e pode me fazer ser banido?',
        'faqa.safe-to-use': '<p>O Glacier Client é um resource pack, ele altera texturas e UI, não injeta código, não modifica a lógica do jogo nem concede vantagens de jogo como alcance, mira assistida ou combate automatizado. Ele funciona dentro do sistema oficial de resource packs do Minecraft Bedrock.</p><ul><li><strong>Vanilla e Realms:</strong> Seguro de usar. Resource packs são um recurso do lado do cliente suportado pelo Minecraft Bedrock.</li><li><strong>Servidores de terceiros:</strong> Alguns servidores proíbem explicitamente qualquer resource pack personalizado, incluindo os cosméticos, em suas próprias regras. Sempre confira as regras de um servidor antes de entrar com qualquer UI modificada.</li></ul><p>Não distribuímos clientes de trapaça, e não apoiamos nem endossamos o uso do Glacier Client para violar os termos de serviço de um servidor.</p>',

        'faqq.compatible-devices': 'Quais dispositivos e versões são compatíveis?',
        'faqa.compatible-devices': '<p>O Glacier Client suporta todos os dispositivos que executam a versão <strong>Oficial</strong> do Minecraft Bedrock Edition.</p><ul><li><strong>Previews / Betas:</strong> O cliente pode funcionar em builds Preview, mas a estabilidade não é garantida, já que a Mojang muda frequentemente o código central da UI nas versões Preview.</li><li><strong>Console (Xbox e PlayStation):</strong> Suportado através do método Realms. Instale primeiro em Mobile ou PC, ative-o em um Realm, depois baixe-o no seu console através de Configurações do Realm → Resource Packs → Baixar, e ative-o em Recursos Globais.</li></ul><p><a href="https://www.youtube.com/watch?v=1f7P9J-W8aM" target="_blank" rel="noopener">Assista ao tutorial de instalação no console →</a></p>',

        'faqq.boost-fps': 'O Glacier Client aumenta os FPS?',
        'faqa.boost-fps': '<p>O Glacier Client é projetado para <strong>utilidade e personalização</strong>, não como um potencializador de FPS.</p><ul><li>O Minecraft Bedrock já é um mecanismo altamente otimizado.</li><li>A maioria dos packs "potencializadores de FPS" não melhora realmente o desempenho. Muitas vezes eles adicionam sobrecarga de processamento extra sem reduzir a carga real do mecanismo, o que pode <em>diminuir</em> os FPS.</li><li>Muitos desses packs encontrados online são clickbait projetados para visualizações em vez de uma melhoria técnica genuína.</li></ul><p>O Glacier foca em fornecer uma experiência estável e de alta qualidade com recursos que realmente melhoram a jogabilidade.</p>',

        'faqq.impossible-features': 'Quais recursos são impossíveis ou não estão planejados?',
        'faqa.impossible-features': '<p><strong>Tecnicamente impossíveis</strong> devido a limitações do mecanismo:</p><ul><li><strong>HUD:</strong> Durabilidade da armadura no HUD, contadores precisos de CPS/Combo, contadores de alcance, Quick Drop no HUD.</li><li><strong>Visuais:</strong> Full Bright, Motion Blur, sem câmera de dano, física de itens, shaders.</li><li><strong>Ferramentas:</strong> Minimapas, Keystrokes, Replay Mod, pré-visualizações de shulkers, gráficos de pizza, nametags em terceira pessoa.</li><li><strong>Automação:</strong> Auto GG, Auto Totem, Autosprint, alternar agachar, alternar correr.</li><li><strong>Sistemas:</strong> Listas de amigos, mod de voz, alternadores de resource pack dentro do jogo.</li></ul><p><strong>Não planejados:</strong></p><ul><li>Zoom, ESP, modais de visualização, modelos de jogador 3D, qualquer forma de trapaça ou hacks, texturas personalizadas para a UI geral (excluindo a barra de acesso rápido e a barra de XP).</li></ul>',

        'faqq.works-with-shaders': 'O Glacier Client funciona com shaders ou outros mods visuais?',
        'faqa.works-with-shaders': '<p>O Glacier Client edita apenas arquivos de UI e HUD, não mexe na iluminação ou renderização, então geralmente é compatível com packs de shaders e outros add-ons puramente visuais. Conflitos só surgem com packs que editam os mesmos arquivos de HUD/menu que o Glacier usa; veja as notas de compatibilidade acima.</p>',

        'faqq.java-dll-version': 'Existe uma versão para Minecraft Java Edition ou um cliente DLL nativo?',
        'faqa.java-dll-version': '<p>Ambos estão em desenvolvimento ativo. Acompanhe o progresso e os anúncios de lançamento na página de <a href="/downloads" data-section="downloads">Downloads</a> e no nosso servidor do Discord, eles aparecerão lá assim que uma build estiver pronta.</p>',

        'faqq.report-bugs': 'Como reporto bugs ou sugiro recursos?',
        'faqa.report-bugs': '<p>Valorizamos o feedback da comunidade. Siga este processo:</p><ol><li><strong>Verifique reportes existentes:</strong> Navegue pelo canal de bug-reports no Discord para ver se o problema já foi registrado.</li><li><strong>Forneça detalhes:</strong> Inclua o <strong>modelo do seu dispositivo</strong> e um <strong>vídeo ou captura de tela</strong> do problema.</li><li><strong>Envie sugestões:</strong> Publique novas ideias no canal de sugestões. Verifique a lista "Impossível" no FAQ antes de publicar para garantir que sua ideia seja tecnicamente viável.</li></ol>',

        'faqq.review-content': 'Posso avaliar ou criar conteúdo com o Glacier Client?',
        'faqa.review-content': '<p>Sim, desde que você siga estas regras. Violá-las pode resultar em banimento do servidor ou advertência:</p><ul><li><strong>Apenas links oficiais:</strong> Sempre faça link para o nosso <a href="https://discord.glacierclient.xyz" target="_blank" rel="noopener">convite oficial do Discord</a>, nunca para Mediafire ou outros mirrors de terceiros.</li><li><strong>Sem desinformação:</strong> Não espalhe alegações falsas nem participe de atividades difamatórias.</li><li><strong>Sem roubo de assets:</strong> Não distribua publicamente o conteúdo do pack sem permissão explícita.</li><li><strong>Atribuição obrigatória:</strong> Se você usar nosso método de salvamento de mods arrastáveis, deve creditar o Glacier Client e incluir o link do nosso servidor. O uso não autorizado resultará em ação legal e uma remoção DMCA.</li><li><strong>Uso privado permitido:</strong> Você pode usar código ou conteúdo em seus próprios packs privados e não públicos.</li></ul><p>Os termos completos estão disponíveis na nossa <a href="/license" data-section="license">Licença</a> e <a href="/tos" data-section="tos">Termos de Serviço</a>.</p>',

        'faqq.watch-in-action': 'Onde posso ver o Glacier Client em ação?',
        'faqa.watch-in-action': '<p>Veja nossa seção de <a href="/community" data-section="community">Vídeos da Comunidade</a> para vídeos selecionados da comunidade, ou procure "Glacier Client" no YouTube para as últimas análises e tutoriais independentes da comunidade Minecraft Bedrock.</p>',

        'faqq.get-involved': 'Como posso me envolver além de reportar bugs?',
        'faqa.get-involved': '<p>Junte-se ao nosso Discord e se apresente. Estamos regularmente procurando membros da comunidade para ajudar com traduções, testes de builds pré-lançamento e moderação do servidor. Anúncios para essas funções são publicados no Discord quando estão abertos.</p>',

        'faqq.data-collected': 'Quais informações o Glacier Client coleta sobre mim?',
        'faqa.data-collected': '<p>Muito pouco. Suas escolhas de configuração são armazenadas localmente no seu próprio dispositivo e nunca são enviadas para nós. O site apenas rastreia contagens de downloads anônimas e agregadas para exibir a popularidade das versões, nenhum dado pessoal é associado a essa contagem.</p><p>Todos os detalhes estão disponíveis na nossa <a href="/privacy" data-section="privacy">Política de Privacidade</a>.</p>',

        'faqq.donations-refundable': 'As doações são reembolsáveis, e o que elas apoiam?',
        'faqa.donations-refundable': '<p>As doações feitas via PayPal ou Ko-fi são voluntárias e financiam diretamente o desenvolvimento contínuo, os custos de hospedagem e novos recursos. Elas não são pagamentos por um produto ou assinatura e geralmente não são reembolsáveis, exceto quando exigido por lei ou pela própria política da plataforma de pagamento.</p><p>Veja nossos <a href="/tos" data-section="tos">Termos de Serviço</a> para todos os detalhes.</p>',

        'faqq.who-owns-client': 'Quem é dono do Glacier Client, e posso redistribuí-lo?',
        'faqa.who-owns-client': '<p>O Glacier Client e seus ativos são propriedade da Glacier Productions. Redistribuição, rebranding ou revenda do pack sem permissão não é permitida. Veja nossa <a href="/license" data-section="license">Licença</a> para os termos completos sobre uso permitido e proibido.</p>'
    }
};
