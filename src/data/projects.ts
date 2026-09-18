export interface Project {
  id: number;
  num: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
  imageAlt: string;
  layout: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  githubLink?: string;
  liveDemoLink?: string;
  supabaseId?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    num: '01',
    title: 'Subscription Manager',
    shortTitle: 'Subscription\nManager',
    category: 'FULLSTACK / AUTOMATION',
    description:
      'A web application for managing recurring subscriptions, renewal dates and Telegram notifications.',
    technologies: ['NestJS', 'React'],
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Analytics dashboard with data charts',
    layout: 'A',
  },
  {
    id: 2,
    num: '02',
    title: 'HomeOS',
    shortTitle: 'HomeOS',
    category: 'FULLSTACK / ARCHITECTURE',
    description:
      'A task management ecosystem designed around Clean Architecture and multi-tenancy, optimized to run efficiently with limited resources.',
    technologies: ['Next.js'],
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Circuit board architecture close-up',
    layout: 'B',
  },
  {
    id: 3,
    num: '03',
    title: 'Modacom',
    shortTitle: 'Modacom',
    category: 'FULLSTACK / E-COMMERCE',
    description:
      'A full-stack e-commerce application focused on clothing.',
    technologies: ['Next.js', 'TypeScript', 'Node.js'],
    image:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Fashion clothing storefront',
    layout: 'C',
  },
  {
    id: 4,
    num: '04',
    title: 'LinkStash',
    shortTitle: 'LinkStash',
    category: 'FULLSTACK / WEB APPLICATION',
    description:
      'A web application for organizing and managing links, including automatic metadata extraction and web scraping.',
    technologies: ['React', 'Express.js'],
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Laptop showing web development workspace',
    layout: 'D',
  },
  {
    id: 5,
    num: '05',
    title: 'Prima S.A. API',
    shortTitle: 'Prima\nS.A. API',
    category: 'BACKEND / REST API',
    description:
      'A REST API for managing sales, inventory and customers.',
    technologies: ['Node.js', 'Express.js', 'Cloudinary', 'JavaScript'],
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Code on monitor showing API endpoints',
    layout: 'E',
  },
  {
    id: 6,
    num: '06',
    title: 'Registration\nManagement System',
    shortTitle: 'Registration\nManagement',
    category: 'BACKEND / ACADEMIC SYSTEM',
    description:
      'A backend system for managing students, subjects and registrations.',
    technologies: ['Node.js', 'Express.js', 'MongoDB'],
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Academic library shelves with books',
    layout: 'F',
  },
  {
    id: 7,
    num: '07',
    title: 'Medical Appointment\nSystem',
    shortTitle: 'Medical\nAppointment',
    category: 'BACKEND / MANAGEMENT SYSTEM',
    description:
      'A system for managing patients, medical specialties and appointments.',
    technologies: ['Node.js', 'Express.js', 'MongoDB'],
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Medical professional at workstation',
    layout: 'G',
  },
  {
    id: 8,
    num: '08',
    title: 'CineNova',
    shortTitle: 'CineNova',
    category: 'APPLICATION / RESERVATION SYSTEM',
    description:
      'A cinema reservation system with room and seat management.',
    technologies: ['Java', 'MySQL'],
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Cinema auditorium with illuminated seats',
    layout: 'H',
  },
  {
    id: 9,
    num: '09',
    title: 'Portfolio Frontend',
    shortTitle: 'Portfolio\nFrontend',
    category: 'FRONTEND / PERFORMANCE',
    description:
      'A portfolio frontend built with Astro and Tailwind CSS using static site generation and API-driven content.',
    technologies: ['Astro', 'Tailwind CSS', 'TypeScript'],
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Code editor showing frontend development',
    layout: 'A',
  },
  {
    id: 10,
    num: '10',
    title: 'Pythonra',
    shortTitle: 'Pythonra',
    category: 'COMPUTER VISION / IOT',
    description:
      'A computer vision application using ArUco marker detection, image overlays and real-time sensor integration.',
    technologies: ['Python', 'Flask', 'OpenCV', 'Blynk'],
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Robot and computer vision technology',
    layout: 'F',
  },
  {
    id: 11,
    num: '11',
    title: 'Car Rental System',
    shortTitle: 'Car Rental\nSystem',
    category: 'BACKEND / REST API',
    description:
      'A REST API for vehicle rental management, including authentication, customers, vehicles and reservations.',
    technologies: ['Node.js', 'Express.js', 'MongoDB'],
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Dark sports car on empty road',
    layout: 'B',
  },
  {
    id: 12,
    num: '12',
    title: 'Support Ticket\nSystem',
    shortTitle: 'Support\nTickets',
    category: 'BACKEND / SUPPORT SYSTEM',
    description:
      'A backend system for managing technical support tickets and customers.',
    technologies: ['Node.js', 'Express.js', 'MongoDB'],
    image:
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Laptop with tech support interface',
    layout: 'D',
  },
  {
    id: 13,
    num: '13',
    title: 'Backend\nConferences',
    shortTitle: 'Backend\nConferences',
    category: 'BACKEND / EVENTS',
    description: 'A REST API for managing conferences and events.',
    technologies: ['Node.js', 'Express.js'],
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=900&fit=crop&auto=format',
    imageAlt: 'Conference hall with stage lighting',
    layout: 'C',
  },
];
