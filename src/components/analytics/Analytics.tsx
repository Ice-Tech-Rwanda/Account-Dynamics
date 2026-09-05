import Script from "next/script";
import { headers } from "next/headers";

/**
 * Google Analytics 4, gated by NEXT_PUBLIC_GA_MEASUREMENT_ID (inlined at build).
 * Renders nothing when unset, so a default build ships zero third-party scripts
 * and keeps the strict CSP. When enabled, the nonce from middleware is applied
 * so the inline gtag bootstrap passes the production CSP.
 */
export async function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;

  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <>
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        nonce={nonce}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}