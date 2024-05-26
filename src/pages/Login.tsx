import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import CreateChatRoom from "../components/Create-chat-room";
import JoinChatRoom from "../components/Join-chat-room";

function LoginPage() {
  const [showGoogleLogin, setShowGoogleLogin] = useState<boolean | null>(false);

  useEffect(() => {
    function keyPressHandler(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key.toLowerCase() === "y") {
        setShowGoogleLogin(true);
      } else if (event.key.toLowerCase() === "n") {
        setShowGoogleLogin(null);
      }
    }
    window.addEventListener("keydown", keyPressHandler);
  }, []);

  return (
    <div className='h-full w-full p-6 bg-black'>
      <h2 className="text-purple-500 text-lg font-medium"> &lt;anonymous@cipher-io:~%&gt;&nbsp;<span className="text-white">cipher-io init</span></h2>
      <div className='font-semibold w-full h-fit text-lg rounded-md pt-4 text-green-500 '>
        <div>
          {showGoogleLogin === false && (
            
            <TypeAnimation
              sequence={["Stop Looking Around!",2000,"What you are looking for is here.",2000,"We have cookies for visitors :)", 2000, "Press 'S' to create a new chat room, \n Press 'j' to join an existing chat room. (S/j) "]}
              wrapper='span'
              speed={80}
              repeat={0}
            />
          )}
        </div>
      </div>
     <CreateChatRoom />
      {/* <JoinChatRoom/> */}
    </div>
  );
}

export default LoginPage;
