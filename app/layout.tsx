import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { CookieBanner } from '@/components/cookie-banner'
import { LocationGuard } from '@/components/delivery/location-guard'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sabor Doce Chocolates Finos - Ovos de Páscoa',
  description: 'Sabor Doce Chocolates Finos - Ovos de Páscoa e chocolates premium com entrega rápida!',
  icons: {
    icon: '/imgs/logo_marrom.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16a34a',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-18020237329" strategy="afterInteractive" />
        <Script id="google-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18020237329');
          `}
        </Script>
        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '742949975415132');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=742949975415132&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* Supabase SDK para rastreamento de cliques */}
        <Script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" strategy="afterInteractive" />
        {/* Script de rastreamento de UTMs e GCLID */}
        <Script id="track-arrival" strategy="afterInteractive">
          {`
            (function() {
              function initTracking() {
                if (typeof supabase === 'undefined') {
                  setTimeout(initTracking, 100);
                  return;
                }
                
                const _supabase = supabase.createClient(
                  'https://pkoytgtcquyuimnbpnhv.supabase.co', 
                  'sb_publishable_3Eucjr7Aa9uTacp4PhA-_Q_UCOFcgqq'
                );

                async function trackArrival() {
                  const urlParams = new URLSearchParams(window.location.search);
                  const gclid = urlParams.get('gclid');
                  
                  // Só registra se tiver vindo de um anúncio (GCLID ou UTM)
                  if (gclid || urlParams.get('utm_source')) {
                    const { data, error } = await _supabase.from('clicks').insert([{
                      gclid: gclid,
                      utm_source: urlParams.get('utm_source'),
                      utm_medium: urlParams.get('utm_medium'),
                      utm_campaign: urlParams.get('utm_campaign'),
                      utm_term: urlParams.get('utm_term'),
                      page_url: window.location.href,
                      referrer: document.referrer
                    }]).select();

                    if (data && data[0]) {
                      // Guarda o ID do clique no navegador do cliente para usar na hora do Pix
                      localStorage.setItem('sd_click_id', data[0].id);
                    }
                  }
                }

                trackArrival();
              }
              
              initTracking();
            })();
          `}
        </Script>
      </head>
      <body className={`font-sans antialiased`}>
        <LocationGuard>
          {children}
        </LocationGuard>
        <CookieBanner />
      </body>
    </html>
  )
}
