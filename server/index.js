const express = require("express");
const cors = require("cors")
const admin = require("firebase-admin")
const serviceAccount = require("./firebase-config/philjaps-firebase-adminsdk-asmoe-0b7dffd0ca.json")

const app = express()
const port = process.env.PORT || 3000;


admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

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


app.get('/test', (req, res) => {
	res.send("Success!")
})

/* The above code is starting a server and listening on a specified port. When the server starts
running, it will log a message to the console indicating the port number on which the server is
running. */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
