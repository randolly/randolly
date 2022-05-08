import React from 'react'
import Compose from 'features/posts/Compose'
import Feed from 'features/posts/Feed'
import Heading from 'comps/Heading'
// import Storie from 'comps/story/storie'
// import Storie from 'comps/Stories'

import MediaQuery from 'react-responsive'
// import AddIcon from '@material-ui/icons/Add';



class Home extends React.Component {
    
    render() {
        return (<>
            <Heading title="Home" btnLogout btnProfile />
            {/* <Storie children={img} delay="7" /> */}
            
            <MediaQuery minWidth={576}>
                <Compose className='mt-2' />
                <div style={{ height: "10px" }} className="w-100 bg-border-color border"></div>
            </MediaQuery>
            <Feed />
        </>)
    }
}

export default Home