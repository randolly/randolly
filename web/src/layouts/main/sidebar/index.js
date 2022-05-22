import React from "react";
import Search from "comps/SearchBar";
import FollowCard from "./FollowCard";
import TrendingCard from "./TrendingCard";
import { Col } from "react-bootstrap";

import { useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  return (
    <Col>
      <Search className="sticky-top my-2" />

      {!(location.pathname === "/explore/users") ? (
        <FollowCard compact className="my-3" length={5} title="People" />
      ) : undefined}
      {/* <br /> */}
      {!(location.pathname === "/explore") ? (
        <TrendingCard className="my-3" title="Trend" />
      ) : undefined}
      <footer className="m-2 mt-3 overflow-hidden">
        <small></small>
        <p className="text-black font-weight-bold mb-0 mt-1">
          randolly, Whats expected??
        </p>
        <div className="text-muted mb-1 mt-n1">
          <small>@randolly</small>
        </div>
      </footer>
    </Col>
  );
}

export default Sidebar;
