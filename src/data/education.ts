export interface EducationItem {
  degree: string;
  school: string;
  location?: string;
  period: string;
}

export const education: EducationItem[] = [
  {
    degree: "BE, Information Science",
    school: "RR Institute of Technology",
    location: "Bangalore",
    period: "2019 – 2023",
  },
  {
    degree: "Full-Stack Development (MERN)",
    school: "Brototype",
    period: "2024 – 2025",
  },
];
