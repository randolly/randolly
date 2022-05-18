import React from "react";

// import { postData } from "./lib/api";

// Injects the Facebook SDK into the page
const injectFbSDKScript = () => {
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
};

export const useInitFbSDK = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initializes the SDK once the script has been loaded
  // https://developers.facebook.com/docs/javascript/quickstart/#loading
  window.fbAsyncInit = function () {
    window.FB.init({
      // Find your App ID on https://developers.facebook.com/apps/
      //enter it in a .env file
      appId: process.env.REACT_APP_FB_APP_ID,
      cookie: true,
      xfbml: true,
      version: "v12.0",
    });

    window.FB.AppEvents.logPageView();
    setIsInitialized(true);
  };

  injectFbSDKScript();

  return isInitialized;
};

// const [facebookUserAccessToken, setFacebookUserAccessToken] = useState("");

//   /* --------------------------------------------------------
//    *                      FACEBOOK LOGIN
//    * --------------------------------------------------------
//    */

//   // Check if the user is authenticated with Facebook
//   useEffect(() => {
//     window.FB.getLoginStatus((response) => {
//       setFacebookUserAccessToken(response.authResponse?.accessToken);
//     });
//   }, []);

// export const logInToFB = (data) => {
//   postData("/fb/update", data).then((response) => {
//     if (!response.success) {
//       alert((response.message as string) || response.err);
//       console.log(response);
//     } else {
//       console.log("User cancelled login or did not fully authorize.");
//     }
//   });
// };

// export const logOutOfFB = () => {
//   window.FB.logout(() => {
//     const accesstoken = undefined;
//     return accesstoken;
//   });
// };
// export const getFacebookPages = (accesstoken) => {
//   window.FB.api("me/accounts", { access_token: accesstoken }, (response) => {
//     if (response) {
//       /* handle the result */
//       console.log(response)
//     }
//   });
// };

// export const logInToIg = (data) => {
//   postData("/ig/update", data).then((response) => {
//     if (!response.success) alert((response.message as string) || response.err);
//   });
// };
