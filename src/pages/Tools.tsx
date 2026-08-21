import { useState } from 'react';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { useGradeStore } from '../store/gradeStore';
import { calculateTBM } from '../utils/gradeUtils';

const ALL_COMBINATIONS = [
  // Khối A
  { id: 'A00', name: 'Toán, Vật lý, Hóa học', subjects: ['Toán học', 'Vật lí', 'Hóa học'] },
  { id: 'A01', name: 'Toán, Vật lý, Tiếng Anh', subjects: ['Toán học', 'Vật lí', 'Tiếng Anh'] },
  { id: 'A02', name: 'Toán, Vật lý, Sinh học', subjects: ['Toán học', 'Vật lí', 'Sinh học'] },
  { id: 'A03', name: 'Toán, Vật lý, Lịch sử', subjects: ['Toán học', 'Vật lí', 'Lịch sử'] },
  { id: 'A04', name: 'Toán, Vật lý, Địa lí', subjects: ['Toán học', 'Vật lí', 'Địa lí'] },
  { id: 'A05', name: 'Toán, Hóa học, Lịch sử', subjects: ['Toán học', 'Hóa học', 'Lịch sử'] },
  { id: 'A06', name: 'Toán, Hóa học, Địa lí', subjects: ['Toán học', 'Hóa học', 'Địa lí'] },
  { id: 'A07', name: 'Toán, Lịch sử, Địa lí', subjects: ['Toán học', 'Lịch sử', 'Địa lí'] },
  { id: 'A08', name: 'Toán, Lịch sử, Giáo dục KT&PL', subjects: ['Toán học', 'Lịch sử', 'GDKT&PL'] },
  // Khối B
  { id: 'B00', name: 'Toán, Hóa học, Sinh học', subjects: ['Toán học', 'Hóa học', 'Sinh học'] },
  { id: 'B01', name: 'Toán, Sinh học, Lịch sử', subjects: ['Toán học', 'Sinh học', 'Lịch sử'] },
  { id: 'B02', name: 'Toán, Sinh học, Địa lí', subjects: ['Toán học', 'Sinh học', 'Địa lí'] },
  { id: 'B03', name: 'Toán, Ngữ văn, Sinh học', subjects: ['Toán học', 'Ngữ văn', 'Sinh học'] },
  // Khối C
  { id: 'C00', name: 'Ngữ văn, Lịch sử, Địa lí', subjects: ['Ngữ văn', 'Lịch sử', 'Địa lí'] },
  { id: 'C01', name: 'Toán, Ngữ văn, Vật lý', subjects: ['Toán học', 'Ngữ văn', 'Vật lí'] },
  { id: 'C02', name: 'Toán, Ngữ văn, Hóa học', subjects: ['Toán học', 'Ngữ văn', 'Hóa học'] },
  { id: 'C03', name: 'Toán, Ngữ văn, Lịch sử', subjects: ['Toán học', 'Ngữ văn', 'Lịch sử'] },
  { id: 'C04', name: 'Ngữ văn, Toán, Địa lí', subjects: ['Ngữ văn', 'Toán học', 'Địa lí'] },
  { id: 'C05', name: 'Ngữ văn, Vật lý, Hóa học', subjects: ['Ngữ văn', 'Vật lí', 'Hóa học'] },
  { id: 'C06', name: 'Ngữ văn, Vật lý, Sinh học', subjects: ['Ngữ văn', 'Vật lí', 'Sinh học'] },
  { id: 'C07', name: 'Ngữ văn, Vật lý, Lịch sử', subjects: ['Ngữ văn', 'Vật lí', 'Lịch sử'] },
  { id: 'C08', name: 'Ngữ văn, Hóa học, Sinh học', subjects: ['Ngữ văn', 'Hóa học', 'Sinh học'] },
  { id: 'C09', name: 'Ngữ văn, Vật lý, Địa lí', subjects: ['Ngữ văn', 'Vật lí', 'Địa lí'] },
  { id: 'C10', name: 'Ngữ văn, Hóa học, Lịch sử', subjects: ['Ngữ văn', 'Hóa học', 'Lịch sử'] },
  { id: 'C11', name: 'Ngữ văn, Địa lí, Hóa học', subjects: ['Ngữ văn', 'Địa lí', 'Hóa học'] },
  { id: 'C12', name: 'Ngữ văn, Sinh học, Lịch sử', subjects: ['Ngữ văn', 'Sinh học', 'Lịch sử'] },
  { id: 'C13', name: 'Ngữ văn, Sinh học, Địa lí', subjects: ['Ngữ văn', 'Sinh học', 'Địa lí'] },
  { id: 'C14', name: 'Ngữ văn, Toán, Giáo dục KT&PL', subjects: ['Ngữ văn', 'Toán học', 'GDKT&PL'] },
  // Khối D
  { id: 'D01', name: 'Ngữ văn, Toán, Tiếng Anh', subjects: ['Ngữ văn', 'Toán học', 'Tiếng Anh'] },
  { id: 'D02', name: 'Ngữ văn, Toán, Tiếng Nga', subjects: ['Ngữ văn', 'Toán học', 'Tiếng Nga'] },
  { id: 'D03', name: 'Ngữ văn, Toán, Tiếng Pháp', subjects: ['Ngữ văn', 'Toán học', 'Tiếng Pháp'] },
  { id: 'D04', name: 'Ngữ văn, Toán, Tiếng Trung', subjects: ['Ngữ văn', 'Toán học', 'Tiếng Trung Quốc'] },
  { id: 'D05', name: 'Ngữ văn, Toán, Tiếng Đức', subjects: ['Ngữ văn', 'Toán học', 'Tiếng Đức'] },
  { id: 'D06', name: 'Ngữ văn, Toán, Tiếng Nhật', subjects: ['Ngữ văn', 'Toán học', 'Tiếng Nhật'] },
  { id: 'D07', name: 'Toán, Hóa học, Tiếng Anh', subjects: ['Toán học', 'Hóa học', 'Tiếng Anh'] },
  { id: 'D08', name: 'Toán, Sinh học, Tiếng Anh', subjects: ['Toán học', 'Sinh học', 'Tiếng Anh'] },
  { id: 'D09', name: 'Toán, Tiếng Anh, Lịch sử', subjects: ['Toán học', 'Tiếng Anh', 'Lịch sử'] },
  { id: 'D10', name: 'Toán, Tiếng Anh, Địa lí', subjects: ['Toán học', 'Tiếng Anh', 'Địa lí'] },
  { id: 'D11', name: 'Ngữ văn, Vật lý, Tiếng Anh', subjects: ['Ngữ văn', 'Vật lí', 'Tiếng Anh'] },
  { id: 'D12', name: 'Ngữ văn, Hóa học, Tiếng Anh', subjects: ['Ngữ văn', 'Hóa học', 'Tiếng Anh'] },
  { id: 'D13', name: 'Ngữ văn, Sinh học, Tiếng Anh', subjects: ['Ngữ văn', 'Sinh học', 'Tiếng Anh'] },
  { id: 'D14', name: 'Ngữ văn, Lịch sử, Tiếng Anh', subjects: ['Ngữ văn', 'Lịch sử', 'Tiếng Anh'] },
  { id: 'D15', name: 'Ngữ văn, Địa lí, Tiếng Anh', subjects: ['Ngữ văn', 'Địa lí', 'Tiếng Anh'] },
  // Khối X (Tổ hợp mới)
  { id: 'X01', name: 'Toán, Ngữ văn, Giáo dục KT&PL', subjects: ['Toán học', 'Ngữ văn', 'GDKT&PL'] },
  { id: 'X02', name: 'Toán, Ngữ văn, Tin học', subjects: ['Toán học', 'Ngữ văn', 'Tin học'] },
  { id: 'X06', name: 'Toán, Vật lý, Tin học', subjects: ['Toán học', 'Vật lí', 'Tin học'] },
  { id: 'X10', name: 'Toán, Hóa học, Tin học', subjects: ['Toán học', 'Hóa học', 'Tin học'] },
  { id: 'X14', name: 'Toán, Sinh học, Tin học', subjects: ['Toán học', 'Sinh học', 'Tin học'] },
];

