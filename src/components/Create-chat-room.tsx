import { useMutation } from '@tanstack/react-query';
import { cipherioTRPCClient } from '../trpc/client';
import { Dispatch, SetStateAction, useState } from 'react';
import { usernamify } from '../../../utils/string';
import { useUserProfileContext } from '../context/UserContext';
import { pushNewRoomtoLocalStore } from '../utils/core';
import { useNavigate } from 'react-router-dom';

function CreateChatRoom({ setShow }: { setShow: Dispatch<SetStateAction<boolean>> | ((arg0: boolean) => void) }) {
  const [userName, setUserName] = useState<string>('');
  const [chatRoomName, setChatRoomName] = useState<string>('');
  const [chatRoomPassword, setChatRoomPassword] = useState<string>('');
  const [userProfile, setUserProfile] = useUserProfileContext();
  const navigate = useNavigate();

  const createRoomMutation = useMutation({
    mutationKey: ['create_room'],
    mutationFn: () =>
      cipherioTRPCClient.chat.createRoom.mutate({
        chatRoomName,
        password: chatRoomPassword,
        adminToken: userProfile ? userProfile.userToken : '',
      }),
    onSuccess: (data) => {
      const { chatRoomName, password } = data.payload!;
      setUserProfile(pushNewRoomtoLocalStore({ chatRoomName, password, username: userName }));
      setShow(false);
      navigate('/home/' + chatRoomName);
    },
  });

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
      <div className="bg-neutral-900 p-5 flex flex-col items-center justify-center">
        <h2 className="text-yellow-400">[ Create your chat room ]</h2>
        <form
          className="flex flex-col items-center gap-2 pt-5 *:py-2 w-full"
          onSubmit={(evt) => {
            evt.preventDefault();
            createRoomMutation.mutate();
          }}
        >
          <div>
            <label className="text-gray-400">Enter chat room name</label>
            <input
              type="text"
              name="name"
              maxLength={30}
              onChange={(evt) => setChatRoomName(evt.target.value)}
              className="text-black w-full"
            />
          </div>
          <div>
            <label className="text-gray-400">Set your username for #{usernamify(chatRoomName)}</label>
            <input
              type="text"
              name="name"
              onChange={(evt) => setUserName(usernamify(evt.target.value))}
              className="text-black w-full"
            />
          </div>
          <div>
            <label className="text-gray-400">Create a password</label>
            <input
              type="password"
              name="name"
              onChange={(evt) => setChatRoomPassword(evt.target.value)}
              className="text-black w-full"
            />
          </div>
          <div className="flex flex-row justify-between w-full">
            <button className="text-white" onClick={() => setShow(false)}>
              &lt;Dismiss&gt;
            </button>
            <button tabIndex={0} type="submit" className="text-white">
              &lt;Create&gt;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChatRoom;
