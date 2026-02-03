import { 
  collection, 
  addDoc, 
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface CallOffer {
  id: string;
  caller_id: string;
  receiver_id: string;
  type: 'voice' | 'video';
  offer: any; // RTCSessionDescriptionInit
  status: 'pending' | 'accepted' | 'rejected' | 'ended';
  created_at: Timestamp;
}

export interface CallAnswer {
  id: string;
  call_id: string;
  answer: any; // RTCSessionDescriptionInit
  created_at: Timestamp;
}

export interface IceCandidate {
  id: string;
  call_id: string;
  user_id: string;
  candidate: any; // RTCIceCandidateInit
  created_at: Timestamp;
}

// Create a call offer
export const createCallOffer = async (
  callerId: string,
  receiverId: string,
  type: 'voice' | 'video',
  offer: RTCSessionDescriptionInit
): Promise<string> => {
  const callRef = await addDoc(collection(db, 'calls'), {
    caller_id: callerId,
    receiver_id: receiverId,
    type,
    offer,
    status: 'pending',
    created_at: serverTimestamp(),
  });

  return callRef.id;
};

// Answer a call
export const answerCall = async (
  callId: string,
  answer: RTCSessionDescriptionInit
): Promise<void> => {
  // Update call status
  await updateDoc(doc(db, 'calls', callId), {
    status: 'accepted'
  });

  // Add answer document
  await addDoc(collection(db, 'call_answers'), {
    call_id: callId,
    answer,
    created_at: serverTimestamp(),
  });
};

// Reject a call
export const rejectCall = async (callId: string): Promise<void> => {
  await updateDoc(doc(db, 'calls', callId), {
    status: 'rejected'
  });
};

// End a call
export const endCall = async (callId: string): Promise<void> => {
  await updateDoc(doc(db, 'calls', callId), {
    status: 'ended'
  });
};

// Add ICE candidate
export const addIceCandidate = async (
  callId: string,
  userId: string,
  candidate: RTCIceCandidateInit
): Promise<void> => {
  await addDoc(collection(db, 'ice_candidates'), {
    call_id: callId,
    user_id: userId,
    candidate,
    created_at: serverTimestamp(),
  });
};

// Listen for incoming calls
export const subscribeToIncomingCalls = (
  userId: string,
  callback: (call: CallOffer) => void
) => {
  const callsRef = collection(db, 'calls');
  const q = query(
    callsRef,
    where('receiver_id', '==', userId),
    where('status', '==', 'pending'),
    orderBy('created_at', 'desc'),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const call = { id: change.doc.id, ...change.doc.data() } as CallOffer;
        callback(call);
      }
    });
  });
};

// Listen for call answers
export const subscribeToCallAnswers = (
  callId: string,
  callback: (answer: CallAnswer) => void
) => {
  const answersRef = collection(db, 'call_answers');
  const q = query(
    answersRef,
    where('call_id', '==', callId),
    orderBy('created_at', 'desc'),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const answer = { id: change.doc.id, ...change.doc.data() } as CallAnswer;
        callback(answer);
      }
    });
  });
};

// Listen for ICE candidates
export const subscribeToIceCandidates = (
  callId: string,
  userId: string,
  callback: (candidate: IceCandidate) => void
) => {
  const candidatesRef = collection(db, 'ice_candidates');
  const q = query(
    candidatesRef,
    where('call_id', '==', callId),
    where('user_id', '!=', userId), // Only get candidates from the other user
    orderBy('created_at', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = { id: change.doc.id, ...change.doc.data() } as IceCandidate;
        callback(candidate);
      }
    });
  });
};

// Clean up old calls (call this periodically)
export const cleanupOldCalls = async (): Promise<void> => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  // This would need a cloud function in production
  // For now, just a placeholder
  console.log('Cleanup old calls older than:', oneDayAgo);
};