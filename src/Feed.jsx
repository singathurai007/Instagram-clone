import Posts from "./Posts";
import Stories from "./Stories";

function Feed() {
  return (
    <main className="feed">
      <Stories />
      <Posts />
    </main>
  );
}

export default Feed;
