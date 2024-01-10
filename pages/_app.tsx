import '../styles/globals.css';
import { AppProps } from 'next/app';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

import { Blaka } from 'next/font/google'
 
const blaka = Blaka({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-blaka',
})

export const FontList = {
    "blaka": blaka.variable, 
}

function MyApp({ Component, pageProps }: AppProps) {
//@ts-ignore
const fonts = Object.keys(FontList).map(key => FontList[key]);

  return (
    <>
          <style jsx global>{`
          
          `}</style>
          <main className={`h-screen min-h-screen flex flex-col bg-military text-yellow ${fonts.join(' ')}`}>
          <Navigation />
          <div className="page-content flex-grow h-full flex flex-col">
            <Component {...pageProps} />
          </div>
          <Footer />
        </main>
    </>
    
  );
}

export default MyApp;
