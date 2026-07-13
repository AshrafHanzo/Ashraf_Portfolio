// Complete Portfolio Data with Scroll Animation Support
// Owner: Ashraf Ali — AI Automation Engineer & Full-Stack Developer
// This file is the built-in source of truth. When your Firebase RTDB is empty,
// the site renders from here. Open /admin/dashboard to push these into Firebase.

import { Code2, Bot, Cpu, Workflow, Briefcase, Rocket, Globe, Award, Shield, Home, Smartphone, Truck, Users, Server, Database, Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

// Personal information
export const personalInfo = {
    name: "Ashraf Ali",
    firstName: "Ashraf",
    title: "AI Automation Engineer & Full-Stack Developer",
    tagline: "With great code comes great responsibility.",
    email: "ashrafali.offic@gmail.com",
    phone: "+91 7305041971",
    location: "Chennai, India",
    linkedin: "https://linkedin.com/in/ashrafali2004",
    github: "https://github.com/AshrafHanzo",
    profileImage: "/assets/profile.png",
    education: "B.Tech — Information Technology",
    currentCompany: "WorkBooster AI",
    badgeText: "AI Automation Engineer @",
    badgeColor: "primary", // Options: 'primary' (Spidey Red) or 'accent' (Spidey Blue)
};

// About section with intro paragraphs for storytelling
export const aboutContent = {
    intro: "AI Automation Engineer & Full-Stack Developer building production SaaS platforms, logistics automation, ATS/CRM solutions, and AI-powered workflows — skilled in FastAPI, React, Python, Playwright, Redis Queue and AI agents.",
    story: [
        "My journey started with a simple obsession: making machines do the boring, repetitive work so people don't have to.",
        "At WorkBooster AI I architect real-time logistics platforms, browser-automation pipelines, and scalable SaaS dashboards that run in production every single day.",
        "From WhatsApp alert systems to AI document extraction and ERP mobile apps — I love shipping technology that quietly saves businesses thousands of hours.",
    ],
    highlights: [
        { icon: Code2, title: "Full-Stack Development", description: "Production SaaS with FastAPI, React & TypeScript", stat: "End-to-End" },
        { icon: Bot, title: "AI & Browser Automation", description: "Scraping & workflows with Playwright, Selenium, n8n", stat: "AI-Powered" },
        { icon: Workflow, title: "Real-Time Systems", description: "Shipment tracking, WhatsApp alerts & Redis queues", stat: "Live" },
        { icon: Server, title: "DevOps & Deployment", description: "Linux, Nginx, Docker & CI/CD with Coolify", stat: "Shipped" },
    ],
};

// Experience for horizontal timeline
export const experiences = [
    {
        id: 1,
        title: "Software Developer",
        company: "WorkBooster AI",
        period: "Oct 2025 – Present",
        type: "current",
        icon: Rocket,
        description: "Building production SaaS, logistics automation and AI-powered internal tools.",
        highlights: [
            "Full-stack apps with Python, FastAPI, React, TypeScript, PostgreSQL & Redis Queue",
            "Browser & data-extraction automation using Selenium and Playwright",
            "Real-time shipment tracking, ETA monitoring & WhatsApp notification systems",
            "Scalable admin dashboards, CRM/ATS/ERP tools & Linux/Nginx/Coolify CI/CD",
        ],
        color: "primary",
    },
    {
        id: 2,
        title: "Software Developer",
        company: "Self-Employed",
        period: "Jan 2025 – Sep 2025",
        type: "completed",
        icon: Briefcase,
        description: "Freelance full-stack development and AI automation systems for clients.",
        highlights: [
            "Built & deployed full-stack apps with PHP, SQL, Python, React & TypeScript",
            "Developed AI automation systems using n8n and Flowise",
            "Delivered CRM systems, admin dashboards and automation workflows",
        ],
        color: "accent",
    },
    {
        id: 3,
        title: "Web Development Intern",
        company: "Branups",
        period: "Mar 2025 – Jul 2025",
        type: "completed",
        icon: Globe,
        description: "Client websites and responsive interactive UI/UX systems.",
        highlights: [
            "Built client sites with WordPress, React, HTML, CSS & JavaScript",
            "Designed responsive UI/UX systems and interactive components",
            "Optimized for performance across devices",
        ],
        color: "primary",
    },
    {
        id: 4,
        title: "Team Lead — Smart India Hackathon",
        company: "SIH 2023 – 2024",
        period: "2023 – 2024",
        type: "achievement",
        icon: Award,
        description: "Led two national-level hackathon teams building IoT & ML solutions.",
        highlights: [
            "IoT Pipeline Leakage Detection — sensor architecture & alerting",
            "Women Safety Analytics — ML-based threat detection",
            "Led team coordination, architecture & live demos",
        ],
        color: "accent",
    },
];

// Skills with levels for animated progress
export const skillCategories = [
    {
        title: "Backend",
        color: "primary",
        skills: [
            { name: "Python", level: 95, icon: "🐍" },
            { name: "FastAPI", level: 92, icon: "⚡" },
            { name: "Flask", level: 82, icon: "🌶️" },
            { name: "REST APIs", level: 90, icon: "🔗" },
            { name: "Redis Queue", level: 85, icon: "🧵" },
            { name: "WebSockets", level: 80, icon: "📡" },
            { name: "JWT / Auth", level: 85, icon: "🔐" },
        ],
    },
    {
        title: "Frontend",
        color: "accent",
        skills: [
            { name: "React.js", level: 90, icon: "⚛️" },
            { name: "TypeScript", level: 88, icon: "📘" },
            { name: "JavaScript", level: 90, icon: "🟨" },
            { name: "Tailwind CSS", level: 90, icon: "🎨" },
            { name: "HTML5 / CSS3", level: 92, icon: "🧱" },
        ],
    },
    {
        title: "Automation & AI",
        color: "primary",
        skills: [
            { name: "Playwright", level: 90, icon: "🎭" },
            { name: "Selenium", level: 88, icon: "🕸️" },
            { name: "n8n", level: 88, icon: "🔄" },
            { name: "Flowise", level: 82, icon: "🌊" },
            { name: "AI Agents", level: 85, icon: "🤖" },
            { name: "OCR / NLP", level: 80, icon: "🧠" },
            { name: "WhatsApp Automation", level: 88, icon: "💬" },
        ],
    },
    {
        title: "Databases",
        color: "accent",
        skills: [
            { name: "PostgreSQL", level: 90, icon: "🐘" },
            { name: "MySQL", level: 85, icon: "🐬" },
            { name: "SQLite", level: 82, icon: "📦" },
            { name: "SQL", level: 88, icon: "🗄️" },
        ],
    },
    {
        title: "DevOps & Mobile",
        color: "primary",
        skills: [
            { name: "Linux (Ubuntu)", level: 88, icon: "🐧" },
            { name: "Docker", level: 82, icon: "🐳" },
            { name: "Nginx", level: 85, icon: "🌐" },
            { name: "Coolify / CI-CD", level: 84, icon: "🚀" },
            { name: "Git", level: 88, icon: "🔀" },
            { name: "React Native", level: 80, icon: "📱" },
        ],
    },
];

// Projects with categories for filtering
export const projects = [
    {
        id: 1,
        title: "TrackContainer",
        subtitle: "SaaS Logistics Automation Platform",
        description: "A full shipment-lifecycle automation platform with web-scraping infrastructure, real-time ETA tracking, WhatsApp notifications and an admin control panel.",
        icon: Truck,
        tags: ["React.js", "FastAPI", "PostgreSQL", "Redis Queue", "Playwright"],
        features: [
            "Shipment lifecycle automation with scraping engine",
            "WhatsApp automation notifications",
            "Admin control panel & real-time ETA monitoring",
        ],
        color: "primary",
        featured: true,
        category: "ai",
    },
    {
        id: 2,
        title: "DHI Consultancy",
        subtitle: "ATS & Recruitment Ecosystem",
        description: "An end-to-end recruitment platform with candidate management, job board, employee dashboards, JWT auth and recruitment analytics deployed on Ubuntu + Nginx.",
        icon: Users,
        tags: ["React.js", "TypeScript", "FastAPI", "PostgreSQL", "Nginx"],
        features: [
            "Candidate management & job board",
            "Employee dashboards with JWT auth",
            "Ad-campaign landing pages & analytics",
        ],
        color: "accent",
        featured: true,
        category: "web",
    },
    {
        id: 3,
        title: "WorkMate",
        subtitle: "AI Workflow Automation Platform",
        description: "A browser-automation platform that handles repetitive employee tasks, with admin task assignment, scheduling and full workflow monitoring.",
        icon: Bot,
        tags: ["Python", "Playwright", "n8n", "Automation", "AI Agents"],
        features: [
            "Browser automation for repetitive tasks",
            "Admin task assignment & scheduling",
            "Workflow monitoring & control",
        ],
        color: "primary",
        featured: true,
        category: "ai",
    },
    {
        id: 4,
        title: "Mobile App Suite",
        subtitle: "ERP, CRM & Logistics Apps",
        description: "A cross-platform mobile suite — BoostEntry (invoice OCR → ERP), CRM Mobile (lead & sales pipeline) and TrackContainer Mobile (shipment tracking).",
        icon: Smartphone,
        tags: ["React Native", "OCR", "CRM", "ERP"],
        features: [
            "BoostEntry — invoice OCR & ERP upload",
            "CRM Mobile — lead & pipeline tracking",
            "TrackContainer Mobile — shipment tracking",
        ],
        color: "accent",
        featured: false,
        category: "mobile",
    },
    {
        id: 5,
        title: "Smart Home Automation",
        subtitle: "Complete IoT Solution",
        description: "An IoT solution featuring smart locking, appliance control and thief-detection alerts built on Arduino / ESP8266.",
        icon: Home,
        tags: ["Arduino", "ESP8266", "IoT", "Sensors"],
        features: [
            "Smart door locking system",
            "Appliance control",
            "Thief detection & alerts",
        ],
        color: "primary",
        featured: false,
        category: "iot",
    },
];

// Contact info
export const contactInfo = [
    { icon: Mail, label: "Email", value: "ashrafali.offic@gmail.com", href: "mailto:ashrafali.offic@gmail.com" },
    { icon: Phone, label: "Phone", value: "+91 7305041971", href: "tel:+917305041971" },
    { icon: MapPin, label: "Location", value: "Chennai, India", href: null },
];

export const socials = [
    { icon: Github, href: "https://github.com/AshrafHanzo", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/ashrafali2004", label: "LinkedIn" },
];

// Navigation chapters for scroll
export const chapters = [
    { id: "hero", label: "Home", number: "00" },
    { id: "about", label: "About", number: "01" },
    { id: "experience", label: "Journey", number: "02" },
    { id: "skills", label: "Skills", number: "03" },
    { id: "projects", label: "Work", number: "04" },
    { id: "contact", label: "Contact", number: "05" },
];

// Certifications (Technical)
export const certifications = [
    { title: "Generative AI Course (8 Weeks)", issuer: "Social Eagle", year: 2025 },
    { title: "Java Masterclass (130+ hrs)", issuer: "Udemy", year: 2024 },
    { title: "Generative AI Foundational", issuer: "Udemy", year: 2024 },
    { title: "Journey to Cloud", issuer: "IBM SkillsBuild", year: 2024 },
    { title: "Java Training (77.05%)", issuer: "IIT Bombay", year: 2024 },
];

// Achievements Unlocked
export const achievements = [
    { title: "Team Lead — SIH (Women Safety, ML)", issuer: "Smart India Hackathon", year: 2024 },
    { title: "Team Lead — SIH (IoT Pipeline Leakage)", issuer: "Smart India Hackathon", year: 2023 },
    { title: "Coordinator — InnoHub", issuer: "College Project Hub", year: 2023 },
    { title: "3rd Place — Project Hackathon Expo", issuer: "Kings Engineering College", year: 2022 },
];

// Tech stack for floating animation
export const techStack = [
    "FastAPI", "React", "Python", "TypeScript", "PostgreSQL", "Playwright",
    "Redis", "n8n", "Docker", "Nginx", "AI Agents", "Selenium"
];

// Re-export for backwards compatibility
export const highlights = aboutContent.highlights;
