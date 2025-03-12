# Flipkart Clone (MERN Stack)

A full-stack e-commerce web application that replicates core features of Flipkart, built using the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Live Demo
🚀 [View Live Demo](https://flipkart-mern-clone.vercel.app)

## Features

### Authentication & User Management
- User signup and login with JWT authentication
- Profile management (edit personal info, manage addresses)
- Account deletion functionality

### Product Management
- Browse fashion products by category (Men/Women)
- Product search with instant suggestions
- Product details with multiple images
- Sort products by price and popularity
- Pagination support

### Shopping Features
- Cart management (add/remove items, update quantities)
- Wishlist functionality
- Address management (add/edit/delete)
- Secure checkout with Stripe payment integration
- Order history and tracking

### User Interface
- Intuitive navigation with category filters
- Real-time search suggestions
- Form validation and error handling
- Loading states and animations
- Toast notifications for user actions

## Technology Stack

### Frontend
- React.js with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- React Hot Toast for notifications

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Stripe for payment processing

## Local Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/FlipkartMERN_clone.git
cd FlipkartMERN_clone
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Backend (.env):
```
PORT=3000
MONGO_URL=your_mongodb_url
JWT_SECRET_KEY=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=http://localhost:5173
```

Frontend (.env):
```
VITE_SERVER_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run the development servers:

```bash
# Run backend server
cd backend
npm run dev

# Run frontend server
cd frontend
npm run dev
```

## Notes
- Project is currently optimized for desktop view only
- Fashion category products are available for demonstration
- Test card for payments(India Only): 4000003560000008

## Future Enhancements
1. Admin panel and seller accounts for product listing
2. Additional product categories
3. Responsive design for all device sizes
4. Advanced search filters
5. Product reviews and ratings
6. Order cancellation functionality

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
