# Build guide

Install [Android Studio]() and install android SDK to `~/Android/sdk`

Build Release version:
```
cd client-app
react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res
cd android
export ANDROID_HOME=~/Android/sdk && ./gradlew assembleRelease

cp app/build/outputs/apk/release/app-release.apk ../../client/public/base.apk
```

Build Debug version:
```
cd client-app
react-native bundle --dev true --platform android --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res
cd android
export ANDROID_HOME=~/Android/sdk && ./gradlew assembleDebug
rm -r app/src/main/res/drawable-*
cp app/build/outputs/apk/debug/app-debug.apk ../../client/public/base-debug.apk
```