import { mockHistory } from '../data';

interface HistoryPageProps {
  onBack: () => void;
}

export default function HistoryPage({ onBack }: HistoryPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] via-[#1a1035] to-[#0f0a1e] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0f0a1e]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">吐槽记录</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
            <div className="text-2xl font-black text-purple-400">{mockHistory.length}</div>
            <div className="text-xs text-gray-500 mt-1">吐槽次数</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
            <div className="text-2xl font-black text-indigo-400">
              {mockHistory.reduce((sum, h) => sum + h.duration, 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">总时长(分钟)</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
            <div className="text-2xl font-black text-yellow-400">
              ¥{mockHistory.length * 5}
            </div>
            <div className="text-xs text-gray-500 mt-1">总花费</div>
          </div>
        </div>

        {/* History list */}
        <h2 className="text-base font-bold mb-3">历史记录</h2>
        <div className="space-y-3">
          {mockHistory.map((record) => (
            <div
              key={record.id}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base">{record.roomName}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{record.industry}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-600">{record.date}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{record.duration}分钟</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: record.rating }).map((_, i) => (
                    <span key={i} className="text-sm">⭐</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockHistory.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400">还没有吐槽记录</p>
            <p className="text-sm text-gray-500 mt-1">快去吐槽一下吧～</p>
          </div>
        )}
      </div>
    </div>
  );
}
