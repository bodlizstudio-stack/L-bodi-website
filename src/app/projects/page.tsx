import { ProjectsHero } from '../../components/sections/ProjectsHero';
import { ProjectsCaseStudy } from '../../components/sections/ProjectsCaseStudy';
import { LupsModsCaseStudy } from '../../components/sections/LupsModsCaseStudy';
import { VHCoachingCaseStudy } from '../../components/sections/VHCoachingCaseStudy';
import { Footer } from '../../components/sections/Footer';

export const metadata = {
  title: 'My Projects | BODLIZ STUDIO',
  description: 'The Engineering Lab: From Concept to Automation. Live configurator from lupsmods.com.',
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <ProjectsHero />
      <LupsModsCaseStudy />
      <VHCoachingCaseStudy />
      <ProjectsCaseStudy />
      <Footer />
    </main>
  );
}
