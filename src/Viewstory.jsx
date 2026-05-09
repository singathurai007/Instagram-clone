import React, { useEffect, useState } from "react";

import {
  useParams,
  Link,
  useNavigate
} from "react-router-dom";

function Viewstory() {
  const { id, tot } = useParams();

  const [story, setStory] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/stories/${id}`)
      .then((res) => res.json())
      .then((data) => setStory(data))
      .catch((err) => console.log(err));
  }, [id]);

  if (Number(id) > Number(tot) || Number(id) <= 0) {
    navigate("/");
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">

      {story ? (
        <div className="d-flex align-items-center">

          <Link to={`/story/${Number(id) - 1}/${tot}`}>
            ⬅️
          </Link>

          <div className="mx-3 text-center">
            <h3>{story?.user?.username}</h3>

            <img
              src={story.image}
              alt=""
              width="300"
              style={{
                borderRadius: "15px"
              }}
            />
          </div>

          <Link to={`/story/${Number(id) + 1}/${tot}`}>
            ➡️
          </Link>

        </div>
      ) : (
        <h1>Loading...</h1>
      )}

    </div>
  );
}

export default Viewstory;