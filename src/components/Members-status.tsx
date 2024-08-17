import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserProfileContext } from '../context/UserContext';
import { cipherioTRPCClient } from '../trpc/client';
import { useMutation } from '@tanstack/react-query';
import { sha256 } from '../utils/crypto';
import { Unsubscribable } from '@trpc/server/observable';

function MembersStatusSection() {
  const [activeMembers, setActiveMembers] = useState<ActiveMember[]>([]);
  const { chatRoomName } = useParams<{ chatRoomName: string }>();
  const [userProfile, setUserProfile] = useUserProfileContext();
  const [selfTokenHash, setSelfTokenHash] = useState<string>('');

  useEffect(() => {
    const localChatRoom = userProfile?.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0];

    if (!localChatRoom) return;

    let activeMemberSubscription: Unsubscribable, selfBlacklistSubscription: Unsubscribable;

    sha256(userProfile!.userToken).then((userTokenHash: string) => {
      setSelfTokenHash(userTokenHash);

      activeMemberSubscription = cipherioTRPCClient.chat.onMemberChange.subscribe(
        {
          chatRoomName: localChatRoom!.name,
          password: localChatRoom!.password,
          user_token_hash: userTokenHash,
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

      selfBlacklistSubscription = cipherioTRPCClient.moderation.onSelfBlacklisted.subscribe(
        {
          chatRoomName: localChatRoom!.name,
          password: localChatRoom!.password,
          user_token_hash: userTokenHash,
        },
        {
          onData({ reason }: { reason: string }) {
            alert('You have been banned! Reason: ' + reason);
            setUserProfile((p) => {
              p = p!;
              const result = { ...p, savedChatRooms: p!.savedChatRooms.filter((c) => c.name !== chatRoomName!) };
              localStorage.setItem('user_profile', JSON.stringify(result));
              return result;
            });
            location.replace('/home');
          },
          onError(err) {
            console.error(err);
          },
        },
      );
    });

    return () => {
      activeMemberSubscription?.unsubscribe();
      selfBlacklistSubscription?.unsubscribe();
    };
  }, [chatRoomName, userProfile, setUserProfile]);

  const blacklistMutation = useMutation({
    mutationKey: ['blacklist_member'],
    mutationFn: (params: { targetUserTokenHash: string; blacklistingReason: string; selfTokenHash: string }) =>
      cipherioTRPCClient.moderation.blacklistMember.mutate({
        chatRoomName: chatRoomName!,
        password: userProfile!.savedChatRooms.filter((chatRoom) => chatRoom.name === chatRoomName)[0].password,
        user_token_hash: params.selfTokenHash,
        target_user_token_hash: params.targetUserTokenHash,
        reason: params.blacklistingReason,
      }),
    onSuccess: () => {
      alert('User banned');
    },
  });

  return (
    <div className="bg-gray-700 flex flex-col">
      <h2 className="sticky text-center">Members online</h2>
      <div className="bg-gray-800 p-3 flex-grow">
        <ul className="overflow-auto h-full w-full">
          {activeMembers
            .sort((a, b) => a.userName.localeCompare(b.userName))
            .map((m) => (
              <div key={m.user_token_hash} className="flex flex-row w-full justify-between items-center group">
                <div className="w-fit">
                  <span className="text-green-500 whitespace-pre-wrap">●</span>&nbsp;{m.userName}
                </div>
                {selfTokenHash !== m.user_token_hash && (
                  <span
                    onClick={async () => {
                      if (blacklistMutation.isPending) return;

                      const blacklistingReason = prompt(
                        'Enter the reason for blacklisting (the user will be notified)',
                        'You are a bad person',
                      )!;
                      blacklistMutation.mutateAsync({
                        blacklistingReason,
                        targetUserTokenHash: m.user_token_hash,
                        selfTokenHash: await sha256(userProfile!.userToken),
                      });
                    }}
                    className="group-hover:block cursor-pointer hidden text-red-500 underline underline-offset-4"
                  >
                    blacklist
                  </span>
                )}
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
