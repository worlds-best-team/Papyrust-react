import { Link } from 'react-router-dom';
import { useUserProfileContext } from '../context/UserContext';

function ChatRoomsSection() {
  const [userProfile, _] = useUserProfileContext();

  return (
    <div className="bg-gray-700 flex flex-col h-full">
      <h2 className="sticky text-center">Chat Room</h2>
      <div className="bg-gray-800 p-3 flex-grow">
        <ul className="text-white">
          {userProfile?.savedChatRooms.map((chatRoom) => (
            <li key={chatRoom.name}>
              <Link to={'/home/' + chatRoom.name}>
                {chatRoom.name} <span className="text-gray-500">@{chatRoom.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChatRoomsSection;
