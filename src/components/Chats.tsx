import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { cipherioTRPCClient } from '../trpc/client';
import { useUserProfileContext } from '../context/UserContext';
import { ReactNode, useEffect, useState } from 'react';
import UserChatBox from './User-Chat-Box';
import { CiMessagePostflight, CiMessagePreflight } from '../core/CiMessage';
import { sha256 } from '../utils/crypto';
import { Unsubscribable } from '@trpc/server/observable';
import classNames from 'classnames';

function ChatSection() {
  const { chatRoomName } = useParams<{ chatRoomName: string }>();
  const [userProfile, _] = useUserProfileContext();
  const [newMsgList, setNewMsgList] = useState<(CiMessagePreflight | CiMessagePostflight)[]>([]);
  const [userTokenHash, setUserTokenHash] = useState<string | null>(null);

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
    sha256(userProfile!.userToken).then((userTokenHash: string) => {
      setUserTokenHash(userTokenHash);
      subscription = cipherioTRPCClient.chat.onNewMessage.subscribe(
        { chatRoomName: chatRoomName!, password: localChatRoom!.password, user_token_hash: userTokenHash },
        {
          onData(data) {
            const peerMessage = new CiMessagePostflight({ messageBody: data });
            setNewMsgList((prev) => [...prev, peerMessage]);
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
    document.getElementById('msg-container')?.scrollTo({ top: Number.MAX_SAFE_INTEGER });
  }, [newMsgList, data]);

  useEffect(() => {
    setNewMsgList([]);
  }, [data]);

  function getFormattedHourMin(date: Date) {
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  function getMessageGroupSeparatorByDay({
    previousCreatedAt,
    createdAt,
  }: {
    previousCreatedAt: Date;
    createdAt: Date;
  }): ReactNode {
    const getFormattedDayString = (date: Date): string =>
      date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (createdAt.getDate() !== previousCreatedAt.getDate())
      return (
        <div
          className={classNames('flex flex-row w-full items-center gap-5 text-gray-600 text-xs mb-3', {
            'mt-3': !isNaN(previousCreatedAt.getMilliseconds()),
          })}
        >
          <div className="h-[1px] bg-gray-600 flex-grow" />
          {getFormattedDayString(createdAt)}
          <div className="h-[1px] bg-gray-600 flex-grow" />
        </div>
      );
  }

  function CiMessageBody({ ciMessage, index }: { ciMessage: CiMessagePostflight | CiMessagePreflight; index: number }) {
    if (ciMessage instanceof CiMessagePostflight) {
      return (
        <li key={ciMessage.key}>
          {getMessageGroupSeparatorByDay({
            previousCreatedAt:
              index === 0
                ? new Date(data!.payload!.messages.slice(-1)[0]?.createdAt)
                : new Date(newMsgList[index - 1].createdAt),
            createdAt: new Date(ciMessage.createdAt),
          })}
          <span className="text-gray-600 text-xs">{getFormattedHourMin(new Date(ciMessage.createdAt))}</span>
          &nbsp;
          <span className="text-purple-400">{ciMessage.messageBody.sender_username} </span>
          {ciMessage.messageBody.content}
        </li>
      );
    } else if (ciMessage instanceof CiMessagePreflight) {
      return (
        <li key={ciMessage.key}>
          {getMessageGroupSeparatorByDay({
            previousCreatedAt:
              index === 0
                ? new Date(data!.payload!.messages.slice(-1)[0]?.createdAt)
                : new Date(newMsgList[index - 1].createdAt),
            createdAt: new Date(ciMessage.createdAt),
          })}
          <span className="text-gray-600 text-xs">{getFormattedHourMin(new Date(ciMessage.createdAt))}</span>
          &nbsp;
          <span className="text-amber-300">{ciMessage.messageBody.sender_username}</span>
          <>
            {ciMessage.isSent === false && ciMessage.isFailed === false && (
              <span className="text-gray-400">{ciMessage.messageBody.content}</span>
            )}
            {ciMessage.isSent === false && ciMessage.isFailed === true && (
              <button onClick={ciMessage.retry} className="text-red-500">
                {ciMessage.messageBody.content}
              </button>
            )}
            {ciMessage.isSent === true && ciMessage.isFailed === false && <span>{ciMessage.messageBody.content}</span>}
          </>
        </li>
      );
    }
  }

  return (
    <div className="bg-gray-700 flex flex-col">
      <h2 className="sticky text-center">Chats</h2>
      <div id="msg-container" className="bg-gray-800 p-5 flex-grow h-[600px] overflow-y-scroll">
        {!!data && (
          <ul className="flex flex-col gap-2">
            {data.payload!.messages.map((message: any, index: number) => (
              <li key={message._id}>
                {getMessageGroupSeparatorByDay({
                  previousCreatedAt: new Date(data.payload!.messages[index - 1]?.createdAt),
                  createdAt: new Date(message.createdAt),
                })}
                <span className="text-gray-600 text-xs">{getFormattedHourMin(new Date(message.createdAt))}</span>
                &nbsp;
                <span
                  className={classNames({
                    'text-purple-400': userTokenHash !== message.sender_token_hash,
                    'text-amber-300': userTokenHash === message.sender_token_hash,
                  })}
                >
                  {message.sender_username}
                </span>
                &nbsp;{message.content}
              </li>
            ))}

            {newMsgList.map((message, index) => (
              <CiMessageBody ciMessage={message} key={message.key} index={index} />
            ))}
          </ul>
        )}
      </div>
      <UserChatBox setNewMsgList={setNewMsgList} />
    </div>
  );
}

export default ChatSection;