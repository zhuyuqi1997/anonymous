import { useState } from 'react';
import { industries, mockRooms } from '../data';

interface RoomListProps {
  onBack: () => void;
  onSelectRoom: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
}

export default function RoomList({ onBack, onSelectRoom, onJoinRoom }: RoomListProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting' | 'active'>('all');

  const filteredRooms = mockRooms.filter(room => {
    if (selectedIndustry !== 'all' && room.industryId !== selectedIndustry) return false;
    if (filterStatus !== 'all' && room.status !== filterStatus) return false;
    return true;
  });

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
          <h1 className="text-lg font-bold">吐槽房间</h1>
        </div>

        {/* Industry tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setSelectedIndustry('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedIndustry === 'all'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              全部
            </button>
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedIndustry === ind.id
                    ? `bg-gradient-to-r ${ind.gradient} text-white shadow-lg`
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <span>{ind.icon}</span>
                <span>{ind.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          {(['all', 'waiting', 'active'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatus === status
                  ? 'bg-white/15 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {status === 'all' ? '全部' : status === 'waiting' ? '⏳ 等待中' : '🎙️ 进行中'}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-500">{filteredRooms.length} 个房间</span>
        </div>
      </div>

      {/* Room list */}
      <div className="max-w-2xl mx-auto px-4 py-4 pb-24 space-y-3">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🤷</div>
            <p className="text-gray-400">暂无房间</p>
            <p className="text-sm text-gray-500 mt-1">换个筛选条件看看？</p>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const industry = industries.find(i => i.id === room.industryId);
            const canJoin = room.status === 'waiting' && room.currentParticipants < room.maxParticipants;
            const isFull = room.currentParticipants >= room.maxParticipants;

            return (
              <div
                key={room.id}
                className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/8 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        room.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {room.status === 'active' ? '🎙️ 进行中' : '⏳ 等待中'}
                      </span>
                      <span className="text-xs text-gray-500">{industry?.icon} {industry?.name}</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-gray-500">{room.duration}分钟</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-yellow-400">¥{room.price}</span>
                    </div>
                    <h3 className="font-bold text-base mb-1 truncate">{room.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{room.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {room.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-300 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex -space-x-2">
                      {room.participants.slice(0, 3).map((p, i) => (
                        <div key={i} className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-sm border-2 border-[#1a1035]">
                          {p.avatar}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {room.currentParticipants}/{room.maxParticipants}
                    </span>
                    {canJoin ? (
                      <button
                        onClick={() => { onSelectRoom(room.id); onJoinRoom(room.id); }}
                        className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95"
                      >
                        加入
                      </button>
                    ) : room.status === 'active' ? (
                      <button className="px-4 py-1.5 bg-white/10 rounded-lg text-xs font-medium text-gray-400 cursor-not-allowed">
                        进行中
                      </button>
                    ) : isFull ? (
                      <button className="px-4 py-1.5 bg-white/10 rounded-lg text-xs font-medium text-gray-400 cursor-not-allowed">
                        已满
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Create room button */}
        <button
          onClick={() => { onSelectRoom('new'); }}
          className="w-full p-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:border-purple-500/30 hover:text-purple-400 hover:bg-purple-500/5 transition-all group"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">创建新房间</span>
          </div>
        </button>
      </div>
    </div>
  );
}
