/* This code is importing necessary
   modules and setting up a server 
   using the Express framework. */
const express = require("express");
const cors = require("cors")
const admin = require("firebase-admin")
const serviceAccount = require("./firebase-config/philjaps-firebase-adminsdk-asmoe-0b7dffd0ca.json")


const app = express()
const port = process.env.PORT || 3000;


admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

/* `app.use(cors())` enables Cross-Origin Resource Sharing (CORS) for the Express server, allowing it
to receive requests from other domains. `app.use(express.json())` is middleware that parses incoming
requests with JSON payloads and makes the resulting data available on the `req.body` property of the
request object. This allows the server to handle JSON data sent in the request body. */
app.use(cors());
app.use(express.json());

/**
 * This function verifies the validity of a token provided in the authorization header of a request.
 * @param req - The `req` parameter is an object that represents the HTTP request made to the server.
 * It contains information about the request, such as the request headers, request body, request
 * method, and request URL.
 * @param res - `res` is the response object that will be sent back to the client making the request.
 * It contains methods and properties that allow you to send a response back to the client, such as
 * `status()` to set the HTTP status code, `json()` to send a JSON response, and `send
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. It is typically used to move on to the next step in the request-response cycle.
 * @returns The function `verifyIdToken` is not returning anything. It is a middleware function that is
 * being used to verify the authenticity of a token in the `Authorization` header of an incoming
 * request. If the token is valid, it sets the `uid` property on the `req` object and calls the
 * `next()` function to pass control to the next middleware function. If the token is invalid,
 */
const verifyIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer') {
    return res.status(403).json({ error: 'Invalid token format' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};


/* This code defines an endpoint for retrieving a user's conversation history. When a GET request is
made to the '/user/:userId/conversations' endpoint, the function retrieves the user ID from the
request parameters. It then queries the Firestore database for messages that were either sent by or
received by the user, combines them, and sorts them by timestamp. Finally, it sends a response to
the client with the conversation history in the form of an array of message objects. If there is an
error during the process, it sends an error response with the error message. */
app.get('/user/:userId/conversations', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Get messages sent by or received by the user
    const sentMessagesSnapshot = await db.collection('messages')
      .where('from', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    const receivedMessagesSnapshot = await db.collection('messages')
      .where('to', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    // Combine the sent and received messages and sort them by timestamp
    const messages = [
      ...sentMessagesSnapshot.docs.map(doc => doc.data()),
      ...receivedMessagesSnapshot.docs.map(doc => doc.data())
    ].sort((a, b) => b.timestamp - a.timestamp);

    res.send({ messages });
  } catch (error) {
    console.error('Error getting conversation history:', error);
    res.status(500).send({ message: 'Error getting conversation history' });
  }
});


/**
 * This function validates a Firebase ID token in a request header and sets the decoded token as a
 * property on the request object.
 * @param req - req stands for request and it is an object that contains information about the HTTP
 * request that was made, such as the headers, body, and query parameters.
 * @param res - `res` stands for response. It is an object that represents the HTTP response that will
 * be sent back to the client. It contains information such as the status code, headers, and body of
 * the response. In this code snippet, `res` is used to send a response with a status code
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. It is typically used to move on to the next function after the current function has
 * completed its task.
 * @returns If the `authorization` header is missing or does not start with "Bearer ", a 401
 * Unauthorized response with a JSON message "Unauthorized" is returned. If the `idToken` cannot be
 * verified or decoded, a 401 Unauthorized response with a JSON message "Unauthorized" is returned.
 * Otherwise, the `decodedToken` is assigned to `req.user` and the `next()` middleware function is
 */
const validateFirebaseIdToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error validating Firebase ID token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


/* This code defines an endpoint for user signup. When a POST request is made to the '/signup'
endpoint, the function retrieves the email and password from the request body. It then uses the
Firebase Admin SDK to create a new user with the provided email and password. If the user is created
successfully, it sends a response to the client with the user's unique ID (UID). If there is an
error during the process, it sends an error response with the error message. */
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    res.status(201).json({ uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/user', async (req, res) => {
  const idToken = req.headers.authorization;

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Get the user's first name from Firestore
    const userSnapshot = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userSnapshot.data();

    res.send({ firstName: userData.firstName });
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).send({ message: 'Error getting user data' });
  }
});


/* This code defines an endpoint for user registration. When a POST request is made to the '/register'
endpoint, the function retrieves the user's first name, last name, birthday, email, password, and
isAdmin status from the request body. It then uses the Firebase Admin SDK to create a new user with
the provided email and password. If the user is created successfully, it saves the user's profile
information (first name, last name, birthday, and isAdmin status) in Firestore and sends a response
to the client with a success message and the user's unique ID (UID). If there is an error during the
process, it sends an error response with the error message. */
app.post('/register', async (req, res) => {
  const { firstName, lastName, birthday, email, password, isAdmin } = req.body;

  try {
    // Create a new user
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    // Save the user's profile information in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      isAdmin: isAdmin,
    });

    res.send({ message: 'User registered successfully', userId: userRecord.uid });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).send({ message: 'Error creating new user' });
  }
});


app.get('/getImage/:imageName', async (req, res) => {
  try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(req.params.imageName);
      const url = await file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491'
      });

      // Return the download URL
      res.send({ url: url[0] });

  } catch (error) {
      console.error('Error getting download URL', error);
      res.status(500).send('Error getting download URL');
  }
});


app.get('/test', (req, res) => {
	res.send("Success!")
});


/* The above code is starting a server and listening on a specified port. When the server starts
running, it will log a message to the console indicating the port number on which the server is
running. */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

