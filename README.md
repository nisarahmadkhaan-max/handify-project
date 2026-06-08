🛠️ Handify – On-Demand Home Services Platform:
Handify is a full-stack mobile application that connects customers with verified skilled professionals such as plumbers, 
electricians, and painters. The platform ensures a seamless, secure, 
and AI-assisted service experience from booking to completion.

🚀 Key Features:
👤 Customer App
⚡ Instant Booking: Browse and book services in seconds.
💬 Real-time Chat: Communicate via text and voice messages.
📍 Live Service Tracking: Track job status from Pending → In Progress → Completed.
⭐ Rating & Reviews: Improve service quality through user feedback.
🌐 Bilingual Support: English & Urdu interface support.

🧑‍🔧 Professional (Worker) App:
🤖 AI Identity Verification: CNIC verification using OCR technology.
📢 Job Notifications: Receive real-time job alerts in relevant categories.
💰 Wallet System: Track earnings and manage commissions.
📅 Flexible Availability: Set working hours and availability.

🛡️ Admin Panel:
📊 Central Dashboard: Manage users, professionals, and services.
💳 Financial Control: Approve and monitor wallet transactions.
🔍 System Monitoring: Track live bookings and platform activity.

💻 Tech Stack:
. Mobile App: Ionic Framework + Angular
. Backend: Node.js + Express.js
. Database: MongoDB Atlas
. Admin Panel: React.js (React-Admin)
. Hosting: Vercel
. AI Integration: OCR.space API (CNIC Verification)

⚙️ Installation & Setup:
🔧 Backend
cd backend
npm install
npm start

Environment Variables:
. MONGODB_URI=
. JWT_SECRET=
. OCR_SPACE_API_KEY=

📱 Mobile App (Ionic):
cd handify
npm install
ionic serve

Build APK:
ionic build --prod
npx cap sync android

🖥️ Admin Panel
cd admin
npm install
npm start

🔄 System Workflow:
1. Customer creates a service request
2. System broadcasts job to nearby verified professionals
3. Professional accepts job (wallet-based access control)
4. Chat is initiated between both parties
5. Service begins and is tracked in real-time
6. Completion is confirmed via OTP verification



