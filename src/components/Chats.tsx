import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { cipherioTRPCClient } from '../../trpc/client';
import { useUserProfileContext } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import UserChatBox from './User-Chat-Box';
import { MessageBodyZSchema } from '../../../types/trpc';

function ChatSection() {
  const { chatRoomName } = useParams<{ chatRoomName: string }>();
  const [userProfile, _] = useUserProfileContext();
  const [newMsgList, setNewMsgList] = useState<z.infer<typeof MessageBodyZSchema>[]>([]);

  const { data } = useQuery({
    queryKey: ['chat_room_messages', chatRoomName],
    queryFn: () =>
      cipherioTRPCClient.chat.getMessages.query({
        chatRoomName: chatRoomName as string,
        password: userProfile?.savedChatRooms.filter((chatRoom: any) => chatRoom.name === chatRoomName)[0]
          .password as string,
        frameIndex: 1,
      }),
  });

  useEffect(() => {
    const localChatRoom = userProfile?.savedChatRooms.filter((chatRoom: any) => chatRoom.name === chatRoomName)[0];

    const subscription = cipherioTRPCClient.chat.onNewMessage.subscribe(
      { chatRoomName: chatRoomName!, password: localChatRoom!.password, user_token_hash: userProfile!.userToken },
      {
        onData(data) {
          setNewMsgList((prev) => [...prev, data]);
        },
        onError(err) {
          console.error('Subscription error:', err);
        },
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [chatRoomName, userProfile]);

  return (
    <div className="bg-gray-700 flex flex-col">
      <h2 className="sticky text-center">Chats</h2>
      <div className="bg-gray-800 p-3 flex-grow h-[600px] ">
        {!!data && (
          <ul className="h-full overflow-y-scroll">
            {data.payload.messages.map((message) => (
              <li key={message._id} className="whitespace-pre-wrap">
                <span className="text-gray-500">{message.sender_username}: </span>
                {message.content}
              </li>
            ))}
          </ul>
        )}
      </div>
      <UserChatBox messageListSetter={setNewMsgList} />
    </div>
  );
}

export default ChatSection;
