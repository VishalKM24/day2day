import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import Post from './Posts';

function App() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()})));
    })
  }, []);

  return (
    <div className="app">

      <div className="app__header">
      <img
        className="app__headerImage"
        src = "/images/day2day-logo.png"
        alt = ""
      />
      </div>

      <h1>Hello Vishal Mandal Let's build day2daypost web</h1>

      {
        posts.map(({id, post}) => (
          <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }
    </div>
  );
}

export default App;
