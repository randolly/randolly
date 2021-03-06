import React from "react";
import { Card, Image } from "react-bootstrap";
// import { ReactTinyLink } from 'react-tiny-link'
import getUrls from "get-urls";
import Microlink from "@microlink/react";

function MM(props) {
  let { post, expanded = false, className } = props;
  let style = {
    card: {
      maxHeight: !expanded ? "350" : "fit-content",
      overflow: "hidden",
    },
  };
  let { entities = {}, text, image } = post;
  let {
    urls: [url],
  } = entities;
  let photo = image;
  if (photo) {
    photo = <Image fluid rounded={true} src={photo} alt="" />;
  }
  if (!url) {
    let unparsed_urls = Array.from(getUrls(text));
    if (unparsed_urls.length) {
      url = {
        expanded_url: unparsed_urls[0], // just the first one
      };
    }
  }
  if (url) {
    // url = <ReactTinyLink
    //     width="100%"
    //     cardSize={expanded ? 'large' : "small"}
    //     autoPlay={expanded}
    //     showGraphic={true}
    //     maxLine={2}
    //     minLine={1}
    //     url={url.expanded_url}
    // />
    url = (
      <Microlink
        url={url.expanded_url}
        autoPlay={false}
        media={["video", "audio", "iframe", "screenshot", "image", "logo"]}
        controls
        loop
        muted={false}
        style={{ width: "100%" }}
        lazy={{ threshold: 0.5 }}
      />
    );
    //props bellow
    // media='logo'
  }
  if (photo || url)
    return (
      <Card className={`${className} w-100 bg-transparent`} style={style.card}>
        {photo}
        <div className="mt-1">{url}</div>
      </Card>
    );
  else return <></>;
}

export default MM;
// import React from 'react'
// import { Card, Image } from 'react-bootstrap'
// import { ReactTinyLink } from 'react-tiny-link'
// import getUrls from 'get-urls'

// function MM(props) {
//     let { post, expanded = false, className } = props;
//     let style = {
//         card: {
//             maxHeight: !expanded ? "350" : "fit-content",
//             overflow: "hidden"
//         }
//     }
//     let { entities = {}, text } = post
//     let { media: [photo] = [], urls: [url] } = entities;
//     if (photo) {
//         photo = (<Image
//             fluid
//             rounded={true}
//             src={photo.media_url_https}
//             alt='media preview' />
//         )
//     }
//     if (!url) {
//         let unparsed_urls = Array.from(getUrls(text))
//         if (unparsed_urls.length) {
//             url = {
//                 expanded_url: unparsed_urls[0] // just the first one
//             }
//         }
//     }
//     if (url) {
//         url = <ReactTinyLink
//             width="100%"
//             cardSize={expanded ? 'large' : "small"}
//             autoPlay={expanded}
//             showGraphic={true}
//             maxLine={2}
//             minLine={1}
//             url={url.expanded_url}
//         />
//     }
//     if (photo || url)
//         return (
//             <Card className={`${className} w-100 bg-transparent`} style={style.card}>
//                 {photo}
//                 <div className="mt-1">{url}</div>
//             </Card>
//         )
//     else
//         return <></>
// }

// export default MM
