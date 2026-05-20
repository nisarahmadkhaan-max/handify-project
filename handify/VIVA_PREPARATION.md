# VIVA PREPARATION: MAJOR FUNCTIONS & COMPONENTS

**Project**: Handify (Ionic/Angular Mobile Service Booking App)

---

## 1. AUTHENTICATION SERVICE (`auth.service.ts`)

### Overview
Manages all user authentication flows including login, signup, password reset, and session management.

### Key Functions

#### **login()**
```typescript
login(credentials: { phoneNumber: string; password: string })
```
**What it does:**
- Authenticates user with phone number and password
- Sends POST request to backend `/auth/login` endpoint
- Stores JWT token and user data in localStorage
- Updates currentUserSubject (BehaviorSubject) to broadcast user state across app

**How it works:**
1. HTTP POST with credentials
2. Backend validates credentials
3. Backend returns JWT token + user details
4. Token stored in localStorage for persistent login
5. currentUserSubject notified (reactive updates to all subscribers)

**Scope:**
- Used in Login Page when user enters credentials
- Enables conditional routing (logged-in vs. non-logged-in pages)
- Tokens sent with every API request via headers

**Why BehaviorSubject?**
- Immediately emits current value to new subscribers
- Used for reactive state management across components
- Current user always accessible via `currentUserValue` property

---

#### **signup()**
```typescript
signup(userData: { fullName: string; email: string; phoneNumber: string; password: string })
```
**What it does:**
- Registers new user in system
- Similar to login but requires full user details
- Automatically logs user in after signup (stores token immediately)

**How it works:**
1. Validates user input (UI responsibility)
2. POST to `/auth/signup` with user data
3. Backend creates user record and returns token
4. Auto-login: token stored immediately
5. User redirected to dashboard

**Key difference from login:**
- Requires more fields (fullName, email)
- Creates new record in database

---

#### **isLoggedIn()**
```typescript
async isLoggedIn(): Promise<boolean>
```
**What it does:**
- Checks if user session is valid and token exists
- Used at app startup to determine initial navigation

**How it works:**
1. Retrieves currentUserValue from BehaviorSubject
2. Returns false if null
3. Checks if token exists
4. Could verify token validity with backend (not currently implemented)

**Where used:**
- App component initialization (`initializeApp()`)
- Route guards (preventing unauthorized access)

---

#### **logout()**
```typescript
logout()
```
**What it does:**
- Removes user session
- Clears localStorage
- Sets currentUserSubject to null

**Important:** Does NOT call backend endpoint (stateless JWT approach)

**Flow:**
1. Remove 'currentUser' from localStorage
2. BehaviorSubject.next(null)
3. Components observing currentUser$ react to change
4. Router redirects to login automatically

---

#### **forgotPassword() & resetPassword()**
```typescript
forgotPassword(phoneNumber: string)
resetPassword(data: { phoneNumber: string; otp: string; newPassword: string })
```
**What it does:**
- 2-step password recovery
- forgotPassword: Initiates OTP sending
- resetPassword: Validates OTP and sets new password

**Flow:**
1. User enters phone → backend sends OTP via SMS/email
2. User receives OTP, enters new password
3. resetPassword validates OTP + password
4. Backend updates password record

---

### VIVA QUESTIONS on AuthService

**Q1: Why use BehaviorSubject instead of simple variable?**
A: BehaviorSubject provides reactive updates. Any component subscribing to `currentUser$` automatically gets notified when user logs in/out without manual polling.

**Q2: Where is the JWT token sent with API requests?**
A: In `booking.service.ts`, the `getHeaders()` method extracts token from currentUserValue and adds it to Authorization header: `Authorization: Bearer ${token}`

**Q3: Why store user data in localStorage?**
A: Persists login session across page refreshes. User doesn't need to re-login after refresh because token is recovered from localStorage on app init.

**Q4: What happens if token expires?**
A: Currently not handled. Could implement token refresh logic or intercept 401 responses to redirect to login.

**Q5: Is signup method secure? (Passwords sent via HTTP)**
A: HTTPS is used in production, so data is encrypted in transit. Password is hashed backend-side before storage.

---

## 2. BOOKING SERVICE (`booking.service.ts`)

### Overview
Handles all booking-related operations: create, retrieve, list, and cancel bookings.

### Key Functions

