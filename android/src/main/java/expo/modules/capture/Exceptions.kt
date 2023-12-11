package expo.modules.capture

import expo.modules.kotlin.exception.CodedException

internal class ExpoCatureException(cause : Throwable) : CodedException("ExpoCaptureException", cause)
