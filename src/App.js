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

  const closeMobileMenu = () => setClick(false);


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
      <div>
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
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="425.000000pt" height="425.000000pt" viewBox="0 0 1500.000000 1500.000000"
                preserveAspectRatio="xMidYMid meet">

                <g transform="translate(0.000000,1500.000000) scale(0.100000,-0.100000)"
                  fill="#000000" stroke="none">
                  <path d="M7863 8179 c-68 -11 -145 -42 -202 -81 -106 -73 -251 -249 -324 -394
-22 -43 -24 -54 -13 -69 21 -29 48 -9 96 72 147 251 309 389 468 401 88 6 112
-12 119 -85 12 -120 -29 -195 -217 -395 -202 -215 -431 -405 -765 -633 -79
-53 -92 -69 -75 -91 18 -21 35 -18 114 20 119 57 176 70 291 63 55 -3 134 -13
175 -22 41 -10 113 -18 160 -18 98 -2 142 15 223 84 50 43 59 72 28 89 -16 8
-28 3 -66 -30 -26 -22 -61 -48 -78 -57 -51 -28 -158 -21 -380 23 -35 7 -57 29
-57 59 0 18 30 50 127 132 249 212 306 268 450 438 101 119 137 195 141 300 5
112 -11 154 -68 183 -47 23 -65 25 -147 11z"/>
                  <path d="M5433 8003 c-139 -162 -223 -269 -313 -401 -36 -53 -73 -100 -82
-106 -14 -8 -28 -5 -63 14 -97 53 -222 22 -369 -91 -123 -95 -232 -270 -243
-389 -5 -60 -3 -69 19 -94 54 -63 154 -41 295 66 36 27 73 48 81 46 9 -2 20
-21 27 -45 5 -23 23 -56 39 -72 24 -25 38 -31 73 -31 57 0 94 16 176 78 37 29
69 52 70 52 1 0 2 -19 3 -41 0 -33 6 -47 28 -65 41 -36 98 -33 166 10 30 19
74 47 97 61 23 15 47 24 53 20 6 -3 19 -24 30 -45 35 -68 98 -86 178 -50 41
19 141 89 192 136 l25 23 1 -51 c0 -43 5 -55 29 -76 38 -32 84 -26 165 23 60
37 85 39 96 11 13 -34 -88 -123 -237 -208 -70 -41 -207 -155 -240 -200 -37
-52 -37 -82 0 -119 37 -37 79 -38 147 -4 98 49 168 129 308 353 23 37 41 49
133 93 146 68 289 182 357 285 50 77 -7 108 -60 33 -35 -51 -184 -191 -229
-215 -28 -15 -36 -16 -49 -5 -9 8 -16 20 -16 29 0 16 83 174 144 276 37 61 44
90 25 101 -26 17 -63 -13 -169 -135 -163 -189 -278 -284 -323 -267 -37 14 -6
133 59 227 19 27 34 53 34 57 0 5 23 37 50 72 49 63 60 93 40 106 -22 14 -48
-9 -115 -101 -107 -146 -159 -206 -245 -279 -121 -103 -183 -135 -221 -114
-45 24 -17 100 80 218 65 79 70 91 45 112 -21 17 -35 8 -183 -126 -201 -181
-282 -233 -316 -205 -77 64 151 372 347 469 69 35 156 56 191 47 32 -8 43 -38
27 -77 -22 -51 23 -81 54 -37 25 36 21 111 -8 145 -23 27 -29 28 -108 28 -79
0 -90 -3 -169 -42 -92 -46 -211 -141 -280 -224 -133 -161 -290 -298 -361 -314
-19 -5 -32 -1 -48 15 -29 29 -23 59 35 175 61 122 161 259 574 779 136 172
136 172 121 191 -26 32 -50 14 -167 -122z m-493 -546 c14 -7 26 -19 28 -28 4
-20 -189 -250 -279 -332 -40 -36 -104 -82 -144 -102 -108 -55 -141 -35 -111
68 45 155 212 340 353 392 48 17 121 18 153 2z m1044 -763 c32 -12 18 -54 -38
-108 -60 -59 -110 -85 -134 -69 -28 17 -25 33 15 71 36 34 132 112 139 112 1
0 9 -3 18 -6z"/>
                  <path d="M9546 8118 c-71 -66 -308 -362 -415 -520 -49 -72 -79 -108 -91 -108
