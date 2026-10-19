import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPost, CURRENT_USER_ID, getErrorMessage } from "./lib/api";
import { useToast } from "./context/toast.jsx";

const SAMPLES = [
  "https://picsum.photos/seed/instagram-new-1/700/700",
  "https://picsum.photos/seed/instagram-new-2/700/700",
  "https://picsum.photos/seed/instagram-new-3/700/700"
];

function CreatePost() {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const canSubmit = Boolean(image.trim()) && !saving;

  function handleImageChange(value) {
    setImage(value);
    setPreviewFailed(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createPost({
        image: image.trim(),
        caption: caption.trim(),
        location: location.trim()
      });

      showToast("Post published.", "success");
      navigate("/");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page page-wide">
      <header className="page-header">
        <button
          type="button"
          className="page-back"
          onClick={() => navigate("/")}
          aria-label="Back to feed"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
        </button>

        <h1>Create a post</h1>
      </header>

      {error && (
        <p className="state state-error" role="alert">
          {error}
        </p>
      )}

      <div className="create-layout">
        <form className="create-form" onSubmit={handleSubmit}>
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            name="image"
            type="url"
            className="form-control"
            placeholder="https://picsum.photos/700"
            value={image}
            onChange={(event) => handleImageChange(event.target.value)}
            required
          />

          <div className="sample-row">
            <span>Try a sample:</span>
            {SAMPLES.map((sample, index) => (
              <button
                key={sample}
                type="button"
                className="sample-thumb"
                onClick={() => handleImageChange(sample)}
                aria-label={`Use sample image ${index + 1}`}
              >
                <img src={sample} alt="" loading="lazy" />
              </button>
            ))}
          </div>

          <label htmlFor="caption">Caption</label>
          <textarea
            id="caption"
            name="caption"
            className="form-control"
            rows={3}
            maxLength={220}
            placeholder="Write something about this photo…"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            className="form-control"
            placeholder="Add a location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
            {saving ? "Publishing…" : "Share post"}
          </button>
        </form>

        <aside className="create-preview">
          <h2 className="section-title">Preview</h2>

          <article className="post-card">
            <header className="post-header">
              <span className="post-avatar post-avatar-fallback" aria-hidden="true">
                <i className="bi bi-person" />
              </span>
              <div className="post-meta">
                <strong>john_doe</strong>
                <span className="post-location">{location || "Add a location"}</span>
              </div>
            </header>

            {image ? (
              previewFailed ? (
                <p className="state state-error">
                  That image could not be loaded — check the URL.
                </p>
              ) : (
                <img
                  className="post-media"
                  src={image}
                  alt="Preview of the new post"
                  onError={() => setPreviewFailed(true)}
                />
              )
            ) : (
              <div className="post-media create-preview-empty">
                <i className="bi bi-image" aria-hidden="true" />
                <span>Your photo appears here</span>
              </div>
            )}

            <div className="post-body">
              <p className="post-caption">
                <strong>john_doe</strong> {caption || "Your caption…"}
              </p>
            </div>
          </article>

          <p className="create-hint">
            Posts are published as user <code>{CURRENT_USER_ID}</code> and stored
            by json-server, so they survive a reload.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default CreatePost;
