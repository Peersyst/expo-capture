package expo.modules.capture

import android.content.Context
import android.view.WindowManager
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

const val SCREENSHOT_EVENT_NAME = "onScreenshot"

class ExpoCaptureModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.AppContextLost()
  private val currentActivity
    get() = appContext.currentActivity ?: throw Exceptions.MissingActivity()

  override fun definition() = ModuleDefinition {
    Name("ExpoCapture")

    // Defines event names that the module can send to JavaScript.
    Events(SCREENSHOT_EVENT_NAME)

    //TODO: Add event emitter
    /* OnCreate {
      ScreenshotEventEmitter(context, appContext.legacyModuleRegistry)
    } */

    AsyncFunction("preventScreenCapture") {
      preventScreenCapture()
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("allowScreenCapture") {
      allowScreenCapture()
    }.runOnQueue(Queues.MAIN)

  }

  private fun preventScreenCapture() {
    currentActivity.window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
  }

  private fun allowScreenCapture() {
    currentActivity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
  }
}
