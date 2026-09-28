import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Student, Course } from "./types";
import { initialStudents, initialCourses } from "./mock-data";

interface EnrollmentState {
  students: Student[];
  courses: Course[];
  addCourse: (course: Course) => void;
  deleteCourse: (courseCode: string) => void;
  removeInstructor: (courseCode: string, instructorName: string) => void;
  enrollStudents: (courseCode: string, studentIds: string[]) => void;
  dropStudentFromCourse: (courseCode: string, studentId: string) => void;
}

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,

      addCourse: (newCourse) =>
        set((state) => ({
          courses: [...state.courses, newCourse],
        })),

      deleteCourse: (courseCode) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseCode !== courseCode),
          students: state.students.map((s) => ({
            ...s,
            enrolledCourses: s.enrolledCourses.filter((code) => code !== courseCode),
          })),
        })),

      removeInstructor: (courseCode, instructorName) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.courseCode === courseCode
              ? {
                  ...c,
                  instructors: c.instructors?.filter((inst) => inst !== instructorName),
                }
              : c
          ),
        })),

      enrollStudents: (courseCode, studentIds) =>
        set((state) => ({
          students: state.students.map((s) => {
            if (studentIds.includes(s.id)) {
              const updated = new Set([...s.enrolledCourses, courseCode]);
              return { ...s, enrolledCourses: Array.from(updated) };
            }
            return s;
          }),
        })),

      dropStudentFromCourse: (courseCode, studentId) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  enrolledCourses: s.enrolledCourses.filter((code) => code !== courseCode),
                }
              : s
          ),
        })),
    }),
    {
      name: "lab16-2569-680610728",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    }
  )
);