#### **createBooking()**
```typescript
createBooking(bookingData: any): Observable<any>
```
**What it does:**
- Creates new service booking
- Validates authentication
- Sends booking details to backend
- Returns Observable with response

**How it works:**
1. `getHeaders()` called → retrieves token from AuthService
2. Creates Authorization header with Bearer token
3. HTTP POST to `/api/bookings` with booking data
4. catchError operator handles failures gracefully

**Data structure:**
```typescript
{
  category: string,        // e.g., "Plumbing"
  service: string,         // Service _id from database
  estimatedCost: number,   // Price in currency units
  date: string,           // ISO format date
  time: string,           // Time slot
  location: string,       // User's address (from geolocation)
  additionalInstructions: string  // Special requests
}
```

**Error handling:**
- If no token → throws error immediately
- If API fails → catchError intercepts and returns throwError

---

#### **getMyBookings()**
```typescript
getMyBookings(): Observable<any>
```
**What it does:**
- Retrieves all bookings for current user
- Filters done backend-side using authentication token

**How it works:**
1. GET request to `/api/bookings/my-bookings`
2. Backend identifies user from token
3. Returns user's bookings list
4. Displayed in Service History page

---

#### **getHeaders() - Private Helper Method**
```typescript
private getHeaders(): HttpHeaders
```
**Why important:**
- **Single source of truth** for authentication headers
- Prevents token hardcoding in every method
- Validates token existence before making requests

**What it does:**
1. Retrieves currentUserValue from AuthService
2. Checks if user exists and has token
3. If missing → throws "No authentication token available"
4. If valid → returns HttpHeaders with Bearer token

**Error scenario:**
If user logs out while API is pending → token becomes null → subsequent requests fail gracefully.

---

#### **cancelBooking()**
```typescript
cancelBooking(id: string): Observable<any>
```
**What it does:**
- Cancels existing booking by ID
- PATCH request (partial update) not DELETE (preserves history)

**Why PATCH not DELETE?**
- Booking record kept for historical records
- Status changed to "CANCELLED"
- User can see cancellation reasons/dates

---

### VIVA QUESTIONS on BookingService

**Q1: Why use Observable instead of Promise?**
A: Observables support:
- Cancellation (via subscription unsubscribe)
- Retry logic
- Real-time updates via WebSockets
- Operator chaining (map, catchError, etc.)

**Q2: What happens if user's token expires during booking?**
A: HTTP 401 response returned. App should intercept and redirect to login. Currently would show error toast.

**Q3: Why is getHeaders() a private method?**
A: Encapsulation. Prevents accidental direct calls. Ensures consistent header creation across all methods.

**Q4: What if API returns 403 (Forbidden)?**
A: User likely doesn't own that booking. catchError catches it and shows error toast.

**Q5: How does backend know which user's bookings to fetch?**
A: Token contains user ID. Backend decodes token in middleware, extracts userId, filters bookings by that ID.

---

## 3. CATEGORY SERVICE (`category.service.ts`)

### Overview
Fetches and manages service categories for the app.

### Key Functions

#### **getAllCategories()**
```typescript
getAllCategories(): Observable<Category[]>
```
**What it does:**
- Fetches all available service categories
- Returns Observable list of categories
- No authentication required (public data)

**Where used:**
- Filter/Browse page
- Service selection dropdown in booking form

**Example response:**
```typescript
[
  { _id: "1", name: "Plumbing", icon: "🔧" },
  { _id: "2", name: "Electrical", icon: "⚡" },
  { _id: "3", name: "Cleaning", icon: "🧹" }
]
```

---

#### **getFeaturedCategories()**
```typescript
getFeaturedCategories(limit: number = 3): Observable<Category[]>
```
**What it does:**
- Returns top N categories to display on home page
- Default: 3 categories (can be overridden)

**Why separate from getAllCategories()**
- Home page shows only popular services → improves UX
- Reduces data load on home page
- Backend can rank by bookings/ratings

---

#### **searchCategories()**
```typescript
searchCategories(query: string): Observable<Category[]>
```
**What it does:**
- Searches categories by query string
- Case-insensitive search backend-side
- Used in search bar with debouncing

**Example:**
- User types "plu" → returns "Plumbing", "Plumber services"
- Displayed in dropdown suggestions

---

### VIVA QUESTIONS on CategoryService

