import { useState, useCallback } from 'react';
import { Page } from './types';
import { mockRooms } from './data';
import HomePage from './components/HomePage';
import RoomList from './components/RoomList';
import RoomLobby from './components/RoomLobby';
import ActiveRoom from './components/ActiveRoom';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleSelectRoom = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleBack = useCallback(() => {
    switch (currentPage) {
      case 'rooms':
        setCurrentPage('home');
        break;
      case 'lobby':
        setCurrentPage('rooms');
        break;
      case 'active':
        setCurrentPage('home');
        setSelectedRoomId(null);
        break;
      case 'history':
      case 'profile':
        setCurrentPage('home');
        break;
      default:
        setCurrentPage('home');
    }
  }, [currentPage]);

  const selectedRoom = selectedRoomId ? mockRooms.find(r => r.id === selectedRoomId) || mockRooms[0] : mockRooms[0];

  const showBottomNav = ['home', 'rooms', 'history', 'profile'].includes(currentPage);

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white">
      {/* Page Content */}
      <div className={`${showBottomNav ? 'pb-20' : ''}`}>
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectRoom={handleSelectRoom}
          />
        )}

        {currentPage === 'rooms' && (
          <RoomList
            onBack={handleBack}
            onSelectRoom={handleSelectRoom}
            onJoinRoom={(roomId) => {
              setSelectedRoomId(roomId);
              setCurrentPage('lobby');
            }}
          />
        )}

        {currentPage === 'lobby' && selectedRoom && (
          <RoomLobby
            room={selectedRoom}
            onBack={handleBack}
            onStart={() => setCurrentPage('active')}
          />
        )}

        {currentPage === 'active' && selectedRoom && (
          <ActiveRoom
            room={selectedRoom}
            onEnd={() => {
              setCurrentPage('home');
              setSelectedRoomId(null);
            }}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage onBack={handleBack} />
        )}

        {currentPage === 'profile' && (
          <ProfilePage onBack={handleBack} />
        )}
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f0a1e]/95 backdrop-blur-md border-t border-white/5">
          <div className="max-w-2xl mx-auto flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {[
              { page: 'home' as Page, icon: '🏠', label: '首页' },
              { page: 'rooms' as Page, icon: '🎙️', label: '房间' },
              { page: 'history' as Page, icon: '📋', label: '记录' },
              { page: 'profile' as Page, icon: '👤', label: '我的' },
            ].map(({ page, icon, label }) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all ${
                  currentPage === page
                    ? 'text-purple-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className={`text-xl transition-transform ${currentPage === page ? 'scale-110' : ''}`}>
                  {icon}
                </span>
                <span className={`text-xs ${currentPage === page ? 'font-bold' : ''}`}>
                  {label}
                </span>
                {currentPage === page && (
                  <div className="w-1 h-1 bg-purple-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
