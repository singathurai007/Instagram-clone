import Feed from "./Feed";
import Sidebar from "./Sidebar";
import Suggestion from "./Suggestion";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <Feed />
      <Suggestion />
    </div>
  );
}

export default App;