**Q1: Why are categories fetched from API instead of hardcoded?**
A: Dynamic management. Admin can add/remove/modify categories without code changes.

**Q2: Is category data cached?**
A: Currently NO. Every page load fetches fresh data. Could optimize with caching using RxJS shareReplay().

**Q3: What if API is slow?**
A: User sees loading spinner. Could add loading state in component with isLoading flag.

---

## 4. CHAT SERVICE (`chat.service.ts`)

### Overview
Manages real-time chat communication between users and support staff.

### Key Functions

#### **sendMessage()**
```typescript
sendMessage(message: ChatMessage): Observable<ChatMessage>
```
**What it does:**
- Sends chat message (text or audio) to backend
- Returns sent message with timestamp and ID

**Message structure:**
```typescript
{
  _id?: string;           // Generated by backend
  userId: string;         // Current user ID
  text: string;          // Message content (empty if audio)
  type: 'text' | 'audio'; // Message type
  audioLength?: string;   // Duration if audio (e.g., "0:05")
  timestamp?: string;     // Set by backend
}
```

**How it works:**
1. Component creates ChatMessage object
2. POST to `/api/chat/send`
3. Backend stores message
4. Returns saved message with generated _id and timestamp
5. Component adds to UI messages array

---

#### **getMessages()**
```typescript
getMessages(userId: string): Observable<ChatMessage[]>
```
**What it does:**
- Retrieves chat history for user
- Shows conversation with support team

**Current limitation:**
- userId is hardcoded as 'USER_ID' in live-chat.page.ts
- Should be replaced with actual logged-in user ID

**How it works:**
1. GET request with userId query parameter
2. Backend returns all messages for that user
3. Displayed in descending chronological order

---

### VIVA QUESTIONS on ChatService

**Q1: Why is there a TODO comment for userId?**
A: Security. userId should come from authenticated user, not hardcoded. Currently bypassed for demo.

**Q2: How would you implement real-time chat?**
A: Replace HTTP polling with WebSocket:
```typescript
// Instead of HTTP GET
// Use Socket.io or similar
this.socket.on('message', (msg) => this.messages.push(msg));
```

**Q3: Why is text empty for audio messages?**
A: Design decision. Audio file stored separately (not as base64 in text field). Reduces payload.

---

## 5. TRANSLATION SERVICE (`translation.service.ts`)

### Overview
Implements multi-language support (i18n) for the app. Loads translations dynamically.

### Key Functions

#### **setLanguage()**
```typescript
async setLanguage(lang: string)
```
**What it does:**
- Changes app language
- Loads JSON translation file
- Broadcasts language change to all subscribers
- Persists selection to local storage

**How it works:**
1. Calls `loadTranslations(lang)`
2. HTTP GET `/assets/i18n/en.json` or `/assets/i18n/ar.json`
3. Stores translations in memory: `translations[lang] = data`
4. `currentLang$.next(lang)` notifies all subscribers
5. Components using this service update UI text

**Language files structure:**
```json
{
  "COMMON": {
    "LOADING": "Loading...",
    "ERROR": "Error occurred",
    "SUCCESS": "Success"
  },
  "AUTH": {
    "LOGIN": "Login",
    "SIGNUP": "Sign Up"
  }
}
```

---

#### **translate()**
```typescript
translate(key: string): string
```
**What it does:**
- Returns translated text for given key
- Supports nested keys: "COMMON.LOADING"

**How it works:**
1. Splits key by "." → ["COMMON", "LOADING"]
2. Recursively accesses nested object
3. Returns value or original key if not found

**Example:**
```typescript
translate("COMMON.LOADING") → "Loading..." (English) or "جاري التحميل" (Arabic)
```

---

#### **initStorage()**
```typescript
private async initStorage()
```
**What it does:**
- Initializes Ionic Storage (persistent key-value store)
- Retrieves saved language preference
- Sets default language if first time

**Why async?**
- Storage initialization is asynchronous
- Must complete before loading translations

---

### VIVA QUESTIONS on TranslationService

**Q1: How does multi-language switch work in real-time?**
A: `currentLang$` is an Observable. Components subscribe via `| async` pipe in templates. When language changes, BehaviorSubject emits new value, templates re-render with new text.

**Q2: What if translation file is missing?**
A: catchError returns empty object `{}`. getTranslation returns original key as fallback text.

