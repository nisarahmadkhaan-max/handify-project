const jwt = require('jsonwebtoken');

// Test admin token generation
const adminToken = jwt.sign(
  { userId: 'admin', role: 'admin' },
  'your-secret-key',
  { expiresIn: '7d' }
);

console.log('Admin token:', adminToken);

// Test token verification
try {
  const decoded = jwt.verify(adminToken, 'your-secret-key');
  console.log('Decoded token:', decoded);
  
  if (decoded.userId === 'admin' && decoded.role === 'admin') {
    console.log('✅ Admin authentication should work!');
  } else {
    console.log('❌ Admin authentication failed');
  }
} catch (error) {
  console.log('❌ Token verification failed:', error.message);
} 