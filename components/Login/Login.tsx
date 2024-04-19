import classes from './Login.module.css';
import Card from '../UI/Card';
import { useState } from 'react';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { storage } from '@/util/firebase';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Loader from '../UI/Loader';
import Image from 'next/image';

export default function Login() {
  const [login, setLogin] = useState(true);
  const [selectedImage, setSelectedImage] = useState<null | string>(null);
  const [error, setError] = useState<null | string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    const fromElem = e.currentTarget;
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    let data = { ...Object.fromEntries(fd.entries()) };

    if (data.password !== data.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const profileImg = data.profileImg as File;
    const imgRef = ref(
      storage,
      `profileImages/${Math.floor(Math.random() * 10000000000)}${
        profileImg.name
      }`
    );

    //if signup
    if (!login) {
      setLoading(true);
      try {
        if (profileImg) {
          const resp = await uploadBytes(imgRef, profileImg);
          if (resp.metadata) data.profileImg = await getDownloadURL(imgRef);
        } else data.profileImg = '';

        const res = await fetch('/api/user', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const message = (await res.json()).message;
          setError(message);
          if (profileImg) await deleteObject(imgRef);
        } else {
          fromElem.reset();
          setSelectedImage(null);
          setLogin(true);
          router.reload();
        }
      } catch (e: any) {
        console.log('hi');
        setError(e);
      }
    } else {
      const data = { ...Object.fromEntries(fd.entries()) };
      const res = await signIn('credentials', { ...data, redirect: false });

      if (res && !res.ok) {
        setError(res.error);
      } else router.replace('/');
    }
    setLoading(false);
  };

  const toggleHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    document.querySelector('form')?.reset();
    setSelectedImage(null);
    setLogin((prev) => !prev);
    setError(null);
  };

  const addImgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    setSelectedImage(URL.createObjectURL(file));
  };

  return (
    <div className={classes.container}>
      <h1>CHAT APP</h1>
      <Card className={classes.card}>
        <h2>{login ? 'Login' : 'Register'}</h2>
        <form className={classes['login-form']} onSubmit={submitHandler}>
          {!login && (
            <div>
              <label htmlFor="profileImg">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt="profile-img"
                    width={99}
                    height={98}
                    className={classes.img}
                  />
                ) : (
                  'Add an Image'
                )}
              </label>
              <input
                id="profileImg"
                type="file"
                name="profileImg"
                accept="image/png, image/jpg, image/jpeg"
                onChange={addImgHandler}
              />
            </div>
          )}
          {!login && (
            <div className={classes.name}>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                required
              />
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
              />
            </div>
          )}
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
          />
          {!login && (
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
            />
          )}
          {error && <p className={classes.error}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? <Loader color={'white'} /> : login ? 'Login' : 'Sign Up'}
          </button>
        </form>
        {login ? (
          <p className={classes.register}>
            Don&apos;t have an account yet?
            <button type="button" disabled={loading} onClick={toggleHandler}>
              Register
            </button>
          </p>
        ) : (
          <p className={classes.register}>
            Already have an account?{' '}
            <button type="button" disabled={loading} onClick={toggleHandler}>
              Login
            </button>
          </p>
        )}
      </Card>
    </div>
  );
}
