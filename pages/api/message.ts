import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../util/firebase';
import { collection, addDoc, getDocs, DocumentData } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { chatId, date, from, message } = req.body;

    if (!chatId || !date || !from || !message)
      return res.status(422).json({ message: 'Invalid data' });

    try {
      const docRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
        date,
        from,
        message,
      });
      return res
        .status(201)
        .json({ message: `Message inserted - ${docRef.id}` });
    } catch (e) {
      return res
        .status(500)
        .json({ message: `Unable to insert message - ${e}` });
    }
  } else if (req.method === 'GET') {
    let messages: DocumentData[] = [];

    if (!req.query.chatId)
      return res.status(400).json({ message: `Chat Id is required` });

    const querySnapshot = await getDocs(
      collection(db, 'chats', req.query.chatId as string, 'messages')
    );
    querySnapshot.forEach((doc) =>
      messages.push({ id: doc.id, ...doc.data() })
    );

    return res.status(201).json({
      message: `Messages fetched successfully!`,
      result: messages,
    });
  } else {
    return res
      .status(405)
      .json({ message: `${req.method} method not supported` });
  }
}
