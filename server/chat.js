


async function sendMessage(fromUserId, toUserId, message) {
    try {
      const db = firebase.firestore();
      
      // Check user types
      const fromUserDoc = await db.collection('users').doc(fromUserId).get();
      const toUserDoc = await db.collection('users').doc(toUserId).get();
  
      const fromIsAdmin = fromUserDoc.data().isAdmin;
      const toIsAdmin = toUserDoc.data().isAdmin;
  
      // Prevent admin to admin messaging
      if (fromIsAdmin && toIsAdmin) {
        console.error('Admin to admin messaging is not allowed');
        return;
      }
  
      // Save the message in Firestore
      await db.collection('messages').add({
        from: fromUserId,
        to: toUserId,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message', error);
    }
  }

  
export default sendMessage;