// copied from "./PostsList.js"
import React from "react";
import { useEffect, useCallback } from "react";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";
import { Media, Row, ListGroup, Figure, Dropdown } from "react-bootstrap";
import MultiMedia from "comps/MultiMedia";
import Spinner from "comps/Spinner";
import ReactionsBar from "features/posts/ReactionsBar";
import PostText from "comps/PostText";
import QuotedPost from "comps/quoted-post";
import UserLink from "comps/user-link";
import PostTag from "comps/post-tag";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons/faEllipsisH";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteSchedule } from 'features/schedule/scheduleSlice';
import { useDispatch } from 'react-redux'

import { useBottomScrollListener } from "react-bottom-scroll-listener";
import TryAgain from "./TryAgain";

export default function PostsList(props) {
  let dispatch = useDispatch()
  let { posts = [], status, getPosts } = props;
  useEffect(
    useCallback(() => {
      if ((status === "idle" || status === "done") && !posts.length) {
        getPosts();
        console.log("fetching on posts load, status:", status);
      }
    }, [status, posts, getPosts]),
    [getPosts]
  );
  useBottomScrollListener(
    useCallback(() => {
      if (status === "idle" && posts.length) {
        getPosts();
        console.log("loading more posts, status:", status);
      }
    }, [status, posts, getPosts]),
    700,
    200,
    null,
    true
  );
  if (status === "loading" && !posts.length) return <Spinner />;
  return (
    <div className="postCard">
      <ListGroup variant="flush" className="border-bottom" m>
        {posts.length > 0
          ? posts.map((post) => {
            {/* console.log(post) */}

              {/* let { retweeted_by } = post; */}
              return (
                <ListGroup.Item
                  className="px-3"
                  action
                  as={"div"}
                  // to={`/post/${post.id_str}`}
                  key={post.id_str}
                >
                  {/* <Row className="d-flex px-3 pb-1 mt-n2 text-muted">
                    <PostTag no_reply_tag={no_reply_tag} post={post} />
                  </Row> */}
                  {/* <Link
                    className="stretched-link"
                    to={`/post/${post.id_str}`}
                  ></Link> */}
                  <Media className="mb-n2 w-100">
                    <UserLink
                      user={post.user}
                      className="rounded-circle"
                      to={`/user/${post.user.screen_name}`}
                    >
                      <Figure
                        className="bg-border-color rounded-circle mr-2 overflow-hidden"
                        style={{ height: "50px", width: "50px" }}
                      >
                        <Figure.Image
                          src={
                            post.user.default_profile_image
                              ? "/img/default-profile-vector.svg"
                              : post.user.profile_image_url_https
                          }
                          className="w-100 h-100"
                        />
                      </Figure>
                    </UserLink>
                    <Media.Body className="w-50">
                      <Row className="d-flex align-items-center">
                        <UserLink
                          user={post.user}
                          to={`/user/${post.user.screen_name}`}
                          className="text-dark font-weight-bold mr-1"
                        >
                          {post.user.name}
                        </UserLink>
                        {/* tick */}
                         <span className="text-muted mr-1">
                          @{post.user.screen_name}
                        </span>
                        <pre className="m-0 text-muted">{" - "}</pre>
                        <span className="text-muted">
                          <ReactTimeAgo
                            date={Date.parse(post.created_at)}
                            timeStyle="twitter"
                          />
                        </span>
                        {/* float: right */}
                        {/* <span className="text-dark justify-content-end align-items-center position-static" style={{right: '0px'}}><FontAwesomeIcon className="m-2" size="lg" icon={faEllipsisH} /></span> */}
                        <div className="ml-auto d-lg-flex justify-content-end ">
                        <Dropdown  className="bg-clear high-index1">
                          <Dropdown.Toggle
                            className="btn btn-naked-primary rounded-pill"
                            id="comment-dropdown"
                          >
                            <FontAwesomeIcon
                              className="m-2"
                              size="xs"
                              icon={faEllipsisH}
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            alignRight
                            className=" high-index1"
                          >
                            <Dropdown.Item
                              className="high-index1"
                              as="button"
                              onClick={(e) => dispatch(deleteSchedule(post))}
                            >
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item
                              as={Link}
                              className="high-index1"
                              to={`/compose/post?reschedule=${post.id_str}`}
                            >
                             Update
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        </div>
                       
                      </Row>
                      <Row className="mb-n1 mt-1">
                        <blockquote className="mb-1 mw-100">
                          <PostText post={post} />
                        </blockquote>
                      </Row>
                      <Row>
                        <MultiMedia className="mt-2" post={post} />
                        {/* <QuotedPost
                          className="mt-2"
                          post={!no_reply_tag && post.quoted_status}
                        /> */}
                      </Row>
                      {/* <Row className="d-flex justify-content-end align-items-center position-static">
                        <ReactionsBar post={post} />
                      </Row> */}
                    </Media.Body>
                  </Media>
                </ListGroup.Item>
              );
            })
          : status === "idle" && (
              <div className="message">No posts for you right now</div>
            )}
        {status === "loading" && <Spinner />}
        {status === "error" && <TryAgain fn={getPosts} />}
      </ListGroup>
    </div>
  );
}
