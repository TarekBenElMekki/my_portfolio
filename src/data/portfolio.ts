export type TimelineItem = {
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
    label: "Role",
    title: "Team Member",
    description:
      "Joined Information Management and worked on operational data, internal tools and process improvement.",
    technologies: ["Information Management", "Data"],
  },
  {
    label: "Project",
    title: "Automation & Data System",
    description:
      "Built dashboards, analytics, workspaces, forms, email automations and API-based data gathering with Google Sheets and Apps Script.",
    technologies: ["Google Sheets", "Apps Script", "APIs"],
  },
  {
    label: "Project",
    title: "Promotional Web Platforms",
    description:
      "Developed frontend-focused promotional and conference websites, including the AIESEC 2030 Vision website.",
    technologies: ["Web", "JavaScript", "Frontend"],
  },
  {
    label: "Role",
    title: "Team Leader",
    description:
      "Coordinated digital initiatives, supported the team and managed delivery of internal information systems.",
    technologies: ["Leadership", "Delivery"],
  },
  {
    label: "Project",
    title: "Internal ERP Platform",
    description:
      "Worked on a custom ERP designed to replace the previous spreadsheet-based operational system.",
    technologies: ["ERP", "Workflows", "Data"],
  },
  {
    label: "Role",
    title: "Vice President",
    description:
      "Led Information Management activities covering automation, internal tools creation and organizational data management.",
    technologies: ["Strategy", "Automation"],
  },
];

export const academicTimeline: TimelineItem[] = [
  {
    label: "Degree",
    title: "Biomedical Engineering",
    description:
      "Licence in Biomedical Engineering, specialization in Medical Informatics, completed at ISTMT.",
    technologies: ["Biomedical", "Medical Informatics"],
  },
  {
    label: "Academic Project",
    title: "Autonomous Navigation Robot",
    description:
      "Developed an autonomous robot using ROS1, SLAM and A* path planning for mapping, localization and navigation.",
    technologies: ["ROS1", "SLAM", "A*"],
  },
  {
    label: "Degree",
    title: "Embedded Systems & Medical Equipment",
    description:
      "Professional Master's degree, specialization in Medical Information Processing, completed at ISTMT.",
    technologies: ["Embedded Systems", "Medical Equipment"],
  },
  {
    label: "Master's Thesis",
    title: "Teleoperated Surgical Robotic Instrument",
    description:
      "Designed a ROS2-based surgical robotic instrument integrating embedded control, force sensing, camera feedback and mechatronics.",
    technologies: ["ROS2", "Raspberry Pi", "SolidWorks"],
  },
];

export const projects: PortfolioProject[] = [
  {
    title: "ROS2 Teleoperated Surgical Robotic Instrument",
    category: "Medical Robotics",
    status: "Master's Thesis",
    description:
      "A multidisciplinary surgical robotics demonstrator combining ROS2, MoveIt, Raspberry Pi control, force sensing, camera feedback and a cable-driven mechanical instrument.",
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
      "An autonomous mobile robot using ROS1, SLAM and A* path planning for mapping, localization and autonomous navigation.",
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
    technologies: ["Google Apps Script", "Google Sheets", "APIs", "Dashboards"],
  },
  {
    title: "Internal ERP Platform",
    category: "Software Systems",
    status: "Completed",
    description:
      "A custom platform developed to move operations from spreadsheet-based workflows to a structured ERP environment.",
    image: "/project-erp.svg",
    technologies: ["ERP", "Workflows", "Data Management", "Software Systems"],
  },
];

export const skillGroups = [
  {
    title: "Robotics & ROS",
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
    title: "Embedded Systems",
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
    title: "Programming",
    skills: ["Python", "C/C++", "Java", "R", "JavaScript", "TypeScript"],
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
    title: "Engineering",
    skills: [
      "SolidWorks",
      "MATLAB",
      "Proteus",
      "Qt",
      "Mechatronics",
      "Mechanical Prototyping",
    ],
  },
  {
    title: "Automation & Software",
    skills: [
      "Google Apps Script",
      "Workflow Automation",
      "Dashboards",
      "REST APIs",
      "React",
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