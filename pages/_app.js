import Head from 'next/head';
import { useEffect } from 'react';
import '../styles/globals.css';

function FeedbackBufferApp({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {
            // Ignore cleanup failures and keep the app usable.
          });
        });
      });
    }

    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys
          .filter((key) => key.indexOf('feedback-buffer-') === 0)
          .forEach((key) => {
            caches.delete(key).catch(() => {
              // Ignore cleanup failures and keep the app usable.
            });
          });
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Feedback Buffer</title>
        <meta
          name="description"
          content="A gentle twenty-three-second buffer before checking feedback."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#ede7dd" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Feedback Buffer" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default FeedbackBufferApp;