**Q3: Why use Ionic Storage instead of localStorage?**
A: Ionic Storage is cross-platform abstraction. Automatically uses localStorage (web) or native storage (mobile), handling differences.

**Q4: How to add new language?**
A: Create `/assets/i18n/es.json`, add translations, call `setLanguage('es')`.

---

## 6. BOOKSERVICE PAGE COMPONENT (`bookservice.page.ts`)

### Overview
Main booking form where users select services, dates, times, and locations.

### Key Functions

#### **getCurrentLocation()**
```typescript
async getCurrentLocation()
```
**What it does:**
- Gets user's GPS coordinates using Capacitor Geolocation
- Converts coordinates to address via Google Maps Geocoding API
- Updates location field in booking form

**How it works:**
1. `Geolocation.getCurrentPosition()` → Gets lat/lng
2. Calls Google Maps API: `geocode/json?latlng=${lat},${lng}&key=${apiKey}`
3. Response: formatted address (e.g., "123 Main St, City, Country")
4. Updates `bookingData.location`
5. Shows success/error toast

**Permissions required:**
- Android: `ACCESS_FINE_LOCATION` in AndroidManifest.xml
- iOS: Location permission in Info.plist
- Web: Browser asks for permission

**Error scenarios:**
- User denies location permission → "Error getting location"
- Geocoding fails → "Error getting address"
- No GPS signal → Geolocation error

---

#### **confirmBooking()**
```typescript
async confirmBooking()
```
**What it does:**
- Validates form fields
- Sends booking to backend
- Navigates to confirmation page

**Validation checks:**
```
✓ category (service type selected)
✓ service (_id of specific service)
✓ date (future date selected)
✓ time (time slot selected)
✓ location (address provided)
```

**How it works:**
1. Checks all required fields filled
2. Calls `bookingService.createBooking(bookingData)`
3. If success → navigate to `/bookingconfirm` with booking details
4. If failure → shows error toast
5. Handles "Please authenticate" error (session expired)

**Example success flow:**
```
User fills form → Clicks "Confirm" 
→ API returns booking ID and confirmation details
→ Navigates to confirmation page showing booking summary
```

---

#### **ngOnInit()**
```typescript
ngOnInit()
```
**What it does:**
- Subscribes to language changes
- Extracts service data from query parameters
- Pre-fills form if service passed from previous page

**How it works:**
```typescript
// If user came from service page
// Service page: router.navigate(['/bookservice'], {
//   queryParams: { service: JSON.stringify(serviceObj) }
// })

// bookservice.page.ts extracts it
this.route.queryParams.subscribe(params => {
  if (params['service']) {
    this.selectedService = JSON.parse(params['service']);
    this.bookingData.service = this.selectedService._id;
    this.bookingData.estimatedCost = this.selectedService.price;
  }
});
```

**Why pass service as query param?**
- Avoids complex route nesting
- Service data survives page refresh
- Cleaner than using shared service

---

### VIVA QUESTIONS on BookservicePage

**Q1: Why use async/await with Capacitor API?**
A: Capacitor returns Promises. Async/await makes code synchronous-looking and easier to handle errors with try-catch.

**Q2: What's the difference between HTTP GET to Google Maps vs backend Maps API?**
A: Direct call to Google saves backend bandwidth. Backend validation could be added for security (verify coordinates are valid).

**Q3: Why navigate with queryParams instead of state?**
A: queryParams persist in URL. If user shares link or refresh page, data is preserved. State is lost on refresh.

**Q4: What if user changes booking date after confirming?**
A: No mechanism currently. User would need to cancel and re-book. Could add "Modify Booking" feature.

**Q5: How is minDate and maxDate calculated?**
A: 
```typescript
minDate = today (prevents past bookings)
maxDate = today + 1 year (prevents far-future bookings)
```

---

## 7. LOGIN PAGE COMPONENT (`login.page.ts`)

### Overview
Handles user authentication: login and signup with password visibility toggle.

### Key Functions

#### **loginBtn()**
```typescript
async loginBtn()
```
**What it does:**
- Routes between login and signup flows
- Submits credentials to AuthService
- Handles success and error states
- Shows loading spinner and toasts

**How it works:**

