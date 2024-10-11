import { Button } from "antd";
import { Dropbox } from "dropbox";
import { useState, useEffect } from "react";
import { getLoginCookie, dbxLogin, logout, setLoginCookie } from "src/auth";
import { authCallbackUrl, dbxClientId } from "src/config.ts";

const DropboxUserLogin = () => {
  const [authUrl, setAuthUrl] = useState<string | undefined>(undefined);

  async function generateLoginUrl() {
    const dbx = new Dropbox({ clientId: dbxClientId });
    try {
      // Dropbox.auth does exist, their type is wrong. Or I'm importing something wrong.
      // @ts-expect-error
      const url: string = await dbx.auth.getAuthenticationUrl(authCallbackUrl);
      setAuthUrl(url);
    } catch (err) {
      console.log("Error generating auth url");
      console.log(err);
    }
  }

  function getCallbackToken() {
    let hash = window.location.hash;
    if (hash[0] === "#") hash = hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    return accessToken;
  }

  async function loginFromToken(accessToken: string): Promise<any> {
    try {
      const dbx = new Dropbox({ accessToken });
      // try getting user account to verify that key is good
      const account = await dbx.usersGetCurrentAccount();
      dbxLogin(dbx, account);
      return true;
    } catch (err) {
      console.log("Invalid dropbox account token");
      logout();
      return false;
    }
  }

  async function loginFlow() {
    const accessToken = getCallbackToken();
    if (accessToken) {
      const loginSuccess = await loginFromToken(accessToken);
      if (loginSuccess) {
        setLoginCookie(accessToken);
      }
      // clear access token from URL
      history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    } else {
      const cookieToken = getLoginCookie();
      if (cookieToken) {
        loginFromToken(cookieToken);
      }
    }
  }

  useEffect(() => {
    loginFlow();
    if (!authUrl) {
      generateLoginUrl();
    }
  }, []);

  return (
    <div style={{ margin: "auto", width: "50%", textAlign: "center" }}>
      <a href={authUrl}>
        <Button color="primary" variant="filled" disabled={!authUrl}>
          Log In With Dropbox
        </Button>
      </a>
    </div>
  );
};
export default DropboxUserLogin;
