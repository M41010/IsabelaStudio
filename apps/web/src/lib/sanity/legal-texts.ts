/**
 * BORRADORES de los textos legales (aviso legal, privacidad, cookies) en ES y EN.
 * ⚠ Deben revisarlos un profesional y completarse los `[PENDIENTE: …]` antes de publicar.
 *
 * Fuente única para dos usos:
 * - `fixtures.ts` (web sin Sanity): se muestran tal cual mientras no hay CMS.
 * - `apps/studio/seed/seed.ts`: se cargan en Sanity como `textBlock` de cada página fija.
 * Una vez en Sanity, el texto vivo es el del CMS; este fichero solo sirve de punto de partida.
 *
 * Módulo de datos puro (sin imports) para que lo puedan importar las dos apps.
 *
 * Formato ligero, convertido a Portable Text con `legalMarkupToPortableText`:
 * - Bloques separados por una línea en blanco.
 * - `## Título` → h2 (sección) · `### Título` → h3 (subsección).
 * - Líneas que empiezan por `- ` → lista con puntos (un elemento por línea).
 * - En línea: `**negrita**` y `[texto](https://…)` (enlace; admite rutas relativas).
 */

export type LegalPageId = 'legal-notice' | 'privacy' | 'cookies';

export interface LegalText {
  title: { es: string; en: string };
  es: string;
  en: string;
}

// ---------------------------------------------------------------------------
// Aviso legal (LSSI-CE, art. 10)
// ---------------------------------------------------------------------------

const legalNoticeEs = `
## Datos identificativos

En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:

- **Titular:** [PENDIENTE: nombre o razón social]
- **Nombre comercial:** Isabela Studio
- **NIF:** [PENDIENTE: NIF]
- **Domicilio:** [PENDIENTE: domicilio]
- **Correo electrónico:** [PENDIENTE: email]
- **Datos registrales:** [PENDIENTE: inscripción en el Registro Mercantil, solo si el titular es una sociedad]

**Actividad:** diseño, patronaje y confección artesanal de prendas de moda, prêt-à-porter y trajes de flamenca, por encargo.

## Objeto

Este sitio web tiene carácter informativo: presenta el trabajo de Isabela Studio, sus colecciones y la forma de encargar una pieza. No es una tienda online ni permite contratar o comprar a través de él. Los encargos se acuerdan de forma individual con cada cliente, fuera de la web.

El acceso y la navegación por el sitio atribuyen la condición de usuario e implican la aceptación de este aviso legal. Si no estás de acuerdo con él, te pedimos que no utilices el sitio.

## Condiciones de uso

El usuario se compromete a hacer un uso adecuado del sitio y de sus contenidos, conforme a la ley, a la buena fe y a este aviso legal, y a no emplearlos para actividades ilícitas o que puedan dañar los derechos de Isabela Studio o de terceros.

## Propiedad intelectual e industrial

Todos los contenidos de este sitio (diseños de las prendas, fotografías, bocetos, vídeos, textos, logotipos, marca «Isabela Studio» y diseño gráfico de la web) pertenecen a su titular o a terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial.

Queda prohibida su reproducción, distribución, comunicación pública o transformación, total o parcial, con fines comerciales o sin citar la fuente, sin la autorización previa y por escrito del titular. Se permite compartir enlaces a las páginas del sitio y visualizar sus contenidos para uso personal y privado.

Las fotografías pueden incluir obra de fotógrafos, modelos y otros colaboradores, cuyos derechos se respetan y se mencionan cuando corresponde.

## Responsabilidad

El titular procura que la información del sitio sea correcta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad ininterrumpida del sitio, y no se hace responsable de los daños que pudieran derivarse de interrupciones técnicas, virus o fallos ajenos a su control.

Las imágenes de las colecciones son orientativas: cada pieza se confecciona a mano y a medida, por lo que tejidos, colores y acabados pueden variar.

El sitio incluye enlaces a servicios de terceros, como Instagram. El titular no controla ni se responsabiliza de sus contenidos ni de sus políticas, que se rigen por sus propias condiciones.

## Protección de datos y cookies

El tratamiento de datos personales se explica en la [Política de privacidad](/es/privacidad/) y el uso de cookies en la [Política de cookies](/es/cookies/).

## Legislación aplicable y jurisdicción

Este aviso legal se rige por la legislación española. Para cualquier controversia, y salvo que la normativa de consumidores y usuarios establezca otro fuero, las partes se someten a los juzgados y tribunales de [PENDIENTE: ciudad].
`;

