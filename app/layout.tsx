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
        <Script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" strategy="beforeInteractive" />
        {/* Supabase Tracker */}
        <Script id="supabase-tracker" strategy="afterInteractive">
          {`
            (function() {
              var retryCount = 0;
              var maxRetries = 50;
              
              function initTracker() {
                if (typeof supabase === 'undefined' || typeof supabase.createClient !== 'function') {
                  retryCount++;
                  if (retryCount < maxRetries) {
                    setTimeout(initTracker, 100);
                  }
                  return;
                }
                
                var SUPABASE_URL = "https://pkoytgtcquyuimnbpnhv.supabase.co";
                var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrb3l0Z3RjcXV5dWltbmJwbmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTgwNTIsImV4cCI6MjA5MDA3NDA1Mn0.d2zuq96KRF_3KK6JgTCzLoPtvfQtOpJm8G_JkWcvouI";
                var _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

                async function track() {
                  var url = new URLSearchParams(window.location.search);
                  
                  // Capturamos todos os parâmetros compatíveis com o Supabase
                  if(url.has('utm_source') || url.has('gclid')) {
                    // Tratamento dinâmico para sufixos avançados do Google Ads
                    var termoPesquisa = url.get('utm_term') || '';
                    if (url.has('matchtype')) termoPesquisa += ' [' + url.get('matchtype') + ']';
                    if (url.has('device')) termoPesquisa += ' | ' + url.get('device');

                    var result = await _supabase.from('clicks').insert([{
                      utm_source: url.get('utm_source') || 'google',
                      utm_medium: url.get('utm_medium') || 'cpc',
                      utm_campaign: url.get('utm_campaign'),
                      utm_content: url.get('utm_content'),
                      utm_term: termoPesquisa,
                      gclid: url.get('gclid'),
                      page_url: window.location.href,
                      referrer: document.referrer
                    }]).select();
                    
                    if (result.data && result.data[0]) {
                      localStorage.setItem('sd_click_id', result.data[0].id);
                    }
                  }
                }
                
                track();
              }
              
              initTracker();
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
