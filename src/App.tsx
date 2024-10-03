import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "src/store/valio";
import DropboxUserLogin from "src/pages/login-dropbox";
import Header from "src/components/header";
import ErrorBoundary from "src/components/error-boundry";
import PieceDetails from "src/pages/piecedetails";
import { PieceList } from "src/pages/piecelist";
import "./App.css";

function App() {
  const { isLoggedIn } = useSnapshot(state);

  if (!isLoggedIn) return <DropboxUserLogin />;

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <BrowserRouter>
        <>
          <Header />
          <div id="mainContent">
            <Routes>
              <Route exact path="/" Component={PieceList} />
              <Route path="pieces/:pieceId" Component={PieceDetails} />
            </Routes>
          </div>
        </>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
