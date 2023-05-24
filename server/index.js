/* This code is importing necessary
   modules and setting up a server 
   using the Express framework. */
   const express = require('express');
   const cors = require('cors');
   const admin = require('firebase-admin');
   const serviceAccount = require('./firebase-config/philjaps-firebase-adminsdk-asmoe-c066ae76b2.json');
   const uuid = require('uuid');


   const app = express();
   const port = process.env.PORT || 3002;
   
   
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     storageBucket: 'philjaps.appspot.com',
   });
   
   const auth = admin.auth();
   const db = admin.firestore();
   const multer = require('multer');
   const bucket = admin.storage().bucket();
   

   /* The code is configuring and initializing a multer middleware for handling file uploads in a
   Node.js application. It sets the storage engine to use in-memory storage, and sets limits for the
   maximum number of files and the maximum file size that can be uploaded. Specifically, it allows
   up to 15 files to be uploaded, with each file having a maximum size of 50 MB. */
   // set multer to store files temporarily on disk
  // Set up storage engine
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // the path where the uploaded files will be stored. Make sure this directory exists.
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()); // sets the name of the file that will be saved.
    },
  });
   
  /* `app.use(cors())` enables Cross-Origin Resource Sharing (CORS) for the Express server, allowing it
  to receive requests from other domains. `app.use(express.json())` is middleware that parses incoming
  requests with JSON payloads and makes the resulting data available on the `req.body` property of the
  request object. This allows the server to handle JSON data sent in the request body. */
  app.use(cors());
  app.use(express.json());   
   

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
   
  const upload = multer({
    storage: multer.diskStorage({
      destination: 'uploads/',
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
    }),
    limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  });
  