const legalNoticeEn = `
This English version is provided for information purposes. In case of discrepancy, the Spanish version prevails.

## Identification details

In compliance with article 10 of Spanish Law 34/2002 of 11 July on Information Society Services and Electronic Commerce (LSSI-CE), the owner of this website is:

- **Owner:** [PENDIENTE: nombre o razón social]
- **Trade name:** Isabela Studio
- **Tax ID (NIF):** [PENDIENTE: NIF]
- **Address:** [PENDIENTE: domicilio]
- **Email:** [PENDIENTE: email]
- **Registration details:** [PENDIENTE: inscripción en el Registro Mercantil, solo si el titular es una sociedad]

**Activity:** design, pattern-making and handcrafted making of fashion garments, ready-to-wear and flamenca dresses, made to order.

## Purpose

This website is informative: it presents the work of Isabela Studio, its collections and how to commission a piece. It is not an online shop and no purchase or contract can be made through it. Commissions are agreed individually with each client, outside the website.

Accessing and browsing the site makes you a user and implies acceptance of this legal notice. If you do not agree with it, please do not use the site.

## Terms of use

Users undertake to use the site and its content appropriately, in accordance with the law, good faith and this legal notice, and not to use them for unlawful purposes or in ways that may harm the rights of Isabela Studio or third parties.

## Intellectual and industrial property

All content on this site (garment designs, photographs, sketches, videos, texts, logos, the «Isabela Studio» brand and the website design) belongs to its owner or to third parties who have authorised its use, and is protected by intellectual and industrial property law.

Reproduction, distribution, public communication or transformation, in whole or in part, for commercial purposes or without citing the source, is prohibited without the prior written consent of the owner. You may share links to the site's pages and view its content for personal, private use.

Photographs may include work by photographers, models and other collaborators, whose rights are respected and credited where appropriate.

## Liability

The owner strives to keep the information on the site accurate and up to date, but does not guarantee that it is error-free or that the site will be available without interruption, and is not liable for damage arising from technical interruptions, viruses or failures beyond its control.

Collection images are for guidance only: each piece is handmade and made to measure, so fabrics, colours and finishes may vary.

The site includes links to third-party services such as Instagram. The owner does not control and is not responsible for their content or policies, which are governed by their own terms.

## Data protection and cookies

The processing of personal data is explained in the [Privacy policy](/en/privacy/) and the use of cookies in the [Cookie policy](/en/cookies/).

## Governing law and jurisdiction

This legal notice is governed by Spanish law. For any dispute, and unless consumer protection law provides for a different venue, the parties submit to the courts of [PENDIENTE: ciudad].
`;

// ---------------------------------------------------------------------------
// Política de privacidad (RGPD y LOPDGDD)
// ---------------------------------------------------------------------------

