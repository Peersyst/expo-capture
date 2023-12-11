import { NativeModulesProxy, EventEmitter, Subscription } from "expo-modules-core";

// Import the native module. On web, it will be resolved to ExpoCapture.web.ts
// and on native platforms to ExpoCapture.ts
import ExpoCaptureModule from "./ExpoCaptureModule";

export async function preventScreenCapture() {
    return await ExpoCaptureModule.preventScreenCapture();
}

export async function allowScreenCapture() {
    return await ExpoCaptureModule.allowScreenCapture();
}

const emitter = new EventEmitter(ExpoCaptureModule ?? NativeModulesProxy.ExpoCapture);

export function addScreenshotListener(listener: () => void): Subscription {
    return emitter.addListener("onScreenshot", listener);
}
