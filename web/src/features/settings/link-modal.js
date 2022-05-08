// copy profile modal
// updateUserDetails - linkUserAccounts
import React from "react";
import { useState } from "react";
import {
  Modal,
  Form,
  Alert,
  ProgressBar,
  Button,
} from "react-bootstrap";
// import {TextField} from "@material-ui/core";
import { useHistory } from "react-router-dom";
// import { filterInput } from "utils/helpers";
import {
  FacebookLoginButton,
  TwitterLoginButton,
  InstagramLoginButton,
  LinkedInLoginButton,
} from "react-social-login-buttons";
import { firebaseConfig } from "../../firebase";
import { useInitFbSDK } from "./link/signup";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  TwitterAuthProvider
} from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { updateIg, updateTw, updateFb } from 'features/users/usersSlice'
// import {FacebookLogin } from "react-facebook-login";        
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'



export default (props) => {
    let history = useHistory()
    let dispatch = useDispatch()
    let { user } = useSelector(state => state.auth)
    let { user_link_accounts_status: status } = useSelector(state => state.users)
    // var pages;
 

  
  const isFbSDKInitialized = useInitFbSDK();
  console.log(isFbSDKInitialized);
  const [Igopen, setIgOpen] = useState(false);
  const [Fbopen, setFbOpen] = useState(false);
  const [password, set_password] = useState();
  const [username, set_username] = useState();
  const [loading, set_loading] = useState(false);
  
  // linked or not
  const linkedFb = user.facebook.llToken || user.facebook.token?"linked Facebook":"Link Facebook";
  const linkedIg = user.instagram.username || user.instagram.password?"linked Instagram":"Link Instagram";
  const linkedTw = user.twitter.access_token || user.twitter.access_token_secret?"linked Twitter":"Link Twitter";
  // const linkedLi = user.linkedin || user.linkedin?"linked Facebook":"Link Facebook";


  const [pages, setPages] = useState(null);
  // const [data2, setData2] = useState({});

  let [error, setError] = useState(null);
  let [progress, setProgress] = useState(10)

  let dirtyProgress = () => {
    if (progress < 90)
        setTimeout(() => { setProgress(90) }, 250)
    return true
}
  const redirected = new URLSearchParams(history.location.search).get(
    "redirected"
  );

  const handleClose = () => {
    if (status !== 'error' && !error) {
      if (redirected === 'true')
          history.push('/home')
      else
          history.goBack();
  }
    // if (redirected === "true") {
    //   history.push("/home");
    // } else {
    //   history.goBack();
    // }
  };
  const handleSubmit = async () => {
    setError(null)
    //     try {
    //         let body = {
    //           fb_token: fbUserAccessToken,
    //           fb_pageId: pageId,
    //           fb_pageAccessToken: fbPageAccessToken,
    //           ig_username: username,
    //           ig_password: password,
    //         }
    //         console.log(body)
    //         let action = await dispatch(linkUserAccounts(body))
    //         if (action.type === 'users/linkUserAccounts/fulfilled') {

                handleClose()
        //     }
        // } catch (err) {
        //     setError(err.message)
        // }
  };


  //   /* --------------------------------------------------------
//    *                      INSTAGRAM
//    * --------------------------------------------------------
//    */
  const IgSubmit = () => {
    if (username === null || password === null) {
      alert("please fill all form");
      return;
    }
    set_loading(true);
    set_username(username);
    set_password(password);
let body ={ 
username: username,
password: password,
}
dispatch(updateIg(body))
    set_loading(false);
    IgHandleClose();
  };
  const IgHandleClickOpen = () => {
    setIgOpen(true);
  };
  const IgHandleClose = () => {

    setIgOpen(false);
  };
  //   /* --------------------------------------------------------
//    *                      FACEBOOK
//    * --------------------------------------------------------
//    */
  const FbHandleClickOpen = () => {
    // if (fbUserAccessToken !== null || fbUserAccessToken !== undefined) {
      setFbOpen(true);
    // }
  };
  const FbHandleClose = () => {
    setFbOpen(false);
    // let data = {
    //   token: fbUserAccessToken,
    //   pageId: pageId,
    //   pageAccessToken: fbPageAccessToken,
    // };
    // dispatch(updateFb(data))
  };
  const getFacebookPages = (accesstoken) => {
    window.FB.api(
      "me/accounts",
      { access_token: accesstoken },
      (response) => {
        let pages1 = response.data;
        console.log(pages1)
        setPages(pages1)
        if (pages !== undefined ){
        FbHandleClickOpen()
        }
      }
    );
  };
  // // Checks if the user is logged in to Facebook
  // React.useEffect(() => {
  //   if (isFbSDKInitialized) {
  //     window.FB.getLoginStatus((response) => {
  //       const accesstoken = response.authResponse?.accessToken;
  //       // setFbUserAccessToken(accesstoken);
  //       // console.log(accesstoken);
  //       // getFacebookPages(accesstoken);
  //       // getFacebookPages();
  //     });
  //   }
  // }, [isFbSDKInitialized]);

  // console.log(pages);
  // // console.log(pages.map((data, index) => data.name));

  // const FbPopUp = () => {
  //   try {
  //   window.FB.login((response) => {
  //     if (response.authResponse) {
  //       const accesstoken = response.authResponse?.accessToken;
  //       setFbUserAccessToken(accesstoken);
  //       // console.log(accesstoken);
        
  //       // getFacebookPages(fbUserAccessToken);
  //       getFacebookPages();
  //       FbHandleClickOpen();
  //     } else {
  //       console.log("User cancelled login or did not fully authorize.");
  //     }
  //   });
  // } catch (err) {
  //   console.log("User cancelled login or did not fully authorize.  😦");
  // }
  // };
   const responseFacebook = (response) => {
    console.log(response);
    // console.log(response.accessToken)

    const accesstoken = response.authResponse?.accessToken;
    // const userID = response.authResponse?.userID
        // setFbUserAccessToken(accesstoken);
        console.log(accesstoken)
        // const updatedValue = {
        //   token: response.authResponse?.accessToken,
        // }
        // setData2({
        //  ...data2,
        //  ...updatedValue
        // })
        getFacebookPages(accesstoken);
  }


  const setFbData = (data) => {
    console.log(data)
    const pageId = data.id;
    const fbPageAccessToken = data.access_token;
    // setPageId(pageId);
    // setFbPageAccessToken(fbPageAccessToken);
      // token: fbUserAccessToken,
    // logInToFB(logindata);
    // console.log(data2)
    console.log(window.FB.getAccessToken())
    // console.log(fb_token)
    // var rtoken = fbUserAccessToken ? (fbUserAccessToken):(fb_token)

    let data1 = {
      token: window.FB.getAccessToken(),
      pageId: pageId,
      // userId: window.FB.getUserID(),
      pageAccessToken: fbPageAccessToken,
    };
    // console.log(accesstoken)
    console.log(data1)
    dispatch(updateFb(data1))
    
    FbHandleClose();
  };
 

  //   /* --------------------------------------------------------
//    *                      TWITTER
//    * --------------------------------------------------------
//    */
const LogInToTw = () => {

  initializeApp(firebaseConfig);

  const provider = new TwitterAuthProvider();
  const auth = getAuth();
  // const auth = app;
  // let { user } = useSelector(state => state.auth)
  // let dispatch = useDispatch()


  signInWithPopup(auth, provider).then((result) => {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;
      let data = {
        access_token: token,
        access_token_secret: secret,
      };
    // console.log("updating twitter for")
        dispatch(updateTw(data))
      

      // The signed-in user info.
      // const user = result.user;
      // console.log(user);
      // ...
    }).catch((error) => {
      console.log(error);
      // setError(error.message)
      // ...
    });
};

 //   /* --------------------------------------------------------
//    *                      LinkedIn
//    * --------------------------------------------------------
//    */

  return (
    <>
      <Modal
        enforceFocus={false}
        className="p-0"
        size="lg"
        scrollable={true}
        show={true}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>
            <small className="font-weight-bold">
              {!redirected ? "link social accounts" : "link accounts"}{" "}
            </small>
          </Modal.Title>
        </Modal.Header>

            {status === 'pending' && (
                dirtyProgress() &&
                <ProgressBar className="rounded-0" now={progress} />
            )}
            {status === "error" && (
                <Alert variant="danger" className="mb-0 font-weight-bold text-white">
                    Error updating details, try again!
                </Alert>
            )}
            {error && (
                <Alert variant="danger" className="mb-0 font-weight-bold text-white">
                    {error}
                </Alert>
            )}
        <Modal.Body className="pt-1 pb-0 px-0">
          {/* <FacebookLoginButton onClick={FbPopUp}>
            <span>Link Facebook</span>
          </FacebookLoginButton> */}
          <FacebookLogin
    appId={process.env.REACT_APP_FB_APP_ID}
    isMobile={true}
    redirectUri={"https://test-rando1.herokuapp.com/"}
    disableMobileRedirect={true}
    autoLoad={false}
    callback={responseFacebook}
    render={renderProps => (<FacebookLoginButton onClick={renderProps.onClick} >
            <span>{linkedFb}</span>
          </FacebookLoginButton>)}/>
          <TwitterLoginButton onClick={LogInToTw}>
            <span>{linkedTw}</span>
          </TwitterLoginButton>
          <InstagramLoginButton onClick={IgHandleClickOpen}>
            <span>{linkedIg}</span>
          </InstagramLoginButton>

          <LinkedInLoginButton onClick={() => alert("Not yet implemented")}>
            <span>Link LinkedIn</span>
          </LinkedInLoginButton>
        </Modal.Body>
        <Modal.Footer className="py-1">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <div></div>
            <div className="right">
              <button
                disabled={status === 'pending'}
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary rounded-pill px-3 py-1 font-weight-bold"
              >
                Save
              </button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      {/* Dialogs */}

      <Modal
        enforceFocus={false}
        show={Fbopen}
        onHide={FbHandleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>choose a page</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pages ? (
            pages.map((data, index) => (
            <div>
              <button onClick={() => setFbData(data)} className="btn confirm-btn">
                {data.name}{" "}
              </button>
              <br />
            </div>
          ))
          ) : (
            <div>Loading Pages</div>
          )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={FbHandleClose} variant="primary">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        enforceFocus={false}
        show={Igopen}
        onHide={IgHandleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>login to Instagram</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={(e) => {
                  set_username(e.target.value);
                }}
                value={username}
                type="text"
                name="username"
                autoCapitalize="off"
                ii
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-0" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={(e) => {
                  set_password(e.target.value);
                }}
                value={password}
                autoCorrect="off"
                type="password"
                name="password"
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={IgHandleClose} variant="primary">
            Cancel
          </Button>
          <Button onClick={IgSubmit} variant="primary">
            {loading ? "Loading..." : "Post"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
