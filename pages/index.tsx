import '../styles/globals.css'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <main className="p-12 min-h-screen flex flex-col">
      <Navigation />
    <div className="page-content flex-grow">
      hello
    </div>
      <Footer />
    </main>
  )
}
