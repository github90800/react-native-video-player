import React, { Component } from "react";
import { Video } from 'expo';
import VideoPlayer from '@expo/videoplayer';

class CustomVideoPlayer extends Component {
    render() {
        return (
            <VideoPlayer
            videoProps={{
                shouldPlay: true,
                resizeMode: Video.RESIZE_MODE_CONTAIN,
                source: {
                    uri: 'https://storage.googleapis.com/deepsentinel-central-images-staging/event/2018/9/14/21/4f32c5182fb244e29703cf9ed4772f08/video.mp4',
                },
            }}
            isPortrait={true}
            playFromPositionMillis={0}
        />);
    }
}


export default CustomVideoPlayer;
