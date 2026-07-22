import { BrowserRouter } from "react-router-dom"
import AppRouter from "./components/AppRouter"
import FooterNavBar from "./shared/ui/layot/FooterNavBar"
import NavBar from "./shared/ui/layot/NavBar"

import { observer } from "mobx-react-lite"
import {useCallback, useContext, useEffect, useState} from "react"
import { Context } from "./index"
import { check, getUserById } from "./entities/user/api/user.api"
import Spinner from "./components/Spinner/Spinner"

import "./App.css"
import { ModalProvider } from "./providers/ModalProvider"
import { getMyEnrollmentByProgram } from "./entities/enrollment/api/enrollment.api"
import axios from "axios";
import BlockedAccountPage from "./pages/User/BlockedAccountPage/BlockAccountPage";




const App = observer(() => {
  const { user } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [blockInfo, setBlockInfo] = useState(null);

  const init = useCallback(async () => {
    try {
      setLoading(true);
      setBlockInfo(null);

      const token = localStorage.getItem("token");

      if (!token) {
        user.setIsAuth(false);
        return;
      }

      const data = await check();

      const userId = data?.user?.id;

      if (!userId) {
        throw new Error("User id not found in check response");
      }

      const userData = await getUserById(userId);
      console.log()
      user.setUser(userData);
      user.setIsAuth(true);

      if (userData.programs?.length > 0) {
        const programId = userData.programs[0].id;
        const enrollment =
            await getMyEnrollmentByProgram(programId);

        if (enrollment) {
          user.setEnrollmentId(enrollment.id);
        }
      }
    } catch (err) {
      console.error(err);

      if (
          axios.isAxiosError(err) &&
          err.response?.status === 403 &&
          err.response?.data?.code === "USER_BLOCKED"
      ) {
        setBlockInfo({
          reason: err.response.data.reason ?? null,
          blockedUntil:
              err.response.data.blockedUntil ?? null,
          permanent:
              Boolean(err.response.data.permanent),
        });

        user.setIsAuth(true);
        return;
      }

      user.setIsAuth(false);
      user.setUser({});
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {


    init()
  }, [init])

  const handleLogout = () => {
    localStorage.removeItem("token");

    setBlockInfo(null);

    user.setUser({});
    user.setIsAuth(false);
    user.setEnrollmentId(null);
  };

  return (
      <BrowserRouter>
        <ModalProvider>
          <NavBar />

          {loading ? (
              <Spinner />
          ) : blockInfo ? (
              <BlockedAccountPage
                  reason={blockInfo.reason}
                  blockedUntil={blockInfo.blockedUntil}
                  permanent={blockInfo.permanent}
                  onRetry={init}
                  onLogout={handleLogout}
              />
          ) : (
              <AppRouter />
          )}

          <FooterNavBar />
        </ModalProvider>
      </BrowserRouter>
  )
})

export default App
