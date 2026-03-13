# Event Management System - Complete Setup Guide

## Features Implemented

### ✅ User Roles & Access Control
- **Admin**: Full access to Maintenance, Reports, and Transactions
- **User**: Access to Reports and Transactions only (no Maintenance access)

### ✅ Maintenance Module (Admin Only)
- **Add Membership**: All fields mandatory with radio button selection (6 months default)
- **Update Membership**: Search by membership number, extend or cancel membership

### ✅ Reports Module (Admin & User)
- Generate membership reports
- Generate transaction reports
- View all generated reports with statistics

### ✅ Transactions Module (Admin & User)
- View all transactions
- Chart visualization toggle
- Transaction history table

### ✅ Security & Validation
- Password fields hidden (type="password")
- Form validations on all inputs
- Session management with JWT tokens
- Protected routes with authentication middleware

### ✅ UI/UX Features
- Radio buttons (only one selectable)
- Proper form validations
- Error and success messages
- Responsive design

## Quick Start

### 1. Install MongoDB
Download and install from: https://www.mongodb.com/try/download/community

### 2. Start MongoDB
```bash
# Windows
net start MongoDB

# Or run mongod manually
mongod
```

### 3. Install Backend Dependencies
```bash
npm install
```

### 4. Seed Database with Admin & User
```bash
npm run seed-admin
```

This creates:
- **Admin**: userId: `admin`, password: `admin123`
- **User**: userId: `user1`, password: `admin123`

### 5. Start Backend Server
```bash
npm run dev
```
Server runs on http://localhost:5000

### 6. Start Frontend
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

### Login as Admin
1. Go to http://localhost:3000
2. Login with:
   - User ID: `admin`
   - Password: `admin123`
3. You'll see: Maintenance, Reports, Transactions buttons

### Login as User
1. Logout and login with:
   - User ID: `user1`
   - Password: `admin123`
2. You'll see: Reports, Transactions buttons (NO Maintenance)

## Features to Test

### Maintenance Module (Admin Only)

#### Add Membership
1. Click "Maintenance" → "Add Membership"
2. Fill all mandatory fields:
   - Name
   - Email
   - Phone
   - Address
3. Select membership type (radio buttons - only one can be selected):
   - 6 Months (default)
   - 1 Year
   - 2 Years
4. Click "Add Membership"
5. Membership number will be generated automatically

#### Update Membership
1. Click "Maintenance" → "Update Membership"
2. Enter membership number (e.g., MEM000001)
3. Click "Search"
4. Details will populate
5. Choose action (radio buttons):
   - Extend Membership (select 6 months/1 year/2 years)
   - Cancel Membership
6. Click "Update Membership"

### Reports Module (Admin & User)
1. Click "Reports"
2. Click "Generate Membership Report" or "Generate Transaction Report"
3. View generated reports with statistics
4. Reports show:
   - Total count
   - Active/Cancelled status
   - Transaction amounts
   - Generation date

### Transactions Module (Admin & User)
1. Click "Transactions"
2. Click "SHOW CHART" to view monthly transaction chart
3. View transaction history table
4. See transaction status (Completed/Pending/Cancelled)

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login

### Memberships (Admin only)
- POST `/api/memberships` - Add membership
- GET `/api/memberships/:membershipNumber` - Get membership
- PUT `/api/memberships/:membershipNumber` - Update membership
- GET `/api/memberships` - Get all memberships

### Reports (Admin & User)
- POST `/api/reports/membership` - Generate membership report
- POST `/api/reports/transaction` - Generate transaction report
- GET `/api/reports` - Get all reports

### Transactions (Admin & User)
- GET `/api/transactions` - Get all transactions
- POST `/api/transactions` - Create transaction

## Project Structure

```
event-management-system/
├── server.js                 # Express server
├── models/
│   ├── User.js              # User model (admin/user roles)
│   ├── Membership.js        # Membership model
│   ├── Report.js            # Report model
│   └── Transaction.js       # Transaction model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── memberships.js       # Membership CRUD
│   ├── reports.js           # Report generation
│   └── transactions.js      # Transaction routes
├── middleware/
│   └── auth.js              # JWT authentication & admin check
├── client/
│   └── src/
│       ├── components/
│       │   ├── Login.js     # Login with password hidden
│       │   ├── Dashboard.js # Role-based dashboard
│       │   ├── Maintenance.js # Admin-only maintenance
│       │   ├── Reports.js   # Reports for all
│       │   └── Transactions.js # Transactions for all
│       └── App.js           # Main app with session
└── package.json

```

## Key Implementation Details

### 1. Password Security
- Passwords are hashed with bcrypt
- Login form uses `type="password"` to hide input

### 2. Session Management
- JWT tokens stored in localStorage
- Token sent with every API request
- Auto-login if valid token exists

### 3. Role-Based Access
- Middleware checks user role
- Admin can access all modules
- User cannot access Maintenance

### 4. Form Validations
- All mandatory fields validated
- Email format validation
- Phone number validation
- Error messages displayed

### 5. Radio Buttons
- Only one option selectable
- Default values set (6 months)
- Proper state management

### 6. Membership Flow
- Auto-generated membership numbers (MEM000001, MEM000002, etc.)
- Automatic end date calculation
- Status tracking (active/cancelled/expired)

## Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
net start MongoDB
# Or
mongod
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### Cannot Access Maintenance
- Make sure you're logged in as admin
- User role cannot access Maintenance module

### Token Expired
- Logout and login again
- Tokens expire after 24 hours

## Environment Variables

Update `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_secret_key_change_this_in_production
PORT=5000
```

## Production Deployment

1. Set strong JWT_SECRET
2. Use MongoDB Atlas for database
3. Enable HTTPS
4. Set proper CORS origins
5. Add rate limiting
6. Enable logging

## Support

For issues or questions, check:
- MongoDB is running
- All dependencies installed
- Correct user credentials
- Valid JWT token
