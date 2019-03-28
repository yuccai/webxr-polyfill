import _XRDisplay from './XRDisplay.js'
import _XRSession from './XRSession.js'
import _XRSessionCreateParameters from './XRSessionCreateParameters.js'
import _Reality from './Reality.js'
import _XRPointCloud from './XRPointCloud.js'
import _XRLightEstimate from './XRLightEstimate.js'
import _XRAnchor from './XRAnchor.js'
import _XRPlaneAnchor from './XRPlaneAnchor.js'
import _XRFaceAnchor from './XRFaceAnchor.js'
import _XRImageAnchor from './XRImageAnchor.js'
import _XRAnchorOffset from './XRAnchorOffset.js'
import _XRStageBounds from './XRStageBounds.js'
import _XRStageBoundsPoint from './XRStageBoundsPoint.js'
import _XRPresentationFrame from './XRPresentationFrame.js'
import _XRView from './XRView.js'
import _XRViewport from './XRViewport.js'
import _XRCoordinateSystem from './XRCoordinateSystem.js'
import _XRViewPose from './XRViewPose.js'
import _XRLayer from './XRLayer.js'
import _XRWebGLLayer from './XRWebGLLayer.js'
import _XRVideoFrame from './XRVideoFrame.js'

import EventHandlerBase from './fill/EventHandlerBase.js'
import FlatDisplay from './display/FlatDisplay.js'
import HeadMountedDisplay from './display/HeadMountedDisplay.js'

import CameraReality from './reality/CameraReality.js'

/*
XRPolyfill implements the window.XR functionality as a polyfill

Code below will check for window.XR and if it doesn't exist will install this polyfill,
so you can safely include this script in any page.
*/
export default class XRPolyfill extends EventHandlerBase {
	constructor(baseContainer){
		super()
		window.XRDisplay = _XRDisplay
		window.XRSession = _XRSession
		window.XRSessionCreateParameters = _XRSessionCreateParameters
		window.Reality = _Reality
		window.XRPointCloud = _XRPointCloud
		window.XRLightEstimate = _XRLightEstimate
		window.XRAnchor = _XRAnchor
		window.XRPlaneAnchor = _XRPlaneAnchor
        window.XRFaceAnchor = _XRFaceAnchor
        window.XRImageAnchor = _XRImageAnchor
        window.XRAnchorOffset = _XRAnchorOffset
		window.XRStageBounds = _XRStageBounds
		window.XRStageBoundsPoint = _XRStageBoundsPoint
		window.XRPresentationFrame = _XRPresentationFrame
		window.XRView = _XRView
		window.XRViewport = _XRViewport
		window.XRCoordinateSystem = _XRCoordinateSystem
		window.XRViewPose = _XRViewPose
		window.XRLayer = _XRLayer
		window.XRWebGLLayer = _XRWebGLLayer
		window.XRVideoFrame = _XRVideoFrame

		XRDisplay = window.XRDisplay
		XRSession = window.XRSession
		XRSessionCreateParameters = window.XRSessionCreateParameters
		Reality = window.Reality
		XRPointCloud = window.XRPointCloud
		XRLightEstimate = window.XRLightEstimate
		XRAnchor = window.XRAnchor;
		XRPlaneAnchor = window.XRPlaneAnchor;
		XRFaceAnchor = window.XRFaceAnchor;
		XRImageAnchor = window.XRImageAnchor;
		XRAnchorOffset = window.XRAnchorOffset;
		XRStageBounds = window.XRStageBounds;
		XRStageBoundsPoint = window.XRStageBoundsPoint;
		XRPresentationFrame = window.XRPresentationFrame;
		XRView = window.XRView;
		XRViewport = window.XRViewport;
		XRCoordinateSystem = window.XRCoordinateSystem;
		XRViewPose = window.XRViewPose;
		XRLayer = window.XRLayer;
		XRWebGLLayer = window.XRWebGLLayer; 
		XRVideoFrame = window.XRVideoFrame;

		this._getVRDisplaysFinished = false;

		// Reality instances that may be shared by multiple XRSessions
		this._sharedRealities = [new CameraReality(this)]
		this._privateRealities = []

		this._displays = [new FlatDisplay(this, this._sharedRealities[0])]

		if(typeof navigator.getVRDisplays === 'function'){
			navigator.getVRDisplays().then(displays => {
				for(let display of displays){
					if(display === null) continue
					if(display.capabilities.canPresent){
						this._displays.push(new HeadMountedDisplay(this, this._sharedRealities[0], display))
					}
				}
				this._getVRDisplaysFinished = true;
			})
		} else {
			// if no WebVR, we don't need to wait
			this._getVRDisplaysFinished = true;
		}

		this._sessionEls = baseContainer;
		this._realityEls = baseContainer;
	}

	getDisplays(){
		var self=this
		var waitTillDisplaysChecked = function(resolve) {
			if (!self._getVRDisplaysFinished) {
				setTimeout(waitTillDisplaysChecked.bind(self, resolve), 30);
			} else {
				resolve(self._displays);
			}
		}
		return new Promise((resolve, reject) => {
			waitTillDisplaysChecked(resolve);
		})
	}

	//attribute EventHandler ondisplayconnect;
	//attribute EventHandler ondisplaydisconnect;
}
