import { useState, useEffect } from 'react';
import { industries, generateParticipant } from '../data';
import { Room, Participant } from '../types';
import VoiceWave from './VoiceWave';

interface RoomLobbyProps {
  room: Room;
  onBack: () => void;
  onStart: () => void;
}

export default function RoomLobby({ room, onBack, onStart }: RoomLobbyProps) {
  const [participants, setParticipants] = useState<Participant[]>(room.participants);
  const [me] = useState<Participant>(generateParticipant('me'));
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paid, setPaid] = useState(false);

  const industry = industries.find(i => i.id === room.industryId);
  const allParticipants = [...participants, me];
  const isReady = allParticipants.length >= 3;

  useEffect(() => {
    // Simulate other players joining
    if (participants.length < 2 && !countdown) {
      const timer = setTimeout(() => {
        setParticipants(prev => {
          if (prev.length < 2) {
            return [...prev, generateParticipant(`bot-${Date.now()}`)];
          }
          return prev;
        });
      }, 2000 + Math.random() * 3000);
      return () => clearTimeout(timer);
    }
  }, [participants.length, countdown]);

  useEffect(() => {
    if (isReady && paid && countdown === null) {
      setCountdown(5);
    }
  }, [isReady, paid, countdown]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onStart();
    }
  }, [countdown, onStart]);

  const handleJoin = () => {
    setShowPayment(true);
  };

  const handlePay = () => {
    setShowPayment(false);
    setPaid(true);
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
          <div className="flex-1">
            <h1 className="text-lg font-bold truncate">{room.name}</h1>
            <p className="text-xs text-gray-500">{industry?.icon} {industry?.name} · {room.duration}分钟 · ¥{room.price}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Room info card */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <p className="text-gray-400 text-sm mb-3">{room.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {room.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Participants */}
        <div className="mb-8">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2">
            👥 参与者 ({allParticipants.length}/{room.maxParticipants})
          </h2>

          <div className="space-y-3">
            {allParticipants.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl animate-fadeIn"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20">
                  {p.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{p.nickname}</span>
                    {p.id === 'me' && (
                      <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">我</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">已加入</div>
                </div>
                <VoiceWave isSpeaking={Math.random() > 0.5} color={industry?.color} />
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, room.maxParticipants - allParticipants.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-center gap-3 p-3 border-2 border-dashed border-white/10 rounded-xl"
              >
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
                  ?
                </div>
                <span className="text-sm text-gray-600">等待加入...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Action */}
        <div className="text-center">
          {!paid ? (
            <>
              <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-yellow-400 text-sm">
                  💰 支付 <span className="font-bold text-lg">¥{room.price}</span> 加入房间
                </p>
                <p className="text-yellow-600 text-xs mt-1">3人成团后自动开始，限时{room.duration}分钟</p>
              </div>
              <button
                onClick={handleJoin}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-lg font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-95 transition-all"
              >
                支付 ¥{room.price} 加入房间
              </button>
            </>
          ) : !isReady ? (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-blue-400">
                  等待其他成员加入... ({allParticipants.length}/{room.maxParticipants})
                </span>
              </div>
            </div>
          ) : countdown !== null ? (
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 text-sm mb-2">🎉 人已齐，即将开始！</p>
              <div className="text-6xl font-black text-white animate-bounce">
                {countdown}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayment(false)} />
          <div className="relative w-full max-w-md bg-[#1a1035] border border-white/10 rounded-t-3xl md:rounded-3xl p-6 animate-slideUp">
            <div className="hidden md:block absolute top-3 right-3">
              <button onClick={() => setShowPayment(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-3">
                💰
              </div>
              <h3 className="text-xl font-bold mb-1">确认支付</h3>
              <p className="text-gray-400 text-sm">加入「{room.name}」</p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">房间费用</span>
                <span>¥{room.price}.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">时长</span>
                <span>{room.duration}分钟</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">人数</span>
                <span>{room.maxParticipants}人</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                <span>合计</span>
                <span className="text-yellow-400">¥{room.price}.00</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="p-3 bg-green-600/20 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium flex items-center justify-center gap-2">
                <span>💚</span> 微信支付
              </button>
              <button className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 text-sm font-medium flex items-center justify-center gap-2 opacity-50">
                <span>💙</span> 支付宝
              </button>
            </div>

            <button
              onClick={handlePay}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-lg font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-95 transition-all"
            >
              确认支付 ¥{room.price}.00
            </button>

            <p className="text-center text-xs text-gray-600 mt-3">
              支付即同意《用户协议》和《隐私政策》
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out both; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}
