import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSnapshot } from "valtio";
import { loadAllData } from "src/data";
import DropboxUserLogin from "src/pages/login-dropbox";
import Header from "src/components/header";
import ErrorBoundary from "src/components/error-boundry";
import Images from "src/pages/images";
import NewPiece from "src/pages/piece-new";
import NotFound from "src/pages/not-found";
import PieceDetails from "src/pages/piece-details";
import PieceList from "src/pages/piece-list";
import Tools from "src/pages/tools";
import { state } from "src/store/valio";
import "./App.css";

function App() {
  const { isLoggedIn } = useSnapshot(state);

  useEffect(() => {
    const handleFocus = () => {
      if (isLoggedIn) loadAllData();
    };
    if (isLoggedIn) {
      window.addEventListener("focus", handleFocus);
    }
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (!isLoggedIn) return <DropboxUserLogin />;

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <>
          <Header />
          <div id="mainContent">
            <Routes>
              <Route path="/" Component={PieceList} />
              <Route path="pieces/:pieceId" Component={PieceDetails} />
              <Route path="newpiece" Component={NewPiece} />
              <Route path="images" Component={Images} />
              <Route path="tools" Component={Tools} />
              <Route path="*" Component={NotFound} />
            </Routes>
          </div>
        </>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
