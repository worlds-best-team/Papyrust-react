import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { pushNewRoomtoLocalStore } from '../utils/core';
import { useUserProfileContext } from '../context/UserContext';
import { cipherioTRPCClient } from '../trpc/client';

function JoinChatRoom() {
  const [userName, setUserName] = useState<string>('');
  const [chatRoomInviteCode, setChatRoomInviteCode] = useState<string>('');
  const [chatRoomPassword, setChatRoomPassword] = useState<string>('');
  const [userProfile, setUserProfile] = useUserProfileContext();
  const navigate = useNavigate();

  const joinRoomMutation = useMutation({
    mutationKey: ['join_room'],
    mutationFn: () =>
      cipherioTRPCClient.chat.joinRoom.mutate({
        inviteCode: chatRoomInviteCode,
        password: chatRoomPassword,
        userToken: userProfile ? userProfile.userToken : '',
      }),
    onSuccess: (data) => {
      const { chatRoomName, password } = data.payload!;
      setUserProfile(pushNewRoomtoLocalStore({ chatRoomName, password, username: userName }));
      navigate('/home');
    },
  });
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
      <div className="bg-neutral-900 p-5 flex flex-col items-center justify-center">
        <h2 className="text-yellow-400">[ Join an existing chat room ]</h2>
        <form
          className="flex flex-col items-left gap-2 pt-5 w-full"
          onSubmit={(evt) => {
            evt.preventDefault();
            joinRoomMutation.mutate();
          }}
        >
          <div className="py-5">
            <label className="text-gray-400">Enter a username</label>
            <input className="w-full" type="text" name="name" onChange={(evt) => setUserName(evt.target.value)} />
          </div>
          <div className="">
            <label className="text-gray-400 ">Invite code of the chat room</label>
            <input
              className="w-full"
              type="text"
              name="name"
              onChange={(evt) => setChatRoomInviteCode(evt.target.value)}
            />
          </div>
          <div className="py-5 flex flex-col">
            <label className="text-gray-400">Type Password here</label>
            <input
              className="w-full"
              type="text"
              name="name"
              onChange={(evt) => setChatRoomPassword(evt.target.value)}
            />
          </div>
          <button type="submit" className="text-white">
            &lt;Join&gt;
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinChatRoom;
