# MyIonicApp

## Voice Search Feature

### Overview
The voice search functionality has been updated to use the Capacitor Speech Recognition plugin, which provides reliable speech recognition on both web and mobile platforms.

### Why the Change?
The previous implementation used the Web Speech API (`webkitSpeechRecognition`) which has significant limitations on mobile Android devices:
- Limited or no support in Android WebView
- Requires HTTPS on mobile devices
- Browser restrictions and security policies
- WebView limitations

### New Implementation
- Uses `@capacitor-community/speech-recognition` plugin
- Works reliably on both web and mobile platforms
- Proper permission handling for mobile devices
- Better error handling and user feedback

### Testing Voice Search

#### On Web (Chrome):
1. Open the app in Chrome browser
2. Navigate to the Dashboard page
3. Click the microphone icon in the search bar
4. Allow microphone permission when prompted
5. Speak your search query
6. Click the stop button or wait for automatic completion

#### On Android Mobile:
1. Build and run the app on an Android device
2. Navigate to the Dashboard page
3. Click the microphone icon in the search bar
4. Grant microphone permission when prompted
5. Speak your search query
6. Click the stop button or wait for automatic completion

### Permissions Required
- **Android**: `RECORD_AUDIO` permission (already added to AndroidManifest.xml)
- **Web**: Microphone access permission (handled automatically)

### Troubleshooting

#### If voice search doesn't work on mobile:
1. Check that microphone permission is granted in device settings
2. Ensure the app has been built with the latest changes (`npx cap sync`)
3. Verify internet connection (speech recognition requires network access)
4. Try restarting the app

#### If voice search doesn't work on web:
1. Ensure you're using HTTPS (required for microphone access)
2. Check browser permissions for microphone access
3. Try refreshing the page and granting permission again

### Technical Details
- Uses Capacitor's native speech recognition on mobile
- Falls back to Web Speech API on web browsers
- Implements proper error handling and retry logic
- Provides real-time feedback during speech recognition
- Automatically performs search when speech recognition completes 