import { useState } from 'react';
import { Card } from '../components/Card';
import { useGradeStore } from '../store/gradeStore';
import { calculateTBM } from '../utils/gradeUtils';

export function Tools() {
  const subjects = useGradeStore((state) => state.subjects);
  const gradedSubjects = subjects.filter(s => !s.isEval);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(gradedSubjects[0]?.id || '');
  const [targetTBM, setTargetTBM] = useState<number>(8.0);

  const selectedSubject = gradedSubjects.find(s => s.id === selectedSubjectId);
  
  let requiredCK: number | null = null;
  let message = '';

  if (selectedSubject) {
    const txScores = selectedSubject.tx.map(s => s.value);
    const gkScores = selectedSubject.gk.map(s => s.value);
    
    const totalTx = txScores.reduce((a, b) => a + b, 0);
    const totalGk = gkScores.reduce((a, b) => a + b * 2, 0);
    const numTx = txScores.length;
    const numGk = gkScores.length;

    // Giả sử có 1 điểm thi cuối kỳ (hệ số 3)
    const totalWeights = numTx + (numGk * 2) + 3;
    const currentTotalWeights = numTx + (numGk * 2);

    if (currentTotalWeights === 0) {
      message = 'Vui lòng nhập ít nhất 1 điểm hệ số 1 hoặc hệ số 2 để tính toán.';
    } else {
      // (TotalTx + TotalGk + 3*CK) / TotalWeights = Target
      // 3*CK = Target * TotalWeights - TotalTx - TotalGk
      const ck = (targetTBM * totalWeights - totalTx - totalGk) / 3;
      requiredCK = Math.round(ck * 10) / 10;

      if (requiredCK > 10) {
        message = 'Mục tiêu quá cao! Kể cả được 10 điểm cuối kỳ cũng không đạt được.';
      } else if (requiredCK <= 0) {
        requiredCK = 0;
        message = 'Chúc mừng, bạn chắc chắn đạt mục tiêu dù không làm bài!';
      } else {
        message = `Bạn cần tối thiểu ${requiredCK} điểm ở bài thi cuối kỳ (hệ số 3).`;
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Công cụ học tập</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tính điểm mục tiêu (Target Grade)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chọn môn học</label>
              <select 
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {gradedSubjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mục tiêu TBM</label>
              <input 
                type="number" step="0.1" min="0" max="10"
                value={targetTBM}
                onChange={(e) => setTargetTBM(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 font-medium">{message}</p>
              {requiredCK !== null && requiredCK <= 10 && requiredCK > 0 && (
                <p className="text-3xl font-bold text-blue-600 mt-2">{requiredCK} điểm</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Dự đoán khối thi (University Predictor)</h3>
          <p className="text-sm text-slate-500 mb-4">
            Tính điểm tổ hợp xét tuyển dựa trên Điểm Trung Bình Môn (TBM) hiện tại.
          </p>
          
          <div className="space-y-3">
            {[
              { id: 'A00', name: 'Toán, Lý, Hóa', subjects: ['Toán', 'Vật lí', 'Hóa học'] },
              { id: 'A01', name: 'Toán, Lý, Anh', subjects: ['Toán', 'Vật lí', 'Ngoại ngữ'] },
              { id: 'D01', name: 'Toán, Văn, Anh', subjects: ['Toán', 'Ngữ văn', 'Ngoại ngữ'] },
              { id: 'B00', name: 'Toán, Hóa, Sinh', subjects: ['Toán', 'Hóa học', 'Sinh học'] },
            ].map(block => {
              // Map by name (this is a simplified approach, real app should map by ID)
              const scores = block.subjects.map(subName => {
                const sub = subjects.find(s => s.name === subName);
                return sub ? (calculateTBM(sub) || 0) : 0;
              });
              const total = Math.round(scores.reduce((a, b) => a + b, 0) * 10) / 10;
              
              return (
                <div key={block.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-700 mr-2">{block.id}</span>
                    <span className="text-sm text-slate-500">({block.name})</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-900">{total}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
