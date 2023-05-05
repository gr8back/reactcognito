import React, { useState, useEffect } from "react";
import $ from "jquery";
import toastr from "toastr";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import AWS from "aws-sdk";
import "./toastr2.css"
import { Tween } from "react-gsap";

export default () => {
  const [loginbox, setloginbox] = useState(false);
  // const [logged, setlogged] = useState(false);
  const [css, setcss] = useState(false);
  const [showloginform, setshowloginform] = useState(false);
  const REACT_APP_REGION = "us-east-2";
  const REACT_APP_userPoolId = "us-east-2_9gOOnd3xR";
  const REACT_APP_clientId = "67l6l2fuptqdfsrntbho33sk3n";
  const REACT_APP_identityPoolId =
    "us-east-2:d3b6dca1-ae19-4711-8453-ebdb7560d6ee";

  var userPoolId = REACT_APP_userPoolId;
  var clientId = REACT_APP_clientId;
  var region = REACT_APP_REGION;
  var identityPoolId = REACT_APP_identityPoolId;

  var cognitoUser;
  var idToken;
  var LoginViewer;

  var poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
  };

  const userPool = new CognitoUserPool(poolData);

  if (!cognitoUser) {
    getCurrentLoggedInSession();
  }

  // const handleClick = async (e) => {
  //   console.log("clicked " + message)
  //   setmessage(!message);
  //   setcss(!css)
  //
  // }
  //

  useEffect(()=>{
    getCognitoIdentityCredentials()
  },[]);

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function switchToVerificationCodeView() {
    console.log("switch to verif code view");
    $("#emailInput").hide();
    $("#userNameInput").hide();
    $("#passwordInput").hide();
    $("#confirmPasswordInput").hide();
    $("#logInButton").hide();
    $("#registerButton").hide();
    $("#bucketNameInput").hide();
    $("#verificationCodeInput").show();
    $("#verifyCodeButton").show();
    $("#logOutButton").hide();
  }

  function switchToRegisterView() {
    console.log("switch to register view");
    $("#emailInput").show();
    $("#userNameInput").show();
    $("#passwordInput").show();
    $("#confirmPasswordInput").show();
    $("#registerButton").show();
    $("#logInButton").hide();
    $("#notregisteryet").hide();
    $("#verificationCodeInput").hide();
    $("#backtologin").show();
    $("#verifyCodeButton").hide();
    $("#bucketNameInput").hide();
    $("#logOutButton").hide();
  }

  function switchToLogInView() {
    console.log("switch to login view");
    $("#userNameInput").val("");
    $("#passwordInput").val("");
    $("#emailInput").hide();
    $("#userNameInput").show();
    $("#backtologin").hide();
    $("#passwordInput").show();
    $("#userPhoneNumber").hide();
    $("#notregisteryet").show();
    $("#confirmPasswordInput").hide();
    $("#logInButton").show();
    $("#registerButton").hide();
    $("#verificationCodeInput").hide();
    $("#verifyCodeButton").hide();
    $("#bucketNameInput").hide();
    $("#logOutButton").hide();
  }

  function switchToLoggedInView() {
    console.log("Switching to logged in view");
    $("#emailInput").hide();
    $("#userNameInput").hide();
    $("#passwordInput").hide();
    $("#userPhoneNumber").hide();
    $("#logOutButton").hide();
    $("#bucketNameInput").show();
    $("#logOutButton").show();
  }

  const loginform = (
    <div id="cognitologin">
      <div
        id={"signinclose"}
        onClick={() => {
          handleClick();
        }}
      >
        X
      </div>
      <input
        id="emailInput"
        type="text"
        className={"button"}
        placeholder="Email"
        style={{ display: "none" }}
      />
      <input
        id="userNameInput"
        type="text"
        placeholder="Username"
        className={"button"}
      />
      <input
        id="userPhoneNumber"
        type="text"
        placeholder="PhoneNumber"
        style={{ display: "none" }}
        className={"button"}
      />
      <input
        id="passwordInput"
        type="password"
        placeholder="Password"
        className={"button"}
      />
      <input
        id="confirmPasswordInput"
        type="password"
        className={"button"}
        placeholder="Confirm Password"
        style={{ display: "none" }}
      />
      <input
        id="verificationCodeInput"
        className={"button"}
        type="text"
        placeholder="Verification Code"
        style={{ display: "none" }}
      />
      <input
        id="logInButton"
        type="text"
        defaultValue="Log In"
        onClick={() => logIn()}
        className={"button"}
      />
      <div>
        <span id="notregisteryet" onClick={() => registerswitch()}>
          Not registered yet?
        </span>
      </div>
      <input
        id="registerButton"
        className={"button"}
        type="text"
        style={{ display: "none" }}
        defaultValue="Register"
        onClick={() => register()}
      />
      <input
        id="logOutButton"
        className={"button"}
        type="Button"
        defaultValue="Log Out"
        onClick={() => logOut()}
        style={{ display: "none" }}
      />
      <input
        id="verifyCodeButton"
        type="button"
        className={"button"}
        defaultValue="Verify"
        onClick={() => verifyCode()}
        style={{ display: "none" }}
      />
      <div>
        <span
          id="backtologin"
          onClick={() => switchToLogInView()}
          style={{ display: "none" }}
        >
          Back to Login
        </span>
      </div>
    </div>
  );

  function logOut() {
    console.log("Logging Out");
    if (cognitoUser != null) {
      cognitoUser.signOut();
      setTimeout(() => {
        toastr.info("signed out");
        switchToLogInView();
        // setlogged(false)
        setcss(false)
        setshowloginform(!showloginform);
        document.getElementById("cognitologin").style.display = "none";
      }, "1000");
    }
  }

  /*
        Starting point for user login flow with input validation
        */
  function logIn() {
    console.log("login called");
    setcss(false)
    if (!$("#userNameInput").val() || !$("#passwordInput").val()) {
      toastr.error("Please enter Username and Password!");
    } else {
      var authenticationData = {
        Username: $("#userNameInput").val(),
        Password: $("#passwordInput").val(),
      };
      var authenticationDetails = new AuthenticationDetails(authenticationData);

      var userData = {
        Username: $("#userNameInput").val(),
        Pool: userPool,
      };
      cognitoUser = new CognitoUser(userData);


      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          var loggedinname = $("#userNameInput").val();
          // setmessage("Logged in as " + loggedinname);

          // switchToLoggedInView();
          toastr.info("logged in");
          // loggy(true)

          // idToken = result.getIdToken().getJwtToken();
          getCognitoIdentityCredentials();
          console.log("about to close button");
          handleClick();
        },

        onFailure: function (err) {
          toastr.error("Error: " + err.message);
        },
      });
    }
  }

  function registerswitch() {
    switchToRegisterView();
  }

  function register() {
    if (
      !$("#emailInput").val() ||
      !$("#userNameInput").val() ||
      !$("#passwordInput").val() ||
      !$("#confirmPasswordInput").val() ||
      !$("#userPhoneNumber").val()
    ) {
      toastr.error("Please fill-in all the fields!");
    } else {
      if ($("#passwordInput").val() == $("#confirmPasswordInput").val()) {
        registerUser(
          $("#emailInput").val(),
          $("#userNameInput").val(),
          $("#passwordInput").val(),
          $("#userPhoneNumber").val()
        );
      } else {
        toastr.error("Confirm password failed!");
      }
    }
  }

  /*
        Starting point for user verification using AWS Cognito with input validation
        */
  function verifyCode() {
    console.log("verify code reached");
    if (!$("#verificationCodeInput").val()) {
      toastr.error("Please enter verification field!");
    } else {

      cognitoUser.confirmRegistration(
        $("#verificationCodeInput").val(),
        true,
        function (err, result) {
          if (err) {
            toastr.error(err.message);
          } else {
            console.log("Successfully verified code!");
            switchToLogInView();
          }
        }
      );
    }
  }

  function registerUser(email, username, password, phoneNumber) {
    var attributeList = [];

    console.log("register user called");

    var dataEmail = {
      Name: "email",
      Value: email,
    };

    sessionStorage.setItem("phonenumber ", $("#userPhoneNumber").val());

    console.log(
      "register user " +
        email +
        " username " +
        username +
        " password " +
        password +
        " phonenumber " +
        phoneNumber
    );

    var attributeEmail = new CognitoUserAttribute(dataEmail);

    var attributeEmail2 = new CognitoUserAttribute({
      Name: "phonenumber",
      Value: phoneNumber,
    });

    attributeList.push(attributeEmail);

    console.log("push to userpool signup");

    REACT_APP_userPoolId.signUp(
      username,
      password,
      attributeList,
      null,
      function (err, result) {
        if (err) {
          toastr.error(err.message);
        } else {
          cognitoUser = result.user;
          toastr.success("Registration Successful");
          toastr.error(
            "Please enter the verification code sent to your Email."
          );
          switchToVerificationCodeView();
        }
      }
    );
  }

  /*
        This method will get temporary credentials for AWS using the IdentityPoolId and the Id Token recieved from AWS Cognito authentication provider.
        */
  function getCognitoIdentityCredentials() {
    console.log("getcognitoidentitycredentials");
    AWS.config.region = region;

    var loginMap = {};
    loginMap["cognito-idp." + region + ".amazonaws.com/" + userPoolId] =
      idToken;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: loginMap,
    });

    AWS.config.credentials.clearCachedId();

    AWS.config.credentials.get(function (err) {
      if (err) {
        console.log(err.message);
      } else {
        setcss(false)

        window.localStorage.setItem(
          "sessionkey",
          AWS.config.credentials.sessionToken
        );
        // window.localStorage.setItem("username", cognitoUser.username);
      }
    });
  }

  const LogoutButton = (
    <div id={"logoutdiv"} >
      <Tween from={{ x: "-700px", y:"200" }} to={{ x: "440px", y:"-140" }}>
        <div id="cognitologin">
          <div>Logged In as {cognitoUser && cognitoUser.username}</div>
          <div
            className={"button"}
            type="Button"
            defaultValue="Log Out"
            onClick={() => logOut()}
          >
            Logout
          </div>
        </div>
      </Tween>
    </div>
  );

  function getCurrentLoggedInSession() {
    var userPool = new CognitoUserPool(poolData);
    // userPool = "test";
    cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          toastr.error(err.message);
        } else {
          console.log("session found logged in");
          switchToLoggedInView();
          // setloggedinuser(true)
          //  setlogged(true)
          // idToken = session.getIdToken().getJwtToken();
          getCognitoIdentityCredentials();
        }

      });
    } else {
      toastr.info("Session expired. Please log in again.");
    }
  }

    const handleClicklogout = async (e) => {
        console.log("clicked");
        $("#logoutdiv").toggle();
        // setloginbox(!loginbox)
    }

  const handleClick = async (e) => {
    console.log("clicked");
    setshowloginform(!showloginform);
    setcss(!css);
    // LoginViewer = loginform;
    sleep(1000);
    switchToLogInView();
    //   var mydisplay = display==true ? "inherit" : "none"
    // document.getElementById("cognitologin").style.display = mydisplay
  };

     if (cognitoUser) {var LoginViewer = LogoutButton; } else {var LoginViewer = loginform; sleep(1000) }

  return (
    <nav >
            {showloginform && (
          <div id={"cognitoparent"}>{LoginViewer}</div>
      )}
      {css &&           <style>{`
        #container > * {
           filter: blur(20px);
        }
      `}</style>}

      <div id="nav-wrapper" >
        {cognitoUser ? (
          <div href="/">
            <div onClick={() => handleClick()}>Logged In  {cognitoUser.username}</div>
            <span onClick={() => handleClicklogout()}>Logout</span>
          </div>
        ) : (
          <div>
            <div onClick={() => handleClick()} style={{ paddingLeft: "15px" }}>
              Sign In
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
