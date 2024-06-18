import React, { useEffect } from 'react';
import { useTheme } from './component/layouts/defaultLayout/header/Setting/Context/ThemeContext';
import { useFontSize } from './component/layouts/defaultLayout/header/Setting/Context/FontSizeContext';
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './component/layouts/defaultLayout/defaultLayout';
import { publicRoutes, privateRoutes } from './routes';
import { useTranslation } from 'react-i18next';
import './i18n';
import './styles.css'; // Import your CSS file

const Main = () => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const { t } = useTranslation();

  useEffect(() => {
    document.body.className = `${theme} ${fontSize}`;
  }, [theme, fontSize]);

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route, index) => {
        const Page = route.component;
        let Layout = DefaultLayout;

        if (route.layout) {
          Layout = route.layout;
        } else if (route.layout === null) {
          Layout = React.Fragment;
        }

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}

      {/* Private Routes */}
      {privateRoutes.map((route, index) => {
        const Page = route.component;
        let Layout = DefaultLayout;

        if (route.layout) {
          Layout = route.layout;
        } else if (route.layout === null) {
          Layout = React.Fragment;
        }

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}
    </Routes>
  );
};

export default Main;
