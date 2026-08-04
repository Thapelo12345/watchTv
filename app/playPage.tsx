import { View, Text, BackHandler, TouchableOpacity, Platform, Alert } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { useMainStore } from "@/stateManagement/store";
import * as ScreenOrientation from "expo-screen-orientation";
import { useNavigation } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from "react";

export default function PlayComponent() {
  const navigation = useNavigation();

  // store state 
  const userID = useMainStore((state: any) => state.userId);
  const mainUrl = useMainStore((state: any) => state.baseUrl);

  const playableUrl = useMainStore((state: any) => state.playUrl);
  const currentlyPlaying = useMainStore((state: any) => state.playingProgramme);
  const unFinishedShows = useMainStore((state: any) => state.continueWatching);
  const showHistory = useMainStore((state: any) => state.watchHistory);

  // store action state
  const turnOffPlay = useMainStore((state: any) => state.setPlaying);
  const saveUnfinishedShow = useMainStore((state: any) => state.addUnfinishedShow); 
  const removeUnfinishedShow = useMainStore((state: any) => state.removeUnfinishedShow);
  const addToHistory = useMainStore((state: any) => state.addWatchedShow);
  
const SERVER1_INJECTED_JAVASCRIPT = `
(function() {
  // Helper function to safely send message packets back to React Native
  function sendLog(type, details = {}) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ 
      type: type, 
      data: details 
    }));
  }

  // Helper to extract duration and current time from a video element
  function getVideoMetrics(video) {
    return {
      currentTime: video.currentTime || 0,
      duration: video.duration || 0
    };
  }

  // Strategy A: Intercept the cross-window messaging pipeline
  window.addEventListener('message', function(event) {
    if (!event.data) return;
    try {
      const parsed = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      const eventName = parsed.event || parsed.type || parsed.method;
      
      if (/play/i.test(eventName)) sendLog('VIDEO_PLAYING', { source: 'postMessage' });
      if (/pause/i.test(eventName)) sendLog('VIDEO_PAUSED', { source: 'postMessage' });
    } catch(e) {}
  });

  // Strategy B: Deep-dive scan for standard tags + Hidden Shadow DOMs
  function scanForVideoElements() {
    const standardVideos = document.querySelectorAll('video');
    standardVideos.forEach(v => bindListeners(v));

    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.shadowRoot) {
        const shadowVideos = el.shadowRoot.querySelectorAll('video');
        shadowVideos.forEach(v => bindListeners(v));
      }
    });
  }

  function bindListeners(video) {
    if (video.dataset.monitored) return;
    video.dataset.monitored = "true";

    // Track the last time a progress update was successfully sent
    let lastLogTime = 0;

    // Directly query live states right now
    if (!video.paused && video.currentTime > 0) {
      sendLog('VIDEO_PLAYING', getVideoMetrics(video));
    }

    // Attach runtime hooks
    video.addEventListener('play', () => sendLog('VIDEO_PLAYING', getVideoMetrics(video)));
    video.addEventListener('playing', () => sendLog('VIDEO_PLAYING', getVideoMetrics(video)));
    video.addEventListener('pause', () => sendLog('VIDEO_PAUSED', getVideoMetrics(video)));
    video.addEventListener('waiting', () => sendLog('VIDEO_BUFFERING', getVideoMetrics(video)));
    
    // Controlled time tracking during playback
    video.addEventListener('timeupdate', () => {
      const metrics = getVideoMetrics(video);
      
      if (metrics.duration > 0) {
        // FIXED: milestone checks run completely outside the 20-second throttle layout
        // 1. Check if video duration is valid and half-way mark hasn't been logged yet
        if (!video.dataset.halfLogged) {
          const halfTime = metrics.duration / 2;
          
          if (metrics.currentTime >= halfTime) {
            video.dataset.halfLogged = "true"; // Flag it so it only fires once
            sendLog('VIDEO_HALF_REACHED', {
              halfTimeMark: halfTime,
              ...metrics
            });
          }
        }

        // 2. Check if 90% of the video time has finished/passed
        if (!video.dataset.ninetyLogged) {
          const ninetyPercentTime = metrics.duration * 0.9;
          
          if (metrics.currentTime >= ninetyPercentTime) {
            video.dataset.ninetyLogged = "true"; // Flag it so it only fires once
            sendLog('VIDEO_WATCHED', {
              message: "Video Has been watch",
              ninetyPercentMark: ninetyPercentTime,
              ...metrics
            });
          }
        }
      }
      
      // PERFORMANCE FIX: This throttle now ONLY blocks standard updates, leaving milestones unaffected
      const now = Date.now();
      if (now - lastLogTime >= 20000) { 
        sendLog('VIDEO_PROGRESS', metrics);
        lastLogTime = now;
      }
    });

    // Reset the flag if the video is rewound or loops back to the start
    video.removeAttribute('data-half-logged');
    video.removeAttribute('data-ninety-logged');
    video.addEventListener('seeked', () => {
      const metrics = getVideoMetrics(video);
      if (metrics.currentTime < (metrics.duration / 2)) {
        video.removeAttribute('data-half-logged');
      }
      if (metrics.currentTime < (metrics.duration * 0.9)) {
        video.removeAttribute('data-ninety-logged');
      }
    });

    // Modified error block to explicitly catch 404 / Missing files
    video.addEventListener('error', () => {
      if (video.error && video.error.code === 4) {
        sendLog('VIDEO_NOT-FOUND', {
          message: "Video file not found (404 Error) or link broken.",
          videoSrc: video.currentSrc || video.src || "unknown",
          ...getVideoMetrics(video)
        });
      } else {
        sendLog('VIDEO_ERROR', {
          message: video.error ? video.error.message : 'unspecified',
          code: video.error ? video.error.code : 0,
          ...getVideoMetrics(video)
        });
      }
    });
  }

  // GLOBAL PAGE/IFRAME 404 CHECKER
  function performTextScrape404Check() {
    if (window.dataset_404_triggered) return;

    const pageText = document.body ? document.body.innerText : "";
    const pageTitle = document.title || "";
    
    if (
      /404|not found|no video available|content missing|error|not available/i.test(pageText) || 
      /404|not found|error/i.test(pageTitle)
    ) {
      window.dataset_404_triggered = true;
      sendLog('VIDEO_NOT-FOUND', { message: "Main page text indicator returned 404.", url: window.location.href });
      return;
    }

    const iframes = document.querySelectorAll('iframe');
    for (let i = 0; i < iframes.length; i++) {
      try {
        const iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
        if (iframeDoc) {
          const iframeText = iframeDoc.body ? iframeDoc.body.innerText : "";
          const iframeTitle = iframeDoc.title || "";
          if (
            /404|not found|no video available|content missing|error/i.test(iframeText) || 
            /404|not found/i.test(iframeTitle)
          ) {
            window.dataset_404_triggered = true;
            sendLog('VIDEO_NOT-FOUND', { message: "Accessible iframe text returned 404.", src: iframes[i].src });
            return;
          }
        }
      } catch (e) {
        if (iframes[i].src && /error|404|failed/i.test(iframes[i].src)) {
          window.dataset_404_triggered = true;
          sendLog('VIDEO_NOT-FOUND', { message: "Cross-origin iframe source URL contains error indicators.", src: iframes[i].src });
          return;
        }
      }
    }
  }

  // Initial runs on page load
  scanForVideoElements();
  performTextScrape404Check();

  // FIX: Run an aggressive dynamic scan on startup to catch elements rendering via AJAX/Single Page App transitions
  const fastVideoScanInterval = setInterval(scanForVideoElements, 2000);
  const checkInterval = setInterval(performTextScrape404Check, 4000);

  // After 3 minutes, clear aggressive loops and scale down performance layout
  setTimeout(function() {
    clearInterval(fastVideoScanInterval);
    clearInterval(checkInterval); 
    setInterval(scanForVideoElements, 15000);
  }, 180000);

})();
true;
`;


// Hidding the Android navigation bar when the video is playing to provide a full-screen experience
async function configureAndroidSystemUI() { if (Platform.OS === 'android') await NavigationBar.setVisibilityAsync('hidden')}

const handleMessage = async (event: any) => {
    const messageData = JSON.parse(event.nativeEvent.data); 
    const orientation = await ScreenOrientation.getOrientationAsync();

    if(messageData.type === "VIDEO_PLAYING") {
      if (Platform.OS === 'android' && (orientation === 1 || orientation === 2)){
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        await configureAndroidSystemUI()
    }

    }//end of if

    else if(messageData.type === "VIDEO_HALF_REACHED") {

      console.log("HALF TIME RUN!...")
      if(unFinishedShows.find((show: any)=> show.programmeName === currentlyPlaying.programmeName)) return
      saveUnfinishedShow(currentlyPlaying)

      try{
        const upDateCloud = await fetch(`${mainUrl}/user/update-continue-watch`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            id: userID,
            continueWatch: unFinishedShows
          })
        })

        if(!upDateCloud.ok) throw new Error("Failed to update cloud!..")

          const data = await upDateCloud.json()

          if(data.message !== "Cloud Updated SuccessFully!..") throw new Error(data.message)

          console.log("CLOUD UPDATED!..")
      }
      catch(err: unknown){console.log(err instanceof Error ? err.message : "unknown error!..")}
    }  

    else if(messageData.type === "VIDEO_WATCHED") {

    if(unFinishedShows.find((show: any)=> show.programmeName === currentlyPlaying.programmeName)) {
      removeUnfinishedShow(currentlyPlaying.programmeName)

      try{
        const cloudUpdate = await fetch(`${mainUrl}/user/update-continue-watch`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            id: userID,
            continueWatch: unFinishedShows
          })
        })

        if(!cloudUpdate.ok) throw new Error("Failed to update cloud!..")
        const data = await cloudUpdate.json()
        if(data.message !== "Cloud Updated SuccessFully!..") throw new Error(data.message)
      }
      catch(err: unknown){console.error(err instanceof Error ? err.message : "unknown error!..")}
    }

    if(!showHistory.find((show: any)=> show === currentlyPlaying.programmeName)) {
      addToHistory(currentlyPlaying.programmeName)
      try{
        const cloudUpdate = await fetch(`${mainUrl}/user/update-history`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            id: userID,
            history: showHistory
          })
        })
        if(!cloudUpdate.ok) throw new Error("Failed to update cloud!..")
        const data = await cloudUpdate.json()
        if(data.message !== "Cloud SuccessFully Updated!.") throw new Error(data.message)
      }
      catch(err: unknown){console.error(err instanceof Error ? err.message : "unknown error!..")}
      }
    }

    else if(messageData.type === "VIDEO_NOT-FOUND") {
      console.log("Video not found or link broken. Please check the URL or contact support.");
    }

};

  useEffect(() => {

  const backAction = async()=>{await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP,);
  // turnOffPlay(false)
  }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", ()=> {backAction()});

    return () => {
      turnOffPlay(false)
      backHandler.remove();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  return (
    <View className="flex-1 bg-black">

<View className="flex-1 w-full h-full">

      <WebView
            source={{ uri: playableUrl }}
            androidHardwareAccelerationDisabled={Platform.OS === 'android'}
            style={{ width: "100%", height: "100%" }}
            setSupportMultipleWindows={false}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            injectedJavaScriptForMainFrameOnly={false}
            injectedJavaScript={SERVER1_INJECTED_JAVASCRIPT}
            onMessage={handleMessage}
            
            // Local fallback intercept for primary domain SSL issues
            onReceivedSslError={(syntheticEvent: any) => {syntheticEvent.preventDefault()}}
            onShouldStartLoadWithRequest={(request: WebViewNavigation) => {return request.url === playableUrl}}
      
          // Catch basic network dropouts or loading failures
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent.description);
      }}
          />
</View>
      

      {Platform.OS === "ios" && <TouchableOpacity
        onPress={() => {
          turnOffPlay(false);
          navigation.goBack();
        }}
        className="absolute top-6 left-6 w-12 h-12 bg-black/60 rounded-full items-center justify-center z-50"
      >
        <Text className="text-white text-xl font-bold">✕</Text>
      </TouchableOpacity>
      }
    </View>
  );
}
