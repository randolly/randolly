import React from "react";

import Search from "comps/SearchBar";
import Trends from "features/trends/Trends";
import MediaQuery from "react-responsive";
import FollowCard from "./sidebar/FollowCard";
import Users from "features/users/UserSuggests";
import Heading from "comps/Heading";
import { Route, Switch } from "react-router-dom";
import { Figure } from 'react-bootstrap'

export default (props) => {
  return (
    <>
      <div className="header">
        {!props.noSearchBar && (
          <MediaQuery maxWidth={1020}>
            <Search className="w-100 p-2" />
          </MediaQuery>
        )}
      </div>
      <Switch>
        <Route path="/explore/users">
          <Heading title="Users" />
          <Users noPop />
        </Route>
        <Route path="/">
          <MediaQuery maxWidth={992}>
            <FollowCard
              noPop
              title="Follow other  Creators"
              length={4}
            />
          </MediaQuery>
         <Figure className="d-flex flex-column align-items-end">
                    <Figure.Image src="/img/creation-process.png" alt="" />
                    
                </Figure>
          <Trends />
        </Route>
      </Switch>
    </>
  );
};
