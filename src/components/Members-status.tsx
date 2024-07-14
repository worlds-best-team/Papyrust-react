import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserProfileContext } from '../context/UserContext';
import { cipherioTRPCClient } from '../trpc/client';

function MembersStatusSection() {
  const [activeMembers, setActiveMembers] = useState<ActiveMember[]>([]);
  const { chatRoomName } = useParams<{ chatRoomName: string }>();
  const [userProfile, _] = useUserProfileContext();

  useEffect(() => {
    const localChatRoom = userProfile?.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0];

    if (!localChatRoom) return;

    console.log('sending active member ping...');

    const activeMemberSubscription = cipherioTRPCClient.chat.onMemberChange.subscribe(
      {
        chatRoomName: localChatRoom!.name,
        password: localChatRoom!.password,
        user_token_hash: userProfile!.userToken,
        userName: localChatRoom!.username,
      },
      {
        onData(list: ActiveMember[]) {
          setActiveMembers(list);
        },
        onError(err) {
          console.error(err);
        },
      },
    );

    return () => {
      activeMemberSubscription.unsubscribe();
    };
  }, [chatRoomName, userProfile]);

  return (
    <div className="bg-gray-700 flex flex-col">
      <h2 className="sticky text-center">Member's Online</h2>
      <div className="bg-gray-800 p-3 flex-grow">
        <ul className="overflow-auto h-full w-full">
          {activeMembers
            .sort((a, b) => a.userName.localeCompare(b.userName))
            .map((m) => (
              <div key={m.user_token_hash} className="flex flex-row w-full justify-between items-center group">
                <div className="w-fit">
                  <span className="text-green-500 whitespace-pre-wrap">●</span>&nbsp;{m.userName}
                </div>
                <span className="group-hover:block cursor-pointer hidden text-red-500 underline underline-offset-4">
                  blacklist
                </span>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}

interface ActiveMember {
  user_token_hash: string;
  userName: string;
  chatRoomName: string;
}

export default MembersStatusSection;
