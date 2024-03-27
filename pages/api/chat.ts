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
} from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { user1, user2, user1Img, user2Img } = req.body;
    let chatId = '';

    if (!user1 || !user2)
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
  } else if (req.method === 'GET') {
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
  } else if (req.method === 'DELETE') {
    if (!req.query.chatId)
      return res.status(400).json({ message: `Chat Id is required` });

    await deleteDoc(doc(db, 'chats', req.query.chatId as string));

    return res.status(201).json({ message: `Chat deleted successfully!` });
  } else {
    return res
      .status(405)
      .json({ message: `${req.method} method not supported` });
  }
}
