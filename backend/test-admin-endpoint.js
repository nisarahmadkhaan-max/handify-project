const fetch = require('node-fetch');

async function testAdminAuth() {
  try {
    // First, login as admin
    console.log('Testing admin login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('Token:', loginData.token);

    // Now test the admin endpoint
    console.log('\nTesting admin bookings endpoint...');
    const bookingsResponse = await fetch('http://localhost:3000/api/bookings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!bookingsResponse.ok) {
      console.log('❌ Admin endpoint failed:', await bookingsResponse.text());
      return;
    }

    const bookingsData = await bookingsResponse.json();
    console.log('✅ Admin endpoint successful');
    console.log('Bookings count:', bookingsData.length);
    console.log('First booking:', bookingsData[0]);

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testAdminAuth(); 