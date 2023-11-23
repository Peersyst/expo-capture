package expo.modules.capture

import android.app.Activity
import android.view.WindowManager
import expo.modules.core.Promise
import expo.modules.core.errors.CurrentActivityNotFoundException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

/**
 * Most of the code is inspired in react-native-screenguard and react-native-screenshot-prevent
 * @see https://github.com/gbumps/react-native-screenguard/blob/master/android/src/main/java/com/screenguard/ScreenGuardModule.java
 * @see https://github.com/killserver/react-native-screenshot-prevent/blob/main/android/src/main/java/com/killserver/screenshotprev/RNScreenshotPreventModule.java
 */

const val SCREENSHOT_EVENT_NAME = "onScreenshot"

// TODO: Check case when two components block screenshots and later one of them allows it.
// This would allow screenshots even though one of the components has the screenshots prevented.
// The solution would probably be adding a special SecureView

class ExpoCaptureModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoCapture')` in JavaScript.
    Name("ExpoCapture")

    // Defines event names that the module can send to JavaScript.
    Events(SCREENSHOT_EVENT_NAME)

    OnStartObserving {
      // TODO: Listen screenshots
    }

    OnStopObserving {
      // TODO: Remove listeners
    }

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    // TODO: Remove when package is ready
    Function("hello") {
      "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("preventScreenCapture") { promise: Promise ->
      GlobalScope.launch(Dispatchers.Main) {
        preventScreenCapture(promise)
      }
    }

    AsyncFunction("allowScreenCapture") { promise: Promise ->
      GlobalScope.launch(Dispatchers.Main) {
        allowScreenCapture(promise)
      }
    }
  }

  companion object {
    private const val ERROR_CODE_PREVENTION = "ERR_SCREEN_CAPTURE_PREVENTION"
  }

  @Throws(CurrentActivityNotFoundException::class)
  private fun getCurrentActivity(): Activity {
    val activity = this.appContext.currentActivity
    if (activity != null) {
      return activity
    } else {
      throw CurrentActivityNotFoundException()
    }
  }

  private fun preventScreenCapture(promise: Promise) {
    val activity = getCurrentActivity()

    try {
      activity.window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
    } catch (exception: Exception) {
      promise.reject(ERROR_CODE_PREVENTION, "Failed to prevent screen capture: $exception")
    }

    promise.resolve(null)
  }

  private fun allowScreenCapture(promise: Promise) {
    val activity = getCurrentActivity()

    try {
      activity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    } catch (exception: Exception) {
      promise.reject(ERROR_CODE_PREVENTION, "Failed to reallow screen capture: $exception")
    }

    promise.resolve(null)
  }

  private fun screenshotListener() {
    sendEvent(SCREENSHOT_EVENT_NAME)
  }
}
