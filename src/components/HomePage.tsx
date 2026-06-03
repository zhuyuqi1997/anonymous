import { industries, mockRooms, hotTopics } from '../data';

interface HomePageProps {
  onNavigate: (page: 'rooms' | 'lobby' | 'active') => void;
  onSelectRoom: (roomId: string) => void;
}

export default function HomePage({ onNavigate, onSelectRoom }: HomePageProps) {
  const waitingRooms = mockRooms.filter(r => r.status === 'waiting');
  const activeRooms = mockRooms.filter(r => r.status === 'active');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] via-[#1a1035] to-[#0f0a1e] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-12 pb-8 md:pt-20 md:pb-12">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div className="absolute w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl top-1/2 right-0 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute w-32 h-32 bg-pink-500/10 rounded-full blur-3xl bottom-0 left-1/3 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-6 inline-block">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/30 rotate-6 hover:rotate-0 transition-transform duration-500">
              <span className="text-4xl md:text-5xl -rotate-6">😤</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
            吐 槽
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-2">
            匿名语音吐槽社区
          </p>
          <p className="text-sm text-gray-500 mb-8">
            按行业分房间 · 3人成团 · 限时20-30分钟 · 每次仅需5元
          </p>

          <button
            onClick={() => onNavigate('rooms')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-lg font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            🎤 立即吐槽
          </button>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {waitingRooms.length} 个房间等待中
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              {activeRooms.length} 个房间进行中
            </span>
          </div>
        </div>
      </section>

      {/* Hot Topics */}
      <section className="px-4 py-6 max-w-2xl mx-auto">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          🔥 热门话题
        </h2>
        <div className="flex flex-wrap gap-2">
          {hotTopics.map((topic, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-6 max-w-2xl mx-auto">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          📖 怎么玩
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', icon: '🏠', title: '选房间', desc: '选择你的行业房间，找到同行的伙伴' },
            { step: '2', icon: '👥', title: '凑满3人', desc: '3人自动成团，匿名进入语音房间' },
            { step: '3', icon: '🎙️', title: '畅快吐槽', desc: '20-30分钟限时吐槽，尽情释放压力' },
          ].map((item) => (
            <div
              key={item.step}
              className="relative p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
            >
              <div className="absolute -top-3 -left-2 w-7 h-7 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-xs font-bold">
                {item.step}
              </div>
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-base mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industry Categories */}
      <section className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            🏷️ 行业分类
          </h2>
          <button
            onClick={() => onNavigate('rooms')}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            查看全部 →
          </button>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-5 gap-3">
          {industries.slice(0, 10).map((ind) => (
            <button
              key={ind.id}
              onClick={() => onNavigate('rooms')}
              className="flex flex-col items-center gap-1.5 p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{ind.icon}</span>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{ind.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="px-4 py-6 pb-24 max-w-2xl mx-auto">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          ⭐ 热门房间
        </h2>
        <div className="space-y-3">
          {mockRooms.filter(r => r.status !== 'ended').slice(0, 4).map((room) => {
            const industry = industries.find(i => i.id === room.industryId);
            return (
              <button
                key={room.id}
                onClick={() => { onSelectRoom(room.id); onNavigate('lobby'); }}
                className="w-full text-left p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        room.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {room.status === 'active' ? '进行中' : '等待中'}
                      </span>
                      <span className="text-xs text-gray-500">{industry?.icon} {industry?.name}</span>
                    </div>
                    <h3 className="font-bold text-base mb-1">{room.name}</h3>
                    <p className="text-sm text-gray-500">{room.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-300 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-400">
                      {room.currentParticipants}/{room.maxParticipants} 人
                    </div>
                    <div className="flex -space-x-2">
                      {room.participants.slice(0, 3).map((p, i) => (
                        <div key={i} className="w-7 h-7 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-sm border-2 border-[#1a1035]">
                          {p.avatar}
                        </div>
                      ))}
                      {room.currentParticipants < room.maxParticipants && (
                        <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-xs border-2 border-[#1a1035] text-gray-400">
                          +
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f0a1e] to-transparent pointer-events-none" />
    </div>
  );
}
