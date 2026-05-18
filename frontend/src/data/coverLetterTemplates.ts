import { CoverLetterData } from "@/types/coverLetter";

export const softwareEngineerCoverLetter: CoverLetterData = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA 94105",
  },
  recipientInfo: {
    companyName: "Tech Innovations Inc.",
    hiringManager: "Sarah Williams",
    companyAddress: "456 Innovation Ave, San Francisco, CA 94107",
  },
  content: {
    opening: "I am writing to express my strong interest in the Software Engineer position at Tech Innovations Inc. With over 5 years of experience in full-stack development and a proven track record of delivering scalable solutions, I am excited about the opportunity to contribute to your team's mission of building cutting-edge technology.",
    body: "In my current role at Digital Solutions Corp, I have successfully led the development of multiple web applications using React, Node.js, and PostgreSQL, serving over 100,000 active users. I architected a microservices-based system that improved application performance by 40% and reduced deployment time by 60%. My experience with modern DevOps practices, including CI/CD pipelines and containerization, aligns perfectly with your team's technical stack.\n\nWhat excites me most about Tech Innovations is your commitment to innovation and your focus on creating products that make a real difference. I am particularly impressed by your recent launch of the AI-powered analytics platform and would love to contribute my expertise in both frontend and backend development to future projects.",
    closing: "I would welcome the opportunity to discuss how my technical skills and passion for innovation can contribute to Tech Innovations' continued success. Thank you for considering my application. I look forward to the possibility of joining your talented team.",
  },
  date: new Date().toISOString().split('T')[0],
};

export const designerCoverLetter: CoverLetterData = {
  personalInfo: {
    fullName: "Emma Davis",
    email: "emma.davis@email.com",
    phone: "+1 (555) 234-5678",
    address: "789 Design Blvd, New York, NY 10001",
  },
  recipientInfo: {
    companyName: "Creative Studios",
    hiringManager: "Michael Chen",
    companyAddress: "321 Art Avenue, New York, NY 10002",
  },
  content: {
    opening: "I am thrilled to apply for the UI/UX Designer position at Creative Studios. As a passionate designer with 4 years of experience creating user-centered digital experiences, I am drawn to your studio's reputation for pushing creative boundaries while maintaining exceptional usability.",
    body: "Throughout my career, I have specialized in transforming complex user problems into elegant, intuitive solutions. At DesignFirst Agency, I led the redesign of a major e-commerce platform that increased user engagement by 45% and conversion rates by 30%. My approach combines thorough user research, rapid prototyping, and data-driven iteration to ensure designs not only look beautiful but also drive measurable business results.\n\nI am particularly excited about Creative Studios' recent work in the healthcare sector. My experience designing accessible interfaces and conducting usability testing with diverse user groups would be valuable as you continue to expand into projects that require both aesthetic excellence and inclusive design principles.",
    closing: "I would love the opportunity to bring my design thinking and user advocacy to Creative Studios. Thank you for your time and consideration. I look forward to discussing how I can contribute to creating exceptional user experiences for your clients.",
  },
  date: new Date().toISOString().split('T')[0],
};

export const businessCoverLetter: CoverLetterData = {
  personalInfo: {
    fullName: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 345-6789",
    address: "456 Business Park, Chicago, IL 60601",
  },
  recipientInfo: {
    companyName: "Global Enterprises",
    hiringManager: "Jennifer Martinez",
    companyAddress: "789 Corporate Drive, Chicago, IL 60602",
  },
  content: {
    opening: "I am writing to apply for the Business Analyst position at Global Enterprises. With a strong background in data analysis, process optimization, and strategic planning, I am confident in my ability to drive impactful business outcomes for your organization.",
    body: "In my role as Senior Business Analyst at Strategic Consulting Group, I have successfully managed cross-functional projects that delivered over $2M in cost savings and efficiency improvements. I excel at translating complex data into actionable insights and have a proven track record of stakeholder management across all organizational levels. My expertise in SQL, Tableau, and advanced Excel, combined with strong business acumen, enables me to identify opportunities and implement solutions that align with strategic objectives.\n\nI am particularly drawn to Global Enterprises' focus on sustainable business practices and digital transformation. My recent experience leading the implementation of a data analytics platform that improved decision-making speed by 50% aligns well with your organization's commitment to innovation and excellence.",
    closing: "I am excited about the opportunity to contribute to Global Enterprises' continued growth and success. Thank you for considering my application. I look forward to discussing how my analytical skills and business expertise can add value to your team.",
  },
  date: new Date().toISOString().split('T')[0],
};
