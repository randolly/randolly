// https://redux-toolkit.js.org/api/createAsyncThunk
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import {
  usersAdded,
  usersAddedDontUpdate,
  usersSelectors,
} from "features/users/usersSlice";
// import { userAPI } from './userAPI'
import { request } from "api";
import { useSelector } from "react-redux";

const schedulesAdapter = createEntityAdapter({
  selectId: (schedule) => schedule.id_str,
  // sortComparer: (a, b) => (b.created_at.localeCompare(a.created_at))
  sortComparer: false,
});
// sorting them based on time it was created in
// const sortedPostsAdapter = createEntityAdapter({
//     selectId: post => post.id_str,
//     sortComparer: (a, b) => (b.created_at.localeCompare(a.created_at))
// })

const initialState = schedulesAdapter.getInitialState({
  schedules_status: "idle", // || 'loading', 'error', 'done'
  date_scheduled_status: "idle", // || 'loading', 'error', 'done'
  compose_schedule_status: "idle", // || 'pending', 'error',
});

// First, create the thunk
// const fetchUserById = createAsyncThunk(
//   'users/fetchByIdStatus',
//   async (userId, thunkAPI) => {
//     const response = await userAPI.fetchById(userId)
//     return response.data
//   }
// )
const parseSchedules = (schedules) => (dispatch) => {
  schedules = schedules.map((post) => ({
    ...post,
    user: post.user.screen_name,
    backup_user: post.user,
  }));
  dispatch(schedulesAdded(schedules));
};
export const getscheduledPosts = createAsyncThunk(
  "schedules/getSchedulegPosts",
  async (username, { dispatch }) => {
    let url = `/api/user_scheduled/${username}`;

    let { posts } = await request(url);
    console.log("posts ", posts);
    dispatch(parseSchedules(posts));
    return posts.length;
  }
);
export const getscheduledPostsByDate = createAsyncThunk(
  "schedules/getSchedulegPostsByDate",
  async ({ date, username }, { dispatch }) => {
    let url = `/api/user_scheduled/${username}/${date}`;

    let { posts } = await request(url);
    console.log("posts ", posts);
    dispatch(parseSchedules(posts));
    return posts.length;
  }
);
export const deleteSchedule = createAsyncThunk(
  "schedules/delete",
  // async (post, { dispatch }) => {
  async (post) => {
    // dispatch(postUnReposted(post))
    // return request(`/api/unpost`, { body: post, dispatch })
    return request(`/api/unschedule`, { body: post });
  }
);

export const composeSchedule = createAsyncThunk(
  "schedules/composePost",
  async ({ body, url = "/api/post" }, { dispatch }) => {
    try {
      let { post } = await request(url, { body, dispatch });
      if (post) post.user.following = true; //work around till server shows this correctly on all posts/users
      return dispatch(parseSchedules([post]));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

// Then, handle actions in your reducers:
const scheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    schedulesAdded: schedulesAdapter.upsertMany,
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: {
    [getscheduledPosts.rejected]: (state) => {
      state.schedules_status = "error";
    },
    [getscheduledPosts.pending]: (state) => {
      state.schedules_status = "loading";
    },
    [getscheduledPosts.fulfilled]: (state) => {
      state.schedules_status = "done";
    },
    [getscheduledPostsByDate.rejected]: (state) => {
      state.date_scheduled_status = "error";
    },
    [getscheduledPostsByDate.pending]: (state) => {
      state.date_scheduled_status = "loading";
    },
    [getscheduledPostsByDate.fulfilled]: (state) => {
      state.date_scheduled_status = "done";
    },
    [composeSchedule.pending]: (state) => {
      state.compose_schedule_status = "pending";
    },
    [composeSchedule.rejected]: (state) => {
      state.compose_schedule_status = "error";
    },
    [composeSchedule.fulfilled]: (state) => {
      state.compose_schedule_status = "idle";
    },
  },
});
const { reducer, actions } = scheduleSlice;
export const { schedulesAdded } = actions;
export default reducer;
// export default scheduleSlice.reducer

// extraReducers: (builder) => {
//     // Add reducers for additional action types here, and handle loading state as needed
//     builder.addCase(scheduledPosts.fulfilled, (state, action) => {
//       // Add user to the state array
//       state.entities.push(action.payload)
//     })
//   },

export const schedulesSelectors = schedulesAdapter.getSelectors(
  (state) => state.schedules
);
export const populateschedule = (schedule, state) => ({
  ...schedule,
  user: usersSelectors.selectById(state, schedule.user) || schedule.backup_user,
  retweeted_by:
    (schedule.retweeted_by &&
      usersSelectors.selectById(state, schedule.retweeted_by)) ||
    schedule.backup_retweeted_by,
  quoted_status:
    schedule.quoted_status && populateschedule(schedule.quoted_status, state),
});

export const selectAllschedules = (state) => {
  return schedulesSelectors
    .selectAll(state)
    .map((schedule) => populateschedule(schedule, state))
    .filter(Boolean);
};

export const selectFeedschedules = createSelector(
  [selectAllschedules],
  (schedules) =>
    schedules.sort((a, b) => b.created_at.localeCompare(a.created_at))
);

// export const selectUserschedules = createSelector(
//     [selectAllschedules, (state, username) => username],
//     (schedules, username) => schedules.filter(schedule =>
//         schedule.user.screen_name === username ||
//         (schedule.retweeted_by && schedule.retweeted_by.screen_name === username)
//     ).sort((a, b) => (b.created_at.localeCompare(a.created_at)))
// )
export const selectUserSchedulesByDate = createSelector(
  [selectAllschedules, (state, date) => date],
  (schedules, date) =>
    schedules
      .filter((schedule) => schedule.yymmdd === date)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
);

export const selectScheduleById = createSelector(
  [selectAllschedules, (state, scheduleId) => scheduleId],
  (schedules, scheduleId) =>
    schedules.find((schedule) => schedule.id_str === scheduleId)
);
