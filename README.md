# FAMI-NA Express - Food Delivery Website

A modern, full-stack food delivery website built with HTML, CSS, JavaScript, Node.js, and Express.js. Order delicious food from your favorite restaurants and get it delivered to your doorstep.

## 🚀 Features

### Core Functionality
- **Browse Restaurants**: Explore featured restaurants with ratings and delivery times
- **Menu Categories**: Filter food by categories (Pizza, Burger, Pasta, Salad, Dessert, Beverage)
- **Shopping Cart**: Add items to cart, update quantities, and manage orders
- **User Authentication**: Register, login, and manage user accounts with JWT
- **Order Management**: Place orders, view order history, and track deliveries
- **RESTful API**: Backend API for all data operations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### User Experience
- **Search & Filter**: Find restaurants and menu items easily
- **Real-time Cart Updates**: See cart count in header navigation
- **Form Validation**: Client-side validation for all forms
- **Loading Indicators**: Visual feedback for async operations
- **Toast Notifications**: User-friendly success/error messages

### Pages & Components
- **Homepage**: Hero section, categories, and featured restaurants
- **Menu Page**: Browse all menu items with filtering options
- **Restaurant Page**: View restaurants and their details
- **Cart Page**: Review and modify cart items
- **Checkout Page**: Complete order with delivery information
- **Profile Page**: Manage account information
- **Orders Page**: View order history
- **Authentication**: Login and registration forms
- **Support Pages**: Contact, FAQ, Privacy Policy, Terms of Service

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Icons & Fonts**: Font Awesome, Google Fonts
- **Storage**: LocalStorage for client-side data persistence
- **Architecture**: Modular JavaScript with separation of concerns

## 📁 Project Structure

```
food-delivery-web/
├── index.html                 # Homepage
├── menu.html                  # Menu browsing page
├── restaurant.html            # Restaurants listing page
├── cart.html                  # Shopping cart page
├── checkout.html              # Checkout process page
├── profile.html               # User profile management
├── orders.html                # Order history page
├── login.html                 # User login page
├── register.html              # User registration page
├── contact.html               # Contact form page
├── faq.html                   # Frequently asked questions
├── privacy.html               # Privacy policy page
├── terms.html                 # Terms of service page
├── 404.html                   # Error page
├── TODO.md                    # Project task list
├── README.md                  # Project documentation
├── backend/
│   ├── server.js              # Express server setup
│   ├── package.json           # Node.js dependencies
│   └── routes/
│       ├── auth.js            # Authentication API routes
│       ├── restaurants.js     # Restaurant data API
│       ├── menu.js            # Menu items API
│       ├── cart.js            # Shopping cart API
│       ├── orders.js          # Order management API
│       ├── payments.js        # Stripe payment processing
│       └── notifications.js   # Push notifications API
├── assets/
│   ├── css/
│   │   ├── style.css          # Main stylesheet
│   │   └── responsive.css     # Responsive design styles
│   ├── js/
│   │   ├── main.js            # Main application logic
│   │   ├── utils.js           # Utility functions
│   │   ├── data.js            # Sample data and constants
│   │   ├── cart.js            # Cart management functionality
│   │   ├── auth.js            # Authentication logic
│   │   ├── checkout.js        # Checkout process handling
│   │   └── menu.js            # Menu filtering and display
│   ├── images/                # Food and restaurant images
│   ├── icons/                 # UI icons
│   └── fonts/                 # Custom fonts
└── components/
    ├── header.html            # Site header/navigation
    └── footer.html            # Site footer
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for better development experience)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/food-delivery-web.git
   cd food-delivery-web
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - For better development experience, use a local server:
     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js
     npx serve .

     # Using PHP
     php -S localhost:8000
     ```

3. **Access the application**
   - Open `http://localhost:8000` (if using server) or directly open `index.html`

## 🎯 Usage

### For Customers
1. **Browse Food**: Explore categories and restaurants on the homepage
2. **Add to Cart**: Click "Add to Cart" on menu items
3. **Checkout**: Review cart and complete order with delivery details
4. **Track Orders**: View order history in your profile

### For Developers
- **Modify Data**: Update `assets/js/data.js` to add new restaurants or menu items
- **Customize Styling**: Edit `assets/css/style.css` for theme changes
- **Add Features**: Extend functionality in respective JavaScript files

## 🔧 Configuration

### Adding New Restaurants
Edit `assets/js/data.js` and add to the `restaurants` array:

```javascript
{
    id: 5,
    name: 'New Restaurant',
    image: 'assets/images/new-restaurant.jpg',
    cuisine: 'Cuisine Type',
    rating: 4.5,
    deliveryTime: '25-30 min',
    description: 'Restaurant description'
}
```

### Adding Menu Items
Add to the `menuItems` array in `assets/js/data.js`:

```javascript
{
    id: 11,
    name: 'New Dish',
    category: 'Category Name',
    price: 15.99,
    image: 'assets/images/new-dish.jpg',
    description: 'Dish description',
    restaurantId: 1
}
```

### Customizing Colors
Update CSS custom properties in `assets/css/style.css`:

```css
:root {
    --primary: #your-color;
    --secondary: #your-color;
    /* ... other variables */
}
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px and above
- **Tablet**: 768px to 1199px
- **Mobile**: Below 768px

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads correctly with categories and restaurants
- [ ] Navigation works across all pages
- [ ] User registration and login functionality
- [ ] Adding items to cart and updating quantities
- [ ] Checkout process completes successfully
- [ ] Order history displays correctly
- [ ] Responsive design on different screen sizes
- [ ] Form validation works properly
- [ ] Search and filtering functionality

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Food images sourced from various free stock photo websites
- Icons provided by Font Awesome
- Fonts from Google Fonts
- Design inspiration from popular food delivery apps

## 📞 Support

For support, email support@famínaexpress.com or create an issue in this repository.

## 🔄 Future Enhancements

- [x] Backend API integration
- [x] Real payment processing
- [x] Push notifications
- [ ] Restaurant owner dashboard
- [ ] Delivery tracking with maps
- [ ] Multi-language support
- [x] Dark mode theme
- [ ] Progressive Web App (PWA) features

---

**Made with ❤️ for food lovers everywhere**
