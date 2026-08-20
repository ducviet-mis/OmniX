import { useState } from 'react';
import { Card } from '../components/Card';
import { useGradeStore } from '../store/gradeStore';
import { calculateTBM } from '../utils/gradeUtils';

const ALL_COMBINATIONS = [
  { id: 'A00', name: 'Toán, Lý, Hóa', subjects: ['Toán học', 'Vật lí', 'Hóa học'] },
  { id: 'A01', name: 'Toán, Lý, Anh', subjects: ['Toán học', 'Vật lí', 'Tiếng Anh'] },
  { id: 'A02', name: 'Toán, Lý, Sinh', subjects: ['Toán học', 'Vật lí', 'Sinh học'] },
  { id: 'B00', name: 'Toán, Hóa, Sinh', subjects: ['Toán học', 'Hóa học', 'Sinh học'] },
  { id: 'B08', name: 'Toán, Sinh, Anh', subjects: ['Toán học', 'Sinh học', 'Tiếng Anh'] },
  { id: 'C00', name: 'Văn, Sử, Địa', subjects: ['Ngữ văn', 'Lịch sử', 'Địa lí'] },
  { id: 'C01', name: 'Toán, Văn, Lý', subjects: ['Toán học', 'Ngữ văn', 'Vật lí'] },
  { id: 'C02', name: 'Toán, Văn, Hóa', subjects: ['Toán học', 'Ngữ văn', 'Hóa học'] },
  { id: 'D01', name: 'Toán, Văn, Anh', subjects: ['Toán học', 'Ngữ văn', 'Tiếng Anh'] },
  { id: 'D02', name: 'Toán, Văn, Nga', subjects: ['Toán học', 'Ngữ văn', 'Tiếng Nga'] },
  { id: 'D03', name: 'Toán, Văn, Pháp', subjects: ['Toán học', 'Ngữ văn', 'Tiếng Pháp'] },
  { id: 'D04', name: 'Toán, Văn, Trung', subjects: ['Toán học', 'Ngữ văn', 'Tiếng Trung Quốc'] },
  { id: 'D05', name: 'Toán, Văn, Đức', subjects: ['Toán học', 'Ngữ văn', 'Tiếng Đức'] },
  { id: 'D06', name: 'Toán, Văn, Nhật', subjects: ['Toán học', 'Ngữ văn', 'Tiếng Nhật'] },
  { id: 'D07', name: 'Toán, Hóa, Anh', subjects: ['Toán học', 'Hóa học', 'Tiếng Anh'] },
];

export function Tools() {
  const { subjects, trackedCombinations, addCombination, removeCombination } = useGradeStore();
  const gradedSubjects = subjects.filter(s => !s.isEval);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(gradedSubjects[0]?.id || '');
  const [targetTBM, setTargetTBM] = useState<number>(8.0);
  const [newComboId, setNewComboId] = useState<string>('');

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

  // Khối thi user đang theo dõi
  const userCombinations = ALL_COMBINATIONS.filter(c => trackedCombinations.includes(c.id));
  const availableCombinations = ALL_COMBINATIONS.filter(c => !trackedCombinations.includes(c.id));

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

        <Card className="p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Dự đoán khối thi (University Predictor)</h3>
          <p className="text-sm text-slate-500 mb-4">
            Tính điểm tổ hợp xét tuyển dựa trên Điểm Trung Bình Môn (TBM) hiện tại.
          </p>
          
          <div className="flex gap-2 mb-4">
            <select 
              value={newComboId} 
              onChange={e => setNewComboId(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500"
            >
              <option value="">-- Chọn tổ hợp để thêm --</option>
              {availableCombinations.map(c => (
                <option key={c.id} value={c.id}>{c.id} ({c.name})</option>
              ))}
            </select>
            <button 
              onClick={() => {
                if (newComboId) addCombination(newComboId);
                setNewComboId('');
              }}
              disabled={!newComboId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {userCombinations.map(block => {
              const scores = block.subjects.map(subName => {
                const sub = subjects.find(s => s.name === subName || (s.name.includes('Ngoại ngữ') && subName === 'Tiếng Anh') || (s.name === 'Toán' && subName === 'Toán học'));
                return sub ? (calculateTBM(sub) || 0) : 0;
              });
              const total = Math.round(scores.reduce((a, b) => a + b, 0) * 10) / 10;
              
              return (
                <div key={block.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 relative group">
                  <div>
                    <span className="font-bold text-slate-700 mr-2">{block.id}</span>
                    <span className="text-sm text-slate-500">({block.name})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-slate-900">{total}</span>
                    <button 
                      onClick={() => removeCombination(block.id)}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 p-1"
                      title="Xoá"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
            
            {userCombinations.length === 0 && (
              <div className="text-center text-slate-500 mt-4 text-sm">
                Bạn chưa thêm tổ hợp nào.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
