import ExpoModulesCore

/**
 * Most of the code is inspired in react-native-screenguard and react-native-screenshot-prevent
 * @see https://github.com/gbumps/react-native-screenguard/blob/master/ios/ScreenGuard.mm
 * @see https://github.com/killserver/react-native-screenshot-prevent/blob/main/ios/RNScreenshotPrevent.m
 */

let SCREENSHOT_EVENT_NAME = "onScreenshot"

// TODO: Check case when two components block screenshots and later one of them allows it.
// This would allow screenshots even though one of the components has the screenshots prevented.
// The solution would probably be adding a special SecureView

public class ExpoCaptureModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoCapture')` in JavaScript.
        Name("ExpoCapture")

        // Defines event names that the module can send to JavaScript.
        Events(SCREENSHOT_EVENT_NAME)
        
        // Starts observing when the module loads
        OnStartObserving {
            NotificationCenter.default.addObserver(self, selector: #selector(self.screenshotListener), name: UIApplication.userDidTakeScreenshotNotification, object: nil)

             if #available(iOS 13.0, *) {
                NotificationCenter.default.addObserver(self, selector: #selector(self.activeListener), name: UIScene.willEnterForegroundNotification, object: nil)

                NotificationCenter.default.addObserver(self, selector: #selector(self.resignListener), name: UIScene.didEnterBackgroundNotification, object: nil)
            } else {
                NotificationCenter.default.addObserver(self, selector: #selector(self.activeListener), name: UIApplication.willEnterForegroundNotification, object: nil)

                NotificationCenter.default.addObserver(self, selector: #selector(self.resignListener), name: UIApplication.didEnterBackgroundNotification, object: nil)
            }
        }
        
        // Stops observing when the module loads
        OnStopObserving {
            NotificationCenter.default.removeObserver(self, name: UIApplication.userDidTakeScreenshotNotification, object: nil)

            if #available(iOS 13.0, *) {
                NotificationCenter.default.removeObserver(self, name: UIScene.willEnterForegroundNotification, object: nil)

                NotificationCenter.default.removeObserver(self, name: UIScene.didEnterBackgroundNotification, object: nil)
            } else {
                NotificationCenter.default.removeObserver(self, name: UIApplication.willEnterForegroundNotification, object: nil)

                NotificationCenter.default.removeObserver(self, name: UIApplication.didEnterBackgroundNotification, object: nil)
            }
        }

        // Defines a JavaScript function that always returns a Promise and whose native code
        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        AsyncFunction("preventScreenCapture") { () in
            DispatchQueue.main.async {
                self.preventScreenCapture()
            }
        }
        
        AsyncFunction("allowScreenCapture") { () in
            DispatchQueue.main.async {
                self.allowScreenCapture()
            }
        }
    }
    
    private var isScreenCapturePrevented: Bool = false
    
    private var secureTextField: UITextField?
    
    /**
     * Activates the secure text field
     */
    private func activateSecureTextField() {
        if (self.secureTextField != nil) {
            self.secureTextField!.isSecureTextEntry = true
        }
    }
    
    /**
     * Deactivates the secure text field
     */
    private func deactivateSecureTextField() {
        if (self.secureTextField != nil) {
            self.secureTextField!.isSecureTextEntry = false
        }
    }
    
    /**
     * Creates a dummy secure UITextField and attaches it to the UIWindow
     */
    private func addSecureTextField() {
        let screenRect = UIScreen.main.bounds
        self.secureTextField = UITextField.init(frame: CGRect(x: 0, y: 0, width: screenRect.size.width, height: screenRect.size.height))
        self.secureTextField!.translatesAutoresizingMaskIntoConstraints = false
        self.secureTextField!.textAlignment = NSTextAlignment.center
        self.secureTextField!.isUserInteractionEnabled = false
        self.secureTextField!.backgroundColor = UIColor.black

        self.activateSecureTextField()
        
        let window: UIWindow
        
        // From https://stackoverflow.com/a/59967138
        if #available(iOS 15, *) {
            window = UIApplication
                .shared
                .connectedScenes
                .compactMap { ($0 as? UIWindowScene)?.keyWindow }
                .last!
                
        } else if #available(iOS 13, *) {
            window = UIApplication
                .shared
                .connectedScenes
                .flatMap { ($0 as? UIWindowScene)?.windows ?? [] }
                .last { $0.isKeyWindow }!
        } else {
            return;
        }
        
        window.makeKeyAndVisible()
        window.sendSubviewToBack(self.secureTextField!)
        window.addSubview(self.secureTextField!)
        window.layer.superlayer?.addSublayer(self.secureTextField!.layer)
        self.secureTextField!.layer.sublayers!.last?.addSublayer(window.layer)
    }
    
    /**
     * Removes the secure UITextField from the UI Window
     */
    private func removeSecureTextField() {
        self.deactivateSecureTextField()
        
        let stfLayer = self.secureTextField?.layer.sublayers?.last
        stfLayer?.removeFromSuperlayer()
        
    }
    
    /**
     * Prevents screen capture by setting secure entry and background color to the attached self.secureTextField
     */
    func preventScreenCapture() {
        if #available(iOS 13, *) {
            if (!self.isScreenCapturePrevented) {
                self.isScreenCapturePrevented = true
                self.addSecureTextField()
            }
        }
    }
    
    /**
     * Allows screen capture by unsetting secure entry and background color to the attached self.secureTextField
     */
    func allowScreenCapture() {
        if (self.isScreenCapturePrevented) {
            self.isScreenCapturePrevented = false
            self.removeSecureTextField()
        }
    }
    
    @objc
    private func screenshotListener() {
        sendEvent(SCREENSHOT_EVENT_NAME)
    }

    // Handle app hiding when resigning focus, this responsibility belongs to a different module
    @objc
    private func activeListener() {
        if (self.isScreenCapturePrevented){
            self.activateSecureTextField()
        }
    }

    @objc
    private func resignListener() {
        if (self.isScreenCapturePrevented) {
            self.deactivateSecureTextField()
        }
    }
}
