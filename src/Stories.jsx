import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Stories() {
  const [stories, setStories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/stories")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch((err) => console.log(err));
  }, []);

  const tot = stories.length;

  return (
    <div className="story d-flex">
      {stories.length > 0 ? (
        stories.map((story) => (
          <div
            key={story.id}
            className="mx-2"
            onClick={() =>
              navigate(`/story/${story.id}/${tot}`)
            }
          >
            <div className="gradient-border">
              <img
                src={story.user.profile_pic}
                alt="dp"
                className="story-dp rounded-circle"
              />
            </div>

            <p
              className="text-truncate"
              style={{ width: "50px" }}
            >
              {story.user.username}
            </p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Stories;