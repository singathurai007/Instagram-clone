import React, { useEffect, useState } from "react";
import "./index.css";

import {
  FaHeart,
  FaRegComment,
  FaPaperPlane
} from "react-icons/fa";

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="d-flex justify-content-center" >
    <div className="posts-container">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="post-card" key={post.id}>
            <img className="post-image" src={post.image} alt="" />

            <div className="post-icons">
              <FaHeart className="icon heart" />
              <FaRegComment className="icon" />
              <FaPaperPlane className="icon" />
            </div>

            <div className="post-content">
              <p className="likes">100 likes</p>
              <h3>{post.caption}</h3>
            </div>
          </div>
        ))
      ) : (
        <h2>Loading posts...</h2>
      )}
    </div>
    </div>
  );
}

export default Posts;