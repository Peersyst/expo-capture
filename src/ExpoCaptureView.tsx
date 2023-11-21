import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoCaptureViewProps } from './ExpoCapture.types';

const NativeView: React.ComponentType<ExpoCaptureViewProps> =
  requireNativeViewManager('ExpoCapture');

export default function ExpoCaptureView(props: ExpoCaptureViewProps) {
  return <NativeView {...props} />;
}