const privacyEs = `
## Responsable del tratamiento

- **Responsable:** [PENDIENTE: nombre o razón social] (Isabela Studio)
- **NIF:** [PENDIENTE: NIF]
- **Domicilio:** [PENDIENTE: domicilio]
- **Correo electrónico:** [PENDIENTE: email]

Esta política explica cómo se tratan tus datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).

## Qué datos tratamos y para qué

Este sitio no tiene formularios ni cuentas de usuario. Solo tratamos los datos que tú decides enviarnos y, si lo aceptas, datos de navegación con fines estadísticos.

### Consultas y encargos por email o Instagram

Si nos escribes por correo electrónico o por mensaje directo en Instagram, tratamos tu nombre, tu dirección de email o tu usuario de Instagram y lo que nos cuentes en el mensaje (por ejemplo, la pieza que buscas, la fecha del evento o tus medidas, si nos las facilitas) para responderte, darte presupuesto, concertar citas y, si se formaliza, gestionar tu encargo.

### Clientes

Si haces un encargo, tratamos además los datos necesarios para confeccionarlo, entregarlo y facturarlo (datos de contacto, medidas, datos de facturación y de pago).

### Estadísticas de uso (solo con tu consentimiento)

Si aceptas las cookies de analítica, usamos Google Analytics 4 para saber de forma agregada cuántas personas visitan la web, qué páginas ven y desde dónde llegan, y así mejorarla. Se tratan identificadores online, datos del dispositivo y del navegador, y una ubicación aproximada. Google Analytics 4 no registra ni almacena direcciones IP completas. Puedes ver el detalle en la [Política de cookies](/es/cookies/).

### Datos técnicos de navegación

Al visitar la web, tu navegador envía de forma automática tu dirección IP y datos técnicos a los servidores que la alojan y que sirven las imágenes y los vídeos. Se usan solo para mostrarte la página y mantener la seguridad del servicio.

## Base jurídica

- **Responder a tus consultas:** tu consentimiento al escribirnos (art. 6.1.a RGPD) y, cuando nos pides un presupuesto o un encargo, la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).
- **Gestionar encargos:** la ejecución del contrato (art. 6.1.b RGPD) y el cumplimiento de obligaciones legales fiscales y contables (art. 6.1.c RGPD).
- **Estadísticas de uso:** tu consentimiento, que puedes retirar en cualquier momento (art. 6.1.a RGPD y art. 22.2 LSSI-CE).
- **Datos técnicos de navegación:** el interés legítimo en ofrecer un sitio web que funcione y sea seguro (art. 6.1.f RGPD).

## Conservación

- **Consultas que no terminan en encargo:** el tiempo necesario para atenderlas y, como máximo, un año desde el último contacto.
- **Datos de clientes:** mientras dure la relación y, después, durante los plazos legales (seis años para la documentación contable según el Código de Comercio y cuatro años a efectos fiscales).
- **Estadísticas de Google Analytics:** [PENDIENTE: 2 o 14 meses, según la configuración de retención de Google Analytics].
- **Datos técnicos de navegación:** los plazos breves de los registros de los proveedores de alojamiento.

## Destinatarios

No vendemos ni cedemos tus datos a terceros, salvo obligación legal (por ejemplo, a la Agencia Tributaria). Para prestar el servicio contamos con proveedores que actúan como encargados del tratamiento, con contrato y garantías conforme al RGPD:

- **Google Ireland Limited** (Google Analytics 4), solo si aceptas las cookies de analítica.
- **Cloudflare, Inc.** (alojamiento y entrega de la web).
- **Sanity AS** (gestor de contenidos y servidor de imágenes).
- **Mux, Inc.** (alojamiento y reproducción de los vídeos).
- [PENDIENTE: proveedor de correo electrónico, por ejemplo Google Workspace]

Si nos escribes por Instagram, Meta Platforms Ireland Limited trata tus datos como responsable independiente, conforme a su propia [política de privacidad](https://privacycenter.instagram.com/policy).

## Transferencias internacionales

Algunos de estos proveedores (Google, Cloudflare, Mux) pueden tratar datos en Estados Unidos. Estas transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU. (Data Privacy Framework), en el que están certificadas estas empresas, o en las cláusulas contractuales tipo aprobadas por la Comisión Europea.

## Tus derechos

Puedes ejercer en cualquier momento tus derechos de **acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad**, así como a no ser objeto de decisiones automatizadas, escribiendo a [PENDIENTE: email] e indicando qué derecho quieres ejercer. Si es necesario para comprobar tu identidad, podremos pedirte información adicional.

Cuando el tratamiento se basa en tu consentimiento, puedes retirarlo cuando quieras, sin que ello afecte a la licitud del tratamiento anterior. Para las cookies de analítica, basta con cambiar tu elección en «Configurar cookies».

Si consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos ([www.aepd.es](https://www.aepd.es)), C/ Jorge Juan 6, 28001 Madrid.

## Menores de edad

Este sitio no está dirigido a menores de 14 años. Si eres menor de esa edad, pide a tu madre, padre o tutor que se ponga en contacto con nosotros.

## Seguridad y cambios en esta política

Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos. Podemos actualizar esta política para adaptarla a cambios legales o del sitio; la fecha de la última actualización figura en esta página.
`;

