export type TimelineItem = {
  period: string;
  label: string;
  title: string;
  specialty?: string;
  image?: string;
  description: string;
  technologies?: string[];
};

export type ProjectMedia = {
  kind: "image" | "video" | "sheet" | "website";
  src: string;
  title: string;
  alt?: string;
  caption?: string;
  poster?: string;
  href?: string;
};

export type ProjectDocument = {
  title: string;
  description: string;
  href: string;
  format: string;
};
export type ProjectExternalLink = {
  title: string;
  href: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  status: string;
  year: string;
  role: string;
  description: string;
  longDescription: string[];
  challenge: string;
  solution: string;
  highlights: string[];
  responsibilities: string[];
  image: string;
  media: ProjectMedia[];
  documents: ProjectDocument[];
  externalLinks?: ProjectExternalLink[];
  technologies: string[];
  featured?: boolean;
};

export const associativeTimeline: TimelineItem[] = [
  {
    period: "Foundation · OCT 2023",
    label: "Role",
    title: "Team Member",
    description:
      "Joined Information Management and contributed to operational data, internal tools and process improvement.",
    technologies: ["Information Management", "Data"],
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
    period: "Leadership · FEB 2025",
    label: "Role",
    title: "Team Leader",
    description:
      "Coordinated digital initiatives, supported team members and managed delivery of internal systems.",
    technologies: ["Leadership", "Delivery"],
  },
  {
    period: "Automation",
    label: "Technical Project",
    title: "Automation & Data System based on Sheets & App Script",
    description:
      "Built an operational data and automation system based on Google Sheets and Apps Script, including dashboards, analytics, workspaces, forms, automated emails and API-based data collection.",
    technologies: [
      "Google Sheets",
      "Google Apps Script",
      "APIs",
      "Automation",
    ],
  },
  {
    period: "Executive · FEB 2026",
    label: "Role",
    title: "Vice President",
    description:
      "Led Information Management, automation, internal tools and organizational data management.",
    technologies: ["Strategy", "Automation"],
  },
  {
    period: "ERP",
    label: "Technical Project",
    title: "Internal ERP Platform",
    description:
      "Developed a structured ERP platform to replace the previous spreadsheet-based operational system.",
    technologies: ["ERP", "Workflows", "Data"],
  },
];

export const academicTimeline: TimelineItem[] = [
  {
    period: "PFE · FEB 2024",
    label: "Academic Project",
    title: "Autonomous Navigation Robot",
    description:
      "Created an autonomous robot using ROS1, SLAM and A* path planning for mapping and navigation.",
    technologies: ["ROS1", "SLAM", "A*"],
  },
  {
    period: "Licence · JUNE 2024",
    label: "Degree",
    title: "Biomedical Engineering",
    specialty: "Medical Informatics",
    description:
      "Licence in Biomedical Engineering with a specialization in Medical Informatics at ISTMT.",
    technologies: ["Biomedical", "Medical Informatics"],
  },
  {
    period: "Mémoire · FEB 2026",
    label: "Master's Thesis",
    title: "Teleoperated Surgical Robotic Instrument",
    description:
      "Designed a ROS2 surgical robotic instrument integrating control, sensing, camera feedback and mechatronics.",
    technologies: ["ROS2", "Raspberry Pi", "SolidWorks"],
  },
  {
    period: "Mastère · JULY 2026",
    label: "Degree",
    title: "Embedded Systems & Medical Equipment",
    specialty: "Medical Information Processing",
    description:
      "Professional Mastère focused on embedded systems, medical equipment and medical information processing.",
    technologies: ["Embedded Systems", "Medical Equipment"],
  },
];

