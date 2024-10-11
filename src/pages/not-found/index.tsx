import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  const { pathname } = location;
  //   also { hash, search} = location

  return (
    <>
      <h2>Page Not Found</h2>
      <p>
        No page at {pathname}. Consider going to the{" "}
        <Link to="/">Pieces List</Link>.
      </p>
    </>
  );
}
