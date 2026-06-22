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
    <Box sx={{ display: 'flex', gap: 2, mb: 4, mt: 2, flexWrap: 'wrap' }}>
      {/* Total Bookings Card - Simple Blue Style */}
      <Card sx={{ minWidth: 200, backgroundColor: '#e3f2fd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ListAltIcon color="primary" fontSize="small" />
            <Typography color="textSecondary" variant="subtitle2">Total Bookings</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: '500' }}>{stats.totalBookings}</Typography>
        </CardContent>
      </Card>

      {/* Pending Wallets Card - Simple Grey/Red Style */}
      <Card sx={{
        minWidth: 220,
        backgroundColor: stats.pendingWallets > 0 ? '#ffebee' : '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: stats.pendingWallets > 0 ? '1px solid #ef5350' : 'none'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AccountBalanceWalletIcon color={stats.pendingWallets > 0 ? "error" : "disabled"} fontSize="small" />
            <Typography color="textSecondary" variant="subtitle2">Pending Wallets</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: '500' }} color={stats.pendingWallets > 0 ? "error.main" : "text.primary"}>
            {stats.pendingWallets}
          </Typography>
          {stats.pendingWallets > 0 && (
            <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>Action required!</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export const Dashboard = () => (
  <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
    <Typography variant="h4" sx={{ fontWeight: '700', color: '#333', mb: 1 }}>Admin Dashboard</Typography>
    <DashboardStats />
  </Box>
);
