# LazyPay Frontend

A simple React frontend for the PayLater service (LazyPay).

## Features

- **Customer Authentication**: Signup, login, logout
- **Merchant Authentication**: Signup, login, logout  
- **Customer Dashboard**: View profile, credit limit, recent transactions, repay option
- **Merchant Dashboard**: View profile, update commission, see total earnings and recent transactions
- **Transaction Management**: Make purchases, view transaction history, repay transactions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Make sure the backend server is running on `http://localhost:8000`

## API Endpoints Used

- `/customer/signup` - Customer registration
- `/customer/login` - Customer login (JWT token)
- `/customer/protected` - Get customer profile
- `/merchant/` - Get all merchants, create merchant
- `/merchant/{id}/commision` - Update merchant commission
- `/transaction/pay` - Create new transaction
- `/transaction/repay` - Repay transaction
- `/transaction/` - Get all transactions

## User Flow

### Customer Flow:
1. Sign up with name, email, phone, credit limit
2. Login with email/password
3. View dashboard with profile and credit limit
4. Make purchases with merchants
5. View transaction history
6. Repay pending transactions

### Merchant Flow:
1. Sign up as merchant
2. Login (contact support for credentials)
3. View dashboard with earnings
4. Update commission rates
5. View transaction history

## Technology Stack

- React 19.2.0
- React Router DOM 7.9.3
- Context API for state management
- Fetch API for HTTP requests
- CSS3 for styling (no external UI libraries)

## Project Structure

```
src/
├── components/
│   └── Navbar.js          # Navigation component
├── contexts/
│   └── AuthContext.js     # Authentication context
├── pages/
│   ├── Home.js            # Landing page
│   ├── Login.js           # Login page
│   ├── Signup.js          # Registration page
│   ├── CustomerDashboard.js # Customer dashboard
│   ├── MerchantDashboard.js # Merchant dashboard
│   └── TransactionPage.js  # Transaction management
├── services/
│   └── api.js             # API service layer
├── App.js                 # Main app component
├── App.css                # Global styles
└── index.js               # App entry point
```

## Testing Checklist

- ✅ All routes work correctly
- ✅ Customer signup → login → dashboard → transaction → repay
- ✅ Merchant signup → dashboard → commission update
- ✅ JWT token persistence across page refreshes
- ✅ Logout functionality
- ✅ Error messages display properly
- ✅ Loading states work during API calls
- ✅ Responsive design on mobile screens

## Development Notes

- Uses JWT tokens for authentication
- Stores user data in localStorage
- Role-based navigation and features
- Responsive design with CSS Grid and Flexbox
- No external UI libraries - pure React and CSS
- Error handling for all API calls
- Loading states for better UX