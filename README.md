# Mobile Store API

This is a simple API for a mobile store. It uses Express.js and MongoDB.

## Features

- Fetch all mobiles
- Add multiple mobiles at once
- Fetch a specific mobile by ID
- Search for mobiles by name, type, processor, OS
- Add a mobile to the cart
- Remove a mobile from the cart
- Fetch all items in the cart

## Setup

1. Clone the repository

```bash
    git clone https://github.com/Ayush-Vish/mobileStore-api.git
```
2. Change the directory 

```bash
    cd mobileStore-api
```

3. Install dependencies with `npm install`
4. Create a `.env` file in the root directory and add your MongoDB URI and client URL like this:
5. Run the server with npm run dev

```env
    MONGO_URI=your_mongodb_uri
    CLIENT_URL=your_client_url
    PORT=3000
```

## API EndPoints

GET /api/mobiles: Fetch all mobiles
POST /api/mobiles/bulk: Add multiple mobiles at once
GET /api/mobiles/:id: Fetch a specific mobile by ID
GET /search: Search for mobiles by name, type, processor, OS
GET /api/cart: Fetch all items in the cart
POST /api/cart: Add a mobile to the cart
DELETE /api/cart/:id: Remove a mobile from the cart

