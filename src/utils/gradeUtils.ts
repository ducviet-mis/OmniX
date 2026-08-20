import { Subject } from '../types';

export const calculateTBM = (subject: Subject): number | null => {
  if (subject.isEval) return null;

  const txScores = subject.tx.map(s => s.value);
  const gkScores = subject.gk.map(s => s.value);
  const ckScores = subject.ck.map(s => s.value);

  // Cần ít nhất 1 điểm GK và 1 điểm CK để tính TBM hoàn chỉnh, 
  // nhưng nếu đang trong học kỳ, ta có thể tính tạm thời
  const totalTx = txScores.reduce((sum, score) => sum + score, 0);
  const totalGk = gkScores.reduce((sum, score) => sum + score * 2, 0);
  const totalCk = ckScores.reduce((sum, score) => sum + score * 3, 0);

  const totalWeights = txScores.length + (gkScores.length * 2) + (ckScores.length * 3);

  if (totalWeights === 0) return null;

  const tbm = (totalTx + totalGk + totalCk) / totalWeights;
  return Math.round(tbm * 10) / 10;
};

export const calculateGPA = (subjects: Subject[]): number | null => {
  const gradedSubjects = subjects.filter(sub => !sub.isEval);
  let totalTBM = 0;
  let count = 0;

  gradedSubjects.forEach(sub => {
    const tbm = calculateTBM(sub);
    if (tbm !== null) {
      totalTBM += tbm;
      count++;
    }
  });

  if (count === 0) return null;
  return Math.round((totalTBM / count) * 10) / 10;
};

// Xếp loại học lực theo TT 22/2021/TT-BGDĐT
export const classifyAcademicPerformance = (subjects: Subject[]): string => {
  if (subjects.length === 0) return 'Chưa có dữ liệu';

  const evalSubjects = subjects.filter(s => s.isEval);
  const gradedSubjects = subjects.filter(s => !s.isEval);

  // Nếu có môn nhận xét bị Chưa đạt (CĐ) => Chưa đạt
  const hasFailEval = evalSubjects.some(s => s.evalResult === 'CD');
  // Nếu chưa có kết quả đánh giá thì không thể xếp loại Tốt/Khá/Đạt, nhưng tạm tính
  const isAllEvalPass = evalSubjects.every(s => s.evalResult === 'D');

  const tbms = gradedSubjects
    .map(s => calculateTBM(s))
    .filter((tbm): tbm is number => tbm !== null);

  // Chưa đủ điểm để tính các môn
  if (tbms.length < gradedSubjects.length) {
    return 'Chưa đủ điểm';
  }

  const countGE8 = tbms.filter(tbm => tbm >= 8.0).length;
  const countGE65 = tbms.filter(tbm => tbm >= 6.5).length;
  const countGE50 = tbms.filter(tbm => tbm >= 5.0).length;

  const minTBM = Math.min(...tbms);

  // Điều kiện TỐT
  if (isAllEvalPass && countGE8 >= 6 && minTBM >= 6.5) {
    return 'Tốt';
  }

  // Điều kiện KHÁ
  if (isAllEvalPass && countGE65 >= 6 && minTBM >= 5.0) {
    return 'Khá';
  }

  // Điều kiện ĐẠT
  if (isAllEvalPass && countGE50 >= 6 && minTBM >= 3.5) {
    return 'Đạt';
  }

  return 'Chưa đạt';
};
