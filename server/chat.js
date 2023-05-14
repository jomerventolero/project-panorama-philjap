/**
 * This function sends a message between two users while preventing admin to admin messaging.
 * @param fromUserId - The ID of the user who is sending the message.
 * @param toUserId - The `toUserId` parameter is the ID of the user who will receive the message.
 * @param message - The message parameter is the actual message that is being sent from the fromUserId
 * to the toUserId. It is a string value.
 * @returns Nothing is being returned explicitly in this code. However, if the condition `if
 * (fromIsAdmin && toIsAdmin)` is met, the function will return without sending the message. Otherwise,
 * if the message is sent successfully, the console will log "Message sent successfully". If there is
 * an error, the console will log "Error sending message" along with the error message.
 */
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