import $ from "jquery";
import React, {useState} from "react";
import toastr from "toastr";
import {CognitoAccessToken, CognitoIdToken, AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool} from 'amazon-cognito-identity-js'
import AWS from "aws-sdk";
import {gql, useQuery} from "@apollo/client";
import "./toastr2.css"
import { Tween, Timeline } from 'react-gsap';

// Initialize the Amazon Cognito credentials provider
AWS.config.region = "us-east-2"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-2:d3b6dca1-ae19-4711-8453-ebdb7560d6ee",
});

const PUT_SIGNUP = gql`
  query putcasauser($username: String!, $email: String!, $phonenumber: Int!) {
    putcasauser(username: $username, email: $email, phonenumber: $phonenumber)
  }
`;

const Cognitosignin = (props) => {
  const [message, setmessage] = useState("");
  const [display, setdisplay] = useState(false);
  // const { loading, error, data, refetch } = useQuery(PUT_SIGNUP, {
  //   variables: {
  //     username: "usercasatest",
  //     email: "test@test.com",
  //     phonenumber: 123456789,
  //   },
  // });
  // if (error) console.log(error);
  // if (loading) return <div>Loading...</div>;
  // if (data) console.log("graph data" + JSON.stringify(data));

  var userPoolId = "us-east-2_9gOOnd3xR";
  var clientId = "67l6l2fuptqdfsrntbho33sk3n";
  var region = "us-east-2";
  var identityPoolId ="us-east-2:d3b6dca1-ae19-4711-8453-ebdb7560d6ee";

  var cognitoUser;
  var idToken;

  var poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
  };

  const userPool = new CognitoUserPool(poolData);
  if (!cognitoUser) {
      getCurrentLoggedInSession();
    }

      async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }

  function switchToVerificationCodeView() {
    console.log("switch to verif code view")
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
    console.log("switch to register view")
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
    console.log("switch to login view")
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

  function switchToLoggedInView(key) {
    console.log("Switching to logged in view");
    $("#emailInput").hide(key);
    $("#userNameInput").hide(key);
    $("#passwordInput").hide(key);
    $("#userPhoneNumber").hide();
    $("#logOutButton").hide();
    $("#bucketNameInput").show();
    $("#logOutButton").show();
  }

    function logOut() {
    console.log("Logging Out");
    if (cognitoUser != null) {
      cognitoUser.signOut();
      setTimeout(() => {
        toastr.info("signed out");
        switchToLogInView();
        props.closebutt()
        document.getElementById("cognitologin").style.display = "none"
      }, "1000");
    }

  }


  /*
        Starting point for user login flow with input validation
        */
   function logIn() {
    console.log("login called");
    if (!$("#userNameInput").val() || !$("#passwordInput").val()) {
      logMessage("Please enter Username and Password!");
      toastr.error("Please enter Username and Password!");
    } else {
      var authenticationData = {
        Username: $("#userNameInput").val(),
        Password: $("#passwordInput").val(),
      };
      var authenticationDetails =
        new AuthenticationDetails(authenticationData);

      var userData = {
        Username: $("#userNameInput").val(),
        Pool: userPool,
      };
      cognitoUser = new CognitoUser(userData);

      $("#loader").show();
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          var loggedinname= $("#userNameInput").val()
          setmessage("Logged in as " + loggedinname);

          // switchToLoggedInView();
          toastr.info("logged in");
          props.loggy(true)

          idToken = result.getIdToken().getJwtToken();
          getCognitoIdentityCredentials();
          console.log("about to close button")
          props.closebutt();
        },

        onFailure: function (err) {
          logMessage(err.message);
          toastr.error("Error: " + err.message);
          $("#loader").hide();
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
      logMessage("Please fill all the fields!");
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
      logMessage("Please enter verification field!");
    } else {
      $("#loader").show();
      cognitoUser.confirmRegistration(
        $("#verificationCodeInput").val(),
        true,
        function (err, result) {
          if (err) {
            logMessage(err.message);
          } else {
            console.log("Successfully verified code!");
            switchToLogInView();
          }

          $("#loader").hide();
        }
      );
    }
  }

  /*
        User registration using AWS Cognito
        */
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

    var attributeEmail = new CognitoUserAttribute(
      dataEmail
    );

    var attributeEmail2 = new CognitoUserAttribute({
      Name: "phonenumber",
      Value: phoneNumber,
    });

    attributeList.push(attributeEmail);

    console.log("push to userpool signup");

    $("#loader").show();
    userPool.signUp(
      username,
      password,
      attributeList,
      null,
      function (err, result) {
        if (err) {
          logMessage(err.message);
          toastr.error(err.message);
        } else {
          cognitoUser = result.user;
          logMessage("Registration Successful!");
          toastr.success("Registration Successful");
          logMessage("Username is: " + cognitoUser.getUsername());
          toastr.error(
            "Please enter the verification code sent to your Email."
          );
          switchToVerificationCodeView();
        }
        $("#loader").hide();
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

    console.log("login identitypoolid " + identityPoolId + "region" + region);

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: loginMap,
    });

    AWS.config.credentials.clearCachedId();

    AWS.config.credentials.get(function (err) {
      if (err) {
        console.log(err.message);
      } else {
        window.localStorage.setItem(
          "sessionkey",
          AWS.config.credentials.sessionToken
        );
        window.localStorage.setItem("username", cognitoUser.username);
      }

      $("#loader").hide();
    });
  }


  function getCurrentLoggedInSession() {
    $("#loader").show();
    var userPool = new CognitoUserPool(poolData);
    // userPool = "test";
    cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          logMessage(err.message);
        } else {
          logMessage("Session found! Logged in.");
          console.log("session found logged in");
          switchToLoggedInView();
          // setloggedinuser(true)

          idToken = session.getIdToken().getJwtToken();
          getCognitoIdentityCredentials();
        }
        $("#loader").hide();
      });
    } else {
      logMessage("Session expired. Please log in again.");
      console.log("Session expired. Please log in again.");
      $("#loader").hide();
    }
  }

  function logMessage(message) {
    $("#log").append(message + "</br>");
  }

    const handleClick = async (e) => {
    console.log("clicked")
    props.closebutt()
      console.log("display " + props.isopen)
      var mydisplay = display==true ? "inherit" : "none"
    document.getElementById("cognitologin").style.display = mydisplay
  }


  const loginform = (
      <div id="cognitologin">
        <div id={"signinclose"} onClick={()=>{handleClick()}}>X</div>
        <input
          id="emailInput"
          type="text"
          className={'button'}
          placeholder="Email"
          style={{ display: "none" }}
        />
        <input id="userNameInput" type="text" placeholder="Username" className={'button'}/>
        <input id="userPhoneNumber" type="text" placeholder="PhoneNumber" className={'button'}/>
        <input id="passwordInput" type="password" placeholder="Password" className={'button'}/>
        <input
          id="confirmPasswordInput"
          type="password"
          className={'button'}
          placeholder="Confirm Password"
          style={{ display: "none" }}
        />
        <input
          id="verificationCodeInput"
          className={'button'}
          type="text"
          placeholder="Verification Code"
          style={{ display: "none" }}
        />
        <input
          id="logInButton"
          type="text"
          defaultValue="Log In"
          onClick={() => logIn()}
          className={'button'}
        />
        <div><span id="notregisteryet" onClick={() => registerswitch()}>Not registered yet?</span></div>
        <input
          id="registerButton"
          className={'button'}
          type="text"
          style={{ display: "none" }}
          defaultValue="Register"
          onClick={() => register()}
        />
        <input
          id="logOutButton"
          className={'button'}
          type="Button"
          defaultValue="Log Out"
          onClick={() => logOut()}
          style={{ display: "none" }}
        />
        <input
          id="verifyCodeButton"
          type="button"
          className={'button'}
          defaultValue="Verify"
          onClick={() => verifyCode()}
          style={{ display: "none" }}
        />
        <div><span id="backtologin" onClick={() => switchToLogInView()} style={{ display: "none" }}>Back to Login</span></div>
      </div>
  );

  const LogoutButton = (
    <div >
        <Tween from={{ x: '-700px' }} to={{ x: '200px'}}>
    <div id="cognitologin"  >
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

    console.log("cognitouser " + JSON.stringify(cognitoUser));

   if (cognitoUser) {var LoginViewer = LogoutButton} else {var LoginViewer = loginform; sleep(1000);switchToLogInView() }

    return (
      <div >
        {LoginViewer}
        {message}
    </div>
  );
};
export default Cognitosignin;
