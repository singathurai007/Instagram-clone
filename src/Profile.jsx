import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {

  const [profile, setProfile] = useState(null);

  const [followers, setFollowers] = useState([]);

  const [unfollowed, setUnfollowed] = useState(false);

  useEffect(() => {

    axios.get("http://localhost:3000/profile/1")
      .then((data) => setProfile(data.data))
      .catch((err) => console.log(err));

    axios.get("http://localhost:3000/suggestion")
      .then((data) => setFollowers(data.data))
      .catch((err) => console.log(err));

  }, [unfollowed]);

  function handledOnChange(e) {

    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  }

  const handleUpdate = async () => {

    axios.put(
      "http://localhost:3000/profile/1",
      profile
    )
      .then(() => console.log("updated"))
      .catch((err) => console.log(err));

  };

  const handleUnfollow = async (id) => {

    axios.delete(
      `http://localhost:3000/suggestion/${id}`
    )
      .then(() => {
        alert("Unfollowed");
        setUnfollowed(!unfollowed);
      })
      .catch((err) => console.log(err));

  };

  return (
    <div className="m-5">

      {profile ? (

        <div>

          <img
            src={profile.profilePic}
            className="rounded-circle"
            width="120"
            height="120"
          />

          <h5>{profile.username}</h5>

          <input
            type="text"
            value={profile.username}
            name="username"
            className="form-control my-4"
            onChange={handledOnChange}
          />

          <input
            type="text"
            name="profilePic"
            value={profile.profilePic}
            className="form-control"
            onChange={handledOnChange}
          />

          <button
            className="btn btn-primary my-2"
            onClick={handleUpdate}
          >
            Update
          </button>

        </div>

      ) : (
        <div>Loading...</div>
      )}

      {followers.length > 0 && (

        followers.map((follower) => (

          <div
            key={follower.id}
            className="d-flex my-2"
          >

            {follower.username}

            <button
              className="btn btn-secondary ms-auto"
              onClick={() =>
                handleUnfollow(follower.id)
              }
            >
              Unfollow
            </button>

          </div>

        ))

      )}

    </div>
  );
}

export default Profile;