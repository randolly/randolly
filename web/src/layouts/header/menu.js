import React from "react";
import Heading from "comps/Heading";

import { NavLink, Link } from "react-router-dom";
import { Col, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faBell } from "@fortawesome/free-regular-svg-icons/faBell";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons/faEnvelope";
import { faComments } from "@fortawesome/free-regular-svg-icons/faComments";
import { faListAlt } from "@fortawesome/free-regular-svg-icons/faListAlt";
import { faUser } from "@fortawesome/free-regular-svg-icons/faUser";
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons/faEllipsisH";
import { faHashtag } from "@fortawesome/free-solid-svg-icons/faHashtag";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faCalendar } from "@fortawesome/free-regular-svg-icons/faCalendar";

import { useSelector } from "react-redux";
import { selectUnread } from "features/notify/notifySlice";

function Menu() {
  let notifsCount = useSelector(selectUnread).length;
  let {
    user: { screen_name },
  } = useSelector((state) => state.auth);
  let list = [
    {
      name: "Settings",
      href: "/settings",
      icon: faEllipsisH,
    },
    {
      name: "edit Profile",
      href: `/user/${screen_name}`,
      icon: faUser,
    },
    {
      name: "Chat Room",
      href: "/chats",
      icon: faComments,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: faEnvelope,
      disabled: true,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: faCalendar,
    },
  ];
  return (
    <>
      <Heading title="Menu" btnProfile backButton />
      <div className="ml-0 d-flex flex-column mb-2 align-items-start ">
        <br />

        {list.map((itm) => {
          let vis = itm.disabled ? "disabled" : "";
          let badge = itm.count ? (
            <>
              <Badge
                className="position-absolute"
                variant="primary"
                style={{ top: 5, right: "unset", left: "unset" }}
              >
                {itm.count}
              </Badge>
              <span className="sr-only">new items</span>
            </>
          ) : null;
          return (
            <div
              key={itm.name}
              className="d-flex align-items-top position-relative"
            >
              <NavLink
                to={itm.href}
                className={`${vis} px-xl-2 py-xl-1 p-1 mb-1 mx-lg-0 mx-auto btn btn-naked-primary rounded-pill font-weight-bold btn-lg d-flex align-items-center`}
                activeClassName="active"
              >
                <FontAwesomeIcon className="m-2" size="lg" icon={itm.icon} />
                <span className="f">{itm.name}</span>
              </NavLink>
              {badge}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Menu;
