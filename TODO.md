# Backend API Integration TODO

- [x] Create backend/ directory
- [x] Create package.json with Express, CORS, JWT, etc.
- [x] Create server.js for Express server setup
- [x] Create routes/auth.js for authentication API
- [x] Create routes/restaurants.js for restaurants API
- [x] Create routes/menu.js for menu API
- [x] Create routes/cart.js for cart API
- [x] Create routes/orders.js for orders API
- [x] Install dependencies: npm install
- [x] Run server: npm start
- [ ] Test API endpoints
- [x] Update auth.js to use API calls
- [x] Update cart.js to use API calls
- [x] Update checkout.js to use API calls
- [x] Update menu.js to use API calls
- [x] Modify data.js to not export data directly (or remove)

# Real Payment Processing TODO

- [ ] Add Stripe dependency to backend
- [ ] Create payment route for payment intents
- [ ] Update orders to include payment status
- [ ] Add Stripe.js to frontend
- [ ] Update checkout.js for Stripe integration
- [ ] Add payment form UI
- [ ] Test payment flow

# Push Notifications TODO

- [x] Create notifications.js route with web-push integration
- [x] Add VAPID keys configuration
- [x] Implement subscription endpoint
- [x] Implement send notification endpoint
- [x] Add service worker for push handling
- [x] Update frontend to request notification permission
- [x] Add notification UI components
- [x] Test push notification functionality