export const projects: PortfolioProject[] = [
  {
    slug: "surgical-robotic-instrument",
    title: "Surgical Robotic Instrument Project",
    category: "Medical Robotics",
    status: "First Release Done",
    year: "2026",
    role: "System design, embedded control and integration",
    description:
      "A surgical robotics demonstrator combining ROS2, MoveIt, Raspberry Pi control, force sensing, camera feedback and a cable-driven mechanical instrument.",
    longDescription: [
      "This project explores the design and implementation of a teleoperated surgical instrument inspired by robotic minimally invasive surgery systems. It combines mechanical design, embedded electronics, sensor integration, computer vision feedback and ROS2-based motion control in a single working demonstrator.",
      "The system is divided between a computer running ROS2, MoveIt and RViz, and a Raspberry Pi responsible for hardware-level execution. The instrument uses multiple servomotors, cable-and-pulley transmission, an FSR force sensor, an MCP3202 analog-to-digital converter and a camera for remote visual feedback.",
      "Safety was treated as a core engineering requirement. Force thresholds warn the operator before excessive jaw pressure and block further closing when the configured safety limit is exceeded, while opening movement remains available.",
    ],
    challenge:
      "Create a compact surgical-instrument prototype capable of translating remote commands into controlled articulation while integrating force feedback, visual feedback and safety constraints.",
    solution:
      "A distributed ROS2 architecture was developed with MoveIt-based planning on the computer and a dedicated trajectory and servo-control layer on the Raspberry Pi. Mechanical, electronic and software subsystems were iteratively designed and tested as one integrated system.",
    highlights: [
      "ROS2 Humble and MoveIt motion-planning integration",
      "Teleoperation across computer and Raspberry Pi",
      "Cable-driven multi-degree-of-freedom instrument",
      "FSR force sensing through an MCP3202 ADC",
      "Camera-based remote visual feedback",
      "Configurable warning and motion-blocking thresholds",
    ],
    responsibilities: [
      "Mechanical concept and SolidWorks prototyping",
      "ROS2 package architecture and communication",
      "MoveIt and RViz configuration",
      "Raspberry Pi servo and GPIO control",
      "Sensor acquisition and force-threshold logic",
      "Camera integration and system-level testing",
    ],
    image: "/project-surgical-robot/surgical-robot-07.png",
    media: [
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-07.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-15.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-14.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-01.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-02.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-03.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-04.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-05.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-06.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-08.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-09.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-10.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-12.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-surgical-robot/surgical-robot-13.png",
        title: "",
        alt: "Surgical robotic instrument project image",
        caption: "",
      }
    ],
    documents: [
      {
        title: "Technical project brief",
        description:
          "Architecture, control pipeline, sensing and safety summary.",
        href: "/project-docs/surgical-robot-technical-brief.txt",
        format: "TXT",
      },
    ],
    technologies: [
      "ROS2",
      "MoveIt",
      "RViz",
      "Raspberry Pi",
      "Python",
      "FSR",
      "MCP3202",
      "SolidWorks",
      "Mechatronics",
    ],
    featured: true,
  },
  {
    slug: "autonomous-navigation-robot",
    title: "Autonomous Navigation Robot",
    category: "Robotics",
    status: "Licence Project",
    year: "2023",
    role: "Robotics software and navigation development",
    description:
      "An autonomous mobile robot using ROS1, SLAM and A* path planning for mapping, localization and navigation.",
    longDescription: [
      "The autonomous-navigation robot was developed as a multidisciplinary robotics project combining mapping, localization, path planning and mobile-platform control.",
      "The robot used ROS1 as the software framework and SLAM to construct a representation of its environment. An A* planning implementation generated routes toward selected destinations while taking the mapped environment into account.",
      "The project established the foundation for later work in ROS2 and medical robotics by introducing robot coordinate systems, sensor-driven navigation, modular ROS nodes and full-system testing.",
    ],
    challenge:
      "Enable a mobile robot to understand an unknown environment, generate a map and autonomously move toward a target without relying on a predefined route.",
    solution:
      "ROS1 nodes were combined with SLAM, localization and A* path planning to create a modular navigation pipeline from environmental perception to motion execution.",
    highlights: [
      "ROS1-based modular architecture",
      "SLAM mapping and localization",
      "A* route planning",
      "Autonomous target navigation",
      "Sensor and mobile-base integration",
      "Iterative simulation and physical testing",
    ],
    responsibilities: [
      "ROS1 node development",
      "Mapping and localization configuration",
      "A* path-planning logic",
      "Navigation testing and debugging",
      "Robot-system integration",
    ],
    image: "/project-autonomous-robot/autonomous-robot-02.png",
    media: [
      {
        kind: "image",
        src: "/project-autonomous-robot/autonomous-robot-02.png",
        title: "",
        alt: "Autonomous navigation robot project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-autonomous-robot/autonomous-robot-01.png",
        title: "",
        alt: "Autonomous navigation robot project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-autonomous-robot/autonomous-robot-03.png",
        title: "",
        alt: "Autonomous navigation robot project image",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-autonomous-robot/autonomous-robot-04.png",
        title: "",
        alt: "Autonomous navigation robot project image",
        caption: "",
      }
    ],
    documents: [
      {
        title: "Navigation project brief",
        description:
          "Summary of the ROS1, SLAM and A* navigation pipeline.",
        href: "/project-docs/autonomous-navigation-project-brief.txt",
        format: "TXT",
      },
    ],
    technologies: [
      "ROS1",
      "SLAM",
      "A*",
      "Python",
      "C++",
      "Autonomous Navigation",
    ],
  },
  {
    slug: "operational-automation-system",
    title: "Operational Automation & Data System",
    category: "Automation",
    status: "Completed",
    year: "2024",
    role: "Product design, automation and data architecture",
    description:
      "An internal operational ecosystem with dashboards, analytics, forms, workspaces, email automation and API-based data gathering.",
    longDescription: [
      "The operational automation system was created to reduce repetitive manual work and provide teams with a clearer view of their activities, responsibilities and performance.",
      "Google Sheets served as a structured data layer while Google Apps Script connected forms, dashboards, automated emails, internal workspaces and external data sources.",
      "Instead of building isolated spreadsheets, the project treated the Google Workspace environment as a connected operational platform with reusable automation and centralized reporting.",
    ],
    challenge:
      "Replace fragmented manual processes with a practical system that teams could adopt quickly without requiring a complex infrastructure.",
    solution:
      "A connected Google Workspace architecture was developed using Apps Script, structured Sheets, Forms, automated communication and API-based data collection.",
    highlights: [
      "Automated operational dashboards",
      "Form-driven data collection",
      "Automated email workflows",
      "API-based information gathering",
      "Reusable team workspaces",
      "Performance and activity analytics",
    ],
    responsibilities: [
      "Workflow analysis",
      "Data-model design",
      "Google Apps Script development",
      "Dashboard creation",
      "Email and form automation",
      "Team onboarding and continuous improvement",
    ],
    image: "/project-sheets-banner.svg",
    media: [
      {
        kind: "sheet",
        src: "https://docs.google.com/spreadsheets/d/19yi8fGlqi4zElvfcMf-ZRQfDIe9nXDlhPV2jpEGEx3k/preview?gid=106641308",
        href: "https://docs.google.com/spreadsheets/d/19yi8fGlqi4zElvfcMf-ZRQfDIe9nXDlhPV2jpEGEx3k/edit?gid=106641308#gid=106641308",
        title: "",
        caption:
          "Google Sheets workspace used within the automation, reporting and operational-data environment.",
      },
      {
        kind: "sheet",
        src: "https://docs.google.com/spreadsheets/d/1okk_aomZZ05J72PZcKIRmBy_f8rAPTwTtZJU5GR5rD4/preview?gid=0",
        href: "https://docs.google.com/spreadsheets/d/1okk_aomZZ05J72PZcKIRmBy_f8rAPTwTtZJU5GR5rD4/edit?gid=0#gid=0",
        title: "",
        caption:
          "Interactive spreadsheet from the connected Google Workspace operational system.",
      },
      {
        kind: "sheet",
        src: "https://docs.google.com/spreadsheets/d/1v31P8nsTXbmr2_TGasLXyAihb3CSGJWPrBc58B2Dj5s/preview?gid=0",
        href: "https://docs.google.com/spreadsheets/d/1v31P8nsTXbmr2_TGasLXyAihb3CSGJWPrBc58B2Dj5s/edit?gid=0#gid=0",
        title: "",
        caption:
          "Structured Google Sheets workspace supporting operational workflows and internal data management.",
      },
      {
        kind: "sheet",
        src: "https://docs.google.com/spreadsheets/d/1xDHFgZTURVdnGMjJn9cfOc1J5iW_Qr19-ujWZuzdy3Q/preview",
        href: "https://docs.google.com/spreadsheets/d/1xDHFgZTURVdnGMjJn9cfOc1J5iW_Qr19-ujWZuzdy3Q/edit?usp=sharing",
        title: "",
        caption:
          "Operational spreadsheet demonstrating the Google Workspace-based system.",
      },
      {
        kind: "sheet",
        src: "https://docs.google.com/spreadsheets/d/10DqsW32crXdMiVGzG3MPBel2CYYGnmVtVhOw1Hbt7Z0/preview",
        href: "https://docs.google.com/spreadsheets/d/10DqsW32crXdMiVGzG3MPBel2CYYGnmVtVhOw1Hbt7Z0/edit?usp=sharing",
        title: "",
        caption:
          "Google Sheets workspace integrated into the broader automation and information-management system.",
      },
      {
        kind: "sheet",
        src: "https://docs.google.com/spreadsheets/d/1Y6VVab84lYx3uySNsaz6YAZM7rarWGuR3dlnbtRzEZU/preview",
        href: "https://docs.google.com/spreadsheets/d/1Y6VVab84lYx3uySNsaz6YAZM7rarWGuR3dlnbtRzEZU/edit?usp=sharing",
        title: "",
        caption:
          "Interactive Google Sheets workspace used for organizational operations and structured information.",
      },
      {
        kind: "sheet",
        src: "https://docs.google.com/spreadsheets/d/14fAe25Z6oRraClSfbRBML-o4uqE94yiH8VLB71kuU6s/preview",
        href: "https://docs.google.com/spreadsheets/d/14fAe25Z6oRraClSfbRBML-o4uqE94yiH8VLB71kuU6s/edit?usp=sharing",
        title: "",
        caption:
          "Google Workspace spreadsheet forming part of the connected automation platform.",
      },
      {
        kind: "sheet",
        src: "https://docs.google.com/spreadsheets/d/1rFLYi4rohcZE8jezrui51xwXVH_etKVbEYFF4DxBbyQ/preview",
        href: "https://docs.google.com/spreadsheets/d/1rFLYi4rohcZE8jezrui51xwXVH_etKVbEYFF4DxBbyQ/edit?usp=sharing",
        title: "",
        caption:
          "Additional Google Sheets workspace documenting the scale of the automation and operational-data ecosystem.",
      },
    ],
    documents: [
      {
        title: "Automation system overview",
        description:
          "Summary of the workflows, dashboards and automation architecture.",
        href: "/project-docs/automation-system-overview.txt",
        format: "TXT",
      },
    ],
    technologies: [
      "Google Apps Script",
      "Google Sheets",
      "Google Forms",
      "REST APIs",
      "Dashboards",
      "Workflow Automation",
    ],
  },
  {
    slug: "internal-erp-platform",
    title: "Internal ERP Platform",
    category: "Software Systems",
    status: "Completed",
    year: "2025",
    role: "Full-stack system and workflow development",
    description:
      "A custom platform developed to move operations from spreadsheet workflows to a structured ERP environment.",
    longDescription: [
      "The internal ERP platform represented the next stage of the operational system. It moved core processes from loosely connected spreadsheets into a dedicated application with structured data, clearer permissions and purpose-built interfaces.",
      "The platform was designed around organizational workflows rather than generic pages. Dashboards, records, administrative actions and operational processes were connected through a consistent data model.",
      "The work combined product thinking, interface design, backend logic and database organization while preserving lessons learned from the earlier automation platform.",
    ],
    challenge:
      "Create a maintainable application capable of supporting growing organizational workflows that had exceeded the practical limits of a spreadsheet-based system.",
    solution:
      "A dedicated web platform was structured around reusable modules, centralized data, role-aware access, dashboards and workflow-specific interfaces.",
    highlights: [
      "Centralized operational data",
      "Role-aware application structure",
      "Administrative dashboards",
      "Structured workflow management",
      "Migration from spreadsheet processes",
      "Modular platform architecture",
    ],
    responsibilities: [
      "Requirements and workflow analysis",
      "Application and database architecture",
      "Frontend interface development",
      "Backend workflow implementation",
      "Administrative tools",
      "Testing and iterative delivery",
    ],
    image: "/project-erp/erp-interface-02.png",
    media: [
      {
        kind: "image",
        src: "/project-erp/erp-interface-02.png",
        title: "",
        alt: "Internal ERP platform interface",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-erp/erp-interface-03.png",
        title: "",
        alt: "Internal ERP platform interface",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-erp/erp-interface-04.png",
        title: "",
        alt: "Internal ERP platform interface",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-erp/erp-interface-05.png",
        title: "",
        alt: "Internal ERP platform interface",
        caption: "",
      },
      {
        kind: "image",
        src: "/project-erp/erp-interface-06.png",
        title: "",
        alt: "Internal ERP platform interface",
        caption: "",
      },
    ],
    documents: [],
    technologies: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Supabase",
      "Dashboards",
      "Data Management",
      "Workflow Systems",
    ],
  },
  {
    slug: "promotional-web-platforms",
    title: "Promotional Web Platforms",
    category: "Web Development",
    status: "Completed",
    year: "2026",
    role: "Design, frontend development and digital experience",
    description:
      "A collection of promotional and event-focused web platforms developed for AIESEC initiatives, conferences and organizational communication.",
    longDescription: [
      "This work represents an early stage of my software-development journey, where I translated communication and event needs into complete web experiences. The projects included promotional websites, conference platforms and the AIESEC 2030 Vision website.",
      "The focus was primarily on frontend development, responsive interfaces, information architecture and visual communication, with lightweight backend functionality added where necessary.",
      "These projects established the web-development foundation that later evolved into more structured internal automation systems and eventually a dedicated ERP platform.",
    ],
    challenge:
      "Turn organizational initiatives, events and strategic communication into clear, engaging and maintainable digital experiences that could be used across different audiences and devices.",
    solution:
      "Designed and developed responsive web platforms with structured content, focused user journeys and reusable frontend patterns, adapting each experience to its communication or event objective.",
    highlights: [
      "AIESEC 2030 Vision promotional website",
      "Conference and event-focused web platforms",
      "Responsive frontend implementation",
      "Digital communication and information architecture",
      "Lightweight backend functionality where required",
    ],
    responsibilities: [
      "Frontend architecture and implementation",
      "Responsive interface development",
      "Content and navigation structure",
      "Visual experience refinement",
      "Testing and iterative improvements",
    ],
    image: "/project-promotional-web.svg",
    media: [
      {
        kind: "website",
        src: "https://liveitwithbardo.vercel.app/",
        href: "https://liveitwithbardo.vercel.app/",
        title: "Live It With Bardo",
        caption: "",
      },
      {
        kind: "website",
        src: "https://ait2030.aiesec.org.tn/",
        href: "https://ait2030.aiesec.org.tn/",
        title: "AIT 2030",
        caption: "",
      },
    ],
    documents: [
      {
        title: "Promotional Web Platforms Overview",
        description:
          "Project context, selected work, contributions and technical overview.",
        href: "/project-docs/promotional-web-platforms-overview.txt",
        format: "TXT",
      },
    ],
    externalLinks: [
      {
        title: "Live It With Bardo",
        href: "https://liveitwithbardo.vercel.app/en",
      },
      {
        title: "AIT 2030",
        href: "https://ait2030.aiesec.org.tn/",
      },
    ],    technologies: [
      "Frontend",
      "JavaScript",
      "Responsive Design",
      "Web Development",
      "UI/UX",
    ],
  },];

export const skillGroups = [
  {
    title: "Robotics Related",
    skills: [
      "ROS Handling",
      "MoveIt (Motion Planning & Inverse Kinematics)",
      "SLAM (Vision-Based Identification)",
      "A* (2D Path Planning)",
    ],
  },

  {
    title: "Embedded Systems & Electronics",
    skills: [
      "FreeRTOS",
      "Embedded Linux",
      "STM32Cube",
      "FPGA Design",
      "LabVIEW",
      "micro-ROS Handling",
    ],
  },

  {
    title: "Programming",
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
    title: "Simulation & Prototyping",
    skills: [
      "SolidWorks (CAD & Sheet Metal)",
      "Gazebo",
      "Qt",
      "Proteus",
      "KiCad",
      "3D Printing Handling",
    ],
  },

  {
    title: "Automation, Data & Platforms",
    skills: [
      "Google Sheets",
      "Google Apps Script",
      "Looker Studio (Google's Power BI Alternative)",
      "GraphQL",
      "REST API",
      "PostgreSQL",
    ],
  },

  {
    title: "General",
    skills: [
      "Git",
      "LaTeX",
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