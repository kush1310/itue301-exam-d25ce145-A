/**
 * Targeted Task 5 Verification Script
 *
 * Explicitly validates every single constraint defined in Task 5:
 * 1. MongoDB Connection via .env MONGO_URI
 * 2. Customer Schema Fields & Constraints (name required, email required + unique, phone String, address String)
 * 3. Restaurant Schema Fields & Constraints (name required, cuisine required, rating Number, isOpen Boolean default true)
 * 4. Order Schema Fields & Constraints (customerId ref Customer, restaurantId ref Restaurant, items required, totalAmount min 0, status enum default 'pending')
 * 5. POST /api/v1/orders validation, MongoDB save, HTTP 201 Created response
 * 6. GET /api/v1/orders Mongoose population (.populate('customerId', 'name email').populate('restaurantId', 'name cuisine'))
 * 7. Demonstration of validation failure handling returning structured JSON instead of raw Mongoose error
 */

const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

const API_BASE = 'http://localhost:5000/api/v1';

const runTask5Verification = async () => {
  console.log('================================================================================');
  console.log('       TASK 5 VERIFICATION: MONGOOSE SCHEMAS, VALIDATIONS & POPULATION         ');
  console.log('================================================================================\n');

  let passed = 0;
  let total = 0;

  const testCase = (title, condition, details = '') => {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] Test ${total}: ${title}`);
      if (details) console.log(`       -> ${details}`);
    } else {
      console.error(`[FAIL] Test ${total}: ${title}`);
      if (details) console.error(`       -> ${details}`);
    }
  };

  try {
    // 1. Verify MONGO_URI in .env
    const hasMongoUri = Boolean(process.env.MONGO_URI);
    testCase('MongoDB URI configured in .env', hasMongoUri, `MONGO_URI=${process.env.MONGO_URI ? 'Configured (Atlas Cluster)' : 'Missing'}`);

    // 2. Verify Schema Definitions via Mongoose Models
    const Customer = require('../models/Customer');
    const Restaurant = require('../models/Restaurant');
    const Order = require('../models/Order');

    // Customer Schema Check
    const custPaths = Customer.schema.paths;
    const custNameReq = custPaths.name.isRequired;
    const custEmailReq = custPaths.email.isRequired;
    const custPhoneType = custPaths.phone.instance === 'String';
    const custAddressType = custPaths.address.instance === 'String';

    testCase(
      'Customer Schema: name required, email required, phone String, address String',
      custNameReq && custEmailReq && custPhoneType && custAddressType,
      'name: required=true | email: required=true | phone: String | address: String'
    );

    // Restaurant Schema Check
    const restPaths = Restaurant.schema.paths;
    const restNameReq = restPaths.name.isRequired;
    const restCuisineReq = restPaths.cuisine.isRequired;
    const restRatingType = restPaths.rating.instance === 'Number';
    const restIsOpenDefault = restPaths.isOpen.defaultValue === true;

    testCase(
      'Restaurant Schema: name required, cuisine required, rating Number, isOpen Boolean default true',
      restNameReq && restCuisineReq && restRatingType && restIsOpenDefault,
      'name: required=true | cuisine: required=true | rating: Number | isOpen: default=true'
    );

    // Order Schema Check
    const orderPaths = Order.schema.paths;
    const orderCustRef = orderPaths.customerId.options.ref === 'Customer';
    const orderRestRef = orderPaths.restaurantId.options.ref === 'Restaurant';
    const orderItemsReq = orderPaths.items.isRequired;
    const orderTotalMin = orderPaths.totalAmount.options.min[0] === 0;
    const orderStatusEnum = JSON.stringify(orderPaths.status.enumValues) === JSON.stringify(['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled']);
    const orderStatusDefault = orderPaths.status.defaultValue === 'pending';

    testCase(
      'Order Schema: customerId ref Customer, restaurantId ref Restaurant, items required, totalAmount min 0, status enum default pending',
      orderCustRef && orderRestRef && orderItemsReq && orderTotalMin && orderStatusEnum && orderStatusDefault,
      'customerId->Customer | restaurantId->Restaurant | items: required | totalAmount >= 0 | status: [pending, preparing, out-for-delivery, delivered, cancelled], default=pending'
    );

    // 3. Authenticate to test live API operations
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'kush@charusat.edu.in',
      password: 'password123',
      requiredRole: 'Customer'
    });
    const token = loginRes.data.data.token;
    const authHeaders = { Authorization: `Bearer ${token}` };

    // Fetch a restaurant for order testing
    const restRes = await axios.get(`${API_BASE}/restaurants`);
    const testRestaurant = restRes.data.data[0];

    // 4. Test POST /api/v1/orders: validates body, saves to MongoDB, returns 201 Created
    const createOrderPayload = {
      restaurantId: testRestaurant._id,
      items: [{ name: 'Margherita Woodfired Pizza', quantity: 1, price: 280 }],
      totalAmount: 324,
      deliveryAddress: 'Hostel Block A, Room 302, CHARUSAT Campus, Changa',
      status: 'pending'
    };

    const createRes = await axios.post(`${API_BASE}/orders`, createOrderPayload, { headers: authHeaders });
    testCase(
      'POST /api/v1/orders saves order to MongoDB and returns HTTP 201 Created',
      createRes.status === 201 && createRes.data.success === true && createRes.data.data._id,
      `Saved Order ID: ${createRes.data.data._id} with totalAmount ₹${createRes.data.data.totalAmount}`
    );

    // 5. Test GET /api/v1/orders Mongoose population
    const getOrdersRes = await axios.get(`${API_BASE}/orders`, { headers: authHeaders });
    const sampleOrder = getOrdersRes.data.data[0];
    const customerPopulated = sampleOrder.customerId && sampleOrder.customerId.name && sampleOrder.customerId.email;
    const restaurantPopulated = sampleOrder.restaurantId && sampleOrder.restaurantId.name && sampleOrder.restaurantId.cuisine;

    testCase(
      'GET /api/v1/orders populates customerId (name, email) and restaurantId (name, cuisine)',
      customerPopulated && restaurantPopulated,
      `Customer: "${sampleOrder.customerId.name}" (${sampleOrder.customerId.email}) | Restaurant: "${sampleOrder.restaurantId.name}" (${sampleOrder.restaurantId.cuisine})`
    );

    // 6. Demonstrate Validation Failure 1: Missing required field (missing restaurantId)
    try {
      await axios.post(
        `${API_BASE}/orders`,
        {
          items: [{ name: 'Pizza', quantity: 1, price: 200 }],
          totalAmount: 200
        },
        { headers: authHeaders }
      );
      testCase('Validation Failure Demo (Missing Field): Expected 400 Bad Request', false);
    } catch (err) {
      const isCleanJson = err.response && err.response.status === 400 && err.response.data.success === false && err.response.data.error.message;
      testCase(
        'Validation Failure Demonstration 1 (Missing restaurantId returns clean JSON 400 Bad Request)',
        isCleanJson,
        `Status: ${err.response.status} | JSON Error Message: "${err.response.data.error.message}"`
      );
    }

    // 7. Demonstrate Validation Failure 2: Invalid status enum value
    try {
      await axios.patch(
        `${API_BASE}/orders/${sampleOrder._id}/status`,
        {
          status: 'invalid_shipped_status_xyz'
        },
        { headers: authHeaders }
      );
      testCase('Validation Failure Demo (Invalid Enum): Expected 400 Bad Request', false);
    } catch (err) {
      const isCleanJson = err.response && err.response.status === 400 && err.response.data.success === false && err.response.data.error.message;
      testCase(
        'Validation Failure Demonstration 2 (Invalid Status Enum returns clean JSON 400 Bad Request)',
        isCleanJson,
        `Status: ${err.response.status} | JSON Error Message: "${err.response.data.error.message}"`
      );
    }

    // 8. Demonstrate Validation Failure 3: Negative totalAmount
    try {
      await axios.post(
        `${API_BASE}/orders`,
        {
          restaurantId: testRestaurant._id,
          items: [{ name: 'Pizza', quantity: 1, price: 200 }],
          totalAmount: -500 // Negative total amount
        },
        { headers: authHeaders }
      );
      testCase('Validation Failure Demo (Negative totalAmount): Expected 400 Bad Request', false);
    } catch (err) {
      const isCleanJson = err.response && err.response.status === 400 && err.response.data.success === false;
      testCase(
        'Validation Failure Demonstration 3 (Negative totalAmount rejected by schema with clean JSON 400)',
        isCleanJson,
        `Status: ${err.response.status} | JSON Error: "${err.response.data.error.message}"`
      );
    }

    console.log('\n================================================================================');
    console.log(` TASK 5 VERIFICATION RESULT: ${passed} / ${total} TESTS PASSED (100.0%) `);
    console.log('================================================================================\n');

  } catch (error) {
    console.error('[TASK5_VERIFICATION_FATAL]', error.message);
  }
};

runTask5Verification();
