import { SessionProvider } from "next-auth/react";
import { AppProps } from 'next/app';
import '../app/globals.css'; 
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
