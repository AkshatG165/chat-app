import classes from './login.module.css';
import Card from '../ui/card';
import { useState } from 'react';

export default function Login() {
  const [login, setLogin] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  const submitHandler = () => {};
  const toggleHandler = () => setLogin((prev) => !prev);
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
              <label htmlFor="profilepic">
                {selectedImage ? (
                  <img src={selectedImage}></img>
                ) : (
                  'Add an Image'
                )}
              </label>
              <input
                id="profilepic"
                type="file"
                name="profilepic"
                accept="image/png, image/jpg, image/jpeg"
                onChange={addImgHandler}
              />
            </div>
          )}
          {!login && (
            <div className={classes.name}>
              <input
                id="firstname"
                type="text"
                name="firstname"
                placeholder="First Name"
                required
              />
              <input
                id="lastname"
                type="text"
                name="lastname"
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
          <button type="submit">{login ? 'Login' : 'Sign Up'}</button>
        </form>
        {login ? (
          <p className={classes.register}>
            Don't have an account yet?{' '}
            <button type="button" onClick={toggleHandler}>
              Register
            </button>
          </p>
        ) : (
          <p className={classes.register}>
            Already have an account?{' '}
            <button type="button" onClick={toggleHandler}>
              Login
            </button>
          </p>
        )}
      </Card>
    </div>
  );
}
