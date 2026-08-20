import React from 'react';
import { useGradeStore } from '../store/gradeStore';
import { calculateTBM } from '../utils/gradeUtils';
import { Card } from '../components/Card';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

export function Grades() {
  const { subjects, updateScore, addScoreColumn, removeScoreColumn, updateEvalResult } = useGradeStore();

  const renderScoreInput = (subjectId: string, type: 'tx' | 'gk' | 'ck', score: { id: string, value: number }) => (
    <div key={score.id} className="relative group inline-block mr-2 mb-2">
      <input
        type="number"
        min="0" max="10" step="0.1"
        value={score.value === 0 ? '' : score.value}
        onChange={(e) => {
          let val = parseFloat(e.target.value);
          if (isNaN(val)) val = 0;
          if (val > 10) val = 10;
          if (val < 0) val = 0;
          updateScore(subjectId, type, score.id, val);
        }}
        className="w-14 h-9 px-2 text-center border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {type === 'tx' && (
        <button
          onClick={() => removeScoreColumn(subjectId, type, score.id)}
          className="absolute -top-2 -right-2 hidden group-hover:flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold w-48">Môn học</th>
              <th className="px-6 py-4 font-semibold min-w-[200px]">Đánh giá thường xuyên (HS1)</th>
              <th className="px-6 py-4 font-semibold">Đánh giá giữa kỳ (HS2)</th>
              <th className="px-6 py-4 font-semibold">Đánh giá cuối kỳ (HS3)</th>
              <th className="px-6 py-4 font-semibold text-center">TBM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {subjects.map(subject => (
              <tr key={subject.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {subject.name}
                  {subject.isEval && <span className="block text-xs text-slate-500 font-normal mt-1">(Đánh giá nhận xét)</span>}
                </td>
                
                {subject.isEval ? (
                  <td colSpan={3} className="px-6 py-4">
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name={`eval-${subject.id}`} 
                          checked={subject.evalResult === 'D'}
                          onChange={() => updateEvalResult(subject.id, 'D')}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-slate-700">Đạt (Đ)</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name={`eval-${subject.id}`} 
                          checked={subject.evalResult === 'CD'}
                          onChange={() => updateEvalResult(subject.id, 'CD')}
                          className="w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500"
                        />
                        <span className="ml-2 text-slate-700">Chưa đạt (CĐ)</span>
                      </label>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center">
                        {subject.tx.map(score => renderScoreInput(subject.id, 'tx', score))}
                        <button
                          onClick={() => addScoreColumn(subject.id, 'tx')}
                          className="w-8 h-9 flex items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-md hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 mb-2 transition-colors"
                          title="Thêm cột điểm ĐGTX"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {subject.gk.map(score => renderScoreInput(subject.id, 'gk', score))}
                      {subject.gk.length === 0 && (
                        <button onClick={() => addScoreColumn(subject.id, 'gk')} className="text-xs text-blue-600 hover:underline">Thêm ĐGGK</button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {subject.ck.map(score => renderScoreInput(subject.id, 'ck', score))}
                      {subject.ck.length === 0 && (
                        <button onClick={() => addScoreColumn(subject.id, 'ck')} className="text-xs text-blue-600 hover:underline">Thêm ĐGCK</button>
                      )}
                    </td>
                  </>
                )}
                
                <td className="px-6 py-4 text-center">
                  {subject.isEval ? (
                    <span className={cn(
                      "font-semibold",
                      subject.evalResult === 'D' ? "text-green-600" : subject.evalResult === 'CD' ? "text-red-600" : "text-slate-400"
                    )}>
                      {subject.evalResult || '--'}
                    </span>
                  ) : (
                    <span className={cn(
                      "text-lg font-bold",
                      (calculateTBM(subject) || 0) >= 8.0 ? "text-green-600" : 
                      (calculateTBM(subject) || 0) >= 6.5 ? "text-blue-600" :
                      (calculateTBM(subject) || 0) >= 5.0 ? "text-yellow-600" :
                      calculateTBM(subject) !== null ? "text-red-600" : "text-slate-400"
                    )}>
                      {calculateTBM(subject) ?? '--'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
