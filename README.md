# brca-exchange app

A mobile-optimized version of the brcaexchange.org website, with additional capabilities for keeping individuals more
involved with the site. Features include:

- the ability to follow a variant of interest and receive notifications when that variant's status changes,
- (in progress) customizable user profiles and ability to upload user-specific data to contribute to the BRCA challenge

This project is developed using react-native, a cross-platform mobile application framework. Versions have been tested
to work with Android 6.0+ (emulator and physical devices) and iOS 9+ (simulator only). The project should build in any
GNU-compatible environment, but development is mostly conducted on OS X 10.11.

# Installing Dependencies and Running the Project

1. Install node.js and npm for your machine, [node.js/npm installation directions](https://docs.npmjs.com/getting-started/installing-node]).
2. Acquire Android and/or iOS build tools depending on your target platform.
  - Android: either [Android Studio](https://developer.android.com/studio/index.html)
    or the [standalone SDK](https://developer.android.com/studio/index.html#command-tools). This project requires v23 of
    the build tools.
  - iOS: Xcode, [third-party installation guide](https://www.moncefbelyamani.com/how-to-install-xcode-homebrew-git-rvm-ruby-on-mac/) 
2. Clone this repository locally.
3. In the project's directory, run the command `npm install` to download project dependencies.
4. Execute `react-native run-<platform>`, where `<platform>` is a choice of 'android' or 'ios'.

The project should build and begin running on whichever device your build tools are configured to deploy. For
Android, it will typically prefer a connected phone with developer mode enabled, and for iOS it will typically launch
the simulator.

Cryptic advice that appears to fix missing third-party source files for building the iOS version:
```
if [ ! -d "node_modules/react-native/third-party" ]; then
    cd node_modules/react-native ; ./scripts/ios-install-third-party.sh
    cd ../../
    cd node_modules/react-native/third-party/glog-0.3.5/
    ../../scripts/ios-configure-glog.sh
    cd ../../../../
fi
```
