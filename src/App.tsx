import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "src/store/valio";
import DropboxUserLogin from "src/pages/login-dropbox";
import Header from "src/components/header";
import ErrorBoundary from "src/components/error-boundry";
import Images from "src/pages/images";
import NewPiece from "src/pages/piece-new/new-piece";
import PieceDetails from "src/pages/piecedetails";
import { PieceList } from "src/pages/piecelist";
import Tools from "src/pages/tools";
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
              <Route path="newpiece" Component={NewPiece} />
              <Route path="images" Component={Images} />
              <Route path="tools" Component={Tools} />
            </Routes>
          </div>
        </>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
