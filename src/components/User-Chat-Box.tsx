import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserProfileContext } from '../context/UserContext';
import { CiMessagePostflight, CiMessagePreflight } from '../core/CiMessage';
import { sha256 } from '../utils/crypto';
import { useMutation } from '@tanstack/react-query';
import { cipherioTRPCClient } from '../trpc/client';
import { ratelimit } from '../utils/rate';

function UserChatBox({
  setNewMsgList,
}: {
  setNewMsgList: React.Dispatch<React.SetStateAction<(CiMessagePreflight | CiMessagePostflight)[]>>;
}) {
  const { chatRoomName } = useParams<{ chatRoomName: string }>();
  const [userProfile, _] = useUserProfileContext();
  const [message, setMessage] = useState<string>('');

  async function initSendMessage() {
    const userTokenHash = await sha256(userProfile!.userToken);

    setNewMsgList((prev) => [
      ...prev,
      new CiMessagePreflight(
        {
          chatRoomName: chatRoomName!,
          messageBody: {
            content: message.trim(),
            sender_token_hash: userTokenHash,
            sender_username: userProfile?.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0]
              .username as string,
            reply_to: null,
          },
          password: userProfile?.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0]
            .password as string,
        },
        setNewMsgList,
      ),
    ]);
  }

  const fireTypingEventMutation = useMutation({
    mutationKey: ['typing_message'],
    mutationFn: () =>
      cipherioTRPCClient.chat.typing.mutate({
        chatRoomName: chatRoomName!,
        password: userProfile!.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0].password,
        userName: userProfile!.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0].username,
        userToken: userProfile!.userToken,
      }),
    onSuccess: () => {
      console.log(new Date(), 'Typing event fired...');
    },
  });

  const ratelimited_fireTypingEventMutate = ratelimit(fireTypingEventMutation.mutate, 3000);

  return (
    <div className="flex flex-row my-2 w-full gap-2">
      <textarea
        id="user_message_box"
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          ratelimited_fireTypingEventMutate();
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            initSendMessage().then(() => setMessage(''));
          }
        }}
        value={message}
        placeholder="Do not enter any sensitive or personally identifiable information..."
        className="flex-grow px-2 bg-gray-800 border-gray-800 border-2 outline-none resize-none"
      ></textarea>
      <button
        onClick={() => initSendMessage().then(() => setMessage(''))}
        className="bg-gray-800 text-white px-4 hover:bg-white hover:text-black duration-300"
        disabled={message.length === 0}
      >
        Send
      </button>
    </div>
  );
}

export default UserChatBox;
