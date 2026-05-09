import React, { useEffect, useState } from "react";
import axios from "axios";

function Suggestion() {

  const [profile, setProfile] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3000/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.log(err));

    fetch("http://localhost:3000/suggestion")
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => console.log(err));

  }, []);

  const handleFollow = async (id, username) => {

    axios.post(
      "http://localhost:3000/followers",
      {
        id,
        username
      }
    )
      .then(() => alert("Followed"))
      .catch((err) => console.log(err));

  };

  return (
    <div>

      <div className="suggestions m-4">

        {profile.length > 0 && (

          profile.map((user) => (

            <div
              className="post-card d-flex align-items-center p-2"
              key={user.id}
            >

              <img
                className="post-image"
                src={user.profilePic}
                alt=""
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%"
                }}
              />

              <h5 className="ms-2">
                {user.username}
              </h5>

            </div>

          ))

        )}

        <div className="d-flex mt-3">
          <p>Suggestions for you</p>
          <b className="ms-auto">See all</b>
        </div>

        {suggestions.length > 0 ? (

          suggestions.map((item) => (

            <div
              className="post-card d-flex align-items-center p-2"
              key={item.id}
            >

              <img
                className="post-image"
                src={item.profilePic}
                alt=""
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%"
                }}
              />

              <h5 className="ms-2">
                {item.username}
              </h5>

              <button
                className="btn btn-link text-primary ms-auto"
                onClick={() =>
                  handleFollow(
                    item.id,
                    item.username
                  )
                }
              >
                Follow
              </button>

            </div>

          ))

        ) : (
          <h2>Loading...</h2>
        )}

      </div>

    </div>
  );
}

export default Suggestion;