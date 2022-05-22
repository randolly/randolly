import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Media,
  Alert,
  ProgressBar,
  Popover,
  OverlayTrigger,
  Button,
  Image,
} from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons/faImage";
import { faSmile } from "@fortawesome/free-regular-svg-icons/faSmile";
import { faCalendar } from "@fortawesome/free-regular-svg-icons/faCalendar";
import { faShareSquare } from "@fortawesome/free-solid-svg-icons/faShareSquare";
import { useSelector, useDispatch } from "react-redux";
import { composePost, selectPostById } from "./postsSlice";
import {
  selectScheduleById,
  composeSchedule,
} from "features/schedule/scheduleSlice";

import QuotedPost from "comps/quoted-post";

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import DOMPurify from "dompurify";
import { filterInput } from "utils/helpers";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";

export default (props) => {
  let location = useLocation();
  let history = useHistory();
  let dispatch = useDispatch();

  let { user } = useSelector((state) => state.auth);
  let quoteId = new URLSearchParams(location.search).get("quote");
  let quotePost = useSelector((state) => selectPostById(state, quoteId));

  let updateId = new URLSearchParams(location.search).get("update");
  let updatePost = useSelector((state) => selectPostById(state, updateId));

  let scheduleId = new URLSearchParams(location.search).get("reschedule");
  let schedulePost = useSelector((state) =>
    selectScheduleById(state, scheduleId)
  );

  const replyId = new URLSearchParams(location.search).get("reply_to");
  let replyPost = useSelector((state) => selectPostById(state, replyId));

  let { compose_status: status } = useSelector((state) => state.posts);

  const socialOptions = [
    {
      name: "Facebook",
    },
    {
      name: "Instagram",
    },
    {
      name: "Twitter",
    },
  ];

  let ta = useRef(null);
  const [height, setHeight] = useState("auto");

  // let initialText = updatePost?updatePost.text : ""
  // let initialText = schedulePost?schedulePost.text : ""
  let initialText;
  if (updatePost) {
    initialText = updatePost.text;
  } else if (schedulePost) {
    initialText = schedulePost.text;
  } else {
    initialText = "";
  }
  const [editor_text, setText] = useState(initialText);
  const [image, setImage] = useState(null);
  const [value, setValue] = useState(new Date());

  const [active, setActive] = useState(false);

  const [error, setError] = useState(null);

  let [progress, setProgress] = useState(10);
  let [SCopen, setSCopen] = useState(false);
  let [CPopen, setCPopen] = useState(false);
  const [preview, setPreview] = useState();
  const [checkedState, setCheckedState] = useState(
    new Array(socialOptions.length).fill(false)
  );

  const [checkedSocials, setCheckedSocials] = useState(null);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!image) {
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    // setProfile(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setImage(e.target.files[0]);
  };

  let SCHandleClose = () => {
    setSCopen(false);
    let currentDate = new Date();
    if (currentDate >= value) {
      setValue(currentDate);
    }
  };
  let CPHandleClose = () => {
    setCPopen(false);
  };
  let SCHandleOpen = () => {
    setSCopen(true);
  };
  let CPHandleOpen = () => {
    setCPopen(true);
  };
  const CPhandleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    // console.log(updatedCheckedState)
    const final = socialOptions.map((obj, index) => ({
      platform: obj.name,
      status: updatedCheckedState[index],
    }));
    setCheckedSocials(final);
    setCheckedState(updatedCheckedState);
  };

  let dirtyProgress = () => {
    if (progress < 90)
      setTimeout(() => {
        setProgress(90);
      }, 200);
    return true;
  };
  const handleClose = () => {
    if (status !== "error" || true) {
      history.goBack();
    }
    // setState to be initial
  };
  let resizeTa = () => {
    if (ta.current) {
      // let height = ta.current.scrollHeight;
      // cur.height = 'auto';
      // cur.height = (cur.scrollHeight) + 'px';
      setHeight("auto");
    }
  };
  useEffect(() => {
    if (ta.current) {
      let height = ta.current.scrollHeight;
      setHeight(height + "px");
    }
  }, [editor_text]);
  useEffect(() => {
    if (ta.current) ta.current.focus();
  }, []);

  let handleChange = (e) => {
    resizeTa();
    let text = e.target.value;
    setText(text);
    setActive(DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim().length > 0);
  };
  let handleSubmit = async (e) => {
    // console.log(image);
    // console.log(editor_text);
    // console.log(image)
    if (image) {
      if (!active) return;
      let text;
      try {
        text = filterInput(editor_text, "html", {
          max_length: 500,
          identifier: "Post",
        });
      } catch (err) {
        return setError(err.message);
      }
      setActive(false);
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "images");
      data.append("cloud_name", "testrando");
      let response = await fetch(
        "https://api.cloudinary.com/v1_1/testrando/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      let dataResponse = await response.json();
      console.log(dataResponse);
      console.log(dataResponse.url);
      let body;
      let schedule = null;
      let currentDate = new Date();
      let timeZone = null;
      if (currentDate <= value) {
        schedule = value;
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
      if (dataResponse.url) {
        body = {
          text: text,
          image: dataResponse.url,
          schedule: schedule,
          timeZone: timeZone,
          socials: checkedSocials,
        };
      }
      let url;
      if (replyId) {
        url = `/api/post/${replyId}/reply`;
      } else if (quotePost) {
        body = {
          ...body,
          is_quote_status: true,
          quoted_status_id: quotePost.id,
          quoted_status_id_str: quotePost.id_str,
          quoted_status: quotePost._id,
        };
      }
      let action = await dispatch(composePost({ body, url }));
      setActive(true);
      if (action.type === "posts/composePost/fulfilled") handleClose();
    } else if (updateId) {
      let url = `/api/post/${updateId}/update`;
      let text;
      try {
        text = filterInput(editor_text, "html", {
          max_length: 500,
          identifier: "Post",
        });
      } catch (err) {
        return setError(err.message);
      }
      let userId = updatePost.user._id;
      let body = {
        ...updatePost,
        text: text,
        userID: userId,
        postID: updatePost._id,
      };
      //  if this doesn't work I will build my own way of posting to the server
      let action = await dispatch(composePost({ body, url }));
      setActive(true);
      if (action.type === "posts/composePost/fulfilled") handleClose();
    } else if (scheduleId) {
      let url = `/api/reschedule/${scheduleId}`;
      let text;
      try {
        text = filterInput(editor_text, "html", {
          max_length: 500,
          identifier: "Post",
        });
      } catch (err) {
        return setError(err.message);
      }
      let userId = schedulePost.user._id;
      let body = {
        ...schedulePost,
        text: text,
        userID: userId,
        postID: schedulePost._id,
      };
      console.log(body);
      //  if this doesn't work I will build my own way of posting to the server
      let action = await dispatch(composeSchedule({ body, url }));
      setActive(true);
      // console.log(action.type)
      if (action.type === "schedules/composePost/fulfilled") handleClose();
      // if(action){
      // handleClose()
      // }
    } else {
      if (!active) return;
      let text;
      try {
        text = filterInput(editor_text, "html", {
          max_length: 500,
          identifier: "Post",
        });
      } catch (err) {
        return setError(err.message);
      }
      setActive(false);
      let schedule = null;
      let currentDate = new Date();
      let timeZone = null;
      if (currentDate <= value) {
        schedule = value;
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
      let body = {
        text: text,
        schedule: schedule,
        timeZone: timeZone,
        socials: checkedSocials,
      };
      let url;
      // if replying or "retweeting"
      if (replyId) {
        url = `/api/post/${replyId}/reply`;
      } else if (quotePost) {
        body = {
          ...body,
          is_quote_status: true,
          quoted_status_id: quotePost.id,
          quoted_status_id_str: quotePost.id_str,
          quoted_status: quotePost._id,
        };
      }

      let action = await dispatch(composePost({ body, url }));
      setActive(true);

      if (action.type === "posts/composePost/fulfilled") handleClose();
    }
  };
  let addEmoji = (emoji) => {
    setText((text) => text + emoji.native);
  };
  const picker = (
    <Popover id="popover-basic">
      <Picker
        onSelect={addEmoji}
        color="#e9240f"
        sheetSize={32}
        emoji="point_up"
        title="Pick your emoji"
        set="twitter"
      />
    </Popover>
  );

  return (
    <>
      <Modal
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
              {replyId ? "Post your reply" : "Compose post"}
            </small>
          </Modal.Title>
        </Modal.Header>
        {status === "pending" && dirtyProgress() && (
          <ProgressBar className="rounded-0" now={progress} />
        )}
        {status === "error" && (
          <Alert variant="danger" className="font-weight-bold text-white">
            Error submiting post, try again!
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="font-weight-bold text-white">
            {error}
          </Alert>
        )}
        <Modal.Body className="pt-1 pb-0">
          <Media className="h-100 w-100">
            <img
              className="rounded-circle"
              src={
                user.default_profile_image
                  ? "/img/default-profile-vector.svg"
                  : user.profile_image_url_https
              }
              alt=""
              width={50}
              height={50}
            />
            <Media.Body className="h-100 w-50" style={{ minHeight: "175px" }}>
              <textarea
                ref={ta}
                className="w-100 p-2 pb-5"
                style={{
                  height,
                }}
                name="text"
                onChange={handleChange}
                value={editor_text}
                placeholder="What's happening?"
              ></textarea>

              <Image fluid rounded={true} src={preview} alt="" />
              <QuotedPost
                className="mb-2 mt-n5"
                post={replyPost || quotePost}
              />
            </Media.Body>
          </Media>
        </Modal.Body>
        <Modal.Footer className="py-1">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <div style={{ fontSize: "1.5em" }}>
              <OverlayTrigger
                rootClose={true}
                trigger="click"
                placement="auto-start"
                overlay={picker}
              >
                <button className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                  <FontAwesomeIcon
                    size="lg"
                    icon={faSmile}
                    className="mb-1 text-muted"
                  />
                </button>
              </OverlayTrigger>
              <div className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                <input
                  onChange={onSelectFile}
                  type="file"
                  id="file1"
                  class="file1"
                  style={{ display: "none" }}
                />
                <label for="file1">
                  <FontAwesomeIcon
                    size="lg"
                    icon={faImage}
                    className="mb-1 text-muted"
                  />
                </label>
              </div>
              <div
                className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2"
                onClick={SCHandleOpen}
              >
                <FontAwesomeIcon
                  size="lg"
                  icon={faCalendar}
                  className="mb-1 text-muted"
                />
              </div>
              <div
                className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2"
                onClick={CPHandleOpen}
              >
                <FontAwesomeIcon
                  size="lg"
                  icon={faShareSquare}
                  className="mb-1 text-muted"
                />

                {/* <FontAwesomeIcon size="lg" icon="fa-solid fa-share-nodes" /> */}
              </div>
            </div>
            <div className="right">
              <button
                onClick={handleSubmit}
                disabled={!active}
                className="btn btn-primary rounded-pill px-3 py-2 font-weight-bold"
              >
                Post
              </button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        enforceFocus={false}
        show={SCopen}
        onHide={SCHandleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Schedule post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="choose date or time"
              value={value}
              onChange={(newValue) => {
                console.log(newValue);
                setValue(newValue);
              }}
            />
          </LocalizationProvider>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={SCHandleClose} variant="primary">
            Schedule
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        enforceFocus={false}
        show={CPopen}
        onHide={CPHandleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose where to post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="options-list">
            {socialOptions.map(({ name }, index) => {
              return (
                <li key={index}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${index}`}
                      class="form-check-input"
                      name={name}
                      value={name}
                      checked={checkedState[index]}
                      onChange={() => CPhandleOnChange(index)}
                    />
                    <label
                      class="form-check-label"
                      htmlFor={`custom-checkbox-${index}`}
                    >
                      {name}
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={CPHandleClose} variant="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
