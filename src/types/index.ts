export type SubjectGroup = 'KHTN' | 'KHXH' | 'KHAC';

export interface Score {
  id: string;
  value: number;
}

export interface Subject {
  id: string;
  name: string;
  isEval: boolean; // Môn đánh giá bằng nhận xét (Thể dục, HĐTN...)
  group: SubjectGroup;
  
  // Điểm đánh giá thường xuyên (hệ số 1) - có thể nhiều cột
  tx: Score[];
  // Điểm đánh giá giữa kỳ (hệ số 2)
  gk: Score[];
  // Điểm đánh giá cuối kỳ (hệ số 3)
  ck: Score[];
  
  // Điểm nhận xét (nếu isEval = true) -> 'D' (Đạt) hoặc 'CD' (Chưa Đạt)
  evalResult?: 'D' | 'CD' | null;
}

export interface SemesterGrades {
  semester1: Subject[];
  semester2: Subject[];
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline?: Date;
  subjectId?: string;
}

export interface ClassSchedule {
  id: string;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  type: 'MAIN' | 'EXTRA' | 'EXAM';
}
