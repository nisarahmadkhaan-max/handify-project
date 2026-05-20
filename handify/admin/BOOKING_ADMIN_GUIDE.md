# Booking Management Admin Guide

## Overview
The admin panel now includes comprehensive booking management functionality that allows administrators to view, manage, and update booking statuses.

## Features

### 1. Dashboard
- **Statistics Overview**: View total bookings, pending, confirmed, and cancelled bookings
- **Recent Pending Bookings**: Quick view of the latest pending bookings that need attention

### 2. Booking List
- **Filter by Status**: Filter bookings by pending, confirmed, or cancelled status
- **Search**: Search through bookings by any field
- **Quick Actions**: For pending bookings, you can:
  - **Confirm**: Change status to confirmed
  - **Cancel**: Change status to cancelled
- **View Details**: Click the eye icon to see full booking details

### 3. Booking Details
- **Complete Information**: View all booking details including:
  - Category and service
  - Estimated cost
  - Date and time
  - Location
  - Additional instructions
  - Creation and update timestamps
- **Status Management**: Confirm or cancel bookings directly from the detail view

## How to Use

### Accessing the Admin Panel
1. Navigate to the admin panel URL
2. Login with admin credentials
3. You'll see the dashboard with booking statistics

### Managing Bookings
1. **View All Bookings**: Click on "Bookings" in the left sidebar
2. **Filter Bookings**: Use the filter options to find specific bookings
3. **Update Status**: 
   - For pending bookings, click "Confirm" or "Cancel" buttons
   - Or click the eye icon to view details and manage from there
4. **View Details**: Click the eye icon to see complete booking information

### Dashboard Features
- **Statistics Cards**: See at a glance how many bookings are in each status
- **Recent Pending**: Quick access to the most recent pending bookings
- **Quick Actions**: Direct links to manage bookings

## Booking Statuses

- **Pending**: New bookings that need admin review and confirmation
- **Confirmed**: Bookings that have been approved by admin
- **Cancelled**: Bookings that have been cancelled

## API Endpoints

The admin panel uses these backend endpoints:
- `GET /bookings` - Get all bookings (admin only)
- `GET /bookings/:id` - Get specific booking (admin only)
- `PATCH /bookings/:id` - Update booking status (admin only)
- `PATCH /bookings/:id/confirm` - Confirm booking (admin only)
- `PATCH /bookings/:id/cancel` - Cancel booking (admin only)

## Security
- All booking management endpoints require admin authentication
- Only users with admin role can access booking management features
- All actions are logged and tracked

## Troubleshooting

### Common Issues
1. **Can't see bookings**: Ensure you're logged in as an admin user
2. **Actions not working**: Check that the backend server is running
3. **No pending bookings**: This is normal if all bookings have been processed

### Support
If you encounter issues:
1. Check the browser console for errors
2. Verify the backend server is running
3. Ensure you have admin privileges
4. Check the network tab for API call failures 