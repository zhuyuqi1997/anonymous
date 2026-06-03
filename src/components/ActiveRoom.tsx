import { useState, useEffect, useCallback, useRef } from 'react';
import { industries, generateParticipant } from '../data';
import { Room, Participant } from '../types';
import VoiceWave from './VoiceWave';

interface ActiveRoomProps {
  room: Room;
  onEnd: () => void;
}

export default function ActiveRoom({ room, onEnd }: ActiveRoomProps) {
  const [timeLeft, setTimeLeft] = useState(room.duration * 60);
  const [micOn, setMicOn] = useState(true);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [participants] = useState<Participant[]>(() => {
    const me = generateParticipant('me');
    const others = Array.from({ length: 2 }, () => generateParticipant(`p-${Math.random()}`));
    return [me, ...others];
  });
  const [chatMessages, setChatMessages] = useState<{ id: number; participant: Participant; text: string }[]>([]);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isRecognizingRef = useRef(false);
  const [srSupported, setSrSupported] = useState<boolean | null>(null);
  const [srError, setSrError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  const industry = industries.find(i => i.id === room.industryId);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((room.duration * 60 - timeLeft) / (room.duration * 60)) * 100;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowSummary(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [room.duration]);

  // Simulate speaking
  useEffect(() => {
    const interval = setInterval(() => {
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
      setSpeakingId(randomParticipant.id);

      // Add simulated chat message
      const ventMessages = [
        '真的太累了...',
        '我老板简直无语',
        '同感同感！',
        '每天加班到11点',
        '太卷了太卷了',
        '已经麻了...',
        '今天又被甩锅了',
        '太真实了兄弟',
        '谁来救救我们',
        '明天又要开会...',
        '摸鱼才是王道',
        '我已经在刷招聘了',
        '还有5分钟就要交报告',
        '甲方说再改一版',
        '周一又要来了',
      ];

      if (Math.random() > 0.4) {
        const msg = ventMessages[Math.floor(Math.random() * ventMessages.length)];
        setChatMessages(prev => [...prev.slice(-20), {
          id: Date.now(),
          participant: randomParticipant,
          text: msg,
        }]);
      }

      setTimeout(() => setSpeakingId(null), 1000 + Math.random() * 2000);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [participants]);

  // Initialize SpeechRecognition (if available)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSrSupported(false);
      setSrError('浏览器不支持 SpeechRecognition（语音识别）。');
      return;
    }
    setSrSupported(true);

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'zh-CN';

    rec.onstart = () => {
      isRecognizingRef.current = true;
      setSpeakingId('me');
      setSrError(null);
    };

    rec.onend = () => {
      isRecognizingRef.current = false;
      setSpeakingId(null);
      setInterimTranscript('');
      // auto-restart if mic is still on (handles some browser stop behavior)
      if (micOn) {
        try { rec.start(); } catch (e) { /* ignore */ }
      }
    };

    rec.onerror = (e: any) => {
      console.warn('SpeechRecognition error', e);
      setSrError(e?.error || String(e));
    };

    rec.onresult = (ev: any) => {
      let interim = '';
      let final = '';
      for (let i = ev.resultIndex; i < ev.results.length; ++i) {
        const res = ev.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }

      setInterimTranscript(interim.trim());

      if (final) {
        setInterimTranscript('');
        const me = participants.find(p => p.id === 'me') || participants[0];
        setChatMessages(prev => [...prev.slice(-20), {
          id: Date.now(),
          participant: me,
          text: final.trim(),
        }]);
      }
    };

    recognitionRef.current = rec;

    return () => {
      try { rec.stop(); } catch (e) { /* ignore */ }
      recognitionRef.current = null;
    };
  }, [participants, micOn]);

  // Start/stop recognition when micOn changes
  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (micOn) {
      try {
        if (!isRecognizingRef.current) rec.start();
      } catch (e) {
        console.warn('Could not start SpeechRecognition', e);
        setSrError(String(e));
      }
    } else {
      try { rec.stop(); } catch (e) { /* ignore */ }
    }
  }, [micOn]);

  const handleRetrySR = () => {
    setSrError(null);
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } catch (e) { /* ignore */ }
    try {
      rec.start();
    } catch (e) {
      setSrError(String(e));
    }
  };

  const handleEnd = useCallback(() => {
    setShowEndConfirm(false);
    setShowSummary(true);
  }, []);

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] via-[#1a1035] to-[#0f0a1e] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-5xl mb-4 shadow-lg shadow-orange-500/30">
              🎉
            </div>
            <h2 className="text-2xl font-black mb-2">吐槽结束</h2>
            <p className="text-gray-400">希望你的心情好了一些～</p>
          </div>

          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">房间</span>
              <span className="font-medium">{room.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">时长</span>
              <span className="font-medium">{room.duration}分钟</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">吐槽次数</span>
              <span className="font-medium text-purple-400">{chatMessages.length}次</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">费用</span>
              <span className="font-medium text-yellow-400">¥{room.price}.00</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">给这次吐槽打个分吧</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} className="text-3xl hover:scale-125 transition-transform active:scale-90">
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onEnd}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-bold shadow-lg shadow-purple-500/30 active:scale-95 transition-all"
            >
              返回首页
            </button>
            <button
              onClick={onEnd}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 font-medium active:scale-95 transition-all"
            >
              再来一局
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] via-[#1a1035] to-[#0f0a1e] text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#0f0a1e]/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate">{room.name}</h1>
            <p className="text-xs text-gray-500">{industry?.icon} {industry?.name}</p>
          </div>
          <button
            onClick={() => setShowEndConfirm(true)}
            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors ml-3"
          >
            退出房间
          </button>
        </div>
      </div>

      {/* Timer */}
      <div className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              直播中
            </span>
            <span className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-500">{room.duration}分钟</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeLeft < 60 ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="flex-1 px-4 overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {participants.map((p) => {
              const isSpeaking = speakingId === p.id;
              const isMe = p.id === 'me';

              return (
                <div
                  key={p.id}
                  className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
                    isSpeaking
                      ? 'bg-purple-500/20 border border-purple-500/40 scale-105'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 ${
                    isSpeaking
                      ? 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/40 ring-4 ring-purple-500/20'
                      : 'bg-gradient-to-br from-purple-400/60 to-indigo-500/60'
                  }`}>
                    {p.avatar}
                    {isSpeaking && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                        <VoiceWave isSpeaking={true} color="#a78bfa" barCount={3} className="scale-75" />
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-medium truncate max-w-full">
                    {isMe ? '我' : p.nickname}
                  </span>
                  {isMe && micOn ? (
                    <span className="text-xs text-green-400 mt-0.5">🎤 开启</span>
                  ) : isMe ? (
                    <span className="text-xs text-red-400 mt-0.5">🎤 静音</span>
                  ) : isSpeaking ? (
                    <span className="text-xs text-purple-400 mt-0.5">说话中...</span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Chat messages area */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl h-48 md:h-64 overflow-y-auto space-y-2">
            {chatMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-600 text-sm">🎤 开始吐槽吧...</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2 animate-fadeIn">
                  <span className="text-lg flex-shrink-0">{msg.participant.avatar}</span>
                  <div>
                    <span className="text-xs text-gray-500">{msg.participant.nickname}</span>
                    <p className="text-sm text-gray-300">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      {/* SpeechRecognition status / interim text */}
      {srSupported === false && (
        <div className="max-w-2xl mx-auto mb-2 px-4">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-sm flex items-center justify-between">
            <div>你的浏览器不支持语音识别。建议使用 Chromium/Edge/Chrome（桌面）或 Safari（部分支持）。</div>
            <button onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition', '_blank')} className="ml-3 text-yellow-200 underline">了解更多</button>
          </div>
        </div>
      )}

      {srError && (
        <div className="max-w-2xl mx-auto mb-2 px-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm flex items-center justify-between">
            <div>语音识别出错：{srError}</div>
            <div className="flex items-center gap-2">
              <button onClick={handleRetrySR} className="px-3 py-1 bg-red-500/20 rounded-md text-red-200 text-sm">重试</button>
            </div>
          </div>
        </div>
      )}

      {interimTranscript && (
        <div className="max-w-2xl mx-auto mb-2 px-4">
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm">正在识别：{interimTranscript}</div>
        </div>
      )}

      <div className="sticky bottom-0 bg-[#0f0a1e]/95 backdrop-blur-md border-t border-white/5 px-4 py-4 pb-6 md:pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-6">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all active:scale-90 ${
              micOn
                ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}
          >
            {micOn ? '🎤' : '🔇'}
          </button>

          <button
            onClick={() => setShowEndConfirm(true)}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg hover:bg-red-500/20 transition-colors"
          >
            🚪
          </button>
        </div>
      </div>

      {/* End confirm modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEndConfirm(false)} />
          <div className="relative w-full max-w-sm bg-[#1a1035] border border-white/10 rounded-3xl p-6 animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center text-3xl mb-3">
                🚪
              </div>
              <h3 className="text-lg font-bold mb-1">确定退出房间？</h3>
              <p className="text-sm text-gray-400">退出后将无法返回本次吐槽</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleEnd}
                className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 active:scale-95 transition-all"
              >
                确定退出
              </button>
              <button
                onClick={() => setShowEndConfirm(false)}
                className="w-full py-3 bg-white/5 text-gray-400 rounded-xl font-medium hover:bg-white/10 active:scale-95 transition-all"
              >
                继续吐槽
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out both; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}
