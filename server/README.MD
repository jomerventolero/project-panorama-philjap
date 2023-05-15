# Express Server with Firebase Integration

## Overview:
This is an Express server application that interacts with Firebase for authentication and Firestore for data storage. The server application provides several endpoints for user registration, authentication, and data retrieval.

## Dependencies:

- **Express:** A web application framework for Node.js, used to build web applications and APIs.
- **CORS:** Middleware to enable Cross-Origin Resource Sharing.
- **Firebase Admin SDK:** A server-side module for interacting with Firebase, which provides interfaces for authentication and data storage.

## Initialization:
The server initializes Firebase Admin SDK using a service account key file, sets up Firestore as the database, and enables CORS and JSON body parsing middleware for Express.

## Middleware:

- **verifyIdToken:** Middleware that verifies a Firebase ID token provided in the `Authorization` header of a request. If the token is valid, it extracts the user ID from the token and passes it to the next middleware or route handler.
- **validateFirebaseIdToken:** Middleware that validates a Firebase ID token in a request header and sets the decoded token as a property on the request object.

## Endpoints:

- **GET /user/:userId/conversations:** Endpoint for retrieving a user's conversation history from Firestore.
- **POST /signup:** Endpoint for user signup, which creates a new user with an email and password using Firebase Admin SDK.
- **GET /user:** Endpoint for retrieving a user's first name from Firestore.
- **POST /register:** Endpoint for user registration, which creates a new user and saves the user's profile information in Firestore.
- **GET /getImage/:imageName:** Endpoint for retrieving a signed URL for a file stored in Firebase Cloud Storage.
- **GET /test:** Test endpoint that returns a success message.

## Server Startup:
The server listens for connections on a specified port and logs a message to the console when it starts running.

## Error Handling:
The application includes error handling for Firebase authentication, Firestore data retrieval, and invalid request data. Errors are logged to the console and appropriate HTTP status codes and error messages are sent in the response.

## Running the ExpressJS Server
   - <code>npm install</code>
   - <code>npm run server</code>