import { useState, useMemo } from "react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, X } from "lucide-react";

export default function CoursesPage() {
  const { courses, addCourse, deleteCourse, removeInstructor } = useEnrollmentStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [instructorInput, setInstructorInput] = useState("");
  const [isInstructorMenuOpen, setIsInstructorMenuOpen] = useState(false);

  const allExistingInstructors = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      c.instructors?.forEach((inst) => {
        if (inst.trim()) set.add(inst.trim());
      });
    });
    return Array.from(set);
  }, [courses]);

  const formattedCode = courseCode.trim().toUpperCase();
  const isDuplicate = useMemo(() => {
    if (!formattedCode) return false;
    return courses.some(
      (c) => c.courseCode.trim().toUpperCase() === formattedCode
    );
  }, [courses, formattedCode]);

  const filteredInstructors = allExistingInstructors.filter(
    (inst) =>
      !selectedInstructors.includes(inst) &&
      inst.toLowerCase().includes(instructorInput.trim().toLowerCase())
  );

  const showAddNewInstructor =
    instructorInput.trim() !== "" &&
    !allExistingInstructors.some(
      (inst) => inst.toLowerCase() === instructorInput.trim().toLowerCase()
    ) &&
    !selectedInstructors.some(
      (inst) => inst.toLowerCase() === instructorInput.trim().toLowerCase()
    );

  const handleAddInstructor = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !selectedInstructors.includes(trimmed)) {
      setSelectedInstructors([...selectedInstructors, trimmed]);
    }
    setInstructorInput("");
  };

  const handleRemoveSelectedInstructor = (name: string) => {
    setSelectedInstructors(selectedInstructors.filter((i) => i !== name));
  };

  const handleSaveCourse = () => {
    if (!formattedCode || !title.trim() || isDuplicate) return;

    addCourse({
      courseCode: formattedCode,
      title: title.trim(),
      instructors: selectedInstructors,
    });

    setCourseCode("");
    setTitle("");
    setSelectedInstructors([]);
    setInstructorInput("");
    setOpenDialog(false);
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">จัดการวิชาเรียน</h1>
          <p className="text-sm text-muted-foreground">
            {courses.length} วิชา — วิชาที่เพิ่มใหม่จะไปโผล่ในตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> เพิ่มวิชา
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
              <p className="text-xs text-muted-foreground">
                วิชาที่เพิ่มใหม่จะไปโผล่ในตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
              </p>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">รหัสวิชา</label>
                <Input
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="cs101"
                  aria-invalid={isDuplicate}
                  className={
                    isDuplicate
                      ? "border-red-500 focus-visible:ring-red-500 text-red-500"
                      : ""
                  }
                />
                {isDuplicate && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    มีรหัสวิชา {formattedCode} นี้แล้ว
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">ชื่อวิชา</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Introduction to Programming"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">ผู้สอน</label>
                <div className="relative">
                  <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-ring">
                    {selectedInstructors.map((inst) => (
                      <Badge
                        key={inst}
                        variant="secondary"
                        className="gap-1 pr-1 font-normal"
                      >
                        {inst}
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedInstructor(inst)}
                          className="rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      value={instructorInput}
                      onChange={(e) => {
                        setInstructorInput(e.target.value);
                        setIsInstructorMenuOpen(true);
                      }}
                      onFocus={() => setIsInstructorMenuOpen(true)}
                      placeholder={selectedInstructors.length === 0 ? "ค้นหา หรือพิมพ์เพิ่มผู้สอน..." : ""}
                      className="flex-1 bg-transparent outline-none text-sm min-w-[120px]"
                    />
                  </div>

                  {isInstructorMenuOpen && (filteredInstructors.length > 0 || showAddNewInstructor) && (
                    <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                      <div className="max-h-48 overflow-y-auto p-1">
                        {showAddNewInstructor && (
                          <div
                            onClick={() => {
                              handleAddInstructor(instructorInput);
                              setIsInstructorMenuOpen(false);
                            }}
                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground font-medium text-primary"
                          >
                            + เพิ่มผู้สอน "{instructorInput.trim()}"
                          </div>
                        )}
                        {filteredInstructors.map((inst) => (
                          <div
                            key={inst}
                            onClick={() => {
                              handleAddInstructor(inst);
                              setIsInstructorMenuOpen(false);
                            }}
                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                          >
                            {inst}
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
                onClick={handleSaveCourse}
                disabled={!courseCode.trim() || !title.trim() || isDuplicate}
                className="w-full sm:w-auto"
              >
                บันทึก
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
              <TableHead>ผู้สอน</TableHead>
              <TableHead className="w-[80px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  ยังไม่มีข้อมูลวิชาเรียน
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.courseCode}>
                  <TableCell className="font-medium">{course.courseCode}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {course.instructors && course.instructors.length > 0 ? (
                        course.instructors.map((inst) => (
                          <Badge
                            key={inst}
                            variant="secondary"
                            className="gap-1 pr-1 font-normal"
                          >
                            {inst}
                            <button
                              type="button"
                              onClick={() => removeInstructor(course.courseCode, inst)}
                              className="rounded-full hover:bg-muted p-0.5 text-muted-foreground hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          ยังไม่มีผู้สอน
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการลบวิชา</AlertDialogTitle>
                          <AlertDialogDescription>
                            คุณต้องการลบวิชา {course.courseCode} ({course.title}) ใช่หรือไม่?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCourse(course.courseCode)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            ลบวิชา
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}