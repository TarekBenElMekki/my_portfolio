export type TimelineItem = {
  period: string;
  label: string;
  title: string;
  description: string;
  technologies?: string[];
};

export type PortfolioProject = {
  title: string;
  category: string;
  status: string;
  description: string;
  image: string;
  technologies: string[];
  featured?: boolean;
};

export const associativeTimeline: TimelineItem[] = [
  {
    period: "Foundation",
    label: "Role",
    title: "Team Member",
    description:
      "Joined Information Management and contributed to operational data, internal tools and process improvement.",
    technologies: ["Information Management", "Data"],
  },
  {
    period: "Automation",
    label: "Technical Project",
    title: "Automation & Data System",
    description:
      "Built dashboards, analytics, workspaces, forms, automated emails and API-based data collection.",
    technologies: ["Google Sheets", "Apps Script", "APIs"],
  },
  {
    period: "Web",
    label: "Technical Project",
    title: "Promotional Web Platforms",
    description:
      "Developed promotional and conference websites, including the AIESEC 2030 Vision platform.",
    technologies: ["JavaScript", "Frontend", "Web"],
  },
  {
    period: "Leadership",
    label: "Role",
    title: "Team Leader",
    description:
      "Coordinated digital initiatives, supported team members and managed delivery of internal systems.",
    technologies: ["Leadership", "Delivery"],
  },
  {
    period: "ERP",
    label: "Technical Project",
    title: "Internal ERP Platform",
    description:
      "Developed a structured ERP platform to replace the previous spreadsheet-based operational system.",
    technologies: ["ERP", "Workflows", "Data"],
  },
  {
    period: "Executive",
    label: "Role",
    title: "Vice President",
    description:
      "Led Information Management, automation, internal tools and organizational data management.",
    technologies: ["Strategy", "Automation"],
  },
];

export const academicTimeline: TimelineItem[] = [
  {
    period: "Licence",
    label: "Degree",
    title: "Biomedical Engineering",
    description:
      "Licence in Biomedical Engineering with a specialization in Medical Informatics at ISTMT.",
    technologies: ["Biomedical", "Medical Informatics"],
  },
  {
    period: "Licence PFE",
    label: "Academic Project",
    title: "Autonomous Navigation Robot",
    description:
      "Created an autonomous robot using ROS1, SLAM and A* path planning for mapping and navigation.",
    technologies: ["ROS1", "SLAM", "A*"],
  },
  {
    period: "Mastère",
    label: "Degree",
    title: "Embedded Systems & Medical Equipment",
    description:
      "Professional Mastère focused on embedded systems, medical equipment and medical information processing.",
    technologies: ["Embedded Systems", "Medical Equipment"],
  },
  {
    period: "Mémoire",
    label: "Master's Thesis",
    title: "Teleoperated Surgical Robotic Instrument",
    description:
      "Designed a ROS2 surgical robotic instrument integrating control, sensing, camera feedback and mechatronics.",
    technologies: ["ROS2", "Raspberry Pi", "SolidWorks"],
  },
];

export const projects: PortfolioProject[] = [
  {
    title: "ROS2 Teleoperated Surgical Robotic Instrument",
    category: "Medical Robotics",
    status: "Master's Thesis",
    description:
      "A surgical robotics demonstrator combining ROS2, MoveIt, Raspberry Pi control, force sensing, camera feedback and a cable-driven mechanical instrument.",
    image: "/project-surgical.svg",
    technologies: [
      "ROS2",
      "MoveIt",
      "Raspberry Pi",
      "Python",
      "FSR",
      "MCP3202",
      "SolidWorks",
    ],
    featured: true,
  },
  {
    title: "Autonomous Navigation Robot",
    category: "Robotics",
    status: "Licence Project",
    description:
      "An autonomous mobile robot using ROS1, SLAM and A* path planning for mapping, localization and navigation.",
    image: "/project-autonomous.svg",
    technologies: ["ROS1", "SLAM", "A*", "Python"],
  },
  {
    title: "Operational Automation & Data System",
    category: "Automation",
    status: "Completed",
    description:
      "An internal operational ecosystem with dashboards, analytics, forms, workspaces, email automation and API-based data gathering.",
    image: "/project-automation.svg",
    technologies: [
      "Google Apps Script",
      "Google Sheets",
      "APIs",
      "Dashboards",
    ],
  },
  {
    title: "Internal ERP Platform",
    category: "Software Systems",
    status: "Completed",
    description:
      "A custom platform developed to move operations from spreadsheet workflows to a structured ERP environment.",
    image: "/project-erp.svg",
    technologies: [
      "ERP",
      "Workflows",
      "Data Management",
      "Software Systems",
    ],
  },
];

export const skillGroups = [
  {
    title: "Robotics & Motion Control",
    skills: [
      "ROS2 Humble",
      "ROS1",
      "MoveIt",
      "RViz",
      "URDF",
      "SLAM",
      "A* Path Planning",
      "Autonomous Navigation",
    ],
  },
  {
    title: "Embedded Systems & Electronics",
    skills: [
      "Raspberry Pi",
      "GPIO",
      "PWM",
      "SPI",
      "ADC Integration",
      "Sensor Interfacing",
      "Servo Control",
      "Embedded Control",
    ],
  },
  {
    title: "Programming & Software",
    skills: [
      "Python",
      "C/C++",
      "Java",
      "R",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
    ],
  },
  {
    title: "Biomedical & MedTech",
    skills: [
      "Biomedical Engineering",
      "Medical Equipment",
      "Medical Instrumentation",
      "Surgical Robotics",
      "Force Sensing",
      "Medical Device Prototyping",
    ],
  },
  {
    title: "Simulation & Prototyping",
    skills: [
      "SolidWorks",
      "MATLAB",
      "Proteus",
      "Qt",
      "Mechatronics",
      "Mechanical Prototyping",
      "CAD",
      "System Integration",
    ],
  },
  {
    title: "Automation, Data & Platforms",
    skills: [
      "Google Apps Script",
      "Workflow Automation",
      "Dashboards",
      "REST APIs",
      "PostgreSQL",
      "Git",
      "Docker",
      "Linux",
    ],
  },
];

export const supportingExperience = [
  {
    organization: "Military Hospital of Tunis",
    title: "Technical Department Intern",
    description:
      "Exposure to medical fluids, imaging and radiology equipment, electronics, maintenance policies and repair processes.",
  },
  {
    organization: "Almaviva Charguia",
    title: "French-Speaking Call Center Agent",
    description:
      "Handled French-speaking outbound telephone operations and professional customer communication.",
  },
];