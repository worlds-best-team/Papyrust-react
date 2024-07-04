import React, { useState } from 'react';
import { cipherioTRPCClient } from '../../trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useUserProfileContext } from '../context/UserContext';
import { MessageBodyZSchema } from '../../../types/trpc';
import { z } from 'zod';

function UserChatBox({
  messageListSetter,
}: {
  messageListSetter: React.Dispatch<React.SetStateAction<z.infer<typeof MessageBodyZSchema>[]>>;
}) {
  const { chatRoomName } = useParams<{ chatRoomName: string }>();
  const [userProfile, _] = useUserProfileContext();
  const [message, setMessage] = useState<string>('');
  const sendMessageMutation = useMutation({
    mutationKey: ['send_message'],
    mutationFn: () => {
      messageListSetter((prev) => [
        ...prev,
        {
          content: message.trim(),
          sender_token_hash: 'redacted[self]',
          sender_username: userProfile?.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0]
            .username as string,
          reply_to: null,
        },
      ]);

      return cipherioTRPCClient.chat.sendMessage.mutate({
        chatRoomName: chatRoomName as string,
        password: userProfile?.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0]
          .password as string,
        messageBody: {
          content: message.trim(),
          sender_token: userProfile?.userToken as string,
          sender_username: userProfile?.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0]
            .username as string,
        },
      });
    },
  });

  return (
    <div className="flex flex-row my-2 w-full gap-2">
      <textarea
        id="user_message_box"
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessageMutation.mutateAsync().then(() => setMessage(''));
          }
        }}
        value={message}
        placeholder="Type a message..."
        className="flex-grow px-2 bg-gray-800 border-gray-800 border-2 outline-none resize-none"
      ></textarea>
      <button
        onClick={() => {
          sendMessageMutation.mutateAsync().then(() => setMessage(''));
        }}
        className="bg-gray-800 text-white px-4 hover:bg-white hover:text-black duration-300"
        disabled={message.length === 0}
      >
        Send
      </button>
    </div>
  );
}

export default UserChatBox;
