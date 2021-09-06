import {
  createTheme, CssBaseline, ThemeProvider, useMediaQuery
} from '@material-ui/core';
import React from 'react';
import './App.css';
import EnabledSwitch from './Components/EnableSwitch';

function Body() {
  // const [title, setTitle] = React.useState('');
  // const [headlines, setHeadlines] = React.useState<string[]>([]);

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    // chrome.tabs && chrome.tabs.query({
    //   active: true,
    //   currentWindow: true
    // }, tabs => {
    //   /**
    //    * Sends a single message to the content script(s) in the specified tab,
    //    * with an optional callback to run when a response is sent back.
    //    *
    //    * The runtime.onMessage event is fired in each content script running
    //    * in the specified tab for the current extension.
    //    */
    //   chrome.tabs.sendMessage(
    //     tabs[0].id || 0,
    //     { type: 'GET_DOM' } as DOMMessage,
    //     (response: DOMMessageResponse) => {
    //       console.log('response', response);
    //       // setTitle(response?.title ?? '');
    //       // setHeadlines(response?.headlines ?? []);
    //     });
    // });
  });

  return (
    <div>
      <h1>Chrome Markdown emojis</h1>
      <EnabledSwitch />
    </div>

  );
}

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
