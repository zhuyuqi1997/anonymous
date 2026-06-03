import { industries } from '../data';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const stats = {
    totalSessions: 12,
    totalMinutes: 280,
    totalSpent: 60,
    level: 5,
    expProgress: 65,
    badges: ['🔥 连续吐槽王', '💪 勇敢发声', '🎯 金句达人', '⭐ 优质成员'],
    favoriteIndustry: industries[0],
  };

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
          <h1 className="text-lg font-bold">个人中心</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Avatar & Info */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-purple-500/30 mb-3 ring-4 ring-purple-500/20">
            🐱
          </div>
          <h2 className="text-xl font-bold">匿名打工人</h2>
          <p className="text-sm text-gray-500 mt-1">ID: TT20250115</p>

          {/* Level */}
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-sm font-bold text-purple-400">Lv.{stats.level}</span>
            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                style={{ width: `${stats.expProgress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{stats.expProgress}%</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
            <div className="text-2xl font-black text-purple-400">{stats.totalSessions}</div>
            <div className="text-xs text-gray-500 mt-1">吐槽次数</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
            <div className="text-2xl font-black text-indigo-400">{stats.totalMinutes}</div>
            <div className="text-xs text-gray-500 mt-1">吐槽时长</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
            <div className="text-2xl font-black text-yellow-400">¥{stats.totalSpent}</div>
            <div className="text-xs text-gray-500 mt-1">累计消费</div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-6">
          <h3 className="text-base font-bold mb-3">🏅 我的徽章</h3>
          <div className="grid grid-cols-2 gap-2">
            {stats.badges.map((badge, i) => (
              <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                <span className="text-sm">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Industry */}
        <div className="mb-6">
          <h3 className="text-base font-bold mb-3">❤️ 常驻行业</h3>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
            <span className="text-3xl">{stats.favoriteIndustry.icon}</span>
            <div>
              <div className="font-bold">{stats.favoriteIndustry.name}</div>
              <div className="text-xs text-gray-500">参与 8 次吐槽</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {[
            { icon: '📝', label: '编辑资料', desc: '修改昵称和头像' },
            { icon: '🔔', label: '消息通知', desc: '房间提醒和系统通知' },
            { icon: '💳', label: '钱包', desc: '余额 ¥35.00' },
            { icon: '🛡️', label: '隐私设置', desc: '匿名等级和黑名单' },
            { icon: '❓', label: '帮助中心', desc: '常见问题和联系客服' },
            { icon: '📋', label: '用户协议', desc: '服务条款和隐私政策' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors flex items-center gap-3"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Version */}
        <div className="text-center mt-8 mb-4">
          <p className="text-xs text-gray-700">吐槽 v1.0.0</p>
          <p className="text-xs text-gray-700 mt-1"> Made with ❤️</p>
        </div>
      </div>
    </div>
  );
}
