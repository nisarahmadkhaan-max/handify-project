import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { List, Datagrid, TextField, DateField, NumberField, ShowButton, Button, useNotify, useRefresh, useRecordContext } from 'react-admin';
import PeopleIcon from '@mui/icons-material/People';

const apiUrl = 'https://public-repo-j9sl.onrender.com/api';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingVerifications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        // Fetch Bookings
        const bRes = await fetch(`${apiUrl}/bookings`, { headers });
        const bookings = await bRes.json();

        // Fetch Employees for Verification Alert
        const eRes = await fetch(`${apiUrl}/employees`, { headers });
        const eData = await eRes.json();
        const pendingEmps = eData.data.filter((e: any) => !e.isVerified).length;

        setStats({
          totalBookings: bookings.length,
          pendingVerifications: pendingEmps
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Card sx={{ minWidth: 200, backgroundColor: '#e3f2fd' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>Total Bookings</Typography>
          <Typography variant="h4">{stats.totalBookings}</Typography>
        </CardContent>
      </Card>

      {/* NEW: Verification Alert Card */}
      <Card sx={{
        minWidth: 250,
        backgroundColor: stats.pendingVerifications > 0 ? '#ffcdd2' : '#f5f5f5',
        border: stats.pendingVerifications > 0 ? '2px solid #d32f2f' : 'none'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon color={stats.pendingVerifications > 0 ? "error" : "disabled"} />
            <Typography color="textSecondary">Pending Verifications</Typography>
          </Box>
          <Typography variant="h4" color={stats.pendingVerifications > 0 ? "error.main" : "text.primary"}>
            {stats.pendingVerifications}
          </Typography>
          {stats.pendingVerifications > 0 && (
            <Typography variant="body2" color="error">New employees waiting for approval!</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export const Dashboard = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
    <DashboardStats />
    {/* Existing Recent Bookings table here... */}
  </Box>
);
