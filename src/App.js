import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, db } from './firebase';
import Post from './Posts';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Link } from '@material-ui/core';
import ImageUpload from "./ImageUpload";
import "./components/Navbar.css";


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [click, setClick] = useState(false);

  const closeMobileMenu=()=> setClick(false);


  const handleClick = () => setClick(!click);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // don't update username
        } else {
          return authUser.updateProfile({
            displayName: username
          });
        }
      } else {
        // user logged out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false);
  }

  const SignIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <>
      <div className="app">
        <Modal
          open={open}
          onClose={() => setOpen(false)}
        >

          <div style={modalStyle} className={classes.paper}>
            <form className="app__signUp">
              <center>
                <img
                  className="app__headerImage"
                  src="/images/day2day-logo.png"
                  alt=""
                />
              </center>
              <input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signUp}>Sign Up</Button>


            </form>

          </div>
        </Modal>

        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
        >

          <div style={modalStyle} className={classes.paper}>
            <form className="app__signUp">
              <center>
                <img
                  className="app__headerImage"
                  src="/images/day2day-logo.png"
                  alt=""
                />
              </center>
              <input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={SignIn}>Sign In</Button>


            </form>

          </div>
        </Modal>

        <nav className="navbar">
          <div className="navbar-container">


            <Link className="navbar-logo">
              <img
                className="app__headerImage"
                src="/images/day2day-logo.png"
                alt=""
              />
            </Link>
            <div className="menu-icon" onClick={handleClick}>
              <i class={click ? "fas fa-times" : "fas fa-bars"} />
            </div>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                {user ? (
                  <li className="nav-item">
                    <Link className='nav-links' onClick={closeMobileMenu}>Logout</Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <li className="nav-item">
                        <Link className='nav-links' onClick={() => setOpenSignIn(true)}>Sign In</Link>
                      </li>
                      <li className="nav-item">
                        <Link className='nav-links' onClick={() => setOpen(true)}>Sign Up</Link>
                      </li>
                    </li>
                  </>
                )}
              </li>
            </ul>

          </div>
        </nav>

        <div className="posts__and__upload">
          <div>

            <div className="app__posts" >
              <div className="app_postsLeft">
                <h1>Welcome to Day2Day</h1>
                {
                  posts.map(({ id, post }) => (
                    <Post
                      key={id}
                      username={post.username}
                      caption={post.caption}
                      imageUrl={post.imageUrl} />
                  ))
                }
              </div>

            </div>
          </div>

          <div>

            {user?.displayName ? (
              <ImageUpload username={user.displayName} />
            ) : (
              <h3>Sorry need to login to Upload</h3>
            )}

          </div>
        </div>

      </div>
    </>
  );
}

export default App;
