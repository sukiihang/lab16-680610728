export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  status: "Active" | "Inactive";
  enrolledCourses: string[];
}

export interface Course {
  courseCode: string;
  title: string;
  instructors?: string[];
}