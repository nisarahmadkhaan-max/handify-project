import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListAltIcon from '@mui/icons-material/ListAlt';

const apiUrl = 'https://handify-api.vercel.app/api';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingWallets: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch Bookings Count
        const bRes = await fetch(`${apiUrl}/bookings`, { headers });
        const bData = await bRes.json();

        // Fetch Wallet Requests Count
        const wRes = await fetch(`${apiUrl}/wallet/requests`, { headers });
        const wData = await wRes.json();

        // Filter pending wallets
        const pendingW = Array.isArray(wData) ? wData.filter((w: any) => w.status === 'pending').length : 0;
        const bookingsCount = Array.isArray(bData) ? bData.length : 0;

        setStats({
          totalBookings: bookingsCount,
          pendingWallets: pendingW
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 3, mb: 4, mt: 2, flexWrap: 'wrap' }}>
      {/* Total Bookings Card */}
      <Card sx={{ minWidth: 240, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '15px' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <ListAltIcon fontSize="large" />
            <Typography variant="h6" sx={{ opacity: 0.9 }}>Total Bookings</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.totalBookings}</Typography>
        </CardContent>
      </Card>

      {/* Pending Wallets Card */}
      <Card sx={{
        minWidth: 240,
        background: stats.pendingWallets > 0 ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' : 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        color: stats.pendingWallets > 0 ? '#b91c1c' : '#065f46',
        borderRadius: '15px',
        border: stats.pendingWallets > 0 ? '2px solid #ef4444' : 'none'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <AccountBalanceWalletIcon fontSize="large" />
            <Typography variant="h6" sx={{ opacity: 0.9 }}>Pending Wallets</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.pendingWallets}</Typography>
          {stats.pendingWallets > 0 && (
            <Typography variant="caption" sx={{ fontWeight: '600' }}>Verification required!</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export const Dashboard = () => (
  <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
    <Typography variant="h4" sx={{ fontWeight: '800', color: '#1e293b' }}>Admin Overview</Typography>
    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>Welcome back! Here is what's happening today.</Typography>
    <DashboardStats />
  </Box>
);
