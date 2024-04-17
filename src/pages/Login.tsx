import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

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
    <div className='h-full w-full flex flex-col items-center justify-center bg-black'>
      <div className='max-w-[550px] font-semibold w-full h-fit text-xl rounded-md p-8 text-green-500 bg-neutral-900 '>
        <div>
          {showGoogleLogin === false && (
            <TypeAnimation
              sequence={["Login with Google to proceed? (Y/n)"]}
              wrapper='span'
              speed={50}
              repeat={0}
            />
          )}
          {showGoogleLogin === null && (
            <TypeAnimation
              sequence={["Exiting..."]}
              wrapper='span'
              speed={50}
              repeat={0}
            />
          )}
          {showGoogleLogin && (
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                fetch(
                  `http://localhost:3000/login`,
                  {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "post",
                    body: JSON.stringify({
                        credential: credentialResponse.credential
                    })
                  }
                )
                  .then(async (res) => console.log(await res.text()))
                  .catch((err) => console.log(err));
              }}
              onError={() => {
                console.log("Login Failed");
              }} 
              theme='filled_black'
              locale='or'
              ux_mode="redirect"
              login_uri="http://localhost:3000/login"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
