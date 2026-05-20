import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
  ChipField,
  useNotify,
  Button,
  useRefresh,
  useRecordContext,
} from 'react-admin';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const BookingActions = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const record = useRecordContext();

  // Debug logging
  console.log('BookingActions - record:', record);
  console.log('BookingActions - record.status:', record?.status);

  const handleConfirm = async () => {
    if (!record) {
      notify('No booking record found', { type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        notify('Please log in to perform this action', { type: 'error' });
        return;
      }

      const response = await fetch(`https://public-repo-j9sl.onrender.com/api/bookings/admin/${record.id}/confirm`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        notify('Booking confirmed successfully', { type: 'success' });
        refresh();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        notify(`Error confirming booking: ${errorData.message || 'Unknown error'}`, { type: 'error' });
      }
    } catch (error) {
      console.error('Confirm booking error:', error);
      notify('Error confirming booking: Network error', { type: 'error' });
    }
  };

  const handleCancel = async () => {
    if (!record) {
      notify('No booking record found', { type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        notify('Please log in to perform this action', { type: 'error' });
        return;
      }

      const response = await fetch(`https://public-repo-j9sl.onrender.com/api/bookings/admin/${record.id}/cancel`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        notify('Booking cancelled successfully', { type: 'success' });
        refresh();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        notify(`Error cancelling booking: ${errorData.message || 'Unknown error'}`, { type: 'error' });
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      notify('Error cancelling booking: Network error', { type: 'error' });
    }
  };

  const handleComplete = async () => {
    if (!record) {
      notify('No booking record found', { type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        notify('Please log in to perform this action', { type: 'error' });
        return;
      }

      const response = await fetch(`https://public-repo-j9sl.onrender.com/api/bookings/admin/${record.id}/complete`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        notify('Booking completed successfully', { type: 'success' });
        refresh();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        notify(`Error completing booking: ${errorData.message || 'Unknown error'}`, { type: 'error' });
      }
    } catch (error) {
      console.error('Complete booking error:', error);
      notify('Error completing booking: Network error', { type: 'error' });
    }
  };

  // Don't show buttons if record is not available
  if (!record) {
    return (
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
        <p>Loading booking details...</p>
      </div>
    );
  }

  // Only show buttons for pending and confirmed bookings
  if (record.status && !['pending', 'confirmed'].includes(record.status)) {
    const statusText = record.status === 'completed' ? 'completed' : 
                      record.status === 'cancelled' ? 'cancelled' : 
                      record.status;
    return (
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p style={{ color: '#000000', margin: 0 }}>This booking has already been {statusText}.</p>
      </div>
    );
  }

  // If status is undefined or null, show buttons (treat as pending)
  if (!record.status) {
    return (
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Button
          label="Confirm Booking"
          onClick={handleConfirm}
          startIcon={<CheckCircleIcon />}
          color="primary"
        />
        <Button
          label="Cancel Booking"
          onClick={handleCancel}
          startIcon={<CancelIcon />}
          color="error"
        />
        <Button
          label="Complete Booking"
          onClick={handleComplete}
          startIcon={<TaskAltIcon />}
          color="success"
        />
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
      <Button
        label="Confirm Booking"
        onClick={handleConfirm}
        startIcon={<CheckCircleIcon />}
        color="primary"
      />
      <Button
        label="Cancel Booking"
        onClick={handleCancel}
        startIcon={<CancelIcon />}
        color="error"
        />
        <Button
          label="Complete Booking"
          onClick={handleComplete}
          startIcon={<TaskAltIcon />}
          color="success"
        />
      </div>
    );
  };

  export const BookingShow = (props: any) => {
    return (
      <Show {...props}>
        <SimpleShowLayout>
          <TextField source="category" label="Category" />
          <TextField source="service" label="Service" />
          <FunctionField source="estimatedCost" label="Estimated Cost" render={(record: any) => record.estimatedCost ? `Rs.${record.estimatedCost}` : 'Rs.0'} />
          <ChipField source="status" label="Status" />
          <DateField source="date" label="Date" />
          <TextField source="time" label="Time" />
          <TextField source="location" label="Location" />
          <TextField source="additionalInstructions" label="Additional Instructions" />
          <DateField source="createdAt" label="Created At" />
          <DateField source="updatedAt" label="Last Updated" />
          <BookingActions />
        </SimpleShowLayout>
      </Show>
    );
  };