const privacyEn = `
This English version is provided for information purposes. In case of discrepancy, the Spanish version prevails.

## Data controller

- **Controller:** [PENDIENTE: nombre o razón social] (Isabela Studio)
- **Tax ID (NIF):** [PENDIENTE: NIF]
- **Address:** [PENDIENTE: domicilio]
- **Email:** [PENDIENTE: email]

This policy explains how your personal data is processed under Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 on the Protection of Personal Data and Guarantee of Digital Rights (LOPDGDD).

## What data we process and why

This site has no forms or user accounts. We only process the data you choose to send us and, if you agree, browsing data for statistical purposes.

### Enquiries and commissions by email or Instagram

If you write to us by email or direct message on Instagram, we process your name, your email address or Instagram username and whatever you tell us in your message (for example, the piece you are looking for, the date of your event or your measurements, if you share them) in order to reply, provide a quote, arrange appointments and, if agreed, manage your commission.

### Clients

If you commission a piece, we also process the data needed to make, deliver and invoice it (contact details, measurements, billing and payment details).

### Usage statistics (only with your consent)

If you accept analytics cookies, we use Google Analytics 4 to learn, in aggregate, how many people visit the site, which pages they view and where they come from, so we can improve it. Online identifiers, device and browser data and an approximate location are processed. Google Analytics 4 does not log or store full IP addresses. See the [Cookie policy](/en/cookies/) for details.

### Technical browsing data

When you visit the site, your browser automatically sends your IP address and technical data to the servers that host it and serve its images and videos. This is used only to display the page and keep the service secure.

## Legal basis

- **Replying to your enquiries:** your consent when you write to us (art. 6.1.a GDPR) and, when you ask for a quote or a commission, steps taken at your request prior to entering into a contract (art. 6.1.b GDPR).
- **Managing commissions:** performance of the contract (art. 6.1.b GDPR) and compliance with tax and accounting obligations (art. 6.1.c GDPR).
- **Usage statistics:** your consent, which you can withdraw at any time (art. 6.1.a GDPR and art. 22.2 LSSI-CE).
- **Technical browsing data:** our legitimate interest in providing a working, secure website (art. 6.1.f GDPR).

## Retention

- **Enquiries that do not lead to a commission:** as long as needed to handle them and, at most, one year from the last contact.
- **Client data:** for the duration of the relationship and then for the legally required periods (six years for accounting records under the Spanish Commercial Code and four years for tax purposes).
- **Google Analytics statistics:** [PENDIENTE: 2 o 14 meses, según la configuración de retención de Google Analytics].
- **Technical browsing data:** the short log retention periods of the hosting providers.

## Recipients

We do not sell or share your data with third parties, except where required by law (for example, to the Spanish Tax Agency). To provide the service we rely on providers acting as data processors, under contracts and safeguards that comply with the GDPR:

- **Google Ireland Limited** (Google Analytics 4), only if you accept analytics cookies.
- **Cloudflare, Inc.** (website hosting and delivery).
- **Sanity AS** (content management and image delivery).
- **Mux, Inc.** (video hosting and playback).
- [PENDIENTE: proveedor de correo electrónico, por ejemplo Google Workspace]

If you write to us on Instagram, Meta Platforms Ireland Limited processes your data as an independent controller, under its own [privacy policy](https://privacycenter.instagram.com/policy).

## International transfers

Some of these providers (Google, Cloudflare, Mux) may process data in the United States. These transfers rely on the EU-U.S. Data Privacy Framework, under which these companies are certified, or on the standard contractual clauses approved by the European Commission.

## Your rights

You may at any time exercise your rights of **access, rectification, erasure, objection, restriction of processing and portability**, as well as the right not to be subject to automated decisions, by writing to [PENDIENTE: email] and stating which right you wish to exercise. If needed to verify your identity, we may ask you for additional information.

Where processing is based on your consent, you may withdraw it at any time, without affecting the lawfulness of prior processing. For analytics cookies, simply change your choice under «Cookie settings».

If you believe we have not handled your data properly, you may lodge a complaint with the Spanish Data Protection Agency ([www.aepd.es](https://www.aepd.es)), C/ Jorge Juan 6, 28001 Madrid, Spain.

## Minors

This site is not intended for children under 14. If you are under that age, please ask your parent or guardian to contact us.

## Security and changes to this policy

We apply appropriate technical and organisational measures to protect your data. We may update this policy to reflect legal or website changes; the date of the last update is shown on this page.
`;

