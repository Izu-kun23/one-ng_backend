# Vendor-to-Vendor Marketplace API Documentation

**Base URL:** `https://one-ngbackend-production.up.railway.app/api`  
**API Version:** 1.0  
**Documentation:** `https://one-ngbackend-production.up.railway.app/api/docs`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Base URL & Headers](#base-url--headers)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#users-endpoints)
   - [Vendors](#vendors-endpoints)
   - [Products](#products-endpoints)
   - [Orders](#orders-endpoints)
   - [Messages](#messages-endpoints)
   - [Admin](#admin-endpoints)

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer {your_jwt_token}
```

The token is obtained by:
1. **Registering** a new user (`POST /api/auth/register`)
2. **Logging in** (`POST /api/auth/login`)

Both endpoints return an `access_token` that must be included in subsequent requests.

**Token Format:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

---

## Base URL & Headers

**Base URL:** `https://one-ngbackend-production.up.railway.app/api`

**Standard Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}' // Required for protected endpoints
}
```

**For File Uploads:**
```javascript
{
  'Authorization': 'Bearer {token}'
  // DO NOT set Content-Type - browser sets it automatically with boundary
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Error Type"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## API Endpoints

### Authentication Endpoints

#### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account. Creates both user and vendor profile.

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "businessName": "ABC Trading Company",
  "interests": "Electronics, Clothing, Food"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `409` - User already exists

**Example:**
```javascript
const response = await fetch('https://one-ngbackend-production.up.railway.app/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    password: 'password123',
    businessName: 'ABC Trading Company',
    interests: 'Electronics, Clothing, Food'
  })
});

const data = await response.json();
// Store data.access_token for future requests
```

---

#### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

**Error Responses:**
- `401` - Invalid credentials

**Example:**
```javascript
const response = await fetch('https://one-ngbackend-production.up.railway.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// Store data.access_token
```

---

#### 3. Logout User

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user (optional - mainly for server-side session cleanup).

**Authentication:** Required

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Users Endpoints

#### 1. Get User Profile

**Endpoint:** `GET /api/users/:id`

**Description:** Get user profile by ID.

**Authentication:** Required

**URL Parameters:**
- `id` (number) - User ID

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "profileImage": {
    "id": 1,
    "url": "https://res.cloudinary.com/example/image/upload/v1/profile.jpg",
    "publicId": "profile/1",
    "isPrimary": true
  }
}
```

**Example:**
```javascript
const response = await fetch(`https://one-ngbackend-production.up.railway.app/api/users/1`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

#### 2. Update User Profile

**Endpoint:** `PATCH /api/users/:id`

**Description:** Update user profile. Users can only update their own profile.

**Authentication:** Required

**URL Parameters:**
- `id` (number) - User ID (must match authenticated user)

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+9876543210"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john@example.com",
  "phone": "+9876543210",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `403` - Unauthorized to update this profile
- `404` - User not found

---

### Vendors Endpoints

#### 1. Create Vendor Profile

**Endpoint:** `POST /api/vendors`

**Description:** Create a vendor profile (usually done during registration).

**Authentication:** Required

**Request Body:**
```json
{
  "businessName": "ABC Trading Company",
  "interests": "Electronics, Clothing, Food",
  "businessPhone": "+1234567890"
}
```

**Response (201):**
```json
{
  "id": 1,
  "businessName": "ABC Trading Company",
  "interests": "Electronics, Clothing, Food",
  "businessPhone": "+1234567890",
  "userId": 1,
  "approved": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `409` - User already has a vendor profile

---

#### 2. Get My Vendor Profile

**Endpoint:** `GET /api/vendors/me`

**Description:** Get the authenticated user's vendor profile.

**Authentication:** Required

**Response (200):**
```json
{
  "id": 1,
  "businessName": "ABC Trading Company",
  "interests": "Electronics, Clothing, Food",
  "userId": 1,
  "approved": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### 3. List All Vendors

**Endpoint:** `GET /api/vendors`

**Description:** Get list of all vendors with optional filtering.

**Authentication:** Not required

**Query Parameters:**
- `interests` (string, optional) - Filter by interests
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page

**Response (200):**
```json
[
  {
    "id": 1,
    "businessName": "ABC Trading Company",
    "interests": "Electronics, Clothing, Food",
    "userId": 1,
    "approved": true,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

**Example:**
```javascript
const response = await fetch('https://one-ngbackend-production.up.railway.app/api/vendors?interests=Electronics&page=1&limit=10');
```

---

#### 4. Get Vendor by ID

**Endpoint:** `GET /api/vendors/:id`

**Description:** Get vendor details by ID.

**Authentication:** Not required

**URL Parameters:**
- `id` (number) - Vendor ID

**Response (200):**
```json
{
  "id": 1,
  "businessName": "ABC Trading Company",
  "interests": "Electronics, Clothing, Food",
  "userId": 1,
  "approved": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### 5. Update Vendor Profile

**Endpoint:** `PATCH /api/vendors/:id`

**Description:** Update vendor profile. Only the vendor owner can update.

**Authentication:** Required

**URL Parameters:**
- `id` (number) - Vendor ID

**Request Body:**
```json
{
  "businessName": "Updated Business Name",
  "interests": "Updated Interests"
}
```

**Response (200):**
```json
{
  "id": 1,
  "businessName": "Updated Business Name",
  "interests": "Updated Interests",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `403` - Forbidden (not vendor owner)
- `404` - Vendor not found

---

### Products Endpoints

#### 1. Create Product

**Endpoint:** `POST /api/products`

**Description:** Create a new product. Only vendors can create products.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "stock": 50
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "stock": 50,
  "vendorId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "vendor": {
    "id": 1,
    "businessName": "Tech Store",
    "userId": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "images": []
}
```

**Error Responses:**
- `404` - Vendor profile not found

**Example:**
```javascript
const response = await fetch('https://one-ngbackend-production.up.railway.app/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features',
    price: 999.99,
    stock: 50
  })
});
```

---

#### 2. List All Products

**Endpoint:** `GET /api/products`

**Description:** Get list of all products with search and pagination.

**Authentication:** Not required

**Query Parameters:**
- `search` (string, optional) - Search term (searches title and description)
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 10) - Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "iPhone 15 Pro",
      "description": "Latest iPhone with advanced features",
      "price": 999.99,
      "stock": 50,
      "vendorId": 1,
      "images": [
        {
          "id": 1,
          "url": "https://res.cloudinary.com/example/image/upload/v1/products/1/image1.jpg",
          "publicId": "products/1/image1",
          "isPrimary": true,
          "entityType": "product",
          "entityId": 1
        }
      ]
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

**Example:**
```javascript
const response = await fetch('https://one-ngbackend-production.up.railway.app/api/products?search=iPhone&page=1&limit=10');
const data = await response.json();
// data.data - array of products
// data.meta - pagination info
```

---

#### 3. Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Description:** Get product details by ID.

**Authentication:** Not required

**URL Parameters:**
- `id` (number) - Product ID

**Response (200):**
```json
{
  "id": 1,
  "title": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "stock": 50,
  "vendorId": 1,
  "vendor": {
    "id": 1,
    "businessName": "Tech Store",
    "userId": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  },
  "images": [
    {
      "id": 1,
      "url": "https://res.cloudinary.com/example/image/upload/v1/products/1/image1.jpg",
      "publicId": "products/1/image1",
      "isPrimary": true
    }
  ]
}
```

---

#### 4. Get Products by Vendor

**Endpoint:** `GET /api/products/vendor/:vendorId`

**Description:** Get all products for a specific vendor.

**Authentication:** Not required

**URL Parameters:**
- `vendorId` (number) - Vendor ID

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "iPhone 15 Pro",
    "description": "Latest iPhone with advanced features",
    "price": 999.99,
    "stock": 50,
    "vendorId": 1,
    "images": [...]
  }
]
```

---

#### 5. Update Product

**Endpoint:** `PATCH /api/products/:id`

**Description:** Update product. Only the product owner (vendor) can update.

**Authentication:** Required

**URL Parameters:**
- `id` (number) - Product ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 899.99,
  "stock": 30
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "price": 899.99,
  "stock": 30,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `403` - Forbidden (not product owner)
- `404` - Product not found

---

#### 6. Delete Product

**Endpoint:** `DELETE /api/products/:id`

**Description:** Delete product. Only the product owner can delete.

**Authentication:** Required

**URL Parameters:**
- `id` (number) - Product ID

**Response (200):**
```json
{
  "id": 1,
  "title": "iPhone 15 Pro",
  ...
}
```

**Error Responses:**
- `403` - Forbidden (not product owner)
- `404` - Product not found

---

#### 7. Upload Single Product Image

**Endpoint:** `POST /api/products/:id/images`

**Description:** Upload a single image to a product. Only product owner can upload.

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**URL Parameters:**
- `id` (number) - Product ID

**Form Data:**
- `image` (File, required) - Image file (JPEG, PNG, GIF, WebP, max 10MB)
  - **Note:** Also accepts field names: `file` or `files`
- `isPrimary` (boolean, optional) - Set as primary image (default: false)

**Response (201):**
```json
{
  "id": 1,
  "url": "https://res.cloudinary.com/example/image/upload/v1/products/32/image.jpg",
  "publicId": "products/32/abc123",
  "entityType": "product",
  "entityId": 32,
  "isPrimary": true,
  "productId": 32
}
```

**Error Responses:**
- `400` - Invalid file, missing file, validation error
- `403` - Forbidden (not product owner)
- `404` - Product not found

**Example:**
```javascript
const formData = new FormData();
formData.append('image', file); // or 'file' or 'files'
formData.append('isPrimary', 'true'); // optional

const response = await fetch(`https://one-ngbackend-production.up.railway.app/api/products/${productId}/images`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // DO NOT set Content-Type - browser sets it automatically
  },
  body: formData
});

const image = await response.json();
```

---

#### 8. Upload Multiple Product Images

**Endpoint:** `POST /api/products/:id/images/multiple`

**Description:** Upload multiple images to a product. Only product owner can upload.

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**URL Parameters:**
- `id` (number) - Product ID

**Form Data:**
- `files` (File[], required) - Array of image files (max 10, JPEG, PNG, GIF, WebP, max 10MB each)
  - **Note:** Also accepts field names: `images` or `image`
- `primaryIndex` (number, optional) - 0-based index of which image should be primary

**Response (201):**
```json
[
  {
    "id": 1,
    "url": "https://res.cloudinary.com/example/image/upload/v1/products/32/image1.jpg",
    "publicId": "products/32/abc123",
    "isPrimary": true,
    "productId": 32
  },
  {
    "id": 2,
    "url": "https://res.cloudinary.com/example/image/upload/v1/products/32/image2.jpg",
    "publicId": "products/32/def456",
    "isPrimary": false,
    "productId": 32
  }
]
```

**Example:**
```javascript
const formData = new FormData();
files.forEach(file => formData.append('files', file)); // or 'images' or 'image'
formData.append('primaryIndex', '0'); // optional

const response = await fetch(`https://one-ngbackend-production.up.railway.app/api/products/${productId}/images/multiple`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const images = await response.json();
```

---

#### 9. Set Primary Image

**Endpoint:** `PATCH /api/products/images/:imageId/primary`

**Description:** Set an image as primary for a product. Unsets other primary images.

**Authentication:** Required

**URL Parameters:**
- `imageId` (number) - Image ID

**Response (200):**
```json
{
  "id": 1,
  "url": "https://res.cloudinary.com/example/image/upload/v1/products/32/image.jpg",
  "publicId": "products/32/abc123",
  "isPrimary": true,
  "productId": 32
}
```

**Error Responses:**
- `403` - Forbidden (not product owner)
- `404` - Image not found

**Example:**
```javascript
const response = await fetch(`https://one-ngbackend-production.up.railway.app/api/products/images/${imageId}/primary`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

#### 10. Delete Product Image

**Endpoint:** `DELETE /api/products/images/:imageId`

**Description:** Delete a product image. Only product owner can delete.

**Authentication:** Required

**URL Parameters:**
- `imageId` (number) - Image ID

**Response (200):**
```json
{
  "message": "Image deleted successfully"
}
```

**Error Responses:**
- `403` - Forbidden (not product owner)
- `404` - Image not found

---

### Orders Endpoints

#### 1. Create Order

**Endpoint:** `POST /api/orders`

**Description:** Create a new order.

**Authentication:** Required

**Request Body:**
```json
{
  "total": 999.99,
  "sellerId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "total": 999.99,
  "buyerId": 2,
  "sellerId": 1,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "vendor": {
    "id": 1,
    "businessName": "Tech Store",
    "userId": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Responses:**
- `404` - Vendor not found

---

#### 2. List User Orders

**Endpoint:** `GET /api/orders`

**Description:** Get all orders for the authenticated user.

**Authentication:** Required

**Query Parameters:**
- `role` (string, optional) - Filter by role: `buyer`, `seller`, or `all` (default: `all`)

**Response (200):**
```json
[
  {
    "id": 1,
    "total": 999.99,
    "buyerId": 2,
    "sellerId": 1,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "vendor": {
      "id": 1,
      "businessName": "Tech Store",
      "userId": 1
    }
  }
]
```

**Example:**
```javascript
// Get orders where user is buyer
const response = await fetch('https://one-ngbackend-production.up.railway.app/api/orders?role=buyer', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get orders where user is seller
const response = await fetch('https://one-ngbackend-production.up.railway.app/api/orders?role=seller', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

#### 3. Get Order by ID

**Endpoint:** `GET /api/orders/:id`

**Description:** Get order details. Only buyer or seller can view.

**Authentication:** Required

**URL Parameters:**
- `id` (number) - Order ID

**Response (200):**
```json
{
  "id": 1,
  "total": 999.99,
  "buyerId": 2,
  "sellerId": 1,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "vendor": {
    "id": 1,
    "businessName": "Tech Store",
    "userId": 1
  }
}
```

**Error Responses:**
- `403` - Forbidden (not order participant)
- `404` - Order not found

---

#### 4. Update Order Status

**Endpoint:** `PATCH /api/orders/:id/status`

**Description:** Update order status. Only seller can update.

**Authentication:** Required

**URL Parameters:**
- `id` (number) - Order ID

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`

**Response (200):**
```json
{
  "id": 1,
  "total": 999.99,
  "status": "confirmed",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `403` - Forbidden (not seller)
- `404` - Order not found

---

### Messages Endpoints

#### 1. Send Message

**Endpoint:** `POST /api/messages`

**Description:** Send a message to another user.

**Authentication:** Required

**Request Body:**
```json
{
  "receiverId": 2,
  "body": "Hello, I am interested in your product"
}
```

**Response (201):**
```json
{
  "id": 1,
  "senderId": 1,
  "receiverId": 2,
  "body": "Hello, I am interested in your product",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "sender": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "receiver": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

**Error Responses:**
- `403` - Cannot send message to yourself
- `404` - Receiver not found

---

#### 2. Get Conversation Thread

**Endpoint:** `GET /api/messages/thread/:userId`

**Description:** Get conversation messages between authenticated user and specified user.

**Authentication:** Required

**URL Parameters:**
- `userId` (number) - Other user's ID

**Response (200):**
```json
[
  {
    "id": 1,
    "senderId": 1,
    "receiverId": 2,
    "body": "Hello",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "sender": {
      "id": 1,
      "name": "John Doe"
    },
    "receiver": {
      "id": 2,
      "name": "Jane Smith"
    }
  },
  {
    "id": 2,
    "senderId": 2,
    "receiverId": 1,
    "body": "Hi there!",
    "createdAt": "2024-01-01T00:01:00.000Z",
    "sender": {
      "id": 2,
      "name": "Jane Smith"
    },
    "receiver": {
      "id": 1,
      "name": "John Doe"
    }
  }
]
```

---

#### 3. Get All Conversations

**Endpoint:** `GET /api/messages/conversations`

**Description:** Get all conversations for the authenticated user (list of users they've messaged).

**Authentication:** Required

**Response (200):**
```json
[
  {
    "userId": 2,
    "user": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "lastMessage": {
      "id": 2,
      "body": "Hi there!",
      "createdAt": "2024-01-01T00:01:00.000Z"
    },
    "unreadCount": 2
  }
]
```

---

### Admin Endpoints

**Note:** All admin endpoints require admin role. Regular users cannot access these.

#### 1. Get All Users

**Endpoint:** `GET /api/admin/users`

**Description:** Get all users with pagination (admin only).

**Authentication:** Required (Admin)

**Query Parameters:**
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page

**Response (200):**
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

#### 2. Get User by ID

**Endpoint:** `GET /api/admin/users/:id`

**Description:** Get user details by ID (admin only).

**Authentication:** Required (Admin)

---

#### 3. Update User

**Endpoint:** `PATCH /api/admin/users/:id`

**Description:** Update user (admin only).

**Authentication:** Required (Admin)

---

#### 4. Delete User

**Endpoint:** `DELETE /api/admin/users/:id`

**Description:** Delete user (admin only).

**Authentication:** Required (Admin)

---

#### 5. Ban/Unban User

**Endpoint:** `PATCH /api/admin/users/:id/ban`

**Description:** Ban or unban a user (admin only).

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "banned": true,
  "reason": "Violation of terms"
}
```

---

#### 6. Get All Vendors

**Endpoint:** `GET /api/admin/vendors`

**Description:** Get all vendors (admin only).

**Authentication:** Required (Admin)

---

#### 7. Approve/Reject Vendor

**Endpoint:** `PATCH /api/admin/vendors/:id/approve`

**Description:** Approve or reject a vendor (admin only).

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "approved": true
}
```

---

#### 8. Get All Products

**Endpoint:** `GET /api/admin/products`

**Description:** Get all products (admin only).

**Authentication:** Required (Admin)

---

#### 9. Delete Product

**Endpoint:** `DELETE /api/admin/products/:id`

**Description:** Delete any product (admin only).

**Authentication:** Required (Admin)

---

#### 10. Get All Orders

**Endpoint:** `GET /api/admin/orders`

**Description:** Get all orders (admin only).

**Authentication:** Required (Admin)

---

#### 11. Get Analytics

**Endpoint:** `GET /api/admin/analytics`

**Description:** Get system analytics (admin only).

**Authentication:** Required (Admin)

**Response (200):**
```json
{
  "totalUsers": 1000,
  "totalVendors": 200,
  "totalProducts": 5000,
  "totalOrders": 500
}
```

---

## Implementation Examples

### TypeScript/JavaScript Helper Functions

```typescript
const API_BASE_URL = 'https://one-ngbackend-production.up.railway.app/api';

// Get auth token from localStorage/sessionStorage
const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Helper function for authenticated requests
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};

// Authentication
export const auth = {
  register: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    businessName: string;
    interests: string;
  }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', result.access_token);
    }
    return result;
  },
  
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', result.access_token);
    }
    return result;
  },
  
  logout: async () => {
    await apiRequest('/auth/logout', { method: 'POST' });
    localStorage.removeItem('access_token');
  },
};

