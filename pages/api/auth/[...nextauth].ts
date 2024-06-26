import { db } from '@/util/firebase';
import { checkPassword } from '@/util/helper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import NextAuth, { Session } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
};

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'text' },
      },
      async authorize(credentials) {
        let users: User[] = [];
        const q = query(
          collection(db, 'users'),
          where('email', '==', credentials!.email)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) =>
          users.push({ id: doc.id, ...doc.data() } as User)
        );

        //checking if email exists
        if (users.length < 1) throw new Error('User does not exist');
        //matching password
        const isValid = await checkPassword(
          credentials!.password,
          users[0].password
        );

        if (!isValid) throw new Error('Invalid password');
        else return users[0];
      },
    }),
  ],
  secret: 'secretKey',
  session: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) return { ...token, user: user };
      return token;
    },
    async session({ session, token }: any) {
      return {
        ...session,
        user: {
          id: token.user.id,
          firstName: token.user.firstName,
          lastName: token.user.lastName,
          email: token.user.email,
          image: token.user.profileImg,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
