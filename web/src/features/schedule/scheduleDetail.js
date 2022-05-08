import React from 'react'
import { useCallback } from 'react'
import {getscheduledPostsByDate, selectUserSchedulesByDate} from './scheduleSlice'
import { useSelector, useDispatch } from 'react-redux'
// import Spinner from 'comps/Spinner'
import SchedulesList from 'comps/SchedulesList'
import Spinner from 'comps/Spinner'

export default props => {
    let dispatch = useDispatch()
    let { match: { params: { date } = {} } = {} } = props
    let { user } = useSelector(state => state.auth)
    let username = user.screen_name
    // let posts = useSelector(state => selectUserPosts(state, user && user.screen_name))
    // let { user_timeline_status: status } = useSelector(state => state.users)
 
    let { date_scheduled_status: status } = useSelector(state => state.schedules)
    // console.log(status)
    let posts = useSelector(state => selectUserSchedulesByDate(state, date))
    
    

    let getPosts = useCallback(() => {
        dispatch(getscheduledPostsByDate({username, date}))
        // eslint-disable-next-line
    }, [{username: username, date: date}])
    if (status === 'loading')
        return <Spinner />
    let scheduledPosts = (<>
        <SchedulesList
            status={status}
            getPosts={getPosts}
            posts={posts}
        />
    </>)
    
    return (<>
        {scheduledPosts}
        
    </>)
}