import { HeroSection } from '../components/sections/HeroSection';
import { ServicesEcosystem } from '../components/sections/ServicesEcosystem';
import { NoCodeControlCenter } from '../components/sections/NoCodeControlCenter';
import { CommunicationProcess } from '../components/sections/CommunicationProcess';
import { ContactForm } from '../components/sections/ContactForm';
import { Footer } from '../components/sections/Footer';
import { CircuitTrace } from '../components/ui/CircuitTrace';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <CircuitTrace />
      <HeroSection />
      <ServicesEcosystem />
      <NoCodeControlCenter />
      <CommunicationProcess />
      <ContactForm />
      <Footer />
    </main>
  )
}
