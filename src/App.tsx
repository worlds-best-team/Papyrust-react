//import { GoogleLogin } from "@react-oauth/google";
import HomePage from "./Home";

function App() {
    return (
        <>
            {/* <GoogleLogin
                onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                }}
                onError={() => {
                    console.log("Login Failed");
                }}
                ux_mode="redirect"
                theme="filled_black"
                locale="or"
            /> */}
            <HomePage />
        </>
    );
}

export default App;
