import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../util/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  DocumentData,
  or,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //POST request
  if (req.method === 'POST') {
    const { user1, user1Name, user2, user2Name } = req.body;
    let chatId = '';

    if (!user1 || !user1Name || !user2 || !user2Name)
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
      const docRef = await addDoc(collection(db, 'chats'), {
        ...req.body,
        lastMessage: {},
      });
      return res
        .status(201)
        .json({ message: `Chat created successfully`, result: docRef.id });
    } catch (e) {
      return res.status(500).json({ message: `Unable to create chat - ${e}` });
    }
  }

  //GET request
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
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => chats.push({ id: doc.id, ...doc.data() }));

    return res.status(201).json({
      message: `Chats fetched successfully!`,
      result: chats,
    });
  }

  //DELETE request
  else if (req.method === 'DELETE') {
    if (!req.query.chatId)
      return res.status(400).json({ message: `Chat Id is required` });

    await deleteDoc(doc(db, 'chats', req.query.chatId as string));
    return res.status(201).json({ message: `Chat deleted successfully!` });
  }

  //PATCH request
  if (req.method === 'PATCH') {
    const { chatId, user1Name, user1Img, user2Name, user2Img, lastMessage } =
      req.body;

    if (!chatId) return res.status(422).json({ message: 'Invalid data' });

    //checking if chat exists or not
    const docSnap = await getDoc(doc(db, 'chats', chatId));
    if (!docSnap.exists)
      return res.status(422).json({ message: 'Invalid chat Id', chatId });

    const existingData = { ...docSnap.data() };
    for (let key in req.body) {
      if (existingData.hasOwnProperty(key)) existingData[key] = req.body[key];
    }

    try {
      await setDoc(doc(db, 'chats', chatId), existingData);
      return res.status(201).json({ message: `Chat created successfully` });
    } catch (e) {
      return res.status(500).json({ message: `Unable to create chat - ${e}` });
    }
  }

  //Anything else
  else {
    return res
      .status(405)
      .json({ message: `${req.method} method not supported` });
  }
}
