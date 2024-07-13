import { Link } from 'react-router-dom';
import { useUserProfileContext } from '../context/UserContext';
import { useState } from 'react';
import CreateChatRoom from './Create-chat-room';
import JoinChatRoom from './Join-chat-room';

function ChatRoomsSection() {
  const [userProfile, _] = useUserProfileContext();
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showJoin, setShowJoin] = useState<boolean>(false);

  return (
    <div className="bg-gray-700 flex flex-col h-full">
      <h2 className="sticky text-center">Chat Room</h2>
      <div className="bg-gray-800 p-3 flex-grow relative">
        <ul className="text-white">
          {userProfile?.savedChatRooms.map((chatRoom) => (
            <li key={chatRoom.name}>
              <Link to={'/home/' + chatRoom.name}>
                {chatRoom.name} <span className="text-gray-500">@{chatRoom.username}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className=" flex flex-col gap-3 align-center absolute bottom-3">
          <button
            className="bg-gray-600 p-2 w-[200px]"
            onClick={() => {
              setShowCreate(true);
              setShowJoin(false);
            }}
          >
            Create Chatroom
          </button>
          {showCreate && <CreateChatRoom setShow={setShowCreate} />}

          <button
            className="bg-gray-600 p-2 w-[200px]"
            onClick={() => {
              setShowJoin(true);
              setShowCreate(false);
            }}
          >
            Join Chatroom
          </button>
          {showJoin && <JoinChatRoom setShow={setShowJoin} />}
        </div>
      </div>
    </div>
  );
}

export default ChatRoomsSection;