/* The above code is defining a route for the "/user" endpoint in an Express app. The route is
protected by a Firebase authentication middleware called "validateFirebaseIdToken". When a GET
request is made to this endpoint, the code retrieves the user data from a Firestore database using
the user ID from the Firebase authentication token. If the user document does not exist, a 404 error
is returned. If the user document exists but does not have a "firstName" field, a 404 error is
returned. Otherwise, the user's first name is returned in the response. If there is an error
retrieving */
  app.get('/user', validateFirebaseIdToken, async (req, res) => {
    try {
      const userSnapshot = await db
        .collection('users')
        .doc(req.user.uid)
        .get();
      if (!userSnapshot.exists) {
        console.log(`No document exists for uid: ${req.user.uid}`);
        return res.status(404).send({ message: 'User not found' });
      }
      const userData = userSnapshot.data();
      console.log(`User data: ${JSON.stringify(userData)}`); 
      if (!userData.firstName) {
        console.log(`No firstName field for uid: ${req.user.uid}`);
        return res.status(404).send({ message: 'User first name not found' });
      }
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
  information in Firestore and sends a response to the client with a success message and the user's
  unique ID (UID). If the user is an admin, it creates a dedicated folder for the admin user in
  Firebase Storage, sets custom Firebase Storage rules for the admin folder, and grants admin
  privileges to the user. If there is an error during the process, it sends an error response with the
  error message. */
  app.post('/register', async (req, res) => {
    const { firstName, lastName, bday, email, password, isAdmin } = req.body;
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
        birthday: bday,
        isAdmin: isAdmin,
      });   
      if (isAdmin) {
        // Create a dedicated folder for the admin user in Firebase Storage
        const bucketName = 'philjaps.appspot.com'; // Replace with your storage bucket name
        const bucket = admin.storage().bucket(bucketName);
        const folderPath = `admin/${userRecord.uid}/`;
        await bucket.file(folderPath).save('');   
        // Set custom Firebase Storage rules for the admin folder
        await bucket.file('.settings/rules.json').save(
          JSON.stringify({
            rules: {
              rulesVersion: '2',
              firebaseStoragePath: {
                '.write': `root.child('${folderPath}').child(newData.path).child('metadata/admin').val() === true`,
                '.read': `root.child('${folderPath}').child(data.path).child('metadata/admin').val() === true`,
              },
            },
          })
        );   
        // Grant admin privileges to the user
        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
      }   
      res.send({ message: 'User registered successfully', userId: userRecord.uid });
    } catch (error) {
      console.error('Error creating new user:', error);
      res.status(500).send({ message: 'Error creating new user' });
    }
  });


  /* The code below is a server-side code written in JavaScript using the Express framework. It defines
  a route for handling file uploads to Google Cloud Storage and Firestore. When a POST request is
  made to the '/upload' endpoint, it expects a multipart form data with an array of images, a title,
  and a description. It then generates a unique project ID using the uuid library, creates a Promise
  for each image file, and uploads it to Google Cloud Storage using the Google Cloud Storage Node.js
  client library. Once the upload is complete, it creates an image record with the image ID, title,
  description, */
  app.post('/upload', upload.array('images'), async (req, res) => {
    try {
      const { title, description } = req.body;
      const projectId = uuid.v4();
  
      const imagesPromises = req.files.map((file) => {
        const id = uuid.v4();
        const blob = bucket.file(`images/project/${req.body.uid}/${title}/${id}.jpg`);
        
        const blobWriter = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
  
        return new Promise((resolve, reject) => {
          blobWriter.on('error', reject);
          blobWriter.on('finish', async () => {
            const imageUrl = `gs://${bucket.name}/${blob.name}`;
            const imageRecord = {
              id,
              imageTitle: title,
              imageDescription: description,
              imageUrl,
            };
  
            resolve(imageRecord);
          });
  
          fs.createReadStream(file.path).pipe(blobWriter);
        });
      });
  
      const images = await Promise.all(imagesPromises);
  
      const projectData = {
        id: projectId,
        title,
        description,
        images,
      };
  
      const docRef = db.collection('projects').doc(projectId);
      await docRef.set(projectData);
  
      res.status(200).send(projectData);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });


  app.get('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userSnapshot = await db.collection('users').doc(userId).get();
      const userData = userSnapshot.data();
  
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.json(userData);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  app.get('/api/projects/images/:projectId', async (req, res) => {
    const { projectId } = req.params;
  
    try {
      // Fetch the images for the project
      const projectRef = db.collection('project').doc(projectId);
      const imagesSnapshot = await projectRef.collection('images').get();
  
      const images = imagesSnapshot.docs.map((doc) => {
        const { imageTitle, imageDescription, imageUrl } = doc.data();
        return {
          imageTitle,
          imageDescription,
          imageUrl,
        };
      });
  
      // Return the images
      return res.json(images);
    } catch (error) {
      console.error('Error fetching project images:', error);
      return res.status(500).json({ message: 'Error fetching project images' });
    }
  });
  
  



  /* The above code is defining an endpoint for a GET request to retrieve all projects for a given user
  ID. It uses Firebase Firestore to query the database for all collections under the "projects"
  document for the specified user ID. For each project collection, it retrieves all documents and
  their associated images, and constructs an array of project objects with their respective image
  objects. Finally, it sends a JSON response with the array of projects. If there are no projects
  found for the user, it sends a 404 error response. If there is an error retrieving the projects, it
  sends a 500 error response. */
  app.get('/api/projects/:userId', async (req, res) => {
    const { userId } = req.params;

    // initialize firestore
    const db = admin.firestore();

    try {
      // get projects for the user
      const userRef = db.collection('projects').doc(userId);
      const projectCollections = await userRef.listCollections();

      if (!projectCollections.length) {
        res.status(404).send('No projects found for this user');
        console.log('No matching documents.');
        return;
      }

      const projectsPromises = projectCollections.map(async (projectColl) => {
        const projectQuerySnapshot = await projectColl.get();

        const projects = projectQuerySnapshot.docs.map(async (projectDoc) => {
          const project = {
            id: projectDoc.id,
            ...projectDoc.data(),
            images: []
          };

          // get images for the project
          const imagesSnapshot = await projectDoc.ref.collection('images').get();

          imagesSnapshot.forEach(imageDoc => {
            const image = {
              id: imageDoc.id,
              ...imageDoc.data()
            };
            project.images.push(image);
          });

          return project;
        });

        return Promise.all(projects);
      });

      const projects = await Promise.all(projectsPromises).then(result => result.flat());

      res.json(projects);
    } catch (error) {
      console.error('Error getting user projects', error);
      res.status(500).send('Error getting user projects');
    }
  });


  app.get('/test', (req, res) => {
    res.send('Success!');
  });   
  

  /* The above code starts the server and listens on the specified port. When the server starts running,
  it will log a message to the console indicating the port number on which the server is running. */
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });   