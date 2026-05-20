const auth = (req, res, next) => {
  // auth middleware should be called before this
  console.log('Admin middleware - req.user:', req.user);
  console.log('Admin middleware - req.user.role:', req.user?.role);
  
  if (req.user && req.user.role === 'admin') {
    console.log('Admin access granted');
    next();
  } else {
    console.log('Admin access denied');
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = auth; 