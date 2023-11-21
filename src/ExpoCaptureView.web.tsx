import * as React from 'react';

import { ExpoCaptureViewProps } from './ExpoCapture.types';

export default function ExpoCaptureView(props: ExpoCaptureViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
