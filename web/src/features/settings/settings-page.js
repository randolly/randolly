import React from "react";
import { Switch, Route } from "react-router-dom";

import Profile from "./profile-modal";
import Link from "./link-modal";
import Heading from "comps/Heading";

export default (props) => {
  return (
    <>
      <Switch>
        <Route path="/settings/profile" component={Profile} />
        <Route path="/settings/link" component={Link} />
      </Switch>
      <Heading title="Settings" btnProfile backButton />
      <div className="message font-weight-bold">Settings coming in future</div>
      <div>
        {" "}
        We want to make rando highly customizable Inorder to embrace our
        creators uniqueness
      </div>
    </>
  );
};
