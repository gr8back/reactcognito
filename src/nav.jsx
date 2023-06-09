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
import "./toastr2.css";
import gsap from 'gsap'
import { Tween } from "react-gsap";
import { region, userPoolId, clientId, identityPoolId } from "./myvars";
import useMediaQuery from "./mediaquery";

export default () => {
  const [css, setcss] = useState(false);
  const [showloginform, setshowloginform] = useState(false);
  const [showverifyform, setshowverifyform] = useState(false);
  const [showemailchangeform, setshowemailchangeform] = useState(false);

  var cognitoUser;
  var idToken;
  var LoginViewer;
 const isDesktop = useMediaQuery('(max-width: 500px)');

  var poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
  };

  const userPool = new CognitoUserPool(poolData);

  if (!cognitoUser) {
    getCurrentLoggedInSession();
  }

  // useEffect(() => {
  //   getCognitoIdentityCredentials();
  // }, []);

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function switchToVerificationCodeView() {
    $("#emailInput").hide();
    $("#userNameInput").show();
    $("#passwordInput").hide();
    $("#confirmPasswordInput").hide();
    $("#logInButton").hide();
    $("#registerButton").hide();
    $("#bucketNameInput").hide();
    $("#verificationCodeInput").show();
    $("#forgotpassword").hide();
    $("#verifyCodeButton").show();
    $("#notregisteryet").hide();
    $("#verify").show();
    $("#resendverifycode").show();
    $("#logOutButton").hide();
  }

  function switchToRegisterView() {
    $("#userNameInput").val("");
    $("#passwordInput").val("");
    $("#emailInput").show();
    $("#userNameInput").show();
    $("#passwordInput").show();
    $("#confirmPasswordInput").show();
    $("#registerButton").show();
    $("#logInButton").hide();
    $("#notregisteryet").hide();
    $("#userPhoneNumber").show();
    $("#verificationCodeInput").hide();
    $("#backtologin").show();
    $("#verifyCodeButton").hide();
    $("#logOutButton").hide();
    $("#forgotpassword").hide();
  }

  function switchToLogInView() {
    $("#userNameInput").val("");
    $("#passwordInput").val("");
    $("#emailInput").hide();
    $("#userNameInput").show();
    $("#backtologin").hide();
    $("#passwordInput").show();
    $("#userPhoneNumber").hide();
    $("#notregisteryet").show();
    $("#forgotpassword").show();
    $("#confirmPasswordInput").hide();
    $("#resetpassword").hide();
    $("#logInButton").show();
    $("#resendverifycode").show();
    $("#changeemail").toggle();
    $("#registerButton").hide();
    $("#verificationCodeInput").hide();
    $("#verifyCodeButton").hide();
    $("#logOutButton").hide();
  }

  function switchToLoggedInView() {
    $("#emailInput").hide();
    $("#userNameInput").hide();
    $("#passwordInput").hide();
    $("#userPhoneNumber").hide();
    $("#logOutButton").hide();
    $("#logOutButton").show();
  }

  function switchToNewPasswordInput() {
    $("#passwordInput").val("");
    $("#emailInput").hide();
    $("#userNameInput").show();
    $("#passwordInput").show();
    $("#userPhoneNumber").hide();
    $("#logOutButton").hide();
    $("#verificationCodeInput").show();
    $("#confirmPasswordInput").show();
    $("#logOutButton").hide();
    $("#logInButton").hide();
    $("#notregisteryet").hide();
    $("#forgotpassword").hide();
    $("#resetpassword").show();
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
        id="verificationCodeInput"
        className={"button"}
        type="text"
        placeholder="Verification Code"
        style={{ display: "none" }}
      />
      <input
        id="verifyCodeButton"
        type="text"
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
      <div>
        <span
          id="verify"
          style={{ display: "none" }}
          onClick={() => switchToVerificationCodeView()}
        >
          Not verified yet?
        </span>
      </div>
      <div>
        <span id="forgotpassword" onClick={() => forgotPassword()}>
          Forgot Password?
        </span>
      </div>
      <div>
        <span
          id="resetpassword"
          style={{ display: "none" }}
          onClick={() => forgotPasswordReset()}
        >
          Reset Password
        </span>
      </div>
    </div>
  );

  function logOut() {
    if (cognitoUser != null) {
      cognitoUser.signOut();
      setTimeout(() => {
        toastr.info("signed out");
        switchToLogInView();
        setcss(false);
        setshowloginform(!showloginform);
        document.getElementById("cognitologin").style.display = "none";
      }, "1000");
    }
  }

  function logIn() {
    console.log("login called");
    if (cognitoUser) {
      cognitoUser.signOut();
    }
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
          toastr.info("logged in");
          setcss(false);
          getCognitoIdentityCredentials();
          handleClick();
        },

        onFailure: function (err) {
          toastr.error("Error: " + err.message);
          $("#resendverifycode").show();
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

  function forgotPassword() {
    if ($("#userNameInput").val()) {
      let cognitoUser = new CognitoUser({
        Username: $("#userNameInput").val(),
        Pool: userPool,
      });

      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          toastr.success("Verification Code sent");
          switchToNewPasswordInput();
        },
        onFailure: function (err) {
          toastr.error("failed to reset password" + err);
          switchToLogInView();
        },
        inputVerificationCode: function (data) {
          toastr.info("input code " + JSON.stringify(data));
          switchToNewPasswordInput();
        },
      });
    } else {
      toastr.error("Please input your username");
    }
  }

  function forgotPasswordReset() {
    try {
      let cognitoUser = new CognitoUser({
        Username: $("#userNameInput").val(),
        Pool: userPool,
      });
      cognitoUser.confirmPassword(
        $("#verificationCodeInput").val(),
        $("#confirmPasswordInput").val(),
        {
          onSuccess: function (result) {
            toastr.info("successful password reset" + JSON.stringify(result));
            switchToLogInView();
          },
          onFailure: function (err) {
            toastr.error("failed to reset password" + err);
            switchToLogInView();
          },
        }
      );
    } catch (e) {
      toastr.error("No cognito user found " + e)
    }
  }
  /*
        Starting point for user verification using AWS Cognito with input validation
        */
  function verifyCode() {
    console.log("verify code reached ");
    if (!$("#verificationCodeInput").val()) {
      toastr.error("Please enter verification code!");
    } else {
      if (cognitoUser) {
        cognitoUser.confirmRegistration(
          $("#verificationCodeInput").val(),
          true,
          function (err, result) {
            if (err) {
              toastr.error(err.message);
              setshowverifyform(!showverifyform)
            } else {
              setshowverifyform(!showverifyform)
              switchToLogInView();
            }
          }
        );
      } else {
        try {
          let cognitoUser = new CognitoUser({
            Username: $("#userNameInput").val(),
            Pool: userPool,
          });

          cognitoUser.confirmRegistration(
            $("#verificationCodeInput").val(),
            true,
            function (err, result) {
              if (err) {
                toastr.error("error confirmregistration " + err);
              } else {
                toastr.info("Successfully verified code!");
                switchToLogInView();
              }
            }
          );
        } catch (e) {
          console.log("error " + e);
        }
      }
    }
  }

  function registerUser(email, username, password, phoneNumber) {
    var attributeList = [];

    var dataEmail = {
      Name: "email",
      Value: email,
    };

    sessionStorage.setItem("phonenumber ", $("#userPhoneNumber").val());

    var attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    console.log("push to userpool signup");

    userPool.signUp(
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

  function changephonefunction(email, username, password, phoneNumber) {

    var dataEmail = {
      Name: $("#userNameInput").val(),
      Value: $("#emailInputslider").val(),
    };

    var attributes = new CognitoUserAttribute(dataEmail);

    if (cognitoUser) {
      const cogattributes = [
        new CognitoUserAttribute({
          Name: "phone_number",
          Value: $("#emailInputslider").val(),
        }),
      ];
      cognitoUser.updateAttributes(cogattributes, (err, results) => {
        if (err) console.error(err);
        console.log(results);
      });
    } else if ($("#userNameInput").val()) {
      let cognitoUser = new CognitoUser({
        Username: $("#userNameInput").val(),
        Pool: userPool,
      });
      cognitoUser.updateAttributes(attributes, (err, results) => {
        if (err) console.error(err);
        console.log(results);
      });
    } else {
      toastr.info("Please log in first");
    }
  }

  function resendCognitoVerifyCode() {
    const userData = {
      Username: cognitoUser.username,
      Pool: userPool,
    };
    const cognitoUserResend = new CognitoUser(userData);
    cognitoUserResend.resendConfirmationCode(function (err, result) {
      // reject promise if confirmation code failed
      if (err) {
        console.log(err);
        return;
      }
      toastr.info("resend verification successful");
      setshowverifyform(!showverifyform);
    });
  }

  /*
        This method will get temporary credentials for AWS using the IdentityPoolId and the Id Token recieved from AWS Cognito authentication provider.
        */
  function getCognitoIdentityCredentials() {
    AWS.config.region = region;

    var loginMap = {};
    loginMap["cognito-idp." + region + ".amazonaws.com/" + userPoolId] =
      idToken;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: loginMap,
    });

    AWS.config.credentials.clearCachedId();

    //if ()

    AWS.config.credentials.get(function (err) {
      if (err) {
        console.log(err.message);
      } else {
        setcss(false);

        window.localStorage.setItem(
          "sessionkey",
          AWS.config.credentials.sessionToken
        );
      }
    });
  }


  const LogoutButton = (
    <div id={"logoutdiv"}>
      <Tween
        from={{ x: "-700px", y: "200" }}
        to={{ x: "80%", y: "-100" }}
        duration={"2"}
      >
        <div id="cognitologin">
          <div
            id={"xclose"}
            onClick={() => {
              handleClicklogout();
            }}
          >
            X
          </div>
          <div>Logged In as {cognitoUser && cognitoUser.username}</div>
          <div
            className={"btn"}
            defaultValue="Log Out"
            onClick={() => logOut()}
          >
            Logout
          </div>
        </div>
      </Tween>
    </div>
  );

    const LogoutMobile = (
    <div id={"logoutdiv"}>
      <Tween
        from={{ x: "-300px", y: "200" }}
        to={{ x: "10px", y: "-100" }}
        duration={"1"}
      >
        <div id="cognitologin">
          <div
            id={"xclose"}
            onClick={() => {
              handleClicklogout();
            }}
          >
            X
          </div>
          <div>Logged In as {cognitoUser && cognitoUser.username}</div>
          <div
            className={"btn"}
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
    cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          toastr.error(err.message);
        } else {
          switchToLoggedInView();
          getCognitoIdentityCredentials();
        }
      });
    }
  }

  const handleClicklogout = async (e) => {
    setcss(!css);
    setshowloginform(!showloginform);
  };

  const handleSignInBox = async (e) => {
    setshowloginform(!showloginform);
    setcss(!css);
    $("#slideout").toggleClass("on");
    switchToLogInView();
  };

  const handleClick = async (e) => {
    setshowloginform(!showloginform);
    setcss(!css);
    switchToLogInView();
  };

  const handleslideClick = async (e) => {
    $("#slideout").toggleClass("on");
  };

  const verifyhtml = (
    <div id={"verifyhtmlinput"}>
      <input
        id="verificationCodeInput"
        className={"button"}
        type="text"
        placeholder="Verification Code"
      />
      <input
        id="verifyCodeButton"
        type="text"
        className={"button"}
        defaultValue="Verify"
        onClick={() => verifyCode()}
      />
    </div>
  );

  const phonechangehtml = (
    <div>
      <input
        id="emailInputslider"
        type="text"
        className={"button"}
        placeholder="Enter New Phone Number In this format : +14325551212"
        style={{ display: "block" }}
      />
      <div
        id="changeemailfunction"
        className={"btn"}
        onClick={() => changephonefunction()}
        type="text"
      >
        Confirm New Phone Number
      </div>
    </div>
  );

  var handleChangePhone = async (e) => {
    setshowemailchangeform(!showemailchangeform);
  };

  if (cognitoUser) {
     {isDesktop ? LoginViewer =LogoutButton : LoginViewer =LogoutMobile}
  } else {
    LoginViewer = loginform;
    sleep(1000);
  }

  return (
    <nav>
      {showloginform && <div id={"cognitoparent"}>{LoginViewer}</div>}
      {css && (
        <style>{`
        #container > * {
           filter: blur(20px);
        }
      `}</style>
      )}

      <div
        id="slidebutton"
        onClick={() => handleslideClick()}
        className="btn btn-default"
      >
        <i
          className="large material-icons prefix accounticon"
          id={"accountcircle"}
        >
          account_circle
        </i>
      </div>

      <div id="slideout">
        <div id={"slideform"}>
          <div>Account Details</div>
          <div>
            {cognitoUser
              ? cognitoUser.username
              : "Please Log In to view account details"}
          </div>
          {cognitoUser && (
            <div>
              <input
                className="btn btn-primary"
                type="submit"
                onClick={() => handleChangePhone()}
                value="Change Phone Number"
              ></input>
              <div>
                <span
                  id="resendverifycode"
                  className="btn btn-primary"
                  onClick={() => resendCognitoVerifyCode()}
                >
                  Resend verify code?
                </span>
              </div>
              <div
                onClick={() => handleSignInBox()}
                className="waves-effect waves-light btn"
              >
                <span>Logout
                <i id="logoutmaterial" className="large material-icons">
                  check_circle
                </i>
                </span>
              </div>
              {showemailchangeform && phonechangehtml}
              {showverifyform && verifyhtml}
            </div>
          )}
        </div>
      </div>

      <div id="nav-wrapper">
        {cognitoUser ? (
          <div>
            <div id={"loggedinasaccount"}>
              Logged In as {cognitoUser.username}
            </div>
          </div>
        ) : (
          <div>
            <div className={'btn btn-default'} onClick={() => handleClick()}>Sign In</div>
          </div>
        )}
      </div>

    </nav>
  );
};
