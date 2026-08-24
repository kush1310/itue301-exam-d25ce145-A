/**
 * Restaurant Controller
 *
 * Manages restaurant retrieval, filtering, and creation operations
 * for the QuickBite Food Ordering System.
 */

const Restaurant = require('../models/Restaurant');

/**
 * getAllRestaurants
 *
 * Retrieves all restaurant records from the database.
 * Supports optional query filtering by cuisine or open status.
 *
 * @param  {import('express').Request} req   - Express request object
 * @param  {import('express').Response} res  - Express response object
 * @param  {import('express').NextFunction} next - Error middleware callback
 * @returns {Promise<Response>}              - 200 OK with array of restaurants
 * @validates - N/A (Public query endpoint)
 * @redirects - N/A
 * @edge-cases - Empty collection returns empty array with 200 OK.
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
 *
 * Retrieves a single restaurant by its MongoDB ObjectId.
 *
 * @param  {import('express').Request} req   - Express request with restaurant ID in req.params
 * @param  {import('express').Response} res  - Express response
 * @param  {import('express').NextFunction} next - Error callback
 * @returns {Promise<Response>}              - 200 OK with restaurant or 404 Not Found
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
 * createRestaurant
 *
 * Creates a new restaurant record in the database.
 *
 * @param  {import('express').Request} req   - Request body with restaurant details
 * @param  {import('express').Response} res  - Response with 201 Created
 * @param  {import('express').NextFunction} next - Error callback
 * @returns {Promise<Response>}              - 201 Created on success
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
  createRestaurant
};
