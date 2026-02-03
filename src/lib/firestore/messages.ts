import { 
  collection,
  doc, 
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  or,
  and
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Timestamp;
}

export const sendMessage = async (
  senderId: string, 
  receiverId: string, 
  content: string
): Promise<string> => {
  const messagesRef = collection(db, 'messages');
  
  const docRef = await addDoc(messagesRef, {
    senderId,
    receiverId,
    content,
    isRead: false,
    createdAt: serverTimestamp(),
  });
  
  return docRef.id;
};

export const getMessages = async (userId: string, partnerId: string): Promise<Message[]> => {
  const messagesRef = collection(db, 'messages');
  
  // Get messages where user is sender and partner is receiver OR vice versa
  const q = query(
    messagesRef,
    orderBy('createdAt', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  
  const messages: Message[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Filter in client since Firestore doesn't support complex OR queries well
    if (
      (data.senderId === userId && data.receiverId === partnerId) ||
      (data.senderId === partnerId && data.receiverId === userId)
    ) {
      messages.push({ id: doc.id, ...data } as Message);
    }
  });
  
  return messages;
};

export const subscribeToMessages = (
  userId: string, 
  partnerId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, 'messages');
  
  const q = query(
    messagesRef,
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        (data.senderId === userId && data.receiverId === partnerId) ||
        (data.senderId === partnerId && data.receiverId === userId)
      ) {
        messages.push({ id: doc.id, ...data } as Message);
      }
    });
    callback(messages);
  });
};
