import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../util/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  QuerySnapshot,
  DocumentData,
  or,
} from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { user1, user2, user1Img, user2Img } = req.body;
    let chatId = '';

    if (!user1 || !user2 || !user1Img || !user2Img)
      return res.status(422).json({ message: 'Invalid data' });

    //confirm that chat does not exists already
    const q = query(
      collection(db, 'chats'),
      where('user1', 'in', [user1, user2]),
      where('user2', 'in', [user1, user2])
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => (chatId = doc.exists() ? doc.id : ''));

    if (chatId)
      return res.status(422).json({ message: 'Chat already exists', chatId });

    try {
      const docRef = await addDoc(collection(db, 'chats'), req.body);
      return res
        .status(201)
        .json({ message: `Chat created with ID - ${docRef.id}` });
    } catch (e) {
      return res.status(500).json({ message: `Unable to create chat - ${e}` });
    }
  }
  //for getting users by email - ?email=emailAddress & skip email query parameter to get all users
  else if (req.method === 'GET') {
    let chats: DocumentData[] = [];

    if (!req.query.userId)
      return res.status(400).json({ message: `User Id is required` });

    const q = query(
      collection(db, 'chats'),
      or(
        where('user1', '==', req.query.userId),
        where('user2', '==', req.query.userId)
      )
    );
    const querySnapshot = await getDocs(collection(db, 'users'));

    querySnapshot.forEach((doc) => chats.push({ id: doc.id, ...doc.data() }));

    return res.status(201).json({
      message: `Chats fetched successfully!`,
      result: chats,
    });
  } else {
    return res
      .status(405)
      .json({ message: `${req.method} method not supported` });
  }
}