**Login Flow:**
1. Show loading spinner
2. Call `authService.login({ phoneNumber, password })`
3. Backend validates credentials
4. Success: Store token, show "Login successful" toast, navigate to dashboard
5. Error: Show error message in toast

**Signup Flow:**
1. Show loading spinner  
2. Call `authService.signup({ fullName, email, phoneNumber, password })`
3. Backend creates user record
4. Success: Auto-login (token stored), navigate to dashboard
5. Error: Show error toast (e.g., "Phone number already registered")

**Try-catch wrapping:**
- Handles network errors
- Shows user-friendly error messages

---

#### **togglePasswordVisibility()**
```typescript
togglePasswordVisibility()
```
**What it does:**
- Toggles `showPassword` boolean
- In template: `[type]="showPassword ? 'text' : 'password'"`
- Shows/hides password characters

---

#### **toggleView()**
```typescript
toggleView()
```
**What it does:**
- Switches between login form and signup form
- Same component, different conditional HTML

**Why single component?**
- Reduced code duplication
- Smooth UX (no page transition)
- Shared styling

---

#### **ionViewWillEnter() & ionViewWillLeave()**
```typescript
ionViewWillEnter()
ionViewWillLeave()
```
**What it does:**
- Disables Android back button on login page
- Re-enables back button when leaving

**Why disable back button?**
- Security: Prevent returning to previous unauthorized page
- UX: User shouldn't go back to home without logging in

**Ionic lifecycle:**
- ionViewWillEnter: Page about to appear
- ionViewWillLeave: Page about to disappear

---

### VIVA QUESTIONS on LoginPage

**Q1: Why show loading spinner?**
A: Network request takes time. Spinner indicates process ongoing, prevents user clicking button multiple times.

**Q2: Why disable back button on login?**
A: App flow:
```
Splash → Login (no back) → Dashboard
         ↓
      Forgot Password (back to login OK)
```
Login page shouldn't go back to splash.

**Q3: How is signup different from login in UX?**
A: 
- Login: 2 fields (phone, password)
- Signup: 4 fields (name, email, phone, password)
Both use same component, different `ngIf` conditions in template.

**Q4: What if user types wrong phone number format?**
A: Currently no client-side validation. Backend would reject and return error. Could add: `pattern="[0-9]{10}"` in HTML input.

**Q5: How does app know to block back button only on login page?**
A: Each page's ngOnInit subscribes independently. Only login page disables it. Other pages ignore this code.

---

## 8. LIVE CHAT PAGE COMPONENT (`live-chat.page.ts`)

### Overview
Support chat interface where users can send text/audio messages to support staff.

### Key Functions

#### **loadMessages()**
```typescript
loadMessages()
```
**What it does:**
- Fetches chat history from backend
- Shows/hides welcome message based on chat history

**How it works:**
1. `chatService.getMessages(userId)` called
2. Backend returns all messages for that userId
3. If 0 messages → `showWelcomeMessage = true`
4. If 1+ messages → `showWelcomeMessage = false`

**Welcome message:**
Only shows when chat is empty to guide new users.

---

#### **sendMessage()**
```typescript
sendMessage()
```
**What it does:**
- Creates ChatMessage object
- Sends to backend via ChatService
- Appends to messages array (optimistic update)
- Clears input field

**How it works:**
```typescript
1. Check if message empty → return
2. Create ChatMessage { userId, text, type: 'text' }
3. chatService.sendMessage(message) → Observable
4. subscribe() → Add sentMessage to messages array
5. Clear newMessage input
6. Hide welcome message
```

**Optimistic update:**
Message added to UI immediately, backend stores in parallel.

---

#### **sendAudio()**
```typescript
sendAudio()
```
**What it does:**
- Sends audio message (currently dummy implementation)
- Creates ChatMessage with type: 'audio'

**Current limitation:**
- Just logs "Audio: 0:05" 
- No actual audio recording
- Should use: `@capacitor-community/microphone` or Web Audio API

**How to implement fully:**
1. Record audio using Capacitor Microphone plugin
2. Convert to base64 or upload to backend
3. Send message with audioLength metadata

---

#### **switchLanguage()**
```typescript
switchLanguage(lang: string)
```
**What it does:**
- Changes app language via TranslationService
- All subscribed components update UI

---

### VIVA QUESTIONS on LiveChatPage

