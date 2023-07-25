import '../styles/globals.css';
import { AppProps } from 'next/app';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="p-12 min-h-screen flex flex-col">
      <Navigation />
      <div className="page-content flex-grow">
        <Component {...pageProps} />
      </div>
      <Footer />
    </main>
  );
}

export default MyApp;
