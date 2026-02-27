# Step-by-Step Setup Guide

## Problem: MongoDB Not Running

You're seeing this error because MongoDB is not installed or not running on your system.

## Solution Options

### Option 1: Install MongoDB Locally (Recommended for Development)

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select your Windows version
   - Download and install

2. **Start MongoDB**
   ```bash
   # After installation, start MongoDB service
   net start MongoDB
   ```

3. **Run the seed script**
   ```bash
   npm run seed
   ```

4. **Start the application**
   ```bash
   # Terminal 1 - Backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

### Option 2: Use MongoDB Atlas (Cloud - Free Tier)

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier
   - Select a region close to you
   - Click "Create"

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update .env file**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```
   Replace `username` and `password` with your MongoDB Atlas credentials

5. **Whitelist Your IP**
   - In Atlas, go to Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

6. **Run the application**
   ```bash
   npm run seed
   npm run dev
   # In another terminal
   cd client
   npm start
   ```

## Current Status

✅ Backend code is ready
✅ Frontend code is ready
✅ Dependencies installed
❌ MongoDB needs to be started

## Next Steps

1. Choose Option 1 or Option 2 above
2. Follow the steps for your chosen option
3. Run `npm run seed` to create test user
4. Start the application with `npm run dev-full`
5. Open http://localhost:3000 in your browser

## Test Credentials (After Seeding)

- User ID: `vendor1`
- Password: `admin123`