// ---------------------------------------------------------------------------
// Política de cookies (LSSI-CE art. 22.2 y Guía de cookies de la AEPD)
// ---------------------------------------------------------------------------

const cookiesEs = `
## Qué son las cookies

Las cookies son pequeños archivos que un sitio web guarda en tu navegador para recordar información sobre tu visita. Algunas son imprescindibles para que la web funcione; otras, como las de analítica, solo se instalan si las aceptas.

## Qué cookies usamos

### Cookie técnica (necesaria)

- **cc_cookie** · propia · guarda tu elección sobre las cookies (aceptar, rechazar o configurar) para no volver a preguntarte en cada visita · duración: 6 meses.

Esta cookie está exenta de consentimiento porque es necesaria para recordar tu decisión.

### Cookies de analítica (solo con tu consentimiento)

Usamos Google Analytics 4, un servicio de Google Ireland Limited, para obtener estadísticas agregadas sobre el uso de la web: páginas visitadas, tiempo de visita, tipo de dispositivo o país de procedencia.

- **_ga** · Google Analytics · distingue a visitantes únicos mediante un identificador aleatorio · duración: 2 años.
- **_ga_[PENDIENTE: ID de medición]** · Google Analytics · mantiene el estado de la sesión · duración: 2 años.

Estas cookies **solo se instalan si las aceptas**. Si las rechazas o no eliges, no se instala ninguna cookie de analítica ni se envía información a Google Analytics. Más información en la [política de privacidad de Google](https://policies.google.com/privacy).

No usamos cookies publicitarias ni de redes sociales. Los enlaces a Instagram son enlaces normales: Instagram solo podrá instalar sus propias cookies si visitas su web o su aplicación.

## Cómo aceptar, rechazar o cambiar tu elección

La primera vez que visitas la web te mostramos un aviso para que aceptes, rechaces o configures las cookies de analítica. Rechazar es tan fácil como aceptar.

Puedes cambiar de opinión en cualquier momento desde el enlace «Configurar cookies», disponible al pie de todas las páginas. Si retiras el consentimiento, las cookies de analítica dejarán de usarse.

## Cómo gestionar las cookies desde el navegador

También puedes bloquear o borrar las cookies desde la configuración de tu navegador. Si bloqueas todas, es posible que la web te vuelva a preguntar por tus preferencias en cada visita.

- [Google Chrome](https://support.google.com/chrome/answer/95647)
- [Mozilla Firefox](https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias)
- [Safari](https://support.apple.com/es-es/guide/safari/sfri11471/mac)
- [Microsoft Edge](https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d)

Google ofrece además un [complemento para desactivar Google Analytics](https://tools.google.com/dlpage/gaoptout) en todos los sitios web.

## Más información

El responsable es [PENDIENTE: nombre o razón social]. Puedes escribirnos a [PENDIENTE: email]. Sobre el tratamiento de tus datos y tus derechos, consulta la [Política de privacidad](/es/privacidad/).
`;

