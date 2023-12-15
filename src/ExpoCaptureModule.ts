import { requireNativeModule } from "expo-modules-core";
import Constants, { ExecutionEnvironment } from "expo-constants";

// `true` when running in Expo Go.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let ExpoCaptureModule;

if (isExpoGo) {
    {
        /**
         *  The ExpoCapture module is not available in the JSI environment. Are you trying to use it in the Expo Go app?
         *  To use this module during development, you need to use a development build.  See https://docs.expo.dev/modules/use-standalone-expo-module-in-your-project/#4-test-the-published-module
         */
        ExpoCaptureModule = {
            preventScreenCapture: async () => {},
            allowScreenCapture: async () => {},
            addListener: () => {},
            removeListeners: () => {},
        };
    }
} else {
    ExpoCaptureModule = requireNativeModule("ExpoCapture");
    // Fixes on Android:
    // WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.
    if (!ExpoCaptureModule.addListener) {
        ExpoCaptureModule.addListener = () => {};
    }
    // WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.
    if (!ExpoCaptureModule.removeListeners) {
        ExpoCaptureModule.removeListeners = () => {};
    }
}

export default ExpoCaptureModule;
