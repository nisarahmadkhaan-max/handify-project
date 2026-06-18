# 🛠️ Handify - Professional On-Demand Home Services Platform

Handify is a full-stack mobile application designed to bridge the gap between skilled professionals and customers. Whether you need a plumber, an electrician, or a painter, Handify provides a seamless, secure, and AI-verified platform to get the job done.

## 🚀 Key Features

### 👤 For Customers
- **Easy Booking:** Browse categorized services and book in seconds.
- **Real-time Chat:** Communicate with professionals via text and voice messages.
- **Service Tracking:** Monitor your booking status from 'Pending' to 'Completed'.
- **Review System:** Rate your experience to maintain service quality.
- **Bilingual Support:** Full support for both **English** and **Urdu**.

### 💼 For Professionals (Employees)
- **AI Identity Verification:** Real-time CNIC verification using **OCR technology**.
- **Job Broadcasting:** Get notified of new jobs in your specialized category.
- **Wallet System:** Manage earnings and pay commissions through an integrated wallet.
- **Flexible Scheduling:** Set your own availability.

### 🛡️ For Administrators
- **Powerful Dashboard:** Manage users, employees, and services.
- **Financial Control:** Review and approve wallet top-up requests.
- **System Monitoring:** Oversee all live bookings and system activities.

## 💻 Tech Stack

- **Mobile App:** Ionic Framework & Angular (Cross-platform)
- **Backend:** Node.js & Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Admin Panel:** React.js (React-Admin)
- **Hosting:** Vercel (Backend & Admin)
- **AI Integration:** OCR.space API for CNIC scanning

## 🛠️ Installation & Setup

### Backend
1. Go to `backend` folder.
2. Run `npm install`.
3. Set up environment variables (`MONGODB_URI`, `JWT_SECRET`, `OCR_SPACE_API_KEY`).
4. Run `npm start`.

### Mobile App (Frontend)
1. Go to `handify` folder.
2. Run `npm install`.
3. Run `ionic serve` for browser testing.
4. To build APK: `ionic build --prod` then `npx cap sync android`.

### Admin Panel
1. Go to `admin` folder.
2. Run `npm install`.
3. Run `npm start`.

## 📸 Project Workflow
1. **User** posts a request.
2. **System** broadcasts it to verified employees.
3. **Employee** accepts the job (must have wallet balance).
4. **Chat** opens between both parties.
5. **Worker** starts job; timer begins.
6. **Completion** is secured via a 4-digit OTP provided by the User.

---
Developed as a **Final Year Project** with ❤️.