// Products
export const products = {
  getAll: async (search?: string, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);
    
    const response = await apiRequest(`/products?${params}`);
    return response.json();
  },
  
  getById: async (id: number) => {
    const response = await apiRequest(`/products/${id}`);
    return response.json();
  },
  
  create: async (data: {
    title: string;
    description?: string;
    price: number;
    stock: number;
  }) => {
    const response = await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  update: async (id: number, data: Partial<{
    title: string;
    description: string;
    price: number;
    stock: number;
  }>) => {
    const response = await apiRequest(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  delete: async (id: number) => {
    const response = await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  
  uploadImage: async (productId: number, file: File, isPrimary = false) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('isPrimary', isPrimary.toString());
    
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/products/${productId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },
  
  uploadMultipleImages: async (
    productId: number,
    files: File[],
    primaryIndex?: number
  ) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (primaryIndex !== undefined) {
      formData.append('primaryIndex', primaryIndex.toString());
    }
    
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/products/${productId}/images/multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },
  
  setPrimaryImage: async (imageId: number) => {
    const response = await apiRequest(`/products/images/${imageId}/primary`, {
      method: 'PATCH',
    });
    return response.json();
  },
  
  deleteImage: async (imageId: number) => {
    const response = await apiRequest(`/products/images/${imageId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Users
export const users = {
  getById: async (id: number) => {
    const response = await apiRequest(`/users/${id}`);
    return response.json();
  },
  
  update: async (id: number, data: Partial<{
    name: string;
    phone: string;
  }>) => {
    const response = await apiRequest(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Vendors
export const vendors = {
  getAll: async (interests?: string) => {
    const params = interests ? `?interests=${interests}` : '';
    const response = await apiRequest(`/vendors${params}`);
    return response.json();
  },
  
  getById: async (id: number) => {
    const response = await apiRequest(`/vendors/${id}`);
    return response.json();
  },
  
  getMyProfile: async () => {
    const response = await apiRequest('/vendors/me');
    return response.json();
  },
  
  update: async (id: number, data: Partial<{
    businessName: string;
    interests: string;
  }>) => {
    const response = await apiRequest(`/vendors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Orders
export const orders = {
  getAll: async (role: 'buyer' | 'seller' | 'all' = 'all') => {
    const response = await apiRequest(`/orders?role=${role}`);
    return response.json();
  },
  
  getById: async (id: number) => {
    const response = await apiRequest(`/orders/${id}`);
    return response.json();
  },
  
  create: async (total: number, sellerId: number) => {
    const response = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ total, sellerId }),
    });
    return response.json();
  },
  
  updateStatus: async (id: number, status: string) => {
    const response = await apiRequest(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};

// Messages
export const messages = {
  send: async (receiverId: number, body: string) => {
    const response = await apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, body }),
    });
    return response.json();
  },
  
  getThread: async (userId: number) => {
    const response = await apiRequest(`/messages/thread/${userId}`);
    return response.json();
  },
  
  getConversations: async () => {
    const response = await apiRequest('/messages/conversations');
    return response.json();
  },
};
```

---

## Notes for Frontend Team

### Important Points:

1. **Authentication:**
   - Always store the `access_token` after login/register
   - Include token in `Authorization: Bearer {token}` header for protected endpoints
   - Handle 401 errors by redirecting to login

2. **File Uploads:**
   - Use `FormData` for image uploads
   - **DO NOT** set `Content-Type` header manually (browser sets it with boundary)
   - Accepted image field names: `image`, `file`, or `files` (for single), `files`, `images`, or `image` (for multiple)
   - Max file size: 10MB
   - Accepted formats: JPEG, PNG, GIF, WebP

3. **Error Handling:**
   - Always check `response.ok` or status code
   - Parse error messages from `response.json()`
   - Show user-friendly error messages

4. **Pagination:**
   - Use `page` and `limit` query parameters
   - Response includes `meta` object with pagination info

5. **Base URL:**
   - All endpoints are prefixed with `/api`
   - Use environment variable for base URL in production

6. **Swagger Documentation:**
   - Interactive API docs available at: `https://one-ngbackend-production.up.railway.app/api/docs`
   - Use Swagger UI to test endpoints directly

---

## Support

For questions or issues, contact the backend team or refer to the Swagger documentation at:
`https://one-ngbackend-production.up.railway.app/api/docs`
