import React from "react";
import { useEffect, useCallback } from "react";
import Spinner from "comps/Spinner";
import { Link } from "react-router-dom";

import TryAgain from "comps/TryAgain";

import Heading from "comps/Heading";
import { getscheduledPosts, selectFeedschedules } from "./scheduleSlice";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useDispatch } from 'react-redux'
import { useSelector, useDispatch } from "react-redux";

// let allViews = Object.keys(BigCalendar.Views).map((k) => BigCalendar.Views[k]);
// BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const localizer = momentLocalizer(moment); // or globalizeLocalizer
export default (props) => {
  let dispatch = useDispatch();
  let { user } = useSelector((state) => state.auth);
  let username = user.screen_name;
  // console.log(username)
  let getSchedules = useCallback(() => {
    // dispatch(getUserScheduled(username))
    dispatch(getscheduledPosts(username));
    // eslint-disable-next-line
  }, [username]);
  let { schedules_status: status } = useSelector((state) => state.schedules);
  // console.log(status)
  let schedules = useSelector(selectFeedschedules);
  // console.log(schedules)

  useEffect(
    useCallback(() => {
      if ((status === "idle" || status === "done") && !schedules.length) {
        getSchedules();
        console.log("fetching on schedules load, status:", status);
      }
    }, [status, schedules, getSchedules]),
    [getSchedules]
  );
  if (status === "loading" && !schedules.length) return <Spinner />;
  let myEventsList;
  const event = ({ event }) => {
    console.log(event);
    return (
      <Link to={`/schedule/${event.date1}`}>
        <div>
          {" "}
          🔴 <br />{" "}
        </div>
      </Link>
    );
  };
  if (schedules.length > 0) {
    myEventsList = schedules.map((schedule) => ({
      start: schedule.schedule,
      end: schedule.schedule,
      title: schedule.text,
      description: schedule.text,
      date1: schedule.yymmdd,
    }));
    // console.log(myEventsList)
  }
  return (
    <>
      <Heading title="Calendar" btnProfile backButton />
      <div className="">
        {/* {schedules.length > 0
          ? schedules.map((schedule) => {
            const myEventsList = [
        { start: schedule.schedule, end: schedule.schedule, title: schedule.text, description: schedule.text },
      ];
        console.log(myEventsList)
      const event = ({ event }) => {
        return (
          <div>
            {event.title} <br /> <small>{event.description}</small>{" "}
          </div>
        );
      };
      return ( */}
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          components={{
            event: event,
          }}
        />
        {/* );
    })
        : status === "idle" && (
              <div className="message">No posts for you right now</div>
            )}
        {status === "loading" && <Spinner />}
        {status === "error" && <TryAgain fn={getSchedules} />} */}
      </div>
    </>
  );
};