export function Tools() {
  const { subjects, trackedCombinations, addCombination, removeCombination } = useGradeStore();
  const gradedSubjects = subjects.filter(s => !s.isEval);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(gradedSubjects[0]?.id || '');
  const [targetTBM, setTargetTBM] = useState<number>(8.0);
  const [newComboId, setNewComboId] = useState<string>('');
  const [isAddingCombo, setIsAddingCombo] = useState<boolean>(false);

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
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Dự đoán khối thi</h3>
              <p className="text-sm text-slate-500">
                Tính điểm xét tuyển dựa trên Điểm Trung Bình Môn hiện tại.
              </p>
            </div>
            <button 
              onClick={() => setIsAddingCombo(true)}
              className="flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
            >
              Thêm khối
            </button>
          </div>

          <Modal isOpen={isAddingCombo} onClose={() => setIsAddingCombo(false)} title="Thêm tổ hợp xét tuyển">
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Chọn khối thi bạn muốn theo dõi điểm số dự báo:</p>
              <select 
                value={newComboId} 
                onChange={e => setNewComboId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500"
              >
                <option value="">-- Chọn tổ hợp để thêm --</option>
                {availableCombinations.map(c => (
                  <option key={c.id} value={c.id}>{c.id} ({c.name})</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setIsAddingCombo(false)} 
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 font-medium"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    if (newComboId) addCombination(newComboId);
                    setNewComboId('');
                    setIsAddingCombo(false);
                  }}
                  disabled={!newComboId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  Thêm
                </button>
              </div>
            </div>
          </Modal>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 mt-2">
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
