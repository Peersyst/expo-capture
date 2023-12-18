import { NativeModulesProxy, EventEmitter, Subscription, Platform } from "expo-modules-core";
import { useEffect } from "react";
// Import the native module. On web, it is currently unsupported and will be undefined.
// and on native platforms to ExpoCapture.ts
import ExpoCaptureModule from "./ExpoCaptureModule";

const emitter = new EventEmitter(ExpoCaptureModule ?? NativeModulesProxy.ExpoCapture);

/**
 * Prevents the user from taking screenshots in the app.
 * On Android, it will set the FLAG_SECURE flag on the window.
 * On iOS, it will display a dark overlay on top of the app.
 * @returns A promise that resolves when the operation is complete.
 */
export async function preventScreenCaptureAsync() {
    return await ExpoCaptureModule.preventScreenCapture();
}

/**
 * Re-enables the user to take screenshots in the app.
 * @returns A promise that resolves when the operation is complete.
 */
export async function allowScreenCaptureAsync() {
    return await ExpoCaptureModule.allowScreenCapture();
}

/**
 * Adds a listerner that will fire when a screenshot is taken.
 * On Android, is currently unsupported and will never fire.
 * @param listener The function that will be executed when the user takes a screenshot.
 * This function accepts no arguments.
 *
 * @return A `Subscription` object that you can use to unregister the listener, either by calling
 * `remove()` or passing it to `removeScreenshotListener`.
 */
export function addScreenshotListener(listener: () => void): Subscription {
    return emitter.addListener("onScreenshot", listener);
}

/**
 * Removes the subscription you provide, so that you are no longer listening for screenshots.
 *
 * If you prefer, you can also call `remove()` on that `Subscription` object, for example:
 *
 * ```ts
 * let mySubscription = addScreenshotListener(() => {
 *   console.log("You took a screenshot!");
 * });
 * ...
 * mySubscription.remove();
 * // OR
 * removeScreenshotListener(mySubscription);
 * ```
 *
 * @param subscription Subscription returned by `addScreenshotListener`.
 */
export function removeScreenshotListener(subscription: Subscription) {
    emitter.removeSubscription(subscription);
}

/**
 * A React hook to prevent screen capturing.
 * @param enabled If `true`, prevents screen capturing. If `false`, it won't do anything. Default is true.
 */
export function usePreventScreenCapture(enabled = true): void {
    useEffect(() => {
        if (!enabled) return;
        preventScreenCaptureAsync();

        return () => {
            allowScreenCaptureAsync();
        };
    }, []);
}

/**
 * A React hook to listen for screenshots.
 * You do not need to call `removeScreenshotListener` when the component unmounts.
 */
export function useScreenshotListener(listener: () => void): void {
    useEffect(() => {
        //Only iOS and macOS support screenshot listeners
        if (!["ios", "macos"].includes(Platform.OS)) return;

        const subscription = addScreenshotListener(listener);
        return () => {
            subscription.remove();
        };
    }, []);
}
