const jwt = require('jsonwebtoken');

// Test the exact same token generation as the login route
const adminToken = jwt.sign(
  { userId: 'admin', role: 'admin' },
  'your-secret-key',
  { expiresIn: '7d' }
);

console.log('Generated admin token:', adminToken);

// Test token verification
try {
  const decoded = jwt.verify(adminToken, 'your-secret-key');
  console.log('Decoded token:', decoded);
  
  // Simulate the auth middleware logic
  if (decoded.userId === 'admin' && decoded.role === 'admin') {
    console.log('✅ Admin token verification successful');
    
    // Simulate setting req.user
    const req = {
      user: {
        _id: 'admin',
        role: 'admin',
        fullName: 'Admin User',
        email: 'admin@gmail.com'
      }
    };
    
    // Simulate admin middleware check
    if (req.user && req.user.role === 'admin') {
      console.log('✅ Admin middleware check successful');
      console.log('User object:', req.user);
    } else {
      console.log('❌ Admin middleware check failed');
      console.log('req.user:', req.user);
      console.log('req.user.role:', req.user?.role);
    }
  } else {
    console.log('❌ Admin token verification failed');
  }
} catch (error) {
  console.log('❌ Token verification failed:', error.message);
} 