**Q1: Why is userId hardcoded as "USER_ID"?**
A: TODO - Security issue. Should fetch from AuthService:
```typescript
constructor(private authService: AuthService, ...) {
  this.userId = this.authService.currentUserValue.user._id;
}
```

**Q2: How would you implement real audio recording?**
A: Use Capacitor or Web Audio API:
```typescript
const permissions = await Microphone.requestAudioRecordingPermission();
if (permissions === 'granted') {
  await Microphone.startRecording();
  // ... user speaks ...
  const recording = await Microphone.stopRecording();
  // Convert to blob, upload to backend
}
```

**Q3: What's optimistic update and why use it?**
A: Immediately add message to UI before backend confirms. If backend fails, remove from UI. Improves perceived performance.

**Q4: How would you show "typing..." indicator?**
A: WebSocket event:
```typescript
socket.on('user:typing', (data) => {
  this.otherUserTyping = true;
});
```

**Q5: How to implement message read status?**
A: Backend tracks viewed timestamps. Display checkmarks:
```
✓ Sent  
✓✓ Delivered
✓✓ Read (blue)
```

---

## 9. APP COMPONENT (Root Component) (`app.component.ts`)

### Overview
Initializes app and determines initial navigation route based on auth state and onboarding status.

### Key Functions

#### **initializeApp()**
```typescript
async initializeApp()
```
**What it does:**
- Waits for Ionic platform initialization
- Sets light theme (removes dark mode)
- Handles Android status bar
- Calls navigation logic

**How it works:**
```typescript
1. await platform.ready() → Waits for Capacitor/Cordova
2. Set theme: document.body.classList.add('light')
3. Android padding: --ion-safe-area-top = 24px
   (Accounts for status bar and notches)
4. checkInitialNavigation()
```

**Why necessary?**
- Platform.ready() ensures native modules are loaded
- Theme prevents flash of dark mode on startup
- Safe area padding prevents content behind notch

---

#### **checkInitialNavigation()**
```typescript
async checkInitialNavigation()
```
**What it does:**
- Determines which page to show based on user state
- Handles three scenarios:

**Scenario 1: User logged in**
```typescript
if (isLoggedIn) {
  navigate('/tabs/tab1')  // Dashboard
}
```

**Scenario 2: User not logged in, hasn't seen onboarding**
```typescript
if (!hasSeenOnboarding) {
  navigate('/splash')  // Show tutorial/splash screen
}
```

**Scenario 3: User not logged in, has seen onboarding**
```typescript
else {
  navigate('/login')  // Go directly to login
}
```

**Navigation flow:**
```
First App Launch
├─ Not logged in
└─ Not seen onboarding
   └─ → Splash (tutorials)
       └─ After watching → Login
           └─ Success → Dashboard

Subsequent Launches
├─ Logged in → Dashboard (skip login)
├─ Not logged in, seen onboarding → Login
```

---

### VIVA QUESTIONS on AppComponent

**Q1: Why use async/await instead of Promise chains?**
A: Readability. Async/await looks synchronous, easier to debug. Promise chains can become "callback hell".

**Q2: What's the purpose of `platform.ready()`?**
A: Ensures native bridge is initialized before accessing Capacitor APIs (Geolocation, Camera, etc.).

**Q3: Why force light theme instead of respecting system preference?**
A: Design consistency. App designed for light theme. Could implement toggle with: `document.body.classList.add('dark')` based on user preference.

**Q4: What's safe area padding?**
A: Space for notch/status bar:
```
┌─────────────┐
│ ⏰  Safe Area Top = 24px
├─────────────┤
│ App content │
└─────────────┘
```

Without padding, content hides behind notch.

**Q5: What if isLoggedIn() throws error?**
A: Currently not handled. Should wrap in try-catch and default to login page.

---

## 10. DASHBOARD PAGE COMPONENT (`dashboard.page.ts`)

### Overview
Landing page after login. Shows service options and navigation buttons.

### Key Functions

#### **Lifecycle Methods**
```typescript
ngOnInit() { }  // Empty currently
```

**All action methods are console.log placeholders:**
- `bookService()` → Navigate to booking page
- `viewHistory()` → Show past bookings
- `bookingDetails()` → Show specific booking
- `contactSupport()` → Open chat/support form
- `bookNow()` → Quick booking

**Current state:** Demo component, not fully connected to services.

---

