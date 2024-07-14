import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useState } from 'react';
import { cipherioTRPCClient } from '../trpc/client';
import { useUserProfileContext } from '../context/UserContext';
import { useParams } from 'react-router-dom';
import { sha256 } from '../utils/crypto';

function InviteMembers({ setShow }: { setShow: Dispatch<SetStateAction<boolean>> }) {
  const [userProfile, _] = useUserProfileContext();
  const params = useParams<{ '*': string }>();
  const [inviteCode, setInviteCode] = useState<string>('Fetching invite code...');

  useQuery({
    queryKey: ['get_room_invite_code'],
    queryFn: async () => {
      const userTokenHash = await sha256(userProfile!.userToken);
      const response = await cipherioTRPCClient.chat.getChatRoomInvite.query({
        chatRoomName: params['*']!,
        /* password: userProfile?.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0]
          .password as string, */
        user_token_hash: userTokenHash,
      });
      setInviteCode(response.payload!.chatroominvite.invite_code);
    },
  });

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
      <div className="bg-neutral-900 p-5 flex flex-col items-center justify-center">
        <h2 className="text-yellow-400">[ Invite participants ]</h2>
        <form className="flex flex-col items-center gap-2 pt-5 *:py-2 w-full">
          <div>
            <label className="text-gray-400">Invite code</label>
            <input type="text" maxLength={30} value={inviteCode} className="text-black w-full" />
          </div>
          <div className="flex flex-row justify-between w-full">
            <button
              className="text-white"
              onClick={(evt) => {
                evt.preventDefault();
                setShow(false);
              }}
            >
              &lt;Dismiss&gt;
            </button>
            <button
              tabIndex={0}
              type="submit"
              onClick={() =>
                navigator.clipboard
                  .writeText(inviteCode)
                  .then(() => {
                    alert('Invite link copied to clipboard');
                  })
                  .catch((err) => {
                    console.error('Failed to copy text: ', err);
                  })
              }
              className="text-white"
            >
              &lt;Copy invite&gt;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteMembers;
