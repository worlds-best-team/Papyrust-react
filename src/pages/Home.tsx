import ChatRoomsSection from '../components/Chat-room';
import ChatSection from '../components/Chats';
import StaticChatSection from '../components/Static-chats';
import MembersStatusSection from '../components/Members-status';
import { Route, Routes } from 'react-router-dom';

function HomePage() {
  return (
    <div className="bg-gray-800 w-full h-full flex flex-col">
      <div
        style={{ gridTemplateColumns: '1fr 3fr 1fr' }}
        className="bg-gray-700 w-full grid grid-cols-3 gap-2 text-white flex-grow"
      >
        <ChatRoomsSection />
        <Routes>
          <Route element={<StaticChatSection />} path="/" />
          <Route element={<ChatSection />} path="/:chatRoomName" />
        </Routes>

        <Routes>
          <Route element={<MembersStatusSection />} path="/:chatRoomName" />
        </Routes>
      </div>
    </div>
  );
}

export default HomePage;
