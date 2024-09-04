import FrontEndLogo from "../components/assets/frontend-logo.png";
import BackEndLogo from "../components/assets/backend-logo.png";
import DatabasesLogo from "../components/assets/db.webp";
import EmbededLogo from "../components/assets/embeded-logo.png";
import All from "../components/assets/all.png";
import Default from "../components/assets/default_course.jfif";

import StudentCapIcon from "../components/assets/student-cap.svg";
import OnlineIcon from "../components/assets/online.svg";
import LessonsIcon from "../components/assets/lesson.svg";
import ExcersiesIcon from "../components/assets/brain.svg";

import JS from "../components/assets/js-course-basics.webp";
import Csharp from "../components/assets/CSharpBasics.jpg";
import C from "../components/assets/CBasics.jpg";
import CPP from "../components/assets/CPPBasics.png";
import JAVA from "../components/assets/javaBS.jpg";
import SQL from "../components/assets/sqlbasics.avif";

export const BACKEND_API_URL: string = "http://localhost:8080";

export const SUPPORTED_LANGUAGES: any = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  c: "C11",
  cpp: "C++17",
  sql: "SQL:2016",
};

export const CODE_SNIPPETS: any = {
  javascript: `\nfunction solution() {\n\t\n}\n\nsolution();\n`,
  typescript: `\ntype Params = {\n\t\n}\n\nfunction solution(data: Params) {\n\t\n}\n\nsolution();\n`,
  python: `\ndef solution():\n\t\n\nsolution()\n`,
  java: `\npublic class Solution {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println();\n\t}\n}\n`,
  csharp: `using System;\n\nnamespace Solution\n{\n\tclass Solution { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine();\n\t\t}\n\t}\n}\n`,
  php: "<?php\n\n$name = '';\necho $name;\n",
  c: `\n#include <stdio.h>\n\nint main() {\n\tprintf();\n\treturn 0;\n}\n`,
  cpp: `\n#include <iostream>\n\nint main() {\n\tstd::cout << "Hello C++!" << std::endl;\n\treturn 0;\n}\n`,
  sql: `\nSELECT 'Hello in SQL!' AS greeting;\n`,
};

export const COURSES_CATEGORIES: any = [
  {
    name: "All Courses",
    icon: All,
    filter: "",
    isActive: true,
  },
  {
    name: "Front-End Development",
    icon: FrontEndLogo,
    filter: "front-end",
    isActive: false,
  },
  {
    name: "Back-End Development",
    icon: BackEndLogo,
    filter: "back-end",
    isActive: false,
  },
  {
    name: "Database Development",
    icon: DatabasesLogo,
    filter: "database",
    isActive: false,
  },
  {
    name: "Embedded Development",
    icon: EmbededLogo,
    filter: "embedded",
    isActive: false,
  },
];

export const CARDS_DATA: any = [
  {
    id: "1",
    title: "Skilled Instructors",
    image: StudentCapIcon,
    text: "Learn from top educators and industry experts who bring real-world experience and insights to the virtual classroom.",
  },
  {
    id: "2",
    title: "Online Classes",
    image: OnlineIcon,
    text: "You will have the opportunity to study from home.",
  },
  {
    id: "3",
    title: "Interactive Lessons",
    image: LessonsIcon,
    text: "Engage with dynamic and interactive materials, including videos, quizzes, simulations, and gamified learning modules, designed to make learning fun and effective.",
  },
  {
    id: "4",
    title: "Exercises",
    image: ExcersiesIcon,
    text: "Monitor your progress with intuitive dashboards and analytics, helping you stay motivated and on track to achieve your learning goals.",
  },
];

export const ITEMS_PER_PAGE: number = 12;

export const COURSE_IMAGES: any = {
  JavaScript: JS,
  "C#": Csharp,
  C: C,
  "C++": CPP,
  Java: JAVA,
  SQL: SQL,
  Default: Default,
};

export const MAX_COURSE_DESCRIPTION_LENGTH: number = 350;

export const COURSE_CATEGORIES: string[] = [
  "Front-End",
  "Back-End",
  "Embedded",
  "Database",
];

export const SUPPORTED_ROLES: string[] = ["admin", "lecturer", "user"];
export const VALID_LEVELS: string[] = ["Beginner", "Intermediate", "Advanced"];
export const VALID_TASKS_TYPE: string[] = ["coding", "database"];

export const ABOUT_PAGE_KEY_FEATURES = [
  {
    head: " ~ Browse Courses:",
    text: "Explore a wide range of courses across various subjects and disciplines. Find the ones that best suit your interests and learning needs.",
  },
  {
    head: " ~ Personalized Profile:",
    text: "Save your favorite courses and resources in your profile for easy access. Keep track of your progress and stay organized.",
  },
  {
    head: " ~ Resource Preview and Download:",
    text: "Get a sneak peek into course materials and download resources to study offline.",
  },
  {
    head: " ~ Interactive Quizzes:",
    text: "Test your knowledge with engaging quizzes designed to reinforce learning",
  },
  {
    head: " ~ Built-In Code Editor:",
    text: "Practice coding directly within our app with our integrated code editor. Solve tasks, run code snippets, and get instant feedback to improve your programming skills.",
  },
];

export const ABOUT_PAGE_WHY_CHOOSE_US = [
  {
    head: " ~ User-Friendly Interface:",
    text: "Our intuitive design makes it easy to navigate and find what you need without any hassle.",
  },
  {
    head: " ~ Comprehensive Learning Tools:",
    text: "From interactive quizzes to a built-in code editor, we offer everything you need to enhance your learning experience.",
  },
  {
    head: " ~ Accessible Anywhere:",
    text: "Learn from anywhere, at any time. Our platform is accessible on various devices, so you can continue your learning journey no matter where you are.",
  },
];

export const LECTURER_RESPONSIBILITIES = [
  {
    head: " ~ Manage Tasks:",
    text: "Lecturers can create, or remove tasks associated with their courses. This feature allows them to tailor assignments to better align with course objectives and student needs.",
  },

  {
    head: " ~ Upload Resources:",
    text: "They have the ability to upload supplementary materials such as lecture notes, articles, and multimedia content. These resources help to enrich the learning experience and provide students with comprehensive study aids.",
  },

  {
    head: " ~ Remove Resources:",
    text: "Lecturers can also remove outdated or irrelevant resources to keep the course materials current and relevant.",
  },
];
