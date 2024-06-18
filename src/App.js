import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./component/contexts/UserContext";
import { ThemeProvider } from "./component/layouts/defaultLayout/header/Setting/Context/ThemeContext";
import { LanguageProvider } from "./component/layouts/defaultLayout/header/Setting/Context/LanguageContext";
import { FontSizeProvider } from "./component/layouts/defaultLayout/header/Setting/Context/FontSizeContext";
import Main from './Main'; // Import component Main

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <LanguageProvider>
          <FontSizeProvider>
            <Router>
              <div className="App">
                <Main />
              </div>
            </Router>
          </FontSizeProvider>
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
