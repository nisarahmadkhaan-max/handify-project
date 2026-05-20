import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  ShowButton,
  Button,
  useNotify,
  useRefresh,
  ChipField,
  useRecordContext,
} from 'react-admin';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const apiUrl = 'https://public-repo-j9sl.onrender.com/api';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${apiUrl}/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const bookings = await response.json();
          const total = bookings.length;
          const pending = bookings.filter((b: any) => b.status === 'pending').length;
          const confirmed = bookings.filter((b: any) => b.status === 'confirmed').length;
          const completed = bookings.filter((b: any) => b.status === 'completed').length;
          const cancelled = bookings.filter((b: any) => b.status === 'cancelled').length;

          setStats({ total, pending, confirmed, completed, cancelled });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Card sx={{ minWidth: 200 }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Total Bookings
          </Typography>
          <Typography variant="h4">{stats.total}</Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, backgroundColor: '#fff3cd' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Pending
          </Typography>
          <Typography variant="h4" color="warning.main">
            {stats.pending}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, backgroundColor: '#d4edda' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Confirmed
          </Typography>
          <Typography variant="h4" color="success.main">
            {stats.confirmed}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, backgroundColor: '#cce5ff' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Completed
          </Typography>
          <Typography variant="h4" color="info.main">
            {stats.completed}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, backgroundColor: '#f8d7da' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Cancelled
          </Typography>
          <Typography variant="h4" color="error.main">
            {stats.cancelled}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

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

      const response = await fetch(`${apiUrl}/bookings/admin/${record.id}/confirm`, {
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

      const response = await fetch(`${apiUrl}/bookings/admin/${record.id}/cancel`, {
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

      const response = await fetch(`${apiUrl}/bookings/admin/${record.id}/complete`, {
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

const PendingBookings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Bookings
        </Typography>
        <List
          resource="bookings"
          perPage={5}
          sort={{ field: 'createdAt', order: 'DESC' }}
          pagination={false}
        >
          <Datagrid>
            <TextField source="category" label="Category" />
            <TextField source="service" label="Service" />
            <FunctionField source="estimatedCost" label="Cost" render={(record: any) => record.estimatedCost ? `Rs.${record.estimatedCost}` : 'Rs.0'} />
            <DateField source="date" label="Date" />
            <TextField source="time" label="Time" />
            <StatusField />
            <ConfirmButton />
            <CancelButton />
            <CompleteButton />
            <ShowButton />
          </Datagrid>
        </List>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <DashboardStats />
      <PendingBookings />
    </Box>
  );
};
