import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  Filter,
  SearchInput,
  SelectInput,
  ChipField,
  ShowButton,
  Button,
  useNotify,
  useRefresh,
  useRecordContext,
} from 'react-admin';
import { Chip } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const BookingFilter = (props: any) => (
  <Filter {...props}>
    <SearchInput source="q" placeholder="Search bookings..." alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: 'pending', name: 'Pending' },
        { id: 'confirmed', name: 'Confirmed' },
        { id: 'completed', name: 'Completed' },
        { id: 'cancelled', name: 'Cancelled' },
        { id: 'all', name: 'All Statuses' },
      ]}
      defaultValue="pending"
      alwaysOn
    />
  </Filter>
);

const StatusField = () => {
  const record = useRecordContext();
  
  console.log('StatusField - record:', record);
  console.log('StatusField - record.status:', record?.status);

  if (!record) {
    return <span>No Record</span>;
  }

  if (!record.status) {
    return <span>No Status Field</span>;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Chip
      label={getStatusText(record.status)}
      color={getStatusColor(record.status) as any}
      size="small"
      variant="filled"
    />
  );
};

const ConfirmButton = ({ record }: { record?: any }) => {
  const notify = useNotify();
  const refresh = useRefresh();

  const handleConfirm = async () => {
    if (!record) return;
    
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

  if (!record || record.status !== 'pending') {
    return null;
  }

  return (
    <Button
      label="Confirm"
      onClick={handleConfirm}
      color="primary"
      size="small"
    />
  );
};

const CancelButton = ({ record }: { record?: any }) => {
  const notify = useNotify();
  const refresh = useRefresh();

  const handleCancel = async () => {
    if (!record) return;
    
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

  if (!record || record.status === 'cancelled') {
    return null;
  }

  return (
    <Button
      label="Cancel"
      onClick={handleCancel}
      color="error"
      size="small"
    />
  );
};

const CompleteButton = ({ record }: { record?: any }) => {
  const notify = useNotify();
  const refresh = useRefresh();

  const handleComplete = async () => {
    if (!record) return;
    
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

  if (!record || record.status === 'completed' || record.status === 'cancelled') {
    return null;
  }

  return (
    <Button
      label="Complete"
      onClick={handleComplete}
      startIcon={<TaskAltIcon />}
      color="success"
      size="small"
    />
  );
};

export const BookingList = (props: any) => {
  return (
    <List {...props} filters={<BookingFilter />} filterDefaultValues={{ status: 'pending' }}>
      <Datagrid>
        <TextField source="category" label="Category" />
        <TextField source="service" label="Service" />
        <FunctionField source="estimatedCost" label="Cost" render={(record: any) => record.estimatedCost ? `Rs.${record.estimatedCost}` : 'Rs.0'} />
        <DateField source="date" label="Date" />
        <TextField source="time" label="Time" />
        <TextField source="location" label="Location" />
        <StatusField />
        <DateField source="createdAt" label="Created" />
        <ConfirmButton />
        <CancelButton />
        <CompleteButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};