### VIVA QUESTIONS on DashboardPage

**Q1: Why are all methods just console.log()?**
A: Placeholder implementation. Component structure ready, logic not implemented yet.

**Q2: How would you implement bookService()?**
A: 
```typescript
bookService() {
  this.router.navigate(['/bookservice']);
}
```

**Q3: How to show booking history?**
A:
```typescript
async viewHistory() {
  const bookings = await this.bookingService.getMyBookings().toPromise();
  // Show in modal or navigate to history page
}
```

---

## COMPREHENSIVE VIVA QUESTIONS (Cross-topic)

### Architecture & Design Patterns

**Q1: What design pattern does BehaviorSubject implement?**
A: **Observer/Pub-Sub pattern**
- AuthService = Publisher (emits user state changes)
- Components = Subscribers (react to changes)
- Benefits: Loose coupling, real-time updates

**Q2: Why separate services from components?**
A: **Separation of Concerns**
- Components: UI logic
- Services: Business logic, API calls
- Reusability: Same service used by multiple components
- Testability: Mock services for unit tests

**Q3: What's a better alternative to current chat architecture?**
A: **WebSocket-based real-time chat**
```
HTTP polling: New message every 5 seconds ❌ (battery drain)
WebSocket: Real-time bidirectional ✓ (efficient)
Implementation: Socket.io or Firebase Realtime DB
```

**Q4: Why use TypeScript over JavaScript?**
A:
- **Static typing**: Catch errors at compile time
- **IntelliSense**: Better IDE autocomplete
- **Interfaces**: Contract for data structures
- **Less runtime errors**: Many caught before deployment

**Q5: What's the difference between GET and POST?**
A:
- **GET**: Retrieves data, cacheable, parameters in URL, safe (no side effects)
- **POST**: Creates/modifies data, parameters in body, not cached, has side effects

---

### Security Questions

**Q1: Are passwords secure in current implementation?**
A:
- ✓ HTTPS in production (encrypted in transit)
- ✓ Backend hashes before storage (not plaintext)
- ✗ No rate limiting on login attempts (brute force possible)
- ✗ JWT token stored in localStorage (XSS vulnerable if attacker injects script)

**Better approach:** HTTPOnly cookies (JavaScript cannot access)

**Q2: What happens if user's token is compromised?**
A: Attacker can:
- Make API requests as that user
- View bookings, chat history
- Create/cancel bookings

**Prevention:**
- Token expiration (e.g., 1 hour)
- Refresh tokens (long-lived, used to get new access tokens)
- HTTPS only transmission

**Q3: How to prevent SQL injection?**
A: ORM/parameterized queries (backend responsibility, not frontend)

**Q4: Why disable back button on login?**
A: Security:
```
User on login page
├─ Clicks back → Goes to previous page
└─ Previous page might be unprotected splash screen
    (Shows before auth, confuses logged-out users)
```

---

### Performance Questions

**Q1: How to optimize category loading?**
A: **Caching with RxJS**
```typescript
getAllCategories(): Observable<Category[]> {
  if (!this.cachedCategories) {
    this.cachedCategories = this.http.get(...).pipe(
      shareReplay(1)  // Cache result, share to all subscribers
    );
  }
  return this.cachedCategories;
}
```

**Q2: Why loading spinner during login?**
A: **UX improvement**
- Indicates action in progress
- Prevents multiple clicks
- Shows app is responsive (not frozen)

**Q3: How to optimize image loading?**
A:
- Lazy loading (load when visible)
- Compression (reduce file size)
- WebP format (modern browsers)
- CDN (faster delivery)

**Q4: What's optimistic update?**
A: Update UI immediately before server confirmation
```
1. User sends message
2. Message appears instantly in UI
3. Backend stores in background
4. If error → remove from UI

Benefits: Feels responsive, doesn't wait for server
```

---

### Error Handling Questions

**Q1: How to handle network errors globally?**
A: **HTTP Interceptor**
```typescript
// Global error handler
http.interceptors.push(
  error => {
    if (error.status === 401) redirect('/login')
    if (error.status === 500) showErrorToast()
    return throwError(error)
  }
)
```

**Q2: What if API returns 401 Unauthorized?**
A: Session expired
```
1. Detect 401 in HTTP interceptor
2. Clear localStorage
3. Redirect to /login
4. Show "Session expired, please login again"
```

