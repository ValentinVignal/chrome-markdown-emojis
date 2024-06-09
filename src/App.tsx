import {
  createTheme, CssBaseline, ThemeProvider, useMediaQuery
} from '@mui/material';
import React from 'react';
import './App.scss';
import { Body } from './Components/Body';


function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () => createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
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
