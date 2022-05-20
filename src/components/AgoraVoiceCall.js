import React, {useState} from 'react';
import {Text} from 'react-native';
import AgoraUIKit, {VideoRenderMode} from 'agora-rn-uikit';

const App = () => {
  const [videoCall, setVideoCall] = useState(true);
  const rtcProps = {
    appId: 'e213b99f5ab44846a756d8aa92dc3482',
    channel: 'chatApp',
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  const startButton = {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: '90%',
  };
  const textStyle = {
    color: '#fff',
    backgroundColor: '#2edb85',
    fontWeight: '700',
    fontSize: 24,
    width: '100%',
    borderColor: '#2edb85',
    borderWidth: 4,
    textAlign: 'center',
    textAlignVertical: 'center',
  };
  const remoteBtnStyle = {backgroundColor: '#2edb8555'};
  const btnStyle = {
    borderRadius: 2,
    width: 40,
    height: 40,
    backgroundColor: '#2edb85',
    borderWidth: 0,
  };
  const styleProps = {
    iconSize: 10,
    theme: '#ffffffee',
    videoMode: {
      max: VideoRenderMode.Hidden,
      min: VideoRenderMode.Hidden,
    },
    overlayContainer: {
      backgroundColor: '#2edb8533',
      opacity: 1,
    },
    localBtnStyles: {
      muteLocalVideo: btnStyle,
      muteLocalAudio: btnStyle,
      switchCamera: btnStyle,
      endCall: {
        borderRadius: 0,
        width: 50,
        height: 50,
        backgroundColor: '#f66',
        borderWidth: 0,
      },
    },
    localBtnContainer: {
      backgroundColor: '#fff',
      bottom: 0,
      paddingVertical: 10,
      borderWidth: 4,
      borderColor: '#2edb85',
      height: 80,
    },
    maxViewRemoteBtnContainer: {
      top: 0,
      alignSelf: 'flex-end',
    },
    remoteBtnStyles: {
      muteRemoteAudio: remoteBtnStyle,
      muteRemoteVideo: remoteBtnStyle,
      remoteSwap: remoteBtnStyle,
      minCloseBtnStyles: remoteBtnStyle,
    },
    minViewContainer: {
      bottom: 80,
      top: undefined,
      backgroundColor: '#fff',
      borderColor: '#2edb85',
      borderWidth: 4,
      height: '26%',
    },
    minViewStyles: {
      height: '100%',
    },
    maxViewStyles: {
      height: '64%',
    },
    UIKitContainer: {height: '50%'},
  };

  return videoCall ? (
    <AgoraUIKit
      styleProps={styleProps}
      rtcProps={rtcProps}
      callbacks={callbacks}
    />
  ) : (
    <Text style={{color: 'black'}} onPress={() => setVideoCall(true)}>
      Start Call
    </Text>
  );
};

export default App;