-11 0 -36 10 -57 23 -159 93 -477 -119 -586 -391 -59 -146 -8 -241 116 -218
39 7 144 68 197 114 21 17 45 32 54 32 18 0 36 -30 36 -59 0 -11 14 -36 31
-56 28 -31 36 -35 80 -35 57 0 97 18 184 85 l60 45 6 -46 c7 -58 35 -84 91
-84 45 0 77 14 169 77 74 50 92 49 110 -4 13 -41 60 -73 107 -73 53 0 169 69
260 153 l32 31 0 -52 c0 -43 5 -58 25 -77 36 -37 78 -32 159 15 77 45 79 46
97 24 25 -31 -13 -74 -137 -155 -156 -101 -286 -201 -323 -248 -41 -52 -43
-110 -5 -140 33 -26 76 -26 133 -1 100 46 179 132 292 317 47 78 54 84 117
114 150 69 178 87 263 162 97 86 162 167 157 194 -8 41 -39 22 -150 -90 -106
-108 -167 -157 -195 -157 -7 0 -17 9 -24 21 -9 18 -4 34 31 103 23 44 64 118
91 162 48 81 59 117 38 129 -24 16 -59 -9 -129 -92 -176 -207 -302 -318 -353
-311 -64 9 -6 161 137 356 55 75 59 89 33 106 -16 9 -24 5 -54 -29 -19 -22
-56 -69 -81 -105 -99 -140 -236 -276 -339 -337 -72 -42 -122 -32 -123 25 0 33
20 68 94 161 69 87 75 101 51 121 -19 16 -41 2 -160 -104 -225 -203 -293 -249
-336 -225 -18 9 -20 17 -15 51 24 149 246 381 425 444 110 39 170 27 158 -32
-3 -16 -7 -37 -9 -48 -2 -10 5 -23 14 -29 14 -10 22 -7 40 11 18 17 23 34 23
73 0 45 -4 54 -33 80 -28 25 -40 29 -90 29 -111 0 -220 -50 -348 -159 -44 -37
-103 -97 -132 -133 -130 -163 -317 -311 -372 -293 -76 24 -23 161 162 417 68
94 119 160 433 557 66 84 122 157 123 162 5 13 -17 39 -34 39 -7 0 -24 -10
-38 -22z m-596 -661 c14 -7 26 -20 28 -28 4 -20 -111 -163 -222 -278 -122
-125 -265 -211 -301 -181 -36 30 -8 129 68 247 115 176 322 293 427 240z
m1061 -778 c9 -18 6 -27 -19 -58 -82 -101 -198 -146 -179 -68 7 24 151 147
174 147 7 0 17 -9 24 -21z"/>
                  <path d="M4290 6746 c-6 -9 -9 -20 -5 -26 4 -7 252 -10 776 -10 l770 0 -3 23
-3 22 -761 3 c-658 2 -763 0 -774 -12z"/>
                  <path d="M6314 6715 c-3 -8 -3 -19 1 -25 8 -13 3423 -14 3444 -1 8 5 11 16 8
25 -6 15 -159 16 -1727 16 -1495 0 -1721 -2 -1726 -15z"/>
                  <path d="M10344 6715 c-3 -8 -3 -19 1 -25 8 -13 394 -14 414 -1 8 5 11 16 8
25 -6 14 -33 16 -212 16 -171 0 -207 -2 -211 -15z"/>
                </g>
              </svg>
            </Link>
            <div className="menu-icon" onClick={handleClick}>
              <i class={click ? "fas fa-times" : "fas fa-bars"} />
            </div>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li>
                {user ? (
                  <li className="nav-item">
                    <Link className='nav-links' onClick={() => auth.signOut()}>LOG OUT</Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <li className="nav-item">
                        <Link className='nav-links' onClick={() => setOpenSignIn(true)}>SIGN IN</Link>
                      </li>
                      <li className="nav-item">
                        <Link className='nav-links' onClick={() => setOpen(true)}>SIGN UP</Link>
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
              <> </>
            )}

          </div>
        </div>

      </div>
    </>
  );
}

export default App;
