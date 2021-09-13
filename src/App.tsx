import {
  createTheme, CssBaseline, ThemeProvider, useMediaQuery
} from '@material-ui/core';
import React from 'react';
import './App.scss';
import { Body } from './Components/Body';


function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () => createTheme({
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
      },
    }),
    [prefersDarkMode],
  );
  return (
    <div className="App" color={theme.palette.background.paper}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Body />
      </ThemeProvider>
    </div>
  );
}

export default App;
