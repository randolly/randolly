// Whatever you do on this file you should try and do the same for ./compose-modal
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons/faImage";
import { faSmile } from "@fortawesome/free-regular-svg-icons/faSmile";
import { faCalendar } from "@fortawesome/free-regular-svg-icons/faCalendar";
import { connect } from "react-redux";
import { composePost } from "features/posts/postsSlice";
import { withRouter, Link } from "react-router-dom";

import { Media, Modal, Button } from "react-bootstrap";
import { AlertsContext } from "features/alerts/alertsContext";
// import {postDataWithFile} from 'api'

import DOMPurify from "dompurify";
import { filterInput } from "utils/helpers";
// import * as React from 'react';
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";

// export default function BasicDateTimePicker() {
//   const [value, setValue] = React.useState(new Date());

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <DateTimePicker
//         renderInput={(props) => <TextField {...props} />}
//         label="DateTimePicker"
//         value={value}
//         onChange={(newValue) => {
//           setValue(newValue);
//         }}
//       />
//     </LocalizationProvider>
//   );
// }

class Compose extends React.Component {
  static contextType = AlertsContext;
  // const [image, set_image] = useState<FileList | null>(null);
  state = {
    editor_text: "",
    image: "",
    active: false,
    pending: false,
    url: "",
    value: new Date(),
    SCopen: false,
  };
  handleChange(e) {
    let ta = e.target;
    if (!this.ta) this.ta = ta;
    let text = ta.value;
    this.setState({
      editor_text: text,
      active: this.isValid(text),
    });
    this.resizeTa();
  }
  isValid(text = "") {
    return Boolean(
      // come back and change sign orriginally like this >
      DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim().length > 0
    );
  }
  handleChange = this.handleChange.bind(this);
  SCHandleClose = () => {
    this.setState({ SCopen: false });
    let currentDate = new Date();
    if (currentDate >= this.state.value) {
      this.setState({
        value: currentDate,
      });
    }
  };
  SCHandleOpen = () => {
    this.setState({ SCopen: true });
  };

  //  this is the handle submit function, so what we want to do is say if there is an image do something else do the original thing that was already here.
  handleSubmit = async (e) => {
    // this.fetchUrl()

    console.log(this.state);
    if (this.state.image) {
      if (!this.state.active) return;
      let text = this.state.editor_text.trim();
      try {
        text = filterInput(this.state.editor_text, "html", {
          max_length: 500,
          identifier: "Post",
        });
      } catch (err) {
        return alert(err.message);
      }
      this.setState({ active: false });
      const data = new FormData();
      data.append("file", this.state.image);
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
      let schedule = null;
      let currentDate = new Date();
      let timeZone = null;
      if (currentDate <= this.state.value) {
        schedule = this.state.value;
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
      if (dataResponse.url) {
        let body = {
          text: text,
          image: dataResponse.url,
          schedule: schedule,
          timeZone: timeZone,
        };
        console.log("posting:  " + body);
        await this.props.composePost({ body });
        this.setState({
          editor_text: "",
          image: "",
          active: false,
          pending: false,
          url: "",
          value: new Date(),
          SCopen: false,
        });
        this.resizeTa();
        let {
          posts: { compose_status },
        } = this.props;
        if (compose_status === "error") {
          alert("Post could not be submitted, try again");
        } else {
          this.context.ensureNotifPermission();
        }
      }
    } else {
      if (!this.state.active) return;
      let text = this.state.editor_text.trim();
      try {
        text = filterInput(this.state.editor_text, "html", {
          max_length: 500,
          identifier: "Post",
        });
      } catch (err) {
        return alert(err.message);
      }
      this.setState({ active: false });
      let schedule = null;
      let currentDate = new Date();
      let timeZone = null;
      if (currentDate <= this.state.value) {
        schedule = this.state.value;
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
      let body = {
        text: text,
        schedule: schedule,
        timeZone: timeZone,
      };
      await this.props.composePost({ body });
      this.setState({
        editor_text: "",
        image: "",
        active: false,
        pending: false,
        url: "",
        value: new Date(),
        SCopen: false,
      });
      this.resizeTa();
      let {
        posts: { compose_status },
      } = this.props;
      if (compose_status === "error") {
        // alert('Post could not be submitted, try again')
        console.warn("Post could not be submitted, try again");
      } else {
        this.context.ensureNotifPermission();
      }
    }
    this.setState({
      editor_text: "",
      image: "",
      active: false,
      pending: false,
      url: "",
      value: new Date(),
      SCopen: false,
    });
  };
  resizeTa() {
    // for auto resizing of text area
    if (this.ta) {
      this.ta.style.height = "auto";
      this.ta.style.height = this.ta.scrollHeight + "px";
    }
  }
  render() {
    let { auth, className } = this.props;
    let { user } = auth;
    return (
      <div className={"p-2 " + className}>
        <Media>
          <Link className="rounded-circle" to={`/user/${user.screen_name}`}>
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
          </Link>
          <Media.Body>
            <Link to="/compose/post">
              <textarea
                className="w-100 p-2"
                style={{ maxHeight: "80vh" }}
                name="text"
                onChange={this.handleChange}
                onKeyPress={this.handleLine}
                value={this.state.editor_text}
                placeholder="What's happening?"
              ></textarea>
              {/* <img src={this.state.image[0]} alt="show picture" ></img> */}

              <div className="border-top d-flex justify-content-between align-items-center pt-2">
                <div style={{ fontSize: "1.5em" }}>
                  <Link
                    className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2"
                    to="/compose/post"
                  >
                    <FontAwesomeIcon
                      size="lg"
                      icon={faSmile}
                      className="mb-1 text-muted"
                    />
                  </Link>

                  {/* onclick this button to get image */}

                  <div className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                    <input
                      onChange={(e) => {
                        this.setState({ image: e.target.files[0] });
                        console.log(e?.target?.files);
                      }}
                      type="file"
                      id="file"
                      class="file"
                      style={{ display: "none" }}
                    />
                    <label for="file">
                      <FontAwesomeIcon
                        size="lg"
                        icon={faImage}
                        className="mb-1 text-muted"
                      />
                    </label>
                  </div>
                  <div
                    className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2"
                    onClick={this.SCHandleOpen}
                  >
                    <FontAwesomeIcon
                      size="lg"
                      icon={faCalendar}
                      className="mb-1 text-muted"
                    />
                  </div>
                </div>
                <div className="right">
                  <button
                    onClick={this.handleSubmit}
                    disabled={!this.state.active}
                    className="btn btn-primary rounded-pill px-3 py-2 font-weight-bold"
                  >
                    Post
                  </button>
                </div>
              </div>
            </Link>
          </Media.Body>
        </Media>
        <Modal
          enforceFocus={false}
          show={this.state.SCopen}
          onHide={this.SCHandleClose}
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
                value={this.state.value}
                onChange={(newValue) => {
                  console.log(newValue);
                  this.setState({ value: newValue });
                }}
              />
            </LocalizationProvider>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.SCHandleClose} variant="primary">
              Schedule
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
// export default connect(state => state, { composePost })(withRouter(Compose))
export default connect((state) => state, { composePost })(withRouter(Compose));
