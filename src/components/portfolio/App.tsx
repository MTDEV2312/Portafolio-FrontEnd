import { useState, useCallback, useEffect } from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { ProgressIndicator } from './ProgressIndicator';
import { ProjectScene } from './ProjectScene';
import { About } from './About';
import { Technologies } from './Technologies';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { projects as defaultProjects, type Project } from '../../data/projects';
import type { Profile } from '../../services/api';
import { supabase } from '../../services/supabase';
import { getPortfolioData } from '../../services/portfolioService';

interface AppProps {
  initialProjects?: Project[];
  profile?: Profile;
}

export default function App({ initialProjects, profile }: AppProps) {
  const [projectList, setProjectList] = useState<Project[]>(
    initialProjects && initialProjects.length > 0 ? initialProjects : defaultProjects
  );
  const [currentProfile, setCurrentProfile] = useState<Profile | undefined>(profile);
  const [activeProjectId, setActiveProjectId] = useState(0);

  const handleProjectActive = useCallback((id: number) => {
    setActiveProjectId(id);
  }, []);

  // Realtime synchronization with Supabase when changes are committed in /admin
  useEffect(() => {
    const channel = supabase
      .channel('portfolio-live-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'proyectos' },
        async () => {
          try {
            const data = await getPortfolioData();
            setProjectList(data.projects);
          } catch (e) {
            console.error('Error updating live projects:', e);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'presentador' },
        async () => {
          try {
            const data = await getPortfolioData();
            setCurrentProfile(data.profile);
          } catch (e) {
            console.error('Error updating live profile:', e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ background: '#0A0909', minHeight: '100vh' }}>
      <Header name={currentProfile?.nombre} />
      <ProgressIndicator projects={projectList} activeId={activeProjectId} />

      <Hero
        name={currentProfile?.nombre}
        projectCount={projectList.length}
      />

      {projectList.map((project) => (
        <ProjectScene
          key={project.id}
          project={project}
          onActive={handleProjectActive}
        />
      ))}

      <About bio={currentProfile?.aboutMeDescription} />
      <Technologies />
      <Contact email={currentProfile?.contactEmail} />
      <Footer
        name={currentProfile?.nombre}
        email={currentProfile?.contactEmail}
      />
    </div>
  );
}
