import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import CreateChatRoom from '../components/Create-chat-room';
import JoinChatRoom from '../components/Join-chat-room';
import { getLocalUserProfile, initLocalUserProfile, UserProfileSchema } from '../utils/core';
import { useUserProfileContext } from '../context/UserContext';
import { z } from 'zod';

function LoginPage() {
  const [showForm, setShowForm] = useState<'s' | 'j' | false>(false);
  const [showInitialise, setShowInitialise] = useState<boolean>(false);
  const [showUserDump, setShowUserDump] = useState<boolean>(false);
  const [_, setUserProfile] = useUserProfileContext();

  useEffect(() => {
    let localUserProfile: z.infer<typeof UserProfileSchema> | false;

    localUserProfile = getLocalUserProfile();
    if (!localUserProfile) localUserProfile = initLocalUserProfile();

    setTimeout(() => {
      setShowInitialise(true);
      setTimeout(() => {
        setUserProfile(localUserProfile!);
        setShowUserDump(true);
      }, 2000);
    }, 8000);
  }, []);

  return (
    <div className="h-full w-full p-6 bg-black">
      <h2 className="text-purple-500 text-lg font-medium">
        &lt;anonymous@cipher-io:~%&gt;&nbsp;<span className="text-white">cipher-io init</span>
      </h2>
      <div className="font-medium w-full h-fit text-lg rounded-md pt-4 text-green-500 ">
        <TypeAnimation
          sequence={[
            'Stop Looking Around!',
            2000,
            'What you are looking for is here.',
            2000,
            'We have cookies for visitors :)',
          ]}
          wrapper="span"
          speed={80}
          repeat={0}
          cursor={false}
        />
      </div>
      {showInitialise && <div className="text-white text-lg font-medium">Initialising user profile...</div>}
      {showUserDump && (
        <>
          <br />

          <div className="text-green-500 text-lg font-medium">
            <button onClick={() => setShowForm('s')}>Create</button> a new chat room, or{' '}
            <button onClick={() => setShowForm('j')}>Join</button> an existing chat room.
          </div>
        </>
      )}
      {showForm === 's' && (
        <CreateChatRoom
          setShow={(b: boolean) => {
            if (b) setShowForm('s');
            else setShowForm(false);
          }}
        />
      )}
      {showForm === 'j' && (
        <JoinChatRoom
          setShow={(b: boolean) => {
            if (b) setShowForm('j');
            else setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

export default LoginPage;
