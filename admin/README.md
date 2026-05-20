# Admin Panel

This is the admin panel for the service booking application, built with React Admin.

## Features

### Booking Management
- **View all bookings** with filtering by status (pending, confirmed, cancelled)
- **Confirm pending bookings** with one click
- **Cancel bookings** when needed
- **Search bookings** by any field
- **View detailed booking information**

### Dashboard
- **Statistics overview** showing total, pending, confirmed, and cancelled bookings
- **Recent pending bookings** that need attention
- **Quick access** to booking management

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the backend server** (make sure it's running on port 3000):
   ```bash
   cd ../bckend
   npm start
   ```

3. **Start the admin panel:**
   ```bash
   npm start
   ```

4. **Access the admin panel:**
   - Open http://localhost:3000 in your browser
   - Login with admin credentials

## API Configuration

The admin panel is configured to connect to the local backend API at:
- **URL:** `http://localhost:3000/api`
- **Authentication:** JWT token-based
- **Admin endpoints:** All booking management endpoints require admin role

## Usage

### Managing Bookings
1. **Login** as an admin user
2. **View dashboard** to see booking statistics
3. **Click "Bookings"** in the sidebar to manage all bookings
4. **Use filters** to find specific bookings
5. **Click action buttons** to confirm or cancel pending bookings
6. **View details** by clicking on any booking row

### Features
- **Real-time updates** when confirming/cancelling bookings
- **Status filtering** to focus on pending bookings
- **Search functionality** to find specific bookings
- **Responsive design** that works on all devices

## API Endpoints Used

- `GET /bookings` - Get all bookings (admin only)
- `GET /bookings/:id` - Get specific booking (admin only)
- `PATCH /bookings/:id` - Update booking status (admin only)
- `POST /auth/login` - Admin login

## Troubleshooting

### Common Issues
1. **Can't connect to API:** Make sure the backend server is running on port 3000
2. **Authentication errors:** Check that you're using admin credentials
3. **No bookings shown:** Ensure the backend has booking data

### Development
- The admin panel uses React Admin for the UI
- Material-UI components for styling
- TypeScript for type safety
- Local API connection for development

## Security
- All admin endpoints require authentication
- Only users with admin role can access booking management
- JWT tokens are used for secure authentication 