const cookiesEn = `
This English version is provided for information purposes. In case of discrepancy, the Spanish version prevails.

## What cookies are

Cookies are small files that a website stores in your browser to remember information about your visit. Some are essential for the site to work; others, such as analytics cookies, are only set if you accept them.

## Cookies we use

### Technical cookie (necessary)

- **cc_cookie** · first party · stores your cookie choice (accept, reject or customise) so we do not ask you again on every visit · duration: 6 months.

This cookie is exempt from consent because it is needed to remember your decision.

### Analytics cookies (only with your consent)

We use Google Analytics 4, a service of Google Ireland Limited, to obtain aggregate statistics on how the site is used: pages visited, visit duration, device type or country of origin.

- **_ga** · Google Analytics · distinguishes unique visitors with a random identifier · duration: 2 years.
- **_ga_[PENDIENTE: ID de medición]** · Google Analytics · keeps the session state · duration: 2 years.

These cookies **are only set if you accept them**. If you reject them or make no choice, no analytics cookie is set and no information is sent to Google Analytics. More information in [Google's privacy policy](https://policies.google.com/privacy).

We do not use advertising or social media cookies. Links to Instagram are plain links: Instagram can only set its own cookies if you visit its website or app.

## How to accept, reject or change your choice

The first time you visit the site we show a notice so you can accept, reject or customise analytics cookies. Rejecting is as easy as accepting.

You can change your mind at any time through the «Cookie settings» link in the footer of every page. If you withdraw your consent, analytics cookies will no longer be used.

## How to manage cookies in your browser

You can also block or delete cookies in your browser settings. If you block all cookies, the site may ask for your preferences again on every visit.

- [Google Chrome](https://support.google.com/chrome/answer/95647?hl=en)
- [Mozilla Firefox](https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop)
- [Safari](https://support.apple.com/en-gb/guide/safari/sfri11471/mac)
- [Microsoft Edge](https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d)

Google also offers a [browser add-on to opt out of Google Analytics](https://tools.google.com/dlpage/gaoptout) on all websites.

## More information

The controller is [PENDIENTE: nombre o razón social]. You can write to us at [PENDIENTE: email]. For how your data is processed and your rights, see the [Privacy policy](/en/privacy/).
`;

export const legalTexts: Record<LegalPageId, LegalText> = {
  'legal-notice': { title: { es: 'Aviso legal', en: 'Legal notice' }, es: legalNoticeEs, en: legalNoticeEn },
  privacy: { title: { es: 'Política de privacidad', en: 'Privacy policy' }, es: privacyEs, en: privacyEn },
  cookies: { title: { es: 'Política de cookies', en: 'Cookie policy' }, es: cookiesEs, en: cookiesEn },
};

// ---------------------------------------------------------------------------
// Conversión a Portable Text
// ---------------------------------------------------------------------------

/** Forma mínima de un bloque de Portable Text (compatible con `@portabletext/types`). */
export interface LegalPtBlock {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h2' | 'h3';
  listItem?: 'bullet';
  level?: number;
  markDefs: { _type: 'link'; _key: string; href: string }[];
  children: { _type: 'span'; _key: string; text: string; marks: string[] }[];
}

/** Separa `**negrita**` y `[texto](url)` en spans con sus marcas. */
function inline(text: string, key: () => string): Pick<LegalPtBlock, 'markDefs' | 'children'> {
  const markDefs: LegalPtBlock['markDefs'] = [];
  const children: LegalPtBlock['children'] = [];
  // `[PENDIENTE: …]` sin `(url)` detrás queda como texto.
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const index = m.index ?? 0;
    if (index > last) children.push({ _type: 'span', _key: key(), text: text.slice(last, index), marks: [] });
    if (m[1] !== undefined) {
      children.push({ _type: 'span', _key: key(), text: m[1], marks: ['strong'] });
    } else if (m[2] !== undefined && m[3] !== undefined) {
      const def = { _type: 'link' as const, _key: key(), href: m[3] };
      markDefs.push(def);
      children.push({ _type: 'span', _key: key(), text: m[2], marks: [def._key] });
    }
    last = index + m[0].length;
  }
  if (last < text.length) children.push({ _type: 'span', _key: key(), text: text.slice(last), marks: [] });
  return { markDefs, children };
}

/** Convierte el formato ligero de este fichero en bloques de Portable Text. */
export function legalMarkupToPortableText(markup: string, key: () => string): LegalPtBlock[] {
  const out: LegalPtBlock[] = [];
  for (const chunk of markup.trim().split(/\n\s*\n/)) {
    const lines = chunk
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;
    if (lines.every((l) => l.startsWith('- '))) {
      for (const l of lines) {
        out.push({ _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, ...inline(l.slice(2), key) });
      }
      continue;
    }
    const text = lines.join(' ');
    const heading = /^(#{2,3})\s+(.*)$/.exec(text);
    if (heading?.[1] && heading[2] !== undefined) {
      out.push({ _type: 'block', _key: key(), style: heading[1] === '##' ? 'h2' : 'h3', ...inline(heading[2], key) });
    } else {
      out.push({ _type: 'block', _key: key(), style: 'normal', ...inline(text, key) });
    }
  }
  return out;
}