**Q3: How to retry failed requests?**
A: **RxJS retry operator**
```typescript
return this.http.get(url).pipe(
  retry(3),  // Retry up to 3 times
  catchError(error => {
    showErrorToast('Failed after 3 attempts');
    return throwError(error);
  })
);
```

---

### Testing Questions

**Q1: How to unit test login() method?**
A:
```typescript
it('should store user token on successful login', () => {
  // Mock HTTP response
  httpClient.post = jasmine.createSpy().and.returnValue(
    of({ token: 'abc123', user: { id: 1 } })
  );
  
  authService.login({ phoneNumber: '123', password: 'pwd' })
    .subscribe(response => {
      expect(localStorage.getItem('currentUser')).toBeDefined();
      expect(response.token).toBe('abc123');
    });
});
```

**Q2: How to mock BookingService in tests?**
A:
```typescript
TestBed.configureTestingModule({
  providers: [
    { provide: BookingService, useValue: mockBookingService }
  ]
});
```

**Q3: What should you test?**
A: Components, Services, Pipes, Directives
```
Test coverage goal: >80%
- Happy path (normal flow)
- Error scenarios (API failures)
- Edge cases (empty lists, null values)
```

---

### Database & API Questions

**Q1: What's the backend API base URL?**
A: `https://public-repo-j9sl.onrender.com/api`

**Q2: What endpoints exist?**
A:
```
Auth:
- POST /auth/login
- POST /auth/signup
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/verify-otp

Bookings:
- POST /bookings (create)
- GET /bookings/my-bookings (list)
- GET /bookings/:id (get one)
- PATCH /bookings/:id/cancel (cancel)

Categories:
- GET /categories (all)
- GET /categories/featured (top 3)
- GET /categories/search?q=query (search)

Services:
- GET /services
- GET /services/category/:category

Chat:
- POST /chat/send
- GET /chat/messages?userId=xxx

Notifications:
- GET /notifications?userId=xxx

Support:
- POST /contact-support
```

**Q3: How would you handle API versioning?**
A: `/api/v1/bookings` vs `/api/v2/bookings`
- Allows backward compatibility
- Gradual migrations
- Prevents breaking existing apps

---

### Ionic/Capacitor Specific Questions

**Q1: What's difference between Ionic and Capacitor?**
A:
- **Ionic**: UI framework (buttons, forms, modals, tabs)
- **Capacitor**: Native bridge (access device APIs like Camera, Geolocation)

**Q2: What's Capacitor plugin?**
A: Bridge between JS and native code
```
Capacitor plugin for Geolocation:
JS side: await Geolocation.getCurrentPosition()
↓ (Capacitor bridge)
Native side: Android/iOS location service
↓ (returns coordinates)
JS side: Handle coordinates
```

**Q3: What permissions are needed for Geolocation?**
A:
- **Android**: `ACCESS_FINE_LOCATION` in AndroidManifest.xml
- **iOS**: `NSLocationWhenInUseUsageDescription` in Info.plist
- **Web**: Browser asks user

---

## FINAL TIPS FOR VIVA

1. **Understand the flow:**
   ```
   User opens app → App component checks auth state
   → If logged in: Show dashboard
   → Else: Show splash/login
   → On login: AuthService stores token
   → Token sent with all API requests
   → On logout: Token cleared, redirect to login
   ```

2. **Know why each service exists:**
   - AuthService: Authentication
   - BookingService: Booking operations
   - CategoryService: Category data
   - ChatService: Support messages
   - TranslationService: Multi-language

3. **Be ready to explain:**
   - How observables work (vs promises)
   - Why BehaviorSubject for state management
   - How token-based auth works
   - How services communicate with components

4. **Common follow-up questions:**
   - "Where would you optimize this code?" → Caching, lazy loading
   - "How to add feature X?" → Design pattern explanation
   - "What if API fails?" → Error handling strategy
   - "Security concerns?" → Token expiration, HTTPS, rate limiting

5. **Have diagrams in mind:**
   ```
   App Component
   ├─ Platform Ready?
   ├─ Logged In?
   │  ├─ Yes → Dashboard
   │  ├─ No → Seen Onboarding?
   │  │   ├─ No → Splash
   │  │   └─ Yes → Login
   ```

Good luck with your viva! 🚀

