import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "src/store/valio";
import DropboxUserLogin from "src/pages/login-dropbox";
import Header from "src/components/header";
import { PieceList } from "src/pages/piecelist";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PieceList />,
  },
]);

function App() {
  const { isLoggedIn } = useSnapshot(state);

  if (!isLoggedIn) return <DropboxUserLogin />;

  return (
    <>
      <Header />
      <div id="mainContent">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
