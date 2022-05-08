import React from 'react'

import Heading from 'comps/Heading'

export default props => {
    return (<>
        <Heading title='Chat room(s)' btnProfile backButton />
        <p className='flex min-vh-100 p-3 text-muted'>
            Rando wants to allow you to work with others therefore unleashing the full power of it being a productivity tool
            <br/>
            We want to allow you to solve challenges together! and ensure that the results of your work are stored in one place
            <br /><br />
            New unique features would help this project stand out and not be just "one more social publishing tool"<br /><br />
            But also if nobody is interested is this, i will also just move on
        </p>
    </>)
}