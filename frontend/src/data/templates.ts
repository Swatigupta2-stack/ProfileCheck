import { ResumeData, LayoutType } from "@/types/resume";

export interface TemplateStyles {
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  spacing: 'compact' | 'normal' | 'relaxed';
  fontSize: 'small' | 'medium' | 'large';
  headingStyle: 'bold' | 'uppercase' | 'underlined' | 'minimal';
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: 'Compact' | 'First Job' | 'Executive' | 'Creative' | 'Technical' | 'Academic' | 'Modern' | 'Standard';
  description: string;
  layoutType: LayoutType | 'json-resume';
  styles: TemplateStyles;
  exampleData: ResumeData;
}

const COMPACT_EXAMPLE: ResumeData = {
  templateId: "compact-1",
  personalInfo: {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Product Manager",
    linkedin: "linkedin.com/in/sarahjohnson"
  },
  summary: "Results-driven Product Manager with 8+ years of experience in SaaS and enterprise software. Proven track record of launching products that generated $15M+ in annual recurring revenue. Expert in agile methodologies and cross-functional leadership.",
  experience: [
    {
      id: "exp1",
      company: "TechCorp Inc.",
      position: "Senior Product Manager",
      startDate: "2021-01",
      endDate: "Present",
      current: true,
      description: "Led product strategy for flagship platform, increasing user engagement by 45%.\nLaunched 3 major features that contributed to $8M in new annual revenue.\nManaged cross-functional team of 12 engineers, designers, and data scientists.",
      achievements: [
        "Led product strategy for flagship platform, increasing user engagement by 45%",
        "Launched 3 major features that contributed to $8M in new annual revenue",
        "Managed cross-functional team of 12 engineers, designers, and data scientists"
      ]
    },
    {
      id: "exp2",
      company: "StartupX",
      position: "Product Manager",
      startDate: "2018-06",
      endDate: "2020-12",
      current: false,
      description: "Drove product roadmap from concept to launch for B2B analytics tool.\nIncreased customer retention by 30% through user feedback integration.",
      achievements: [
        "Drove product roadmap from concept to launch for B2B analytics tool",
        "Increased customer retention by 30% through user feedback integration"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Stanford Graduate School of Business",
      degree: "MBA",
      field: "Strategy & Marketing",
      startDate: "2016-09",
      endDate: "2018-06"
    },
    {
      id: "edu2",
      institution: "University of California, Berkeley",
      degree: "BS",
      field: "Computer Science",
      startDate: "2010-09",
      endDate: "2014-05"
    }
  ],
  skills: [
    "Product Strategy", "Data Analytics", "Agile/Scrum", "User Research", "Roadmap Planning",
    "Leadership", "Communication", "Problem Solving", "Cross-functional Collaboration",
    "JIRA", "Confluence", "Figma", "Miro", "Amplitude",
    "English (Native)", "Spanish (Professional)"
  ],
  projects: []
};

const FIRST_JOB_EXAMPLE: ResumeData = {
  templateId: "first-job-1",
  personalInfo: {
    fullName: "Alex Rivera",
    email: "alex.rivera@edu.com",
    phone: "(555) 987-6543",
    location: "Austin, TX",
    title: "Recent Computer Science Graduate",
    github: "github.com/arivera"
  },
  summary: "Eager Computer Science graduate with a strong foundation in full-stack development. Passionate about building scalable web applications and solving complex problems through clean code.",
  education: [
    {
      id: "edu1",
      institution: "University of Texas at Austin",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2020-09",
      endDate: "2024-05",
      gpa: "3.85/4.0"
    }
  ],
  experience: [
    {
      id: "exp1",
      company: "InnovateSoft",
      position: "Software Engineering Intern",
      startDate: "2023-06",
      endDate: "2023-08",
      current: false,
      description: "Collaborated with the core engineering team to develop a real-time dashboard.\nOptimized API endpoints, resulting in 15% faster data retrieval.",
      achievements: [
        "Developed real-time dashboard using React",
        "Optimized API endpoints for 15% performance gain"
      ]
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "Teamwork", "Adaptability"],
  projects: [
    {
      id: "p1",
      name: "Smart Task Manager",
      description: "A full-stack task management app with AI-powered prioritization.",
      technologies: "React, Express, MongoDB, OpenAI API",
      link: "github.com/arivera/task-manager"
    }
  ]
};

const EXECUTIVE_EXAMPLE: ResumeData = {
  templateId: "executive-1",
  personalInfo: {
    fullName: "David Chen",
    email: "david.chen@executive.com",
    phone: "(555) 000-1111",
    location: "New York, NY",
    title: "Vice President of Engineering"
  },
  summary: "Visionary engineering leader with 15+ years of experience driving technological innovation and operational excellence in global organizations. Expertise in scaling engineering teams from 10 to 200+ and managing multi-million dollar budgets.",
  experience: [
    {
      id: "exp1",
      company: "Global Systems Inc.",
      position: "VP of Engineering",
      startDate: "2018-03",
      endDate: "Present",
      current: true,
      description: "Oversee global engineering organization of 250+ staff across 4 continents.\nReduced operational costs by 30% through infrastructure modernization and strategic outsourcing.\nImplemented AI-driven automation that increased developer productivity by 25%.",
      achievements: [
        "Managed 250+ engineering staff globally",
        "Reduced operational costs by 30% ($5M annually)",
        "Launched enterprise AI platform now used by 80% of Fortune 500 clients"
      ]
    },
    {
      id: "exp2",
      company: "ScaleUp Tech",
      position: "Director of Engineering",
      startDate: "2012-05",
      endDate: "2018-02",
      current: false,
      description: "Scaled engineering team from 15 to 80 during rapid growth phase.\nArchitected microservices transition that improved system uptime to 99.99%.",
      achievements: [
        "Scaled team from 15 to 80 members",
        "Transitioned to microservices architecture"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Massachusetts Institute of Technology (MIT)",
      degree: "Master of Science",
      field: "Engineering Management",
      startDate: "2005-09",
      endDate: "2007-06"
    }
  ],
  skills: ["Strategic Planning", "Change Management", "M&A Integration", "Public Speaking", "Board Relations"],
  projects: []
};

const CREATIVE_EXAMPLE: ResumeData = {
  templateId: "creative-1",
  personalInfo: {
    fullName: "Mia Song",
    email: "mia@design.studio",
    phone: "(555) 222-3333",
    location: "Portland, OR",
    title: "Senior UI/UX Designer",
    portfolio: "miasong.design"
  },
  summary: "Multi-disciplinary designer focused on creating intuitive digital experiences that blend aesthetic beauty with functional simplicity. 7+ years experience in product design and branding.",
  experience: [
    {
      id: "exp1",
      company: "Design Studio X",
      position: "Lead UI/UX Designer",
      startDate: "2020-06",
      endDate: "Present",
      current: true,
      description: "Lead design strategy for top-tier clients including Nike and Apple.\nEstablished a company-wide design system, reducing design-to-dev time by 40%.",
      achievements: [
        "Led rebranding for 3 Fortune 500 companies",
        "Designed award-winning mobile app with 1M+ downloads"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Rhode Island School of Design (RISD)",
      degree: "Bachelor of Fine Arts",
      field: "Graphic Design",
      startDate: "2014-09",
      endDate: "2018-06"
    }
  ],
  skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Motion Graphics", "Branding", "User Research"],
  projects: [
    {
      id: "p1",
      name: "Artisanal Marketplace",
      description: "End-to-end design and prototype for a global craft marketplace.",
      technologies: "Figma, Prototyping, User Testing"
    }
  ]
};

const TECHNICAL_EXAMPLE: ResumeData = {
  templateId: "technical-1",
  personalInfo: {
    fullName: "James Wilson",
    email: "james.wilson@dev.io",
    phone: "(555) 444-5555",
    location: "Seattle, WA",
    title: "Full Stack Engineer",
    github: "github.com/jwilson-dev"
  },
  summary: "Cloud-native developer with deep expertise in distributed systems, microservices architecture, and DevOps practices. Passionate about performance optimization and developer experience.",
  experience: [
    {
      id: "exp1",
      company: "CloudScale",
      position: "Senior Software Engineer",
      startDate: "2019-09",
      endDate: "Present",
      current: true,
      description: "Architected a serverless event-driven system handling 50k requests/sec.\nMentored junior developers and improved code review processes, reducing bug count by 20%.",
      achievements: [
        "Architected serverless system for 50k req/sec",
        "Reduced production incidents by 35% through better observability"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "University of Washington",
      degree: "BS",
      field: "Computer Science",
      startDate: "2013-09",
      endDate: "2017-06"
    }
  ],
  skills: ["Go", "Kubernetes", "AWS", "Terraform", "Redis", "PostgreSQL", "React", "TypeScript"],
  projects: [
    {
      id: "p1",
      name: "K8s Custom Operator",
      description: "Developed a custom Kubernetes operator for automated database lifecycle management.",
      technologies: "Go, Kubernetes API, Docker"
    }
  ]
};

const ACADEMIC_EXAMPLE: ResumeData = {
  templateId: "academic-1",
  personalInfo: {
    fullName: "Dr. Elena Petrov",
    email: "e.petrov@university.edu",
    phone: "(555) 666-7777",
    location: "Boston, MA",
    title: "Assistant Professor of Physics"
  },
  summary: "Dedicated researcher and educator with a primary focus on quantum computing and condensed matter physics. Published in top-tier journals and recipient of multiple research grants.",
  experience: [
    {
      id: "exp1",
      company: "Harvard University",
      position: "Postdoctoral Researcher",
      startDate: "2021-08",
      endDate: "2023-07",
      current: false,
      description: "Published 5 peer-reviewed papers in high-impact journals including Nature Physics.\nCollaborated on a $2M NSF research grant for quantum materials research.",
      achievements: [
        "Published 5 peer-reviewed papers",
        "Secured $2M NSF research grant"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Princeton University",
      degree: "PhD",
      field: "Theoretical Physics",
      startDate: "2016-09",
      endDate: "2021-05"
    }
  ],
  skills: ["Quantum Modeling", "Latex", "Research Methodology", "Grant Writing", "Data Analysis", "Python"],
  projects: []
};

const MODERN_EXAMPLE: ResumeData = {
  templateId: "modern-1",
  personalInfo: {
    fullName: "Robert Taylor",
    email: "robert.taylor@biz.com",
    phone: "(555) 888-9999",
    location: "Chicago, IL",
    title: "Operations Manager"
  },
  summary: "Dynamic Operations Manager with a proven ability to streamline processes and enhance organizational productivity. 10+ years of experience in supply chain and project management.",
  experience: [
    {
      id: "exp1",
      company: "Midwest Logistics",
      position: "Operations Manager",
      startDate: "2020-02",
      endDate: "Present",
      current: true,
      description: "Reduced supply chain costs by 15% through strategic vendor negotiations.\nImplemented a new ERP system across 5 regional offices.",
      achievements: [
        "15% cost reduction in supply chain",
        "Successful multi-site ERP implementation"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Northwestern University",
      degree: "Bachelor of Arts",
      field: "Business Administration",
      startDate: "2012-09",
      endDate: "2016-06"
    }
  ],
  skills: ["Project Management", "Supply Chain", "ERP Systems", "Six Sigma", "Team Leadership"],
  projects: []
};

const CATEGORY_MAP: Record<string, ResumeData> = {
  'Compact': COMPACT_EXAMPLE,
  'First Job': FIRST_JOB_EXAMPLE,
  'Executive': EXECUTIVE_EXAMPLE,
  'Creative': CREATIVE_EXAMPLE,
  'Technical': TECHNICAL_EXAMPLE,
  'Academic': ACADEMIC_EXAMPLE,
  'Modern': MODERN_EXAMPLE
};

const createTemplates = (
  category: ResumeTemplate['category'],
  count: number,
  baseId: string
): ResumeTemplate[] => {
  const descriptions: Record<ResumeTemplate['category'], string> = {
    'Compact': "Best for experienced professionals with 5+ years experience. Dense, minimal white space.",
    'First Job': "For fresh graduates. Focuses on education and skills prominent, internship experience.",
    'Executive': "For senior leaders (Director+). Spacious layout, executive summary, board memberships.",
    'Creative': "For design/marketing roles. Visual elements, portfolio links, creative skills.",
    'Technical': "For engineers/developers. Technical skills grid, GitHub links, project highlights.",
    'Academic': "For researchers/educators. Publications, research, teaching experience.",
    'Modern': "General professional. Two-column layout, balanced, bold headers."
  };

  return Array.from({ length: count }).map((_, i) => {
    const id = `${baseId}-${i + 1}`;
    const layoutTypes: LayoutType[] = ['single-column', 'two-column', 'sidebar'];
    const fonts = [
      'Inter, sans-serif', 
      'Georgia, serif', 
      'ui-monospace, SFMono-Regular', 
      'Montserrat, sans-serif', 
      'Playfair Display, serif'
    ];
    const colors = [
      '#0f172a', // Slate 900
      '#1e3a8a', // Blue 900
      '#4338ca', // Indigo 700
      '#065f46', // Emerald 900
      '#991b1b', // Red 800
    ];
    
    return {
      id,
      name: `${category} ${i + 1}`,
      category,
      description: descriptions[category],
      layoutType: layoutTypes[i % layoutTypes.length],
      styles: {
        fontFamily: fonts[i % fonts.length],
        primaryColor: colors[i % colors.length],
        accentColor: colors[(i + 1) % colors.length],
        spacing: category === 'Compact' ? 'compact' : category === 'Executive' ? 'relaxed' : 'normal',
        fontSize: category === 'Compact' ? 'small' : 'medium',
        headingStyle: category === 'Modern' ? 'bold' : category === 'Executive' ? 'uppercase' : 'underlined',
      },
      exampleData: {
        ...CATEGORY_MAP[category],
        templateId: id
      }
    };
  });
};

export const TEMPLATES: ResumeTemplate[] = [
  ...createTemplates('Compact', 5, 'compact'),
  ...createTemplates('First Job', 5, 'first-job'),
  ...createTemplates('Executive', 5, 'executive'),
  ...createTemplates('Creative', 5, 'creative'),
  ...createTemplates('Technical', 5, 'technical'),
  ...createTemplates('Academic', 5, 'academic'),
  ...createTemplates('Modern', 5, 'modern'),
  {
    id: 'json-class',
    name: 'Classy Standard',
    category: 'Standard',
    description: 'A classic professional theme based on JSON Resume standard.',
    layoutType: 'json-resume',
    styles: {
      fontFamily: 'serif',
      primaryColor: '#000000',
      accentColor: '#333333',
      spacing: 'normal',
      fontSize: 'medium',
      headingStyle: 'bold'
    },
    exampleData: { ...MODERN_EXAMPLE, templateId: 'json-class' }
  },
  {
    id: 'json-paper',
    name: 'Paper Clean',
    category: 'Standard',
    description: 'Minimalist clean theme focused on readability.',
    layoutType: 'json-resume',
    styles: {
      fontFamily: 'sans-serif',
      primaryColor: '#2d3436',
      accentColor: '#636e72',
      spacing: 'relaxed',
      fontSize: 'medium',
      headingStyle: 'minimal'
    },
    exampleData: { ...MODERN_EXAMPLE, templateId: 'json-paper' }
  },
  {
    id: 'json-rocketspacer',
    name: 'Rocket Spacer',
    category: 'Standard',
    description: 'Modern spaced theme for a contemporary look.',
    layoutType: 'json-resume',
    styles: {
      fontFamily: 'Montserrat',
      primaryColor: '#2c3e50',
      accentColor: '#3498db',
      spacing: 'relaxed',
      fontSize: 'medium',
      headingStyle: 'uppercase'
    },
    exampleData: { ...MODERN_EXAMPLE, templateId: 'json-rocketspacer' }
  }
];

export const CATEGORIES = [
  'Compact',
  'First Job',
  'Executive',
  'Creative',
  'Technical',
  'Academic',
  'Modern',
  'Standard'
] as const;
