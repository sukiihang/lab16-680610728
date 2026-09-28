import { useState, useMemo } from "react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

export default function EnrollmentsPage() {
  const { students, courses, enrollStudents, dropStudentFromCourse } =
    useEnrollmentStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearchInput, setStudentSearchInput] = useState("");
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);

  const availableStudents = useMemo(() => {
    if (!selectedCourseCode) return [];
    return students.filter(
      (s) => !s.enrolledCourses.includes(selectedCourseCode)
    );
  }, [students, selectedCourseCode]);

  const filteredStudents = useMemo(() => {
    return availableStudents.filter(
      (s) =>
        !selectedStudentIds.includes(s.id) &&
        (`${s.studentId} — ${s.firstName} ${s.lastName}`)
          .toLowerCase()
          .includes(studentSearchInput.trim().toLowerCase())
    );
  }, [availableStudents, selectedStudentIds, studentSearchInput]);

  const handleSelectStudent = (studentId: string) => {
    if (!selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
    setStudentSearchInput("");
  };

  const handleRemoveSelectedStudent = (studentId: string) => {
    setSelectedStudentIds(selectedStudentIds.filter((id) => id !== studentId));
  };

  const handleEnroll = () => {
    if (!selectedCourseCode || selectedStudentIds.length === 0) return;
    enrollStudents(selectedCourseCode, selectedStudentIds);
    setSelectedCourseCode("");
    setSelectedStudentIds([]);
    setStudentSearchInput("");
    setOpenDialog(false);
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            จัดการการลงทะเบียน
          </h1>
          <p className="text-sm text-muted-foreground">
            จัดการการลงทะเบียนและถอนรายวิชาให้นักศึกษาในระบบ
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> ลงทะเบียนให้นักศึกษา
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">วิชาเรียน</label>
                <Select
                  value={selectedCourseCode}
                  onValueChange={(val) => {
                    setSelectedCourseCode(val);
                    setSelectedStudentIds([]);
                    setStudentSearchInput("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกวิชาเรียน..." />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem
                        key={course.courseCode}
                        value={course.courseCode}
                      >
                        {course.courseCode} — {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">นักศึกษา</label>
                <div className="relative">
                  <div
                    className={`min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-ring ${
                      !selectedCourseCode ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {selectedStudentIds.map((id) => {
                      const st = students.find((s) => s.id === id);
                      if (!st) return null;
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="gap-1 pr-1 font-normal"
                        >
                          {st.firstName} {st.lastName}
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedStudent(id)}
                            className="rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                    <input
                      disabled={!selectedCourseCode}
                      value={studentSearchInput}
                      onChange={(e) => {
                        setStudentSearchInput(e.target.value);
                        setIsStudentMenuOpen(true);
                      }}
                      onFocus={() => setIsStudentMenuOpen(true)}
                      placeholder={
                        !selectedCourseCode
                          ? "กรุณาเลือกวิชาก่อน"
                          : selectedStudentIds.length === 0
                          ? "เลือกนักศึกษา..."
                          : ""
                      }
                      className="flex-1 bg-transparent outline-none text-sm min-w-[120px] disabled:cursor-not-allowed"
                    />
                  </div>

                  {isStudentMenuOpen &&
                    selectedCourseCode &&
                    filteredStudents.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                        <div className="max-h-48 overflow-y-auto p-1">
                          {filteredStudents.map((st) => (
                            <div
                              key={st.id}
                              onClick={() => {
                                handleSelectStudent(st.id);
                                setIsStudentMenuOpen(false);
                              }}
                              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                            >
                              {st.studentId} — {st.firstName} {st.lastName}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                onClick={handleEnroll}
                disabled={
                  !selectedCourseCode || selectedStudentIds.length === 0
                }
                className="w-full"
              >
                ลงทะเบียน ({selectedStudentIds.length} คน)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead className="w-[100px]">จำนวน นศ.</TableHead>
              <TableHead>นักศึกษาที่ลงทะเบียน</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-8"
                >
                  ยังไม่มีวิชาเรียน
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => {
                const enrolledList = students.filter((s) =>
                  s.enrolledCourses.includes(course.courseCode)
                );

                return (
                  <TableRow key={course.courseCode}>
                    <TableCell className="font-medium">
                      {course.courseCode}
                    </TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{enrolledList.length}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {enrolledList.length > 0 ? (
                          enrolledList.map((st) => (
                            <Badge
                              key={st.id}
                              variant="secondary"
                              className="gap-1 pr-1 font-normal"
                            >
                              {st.firstName} {st.lastName}
                              <button
                                type="button"
                                onClick={() =>
                                  dropStudentFromCourse(
                                    course.courseCode,
                                    st.id
                                  )
                                }
                                className="rounded-full hover:bg-muted p-0.5 text-muted-foreground hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            ยังไม่มีนักศึกษาลงทะเบียน
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}