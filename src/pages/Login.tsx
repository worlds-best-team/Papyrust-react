import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import CreateChatRoom from '../components/Create-chat-room';
import JoinChatRoom from '../components/Join-chat-room';
import { initOrGetUserProfile } from '../utils/core';
import { useUserProfileContext } from '../context/UserContext';

function LoginPage() {
  const [showForm, setShowForm] = useState<'s' | 'j' | false>(false);
  const [showInitialise, setShowInitialise] = useState<boolean>(false);
  const [showUserDump, setShowUserDump] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useUserProfileContext();

  useEffect(() => {
    function keyPressHandler(event: KeyboardEvent) {
      if (['s', 'j'].includes(event.key.toLowerCase())) setShowForm(event.key.toLowerCase() as 's' | 'j');
      window.removeEventListener('keydown', keyPressHandler);
    }
    window.addEventListener('keydown', keyPressHandler);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowInitialise(true);
      setTimeout(() => {
        const localUserProfile = initOrGetUserProfile();
        setUserProfile(localUserProfile);
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
          <div className="text-white text-lg font-medium">
            <br />
            <div className="h-[450px] bg-zinc-900 border rounded-md border-none">
              <div className="h-full overflow-auto">
                <pre className="whitespace-pre-wrap">{userProfile ? JSON.stringify(userProfile, null, 4) : ''}</pre>
              </div>
            </div>
            <br />
          </div>
          <div className="text-green-500 text-lg font-medium">
            <TypeAnimation
              sequence={["Press 'S' to create a new chat room, \n Press 'j' to join an existing chat room. (S/j)"]}
              wrapper="span"
              speed={80}
              repeat={0}
            />
          </div>
        </>
      )}
      {showForm === 's' && <CreateChatRoom />}
      {showForm === 'j' && <JoinChatRoom />}
    </div>
  );
}

export default LoginPage;
