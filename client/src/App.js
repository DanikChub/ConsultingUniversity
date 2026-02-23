import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import FooterNavBar from "./shared/ui/layot/FooterNavBar";
import NavBar from "./shared/ui/layot/NavBar";

import {observer} from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "./index"
import { check, getUserById } from "./entities/user/api/user.api";
import Spinner from "./components/Spinner/Spinner";

import "./App.css"
import {ModalProvider} from "./providers/ModalProvider";
import {getEnrollmentByProgram} from "./entities/enrollment/api/enrollment.api";


const App = observer(() => {
  const {user} = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        const data = await check();
        const userData = await getUserById(data.id);
        user.setUser(userData);
        user.setIsAuth(true);

        // Берем первый доступный курс, если есть
        if (userData.programs?.length > 0) {
          const programId = userData.programs[0].id; // или выбираем как тебе нужно
          const enrollment = await getEnrollmentByProgram(programId, userData.id);
          if (enrollment) {
            user.setEnrollmentId(enrollment.id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  

  return (
    <BrowserRouter>
      <ModalProvider>
        <NavBar/>
        {
          loading ?
          <Spinner/>
          :

          <AppRouter/>
        }


        <FooterNavBar/>
      </ModalProvider>
    </BrowserRouter>
  );
})

export default App;
