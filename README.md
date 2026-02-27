# Event Management System - MERN Stack

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn

## Quick Start

### 1. Install MongoDB
If you don't have MongoDB installed:
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2. Start MongoDB
```bash
# Windows (if installed locally)
net start MongoDB

# Or run mongod manually
mongod
```

### 3. Install Backend Dependencies
```bash
npm install
```

### 4. Configure Environment
Update `.env` file if needed (default settings should work):
```
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### 5. Seed Database (Create Test User)
```bash
npm run seed
```
This creates a test user:
- User ID: `vendor1`
- Password: `admin123`

### 6. Start Backend Server
```bash
npm run dev
```
Server runs on http://localhost:5000

### 7. Start Frontend (New Terminal)
```bash
cd client
npm start
```
Frontend runs on http://localhost:3000

## OR Run Both Together
```bash
npm run dev-full
```

## Test the Application

1. Open http://localhost:3000
2. Click "Sign Up as Vendor" to register a new vendor
3. Or login with test credentials:
   - User ID: `vendor1`
   - Password: `admin123`

## Features
- ✅ Vendor login/signup
- ✅ Category selection (Catering, Florist, Decoration, Lighting)
- ✅ Vendor dashboard
- ✅ Navigation menu
- 🔄 Item management (coming soon)
- 🔄 Transaction tracking (coming soon)

## API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/vendors/signup` - Vendor registration
- `GET /api/vendors` - Get all vendors
- `POST /api/items` - Add new item
- `GET /api/items` - Get all items
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions

## Troubleshooting

### MongoDB Connection Error
If you see "MongooseServerSelectionError":
1. Make sure MongoDB is installed
2. Start MongoDB service: `net start MongoDB` (Windows)
3. Or use MongoDB Atlas cloud database

### Port Already in Use
If port 5000 or 3000 is busy:
- Change PORT in `.env` file
- Or stop the process using that port

### CORS Errors
Make sure backend is running on port 5000 and frontend on port 3000
