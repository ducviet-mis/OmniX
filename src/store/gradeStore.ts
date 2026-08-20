import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, Score } from '../types';

interface GradeState {
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'tx' | 'gk' | 'ck'>) => void;
  removeSubject: (id: string) => void;
  updateScore: (
    subjectId: string, 
    type: 'tx' | 'gk' | 'ck', 
    scoreId: string, 
    value: number
  ) => void;
  addScoreColumn: (subjectId: string, type: 'tx' | 'gk' | 'ck') => void;
  removeScoreColumn: (subjectId: string, type: 'tx' | 'gk' | 'ck', scoreId: string) => void;
  updateEvalResult: (subjectId: string, result: 'D' | 'CD' | null) => void;
}

const initialSubjects: Subject[] = [
  { id: 'math', name: 'Toán', isEval: false, group: 'KHTN', tx: [], gk: [], ck: [] },
  { id: 'lit', name: 'Ngữ văn', isEval: false, group: 'KHXH', tx: [], gk: [], ck: [] },
  { id: 'eng', name: 'Ngoại ngữ', isEval: false, group: 'KHAC', tx: [], gk: [], ck: [] },
  { id: 'pe', name: 'Thể dục', isEval: true, group: 'KHAC', tx: [], gk: [], ck: [] },
];

export const useGradeStore = create<GradeState>()(
  persist(
    (set) => ({
      subjects: initialSubjects,
      
      addSubject: (sub) => set((state) => ({
        subjects: [
          ...state.subjects,
          {
            ...sub,
            id: Date.now().toString(),
            tx: [],
            gk: [],
            ck: []
          }
        ]
      })),

      removeSubject: (id) => set((state) => ({
        subjects: state.subjects.filter(s => s.id !== id)
      })),

      updateScore: (subjectId, type, scoreId, value) => set((state) => ({
        subjects: state.subjects.map(sub => {
          if (sub.id !== subjectId) return sub;
          return {
            ...sub,
            [type]: sub[type].map((s: Score) => s.id === scoreId ? { ...s, value } : s)
          };
        })
      })),

      addScoreColumn: (subjectId, type) => set((state) => ({
        subjects: state.subjects.map(sub => {
          if (sub.id !== subjectId) return sub;
          return {
            ...sub,
            [type]: [...sub[type], { id: Date.now().toString(), value: 0 }]
          };
        })
      })),

      removeScoreColumn: (subjectId, type, scoreId) => set((state) => ({
        subjects: state.subjects.map(sub => {
          if (sub.id !== subjectId) return sub;
          return {
            ...sub,
            [type]: sub[type].filter((s: Score) => s.id !== scoreId)
          };
        })
      })),

      updateEvalResult: (subjectId, result) => set((state) => ({
        subjects: state.subjects.map(sub => {
          if (sub.id !== subjectId) return sub;
          return {
            ...sub,
            evalResult: result
          };
        })
      }))
    }),
    {
      name: 'grade-storage',
    }
  )
);
