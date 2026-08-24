/**
 * Restaurant Controller
 *
 * Manages restaurant retrieval, filtering, creation, canteen controls,
 * and menu management for Restaurant Owners and Admins.
 */

const Restaurant = require('../models/Restaurant');
const Customer = require('../models/Customer');

/**
 * getAllRestaurants
 * Retrieves all restaurants (public).
 */
const getAllRestaurants = async (req, res, next) => {
  try {
    const { cuisine, isOpen, search } = req.query;
    const filterQuery = {};

    if (cuisine) {
      filterQuery.cuisine = new RegExp(cuisine, 'i');
    }

    if (isOpen !== undefined) {
      filterQuery.isOpen = isOpen === 'true';
    }

    if (search) {
      filterQuery.$or = [
        { name: new RegExp(search, 'i') },
        { cuisine: new RegExp(search, 'i') }
      ];
    }

    const restaurants = await Restaurant.find(filterQuery).sort({ rating: -1, name: 1 });

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * getRestaurantById
 */
const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESTAURANT_NOT_FOUND',
          status: 404,
          message: `Restaurant with ID ${req.params.id} was not found.`
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * getMyRestaurant
 * Returns the restaurant entity managed by the authenticated Restaurant Owner.
 */
const getMyRestaurant = async (req, res, next) => {
  try {
    const user = await Customer.findById(req.user.id);
    let restaurantId = user?.restaurantId || req.user.restaurantId;

    if (!restaurantId && user.role === 'Admin') {
      // If admin, default to first restaurant
      const firstRest = await Restaurant.findOne();
      restaurantId = firstRest?._id;
    }

    if (!restaurantId) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_ASSIGNED_RESTAURANT',
          status: 404,
          message: 'No restaurant is assigned to this owner account.'
        }
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESTAURANT_NOT_FOUND',
          status: 404,
          message: 'Assigned restaurant not found.'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * toggleRestaurantStatus
 * Toggles or sets isOpen boolean status in real time.
 */
const toggleRestaurantStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isOpen } = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESTAURANT_NOT_FOUND',
          status: 404,
          message: `Restaurant with ID ${id} was not found.`
        }
      });
    }

    restaurant.isOpen = isOpen !== undefined ? Boolean(isOpen) : !restaurant.isOpen;
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: `Restaurant is now ${restaurant.isOpen ? 'Open' : 'Closed'}.`,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * addMenuItem
 * Adds a new food item to the restaurant's menu.
 */
const addMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_MENU_FIELDS',
          status: 400,
          message: 'Menu item name and price are required.'
        }
      });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESTAURANT_NOT_FOUND',
          status: 404,
          message: `Restaurant with ID ${id} was not found.`
        }
      });
    }

    restaurant.menu.push({
      name: name.trim(),
      price: Number(price),
      category: category || 'Main'
    });

    await restaurant.save();

    return res.status(201).json({
      success: true,
      message: 'Menu item added successfully.',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * removeMenuItem
 * Removes a menu item from the restaurant.
 */
const removeMenuItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESTAURANT_NOT_FOUND',
          status: 404,
          message: `Restaurant with ID ${id} was not found.`
        }
      });
    }

    restaurant.menu = restaurant.menu.filter((m) => String(m._id) !== itemId);
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: 'Menu item removed successfully.',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * createRestaurant
 */
const createRestaurant = async (req, res, next) => {
  try {
    const { name, cuisine, rating, isOpen, menu, address, deliveryTimeMinutes } = req.body;

    const newRestaurant = await Restaurant.create({
      name,
      cuisine,
      rating: rating !== undefined ? Number(rating) : 4.0,
      isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
      menu: menu || [],
      address: address || 'Main Campus Road, Changa',
      deliveryTimeMinutes: deliveryTimeMinutes || 30
    });

    return res.status(201).json({
      success: true,
      message: 'Restaurant created successfully.',
      data: newRestaurant
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant,
  toggleRestaurantStatus,
  addMenuItem,
  removeMenuItem,
  createRestaurant
};
