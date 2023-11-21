import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoCapture.web.ts
// and on native platforms to ExpoCapture.ts
import ExpoCaptureModule from './ExpoCaptureModule';
import ExpoCaptureView from './ExpoCaptureView';
import { ChangeEventPayload, ExpoCaptureViewProps } from './ExpoCapture.types';

// Get the native constant value.
export const PI = ExpoCaptureModule.PI;

export function hello(): string {
  return ExpoCaptureModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoCaptureModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoCaptureModule ?? NativeModulesProxy.ExpoCapture);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoCaptureView, ExpoCaptureViewProps, ChangeEventPayload };
