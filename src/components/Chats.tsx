import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { cipherioTRPCClient } from '../../trpc/client';
import { useUserProfileContext } from '../context/UserContext';
import { useEffect, useState } from 'react';
import UserChatBox from './User-Chat-Box';
import { CiMessagePostflight, CiMessagePreflight } from '../core/CiMessage';
import { sha256 } from '../../utils/crypto';
import { Unsubscribable } from '@trpc/server/observable';

function ChatSection() {
  const { chatRoomName } = useParams<{ chatRoomName: string }>();
  const [userProfile, _] = useUserProfileContext();
  const [newMsgList, setNewMsgList] = useState<(CiMessagePreflight | CiMessagePostflight)[]>([]);

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

    let subscription: Unsubscribable;
    sha256(userProfile!.userToken).then((userTokenHash) => {
      subscription = cipherioTRPCClient.chat.onNewMessage.subscribe(
        { chatRoomName: chatRoomName!, password: localChatRoom!.password, user_token_hash: userTokenHash },
        {
          onData(data) {
            setNewMsgList((prev) => [...prev, new CiMessagePostflight({ messageBody: data })]);
          },
          onError(err) {
            console.error('Subscription error:', err);
          },
        },
      );
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [chatRoomName, userProfile]);

  useEffect(() => {
    document.getElementById('msg-container')?.scrollTo({ top: 99999999 });
  }, [newMsgList]);

  return (
    <div className="bg-gray-700 flex flex-col">
      <h2 className="sticky text-center">Chats</h2>
      <div id="msg-container" className="bg-gray-800 p-3 flex-grow h-[600px] overflow-y-scroll">
        {!!data && (
          <ul className="h-full">
            {data.payload!.messages.map((message: any) => (
              <li key={message._id} className="whitespace-pre-wrap">
                <span className="text-gray-500">{message.sender_username}: </span>
                {message.content}
              </li>
            ))}

            {newMsgList.map((message) =>
              message instanceof CiMessagePostflight ? (
                <li key={message.key} className="whitespace-pre-wrap">
                  <span className="text-gray-500">{message.messageBody.sender_username}: </span>
                  {message.messageBody.content}
                </li>
              ) : (
                <li key={message.key} className="whitespace-pre-wrap">
                  <span className="text-gray-500">{message.messageBody.sender_username}: </span>
                  {message.messageBody.content}
                  <>
                    &nbsp;
                    {message.isSent === false && message.isFailed === false && '(Sending...)'}
                    {message.isSent === false && message.isFailed === true && (
                      <button onClick={message.retry} className="text-red-500">
                        Retry...
                      </button>
                    )}
                    {message.isSent === true && message.isFailed === false && '(Sent...)'}
                  </>
                </li>
              ),
            )}
          </ul>
        )}
      </div>
      <UserChatBox setNewMsgList={setNewMsgList} />
    </div>
  );
}

export default ChatSection;
