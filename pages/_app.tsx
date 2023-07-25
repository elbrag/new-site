import '../styles/globals.css';
import { AppProps } from 'next/app';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

import { Blaka } from 'next/font/google'
import { My_Soul } from 'next/font/google';
import { Rock_3D } from 'next/font/google';
import { Rubik_Beastly } from 'next/font/google';
import { Rubik_Bubbles } from 'next/font/google';
import { Rubik_Distressed } from 'next/font/google';
import { Rubik_Glitch } from 'next/font/google';
import { Rubik_Microbe } from 'next/font/google';
 
const blaka = Blaka({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-blaka',
})
const mySoul = My_Soul({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-mySoul',
  })
  const rock3D = Rock_3D({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-rock3D',
  })
  const rubikBeastly = Rubik_Beastly({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-rubikBeastly',
  })
  const rubikBubbles = Rubik_Bubbles({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-rubikBubbles',
  })
  const rubikDistressed = Rubik_Distressed({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-rubikDistressed',
  })
  const rubikGlitch = Rubik_Glitch({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-rubikGlitch',
  })
  const rubikMicrobe = Rubik_Microbe({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-rubikMicrobe',
  })

export const FontList = {
    "blaka": blaka.variable, 
    "mySoul": mySoul.variable,
    "rock3D": rock3D.variable,
    "rubikBeastly": rubikBeastly.variable,
    "rubikBubbles": rubikBubbles.variable,
    "rubikDistressed": rubikDistressed.variable,
    "rubikGlitch": rubikGlitch.variable,
    "rubikMicrobe": rubikMicrobe.variable
}

function MyApp({ Component, pageProps }: AppProps) {
//@ts-ignore
const fonts = Object.keys(FontList).map(key => FontList[key]);

  return (
    <>
          <style jsx global>{`
          
          `}</style>
          <main className={`min-h-screen flex flex-col ${fonts.join(' ')}`}>
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
