import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '@/util/helper';
import { db } from '../../../util/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password, profileImg } = req.body;
    const hashedPassword = await hashPassword(password);
    const data = { ...req.body, password: hashedPassword };
    let emailExists = false;

    if (!firstName || !lastName || !email || !password || !profileImg)
      return res.status(422).json({ message: 'Invalid data' });

    //confirm that users does not exists already
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.exists()) emailExists = true;
    });

    if (emailExists)
      return res.status(422).json({ message: 'Email already exists' });

    try {
      const docRef = await addDoc(collection(db, 'users'), data);
      return res
        .status(201)
        .json({ message: `User created with ID - ${docRef.id}` });
    } catch (e) {
      return res.status(500).json({ message: `Unable to add user - ${e}` });
    }
  }
  //for getting users by email - ?email=emailAddress & skip email query parameter to get all users
  else if (req.method === 'GET') {
    let querySnapshot: QuerySnapshot<DocumentData, DocumentData>;
    let users: DocumentData[] = [];

    if (req.query.email) {
      const q = query(
        collection(db, 'users'),
        where('email', '==', req.query.email)
      );
      querySnapshot = await getDocs(q);
    } else if (req.query.name) {
      const q = query(
        collection(db, 'users'),
        where(
          'firstName',
          '>=',
          (req.query.name as string).substring(0, 1).toUpperCase() +
            (req.query.name as string).substring(1)
        ),
        where(
          'firstName',
          '<',
          (req.query.name as string).substring(0, 1).toUpperCase() +
            (req.query.name as string).substring(1) +
            'z'
        )
      );
      querySnapshot = await getDocs(q);
    } else querySnapshot = await getDocs(collection(db, 'users'));

    querySnapshot.forEach((doc) => users.push(doc.data()));

    if (users.length < 1)
      return res.status(201).json({
        message: 'User does not exists',
        result: [],
      });

    return res.status(201).json({
      message: `${req.query.email ? 'User' : 'Users'} fetched successfully!`,
      result: users,
    });
  } else {
    return res
      .status(405)
      .json({ message: `${req.method} method not supported` });
  }
}
