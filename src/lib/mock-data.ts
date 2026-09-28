import type { Student, Course } from "./types";

export const initialStudents: Student[] = [
  {
    id: "1",
    firstName: "Matt",
    lastName: "Damon",
    studentId: "650610001",
    status: "Active",
    enrolledCourses: ["CS101", "CS201"],
  },
  {
    id: "2",
    firstName: "Emily",
    lastName: "Blunt",
    studentId: "650610003",
    status: "Active",
    enrolledCourses: ["CS101"],
  },
  {
    id: "3",
    firstName: "Florence",
    lastName: "Pugh",
    studentId: "650610004",
    status: "Active",
    enrolledCourses: ["CPE301"],
  },
  {
    id: "4",
    firstName: "Robert",
    lastName: "Downey",
    studentId: "650610005",
    status: "Active",
    enrolledCourses: [],
  },
  {
    id: "5",
    firstName: "Zendaya",
    lastName: "Coleman",
    studentId: "650610006",
    status: "Active",
    enrolledCourses: ["CS101", "CPE301", "CPE302"],
  },
];

export const initialCourses: Course[] = [
  {
    courseCode: "CS101",
    title: "Introduction to Programming",
    instructors: ["Dome"],
  },
  {
    courseCode: "CS201",
    title: "Data Structures",
    instructors: ["Chanatita"],
  },
  {
    courseCode: "CPE301",
    title: "Basic Computer Engineering Lab",
    instructors: ["Dome", "Chanatita"],
  },
  {
    courseCode: "CPE302",
    title: "Full Stack Development",
    instructors: ["Dome", "Nirand", "Chanatita"],
  },
  {
    courseCode: "ISNE101",
    title: "Introduction to Information Systems and Network Engineering",
    instructors: ["KENNETH COSH"],
  },
];