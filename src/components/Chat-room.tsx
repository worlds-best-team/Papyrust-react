import { Link, useLocation } from 'react-router-dom';
import { useUserProfileContext } from '../context/UserContext';
import { useEffect, useState } from 'react';
import CreateChatRoom from './Create-chat-room';
import JoinChatRoom from './Join-chat-room';
import InviteMembers from './Invite';

function ChatRoomsSection() {
  const [userProfile, _] = useUserProfileContext();
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showJoin, setShowJoin] = useState<boolean>(false);
  const [showInvite, setShowInvite] = useState<boolean>(false);
  const [chatRoomName, setChatRoomName] = useState<string | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    setChatRoomName((_) => {
      const pathSegments = location.pathname.split('/').filter((i) => i.trim().length !== 0);
      return pathSegments[1];
    });
  }, [location]);

  return (
    <div className="bg-gray-700 flex flex-col h-full">
      <h2 className="sticky text-center">Chat Room</h2>
      <div className="bg-gray-800 flex-grow relative flex flex-col">
        <ul className="text-white flex-grow p-3 overflow-y-auto">
          {userProfile?.savedChatRooms.map((chatRoom) => (
            <li key={chatRoom.name}>
              <Link to={'/home/' + chatRoom.name}>
                {chatRoom.name} <span className="text-gray-500">@{chatRoom.username}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 align-center bg-black bg-opacity-10 p-5">
          Tools
          {chatRoomName && (
            <button
              className="bg-gray-600 p-2 w-full"
              onClick={() => {
                setShowInvite(true);
                setShowCreate(false);
                setShowJoin(false);
              }}
            >
              Invite
            </button>
          )}
          {showInvite && <InviteMembers setShow={setShowInvite} />}
          <div className="flex flex-row gap-3 w-full">
            <button
              className="bg-gray-600 p-2 w-full"
              onClick={() => {
                setShowCreate(true);
                setShowJoin(false);
                setShowInvite(false);
              }}
            >
              Create
            </button>
            {showCreate && <CreateChatRoom setShow={setShowCreate} />}

            <button
              className="bg-gray-600 p-2 w-full"
              onClick={() => {
                setShowJoin(true);
                setShowCreate(false);
                setShowInvite(false);
              }}
            >
              Join
            </button>
            {showJoin && <JoinChatRoom setShow={setShowJoin} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoomsSection;
