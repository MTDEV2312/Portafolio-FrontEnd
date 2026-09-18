import { useState, useCallback } from 'react';
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

interface AppProps {
  initialProjects?: Project[];
  profile?: Profile;
}

export default function App({ initialProjects, profile }: AppProps) {
  const [projectList] = useState<Project[]>(
    initialProjects && initialProjects.length > 0 ? initialProjects : defaultProjects
  );
  const [currentProfile] = useState<Profile | undefined>(profile);
  const [activeProjectId, setActiveProjectId] = useState(0);

  const handleProjectActive = useCallback((id: number) => {
    setActiveProjectId(id);
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
          totalProjects={projectList.length}
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
