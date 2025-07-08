require('dotenv').config({ path: __dirname + '/.env' });
 
console.log('Testing dotenv load:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT || 'Not set in .env or default'); 