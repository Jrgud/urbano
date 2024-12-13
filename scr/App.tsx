import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';




import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import GestionRuteo from './pages/Ruteo_Map/GestionRuteo';
import GeorefManual from './pages/Ruteo_Manual/GeorefManual';
import PrivateRoute from './components/User/PrivateRoute';
import useUser from './hooks/User/useUser';
import PreRutaDelDia from './pages/Pre-Rutas/PreRutaDelDia';
import RutaOptima from './pages/Pre-Rutas/RutaOptima';



const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Color primario personalizado
    },
    secondary: {
      main: '#dc004e', // Color secundario personalizado
    },
  },
});

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { authorization } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <ThemeProvider theme={theme}>
      {/* <DefaultLayout> */}
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup" />
              <SignUp />
            </>
          }
        />
        <Route element={<DefaultLayout />}>
          <Route
            path="/ruteo/gestion"
            element={
              <PrivateRoute>
                <PageTitle title="Gestión Ruteo" />
                <GestionRuteo />
              </PrivateRoute>
            }
          />
          <Route
            path="/ruteo/georeferenciacion"
            element={
              <PrivateRoute>
                <PageTitle title="Georeferenciación Manual" />
                <GeorefManual />
              </PrivateRoute>
            }
          />
          <Route  
            path='/ruteo/pre-ruta'
            element={
              <PrivateRoute>
                <PageTitle title="Pre Ruta del Día" />
                <PreRutaDelDia />
              </PrivateRoute>
            }
          />
          <Route  
            path='/ruteo/ruta-optima'
            element={
              <PrivateRoute>
                <PageTitle title="Ruta Optima" />
                <RutaOptima />
              </PrivateRoute>
            }
          />

          <Route
            index
            element={
              <PrivateRoute>
                <PageTitle title="eCommerce Dashboard" />
                <ECommerce />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <PageTitle title="Calendar" />
                <Calendar />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <PageTitle title="Profile" />
                <Profile authorization={authorization} />
              </PrivateRoute>
            }
          />
          <Route
            path="/forms/form-elements"
            element={
              <PrivateRoute>
                <PageTitle title="Form Elements" />
                <FormElements />
              </PrivateRoute>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <PrivateRoute>
                <PageTitle title="Form Layout" />
                <FormLayout />
              </PrivateRoute>
            }
          />
          <Route
            path="/tables"
            element={
              <PrivateRoute>
                <PageTitle title="Tables" />
                <Tables />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <PageTitle title="Settings" />
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/chart"
            element={
              <PrivateRoute>
                <PageTitle title="Basic Chart" />
                <Chart />
              </PrivateRoute>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <PrivateRoute>
                <PageTitle title="Alerts" />
                <Alerts />
              </PrivateRoute>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <PrivateRoute>
                <PageTitle title="Buttons" />
                <Buttons />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
      {/* </DefaultLayout>  */}
    </ThemeProvider>
  );
}

export default App;
