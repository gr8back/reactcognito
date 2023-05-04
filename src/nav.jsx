import React, { useState } from "react";
// import { AuthConsumer } from "./auth.jsx";
import { useNavigate } from "react-router-dom";
import CognitoLogin from "./cognitosignin";


export default () => {
  const [message, setmessage] = useState(false);
  const [logged, setlogged] = useState(false);
  const [css, setcss] = useState(false);

  const handleClick = async (e) => {
    console.log("clicked " + message)
    setmessage(!message);
    setcss(!css)
        // document.getElementById("cognitologin").style = "filter: none;";
        // document.getElementById("root").style = "filter: blur(3px);";
  }

  return (
    <nav>
        {css &&       <style>{`
        #container > * {
           filter: blur(3px);
        }
      `}</style>}
      <div id="nav-wrapper">
          {logged && (
                <span>Logout</span>
          )}

        {logged ? (
          <div href="/" >
            Logged In
          </div>
        ) : (
          <div>
            <div
              onClick={() => handleClick()}
              style={{ paddingLeft: "15px" }}
            >
              Sign In
            </div>
            {message && <div id={'cognitoparent'}><CognitoLogin isopen={message} closebutt={handleClick} loggy={setlogged}/></div>}
          </div>
        )}
      </div>
    </nav>
  );
};
