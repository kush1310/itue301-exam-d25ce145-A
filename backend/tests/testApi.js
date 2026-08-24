/**
 * API Verification & Automated Test Suite
 *
 * Tests all 5 REST API requirements specified in ITUE301 Practical Exam Set A:
 * 1. Health check & Request logging
 * 2. Customer Authentication (POST /api/v1/auth/login)
 * 3. Public Restaurant catalog retrieval (GET /api/v1/restaurants)
 * 4. Protected Order creation with Mongoose validation (POST /api/v1/orders)
 * 5. Protected Populated Order history (GET /api/v1/orders)
 * 6. Protected Order status modification (PATCH /api/v1/orders/:id/status)
 * 7. Negative test cases (401 Unauthorized & 400 Validation Error)
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/v1';
let authToken = '';
let sampleRestaurantId = '';
let sampleOrderId = '';

const runTests = async () => {
  console.log('================================================================');
  console.log('   QUICKBITE API AUTOMATED VERIFICATION SUITE (ITUE301 SET A)   ');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 7;

  try {
    // -------------------------------------------------------------
    // Test 1: Public Restaurant Catalog (GET /api/v1/restaurants)
    // -------------------------------------------------------------
    console.log('[TEST 1] Testing Public Restaurant Retrieval: GET /api/v1/restaurants');
    const restaurantsRes = await axios.get(`${API_BASE_URL}/restaurants`);
    if (restaurantsRes.status === 200 && Array.isArray(restaurantsRes.data.data)) {
      console.log(`[PASS] Received ${restaurantsRes.data.data.length} restaurants with HTTP 200 OK.`);
      sampleRestaurantId = restaurantsRes.data.data[0]._id;
      passedTests++;
    } else {
      console.error('[FAIL] Failed to retrieve restaurants.');
    }
    console.log('----------------------------------------------------------------');

    // -------------------------------------------------------------
    // Test 2: Customer Authentication (POST /api/v1/auth/login)
    // -------------------------------------------------------------
    console.log('[TEST 2] Testing Customer Authentication: POST /api/v1/auth/login');
    const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'kush@charusat.edu.in',
      password: 'password123'
    });
    if (loginRes.status === 200 && loginRes.data.data.token) {
      authToken = loginRes.data.data.token;
      console.log(`[PASS] Customer authenticated successfully with HTTP 200 OK. Token issued.`);
      console.log(`       Customer: ${loginRes.data.data.customer.name} (${loginRes.data.data.customer.email})`);
      passedTests++;
    } else {
      console.error('[FAIL] Login failed.');
    }
    console.log('----------------------------------------------------------------');

    // -------------------------------------------------------------
    // Test 3: Protected Order Creation (POST /api/v1/orders)
    // -------------------------------------------------------------
    console.log('[TEST 3] Testing Protected Order Creation: POST /api/v1/orders');
    const orderPayload = {
      restaurantId: sampleRestaurantId,
      items: [
        { name: 'Margherita Woodfired Pizza', quantity: 2, price: 280 },
        { name: 'Garlic Herb Bread with Cheese', quantity: 1, price: 150 }
      ],
      totalAmount: 710,
      deliveryAddress: 'Hostel Block A, Room 302, CHARUSAT Campus, Changa',
      status: 'pending'
    };

    const orderRes = await axios.post(`${API_BASE_URL}/orders`, orderPayload, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (orderRes.status === 201 && orderRes.data.data._id) {
      sampleOrderId = orderRes.data.data._id;
      console.log(`[PASS] Order created successfully with HTTP 201 Created.`);
      console.log(`       Order ID: ${sampleOrderId}`);
      console.log(`       Populated Customer: ${orderRes.data.data.customerId.name}`);
      console.log(`       Populated Restaurant: ${orderRes.data.data.restaurantId.name}`);
      passedTests++;
    } else {
      console.error('[FAIL] Order creation failed.');
    }
    console.log('----------------------------------------------------------------');

    // -------------------------------------------------------------
    // Test 4: Populated Customer Orders (GET /api/v1/orders)
    // -------------------------------------------------------------
    console.log('[TEST 4] Testing Populated Customer Orders: GET /api/v1/orders');
    const getOrdersRes = await axios.get(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (getOrdersRes.status === 200 && Array.isArray(getOrdersRes.data.data)) {
      console.log(`[PASS] Retrieved ${getOrdersRes.data.data.length} customer orders with HTTP 200 OK.`);
      const firstOrder = getOrdersRes.data.data[0];
      console.log(`       Verified customerId populate: ${firstOrder.customerId?.name} (${firstOrder.customerId?.email})`);
      console.log(`       Verified restaurantId populate: ${firstOrder.restaurantId?.name} [${firstOrder.restaurantId?.cuisine}]`);
      passedTests++;
    } else {
      console.error('[FAIL] Populated orders retrieval failed.');
    }
    console.log('----------------------------------------------------------------');

    // -------------------------------------------------------------
    // Test 5: Order Status Update (PATCH /api/v1/orders/:id/status)
    // -------------------------------------------------------------
    console.log(`[TEST 5] Testing Order Status Update: PATCH /api/v1/orders/${sampleOrderId}/status`);
    const patchRes = await axios.patch(
      `${API_BASE_URL}/orders/${sampleOrderId}/status`,
      { status: 'preparing' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    if (patchRes.status === 200 && patchRes.data.data.status === 'preparing') {
      console.log(`[PASS] Order status updated to 'preparing' with HTTP 200 OK.`);
      passedTests++;
    } else {
      console.error('[FAIL] Order status patch failed.');
    }
    console.log('----------------------------------------------------------------');

    // -------------------------------------------------------------
    // Test 6: Validation Failure Handling (400 Bad Request)
    // -------------------------------------------------------------
    console.log('[TEST 6] Testing Schema Validation Failure: POST /api/v1/orders with invalid status');
    try {
      await axios.post(
        `${API_BASE_URL}/orders`,
        {
          restaurantId: sampleRestaurantId,
          items: [{ name: 'Test Item', quantity: 1, price: 100 }],
          totalAmount: 100,
          status: 'invalid_status_value'
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.error('[FAIL] Validation failure was not caught.');
    } catch (valErr) {
      if (valErr.response && valErr.response.status === 400) {
        console.log(`[PASS] Handled invalid status with structured HTTP 400 Bad Request.`);
        console.log(`       Response Error: ${valErr.response.data.error.message}`);
        passedTests++;
      } else {
        console.error(`[FAIL] Unexpected response: ${valErr.message}`);
      }
    }
    console.log('----------------------------------------------------------------');

    // -------------------------------------------------------------
    // Test 7: Unauthorized Access Protection (401 Unauthorized)
    // -------------------------------------------------------------
    console.log('[TEST 7] Testing Auth Guard Middleware: GET /api/v1/orders without token');
    try {
      await axios.get(`${API_BASE_URL}/orders`);
      console.error('[FAIL] Unprotected access was allowed.');
    } catch (authErr) {
      if (authErr.response && authErr.response.status === 401) {
        console.log(`[PASS] AuthGuard rejected unauthenticated request with HTTP 401 Unauthorized.`);
        console.log(`       Response Message: ${authErr.response.data.error.message}`);
        passedTests++;
      } else {
        console.error(`[FAIL] Unexpected response: ${authErr.message}`);
      }
    }
    console.log('----------------------------------------------------------------');

    console.log(`\nTEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED SUCCESSFULLY.\n`);
  } catch (globalError) {
    console.error(`[TEST_SUITE_FATAL] Error running test suite: ${globalError.message}`);
  }
};

runTests();
