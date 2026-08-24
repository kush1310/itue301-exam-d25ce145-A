/**
 * Database Seed Script — QuickBite Food Ordering System
 *
 * Populates MongoDB with standard initial data:
 * - Customers (Customer, Admin)
 * - Restaurants (Italian, Indian, Asian, Mexican, Cafe) with menu items
 * - Sample orders to verify Mongoose references and population
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('../models/Customer');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('[SEED_ERROR] MONGO_URI missing.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('[SEED] Connected to MongoDB Atlas.');

    // Clear existing collections
    await Order.deleteMany({});
    await Restaurant.deleteMany({});
    await Customer.deleteMany({});
    console.log('[SEED] Cleared existing Customers, Restaurants, and Orders.');

    // 1. Create Seed Customers
    const customer1 = await Customer.create({
      name: 'Kush Shah',
      email: 'kush@charusat.edu.in',
      password: 'password123',
      phone: '+91 98765 43210',
      address: 'Hostel Block A, Room 302, CHARUSAT Campus, Changa',
      role: 'Customer'
    });

    const adminUser = await Customer.create({
      name: 'Admin User',
      email: 'admin@quickbite.com',
      password: 'adminpassword123',
      phone: '+91 98765 00000',
      address: 'CSPIT IT Dept, Changa',
      role: 'Admin'
    });

    const customer2 = await Customer.create({
      name: 'Priya Patel',
      email: 'priya@charusat.edu.in',
      password: 'password123',
      phone: '+91 98765 11111',
      address: 'Faculty Quarters B-12, CHARUSAT Campus, Changa',
      role: 'Customer'
    });

    console.log(`[SEED] Created ${3} customers.`);

    // 2. Create Seed Restaurants
    const restaurantsData = [
      {
        name: 'The Rustic Oven Bistro',
        cuisine: 'Italian & Woodfired Pizza',
        rating: 4.8,
        isOpen: true,
        address: 'Opposite Central Library, Changa Campus',
        deliveryTimeMinutes: 25,
        menu: [
          { name: 'Margherita Woodfired Pizza', price: 280, category: 'Pizza' },
          { name: 'Penne Arrabiata Pasta', price: 240, category: 'Pasta' },
          { name: 'Garlic Herb Bread with Cheese', price: 150, category: 'Sides' },
          { name: 'Tiramisu Classic', price: 180, category: 'Dessert' }
        ]
      },
      {
        name: 'Spice Symphony Tandoor',
        cuisine: 'North Indian & Biryani',
        rating: 4.6,
        isOpen: true,
        address: 'Student Activity Center Gate, Changa',
        deliveryTimeMinutes: 30,
        menu: [
          { name: 'Dum Paneer Biryani', price: 260, category: 'Biryani' },
          { name: 'Butter Naan Platter', price: 120, category: 'Breads' },
          { name: 'Dal Makhani Special', price: 220, category: 'Curry' },
          { name: 'Gulab Jamun with Rabdi', price: 140, category: 'Dessert' }
        ]
      },
      {
        name: 'Zen Dragon Express',
        cuisine: 'Pan-Asian & Dimsum',
        rating: 4.5,
        isOpen: true,
        address: 'Campus Food Court, Block 3',
        deliveryTimeMinutes: 20,
        menu: [
          { name: 'Steamed Veg Dimsums (6 pcs)', price: 190, category: 'Dimsum' },
          { name: 'Hakka Noodles Deluxe', price: 210, category: 'Noodles' },
          { name: 'Manchurian Gravy Bowl', price: 200, category: 'Mains' },
          { name: 'Thai Green Curry with Jasmine Rice', price: 290, category: 'Curry' }
        ]
      },
      {
        name: 'Taco Fiesta Grill',
        cuisine: 'Mexican & Burrito Bowls',
        rating: 4.2,
        isOpen: false, // Closed restaurant to demonstrate isOpen = false rendering
        address: 'Near East Sports Complex, Changa',
        deliveryTimeMinutes: 35,
        menu: [
          { name: 'Loaded Nachos Supreme', price: 230, category: 'Starters' },
          { name: 'Smoky Bean Burrito', price: 250, category: 'Mains' },
          { name: 'Guacamole Quesadilla', price: 220, category: 'Mains' },
          { name: 'Churros with Chocolate Sauce', price: 160, category: 'Dessert' }
        ]
      },
      {
        name: 'Campus Brew & Bakery',
        cuisine: 'Artisanal Coffee & Sandwiches',
        rating: 4.7,
        isOpen: true,
        address: 'Ground Floor, CSPIT Main Building',
        deliveryTimeMinutes: 15,
        menu: [
          { name: 'Hazelnut Iced Latte', price: 160, category: 'Beverage' },
          { name: 'Grilled Paneer Focaccia Sandwich', price: 190, category: 'Sandwich' },
          { name: 'Belgian Chocolate Waffle', price: 210, category: 'Dessert' },
          { name: 'Cold Brew Citrus', price: 150, category: 'Beverage' }
        ]
      },
      {
        name: 'The Midnight Kitchen',
        cuisine: 'Late Night Fast Food & Burgers',
        rating: 3.9,
        isOpen: false, // Another closed restaurant for testing
        address: 'Changa Cross Roads',
        deliveryTimeMinutes: 40,
        menu: [
          { name: 'Crispy Veg Double Patty Burger', price: 180, category: 'Burgers' },
          { name: 'Peri Peri Crinkle Fries', price: 120, category: 'Sides' },
          { name: 'Thick Chocolate Milkshake', price: 140, category: 'Beverage' }
        ]
      }
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurantsData);
    console.log(`[SEED] Created ${createdRestaurants.length} restaurants.`);

    // 3. Create Sample Orders
    const sampleOrder1 = await Order.create({
      customerId: customer1._id,
      restaurantId: createdRestaurants[0]._id,
      items: [
        { name: 'Margherita Woodfired Pizza', quantity: 1, price: 280 },
        { name: 'Garlic Herb Bread with Cheese', quantity: 1, price: 150 }
      ],
      totalAmount: 430,
      deliveryAddress: 'Hostel Block A, Room 302, CHARUSAT Campus, Changa',
      status: 'delivered'
    });

    const sampleOrder2 = await Order.create({
      customerId: customer1._id,
      restaurantId: createdRestaurants[1]._id,
      items: [
        { name: 'Dum Paneer Biryani', quantity: 2, price: 260 },
        { name: 'Gulab Jamun with Rabdi', quantity: 1, price: 140 }
      ],
      totalAmount: 660,
      deliveryAddress: 'Hostel Block A, Room 302, CHARUSAT Campus, Changa',
      status: 'preparing'
    });

    console.log(`[SEED] Created ${2} sample orders.`);
    console.log('[SEED] Database initialization completed successfully.');

    await mongoose.connection.close();
    console.log('[SEED] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`[SEED_ERROR] Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
