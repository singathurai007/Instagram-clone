import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getErrorMessage, getStories } from "./lib/api";

function Stories() {
  const [stories, setStories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    getStories()
      .then((data) => {
        if (!active) return;
        setStories(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <section className="stories" aria-label="Stories" aria-busy="true">
        {[1, 2, 3, 4, 5].map((item) => (
          <div className="story-item" key={item}>
            <div className="story-ring skeleton" />
            <span className="skeleton skeleton-text" />
          </div>
        ))}
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="stories" aria-label="Stories">
        <p className="state state-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (!stories.length) {
    return (
      <section className="stories" aria-label="Stories">
        <p className="state">No stories yet.</p>
      </section>
    );
  }

  return (
    <section className="stories" aria-label="Stories">
      {stories.map((story) => (
        <button
          type="button"
          key={story.id}
          className="story-item"
          onClick={() => navigate(`/story/${story.id}/${stories.length}`)}
        >
          <span className="story-ring">
            <img
              src={story.user?.profile_pic}
              alt=""
              className="story-avatar"
              loading="lazy"
            />
          </span>

          <span className="story-username">
            {story.user?.username ?? "unknown"}
          </span>
        </button>
      ))}
    </section>
  );
}

export default Stories;
