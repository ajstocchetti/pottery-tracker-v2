import { useSnapshot } from "valtio";
import { state } from "src/store/valio";
import DropboxUserLogin from "src/pages/login-dropbox";
import "./App.css";

function App() {
  const { isLoggedIn } = useSnapshot(state);

  if (!isLoggedIn) return <DropboxUserLogin />;

  return (
    <>
      <div></div>
      <h1>Pottery Tracker...</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <pre>{JSON.stringify({ isLoggedIn }, null, 2)}</pre>
    </>
  );
}

export default App;
