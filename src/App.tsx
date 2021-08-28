import { createTheme, CssBaseline, Switch, ThemeProvider, useMediaQuery } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';

const isDebug = chrome.storage === undefined;

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createTheme({
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


function Body() {
  // const [title, setTitle] = React.useState('');
  // const [headlines, setHeadlines] = React.useState<string[]>([]);

  // React.useEffect(() => {
  //   /**
  //    * We can't use "chrome.runtime.sendMessage" for sending messages from React.
  //    * For sending messages from React we need to specify which tab to send it to.
  //    */
  //   // chrome.tabs && chrome.tabs.query({
  //   //   active: true,
  //   //   currentWindow: true
  //   // }, tabs => {
  //   //   /**
  //   //    * Sends a single message to the content script(s) in the specified tab,
  //   //    * with an optional callback to run when a response is sent back.
  //   //    *
  //   //    * The runtime.onMessage event is fired in each content script running
  //   //    * in the specified tab for the current extension.
  //   //    */
  //   //   chrome.tabs.sendMessage(
  //   //     tabs[0].id || 0,
  //   //     { type: 'GET_DOM' } as DOMMessage,
  //   //     (response: DOMMessageResponse) => {
  //   //       setTitle(response?.title ?? '');
  //   //       setHeadlines(response?.headlines ?? []);
  //   //     });
  //   // });
  // });


  return (
    <div>
      <h1>Chrome Markdown emojis</h1>
      <EnabledSwitch />
    </div>

  );
}


function EnabledSwitch() {
  const [enabled, setEnabled] = useState<boolean | null>(null);


  useEffect(() => {
    if (!isDebug) {
      chrome.storage.sync.get('enabled', (data) => {
        console.log(data);
        setEnabled(data.enabled);
      });
    }
  });


  return <div className='row'>
    <p>Enabled</p>
    <Switch
      checked={enabled ?? true}
      name="switchEnabled"
      onChange={(event) => {
        if (enabled === null && !isDebug) {
          // It was not loaded
          return;
        }
        if (!isDebug) {
          chrome.storage.sync.set({ enabled: event.target.checked });
        }
        setEnabled(event.target.checked);
      }}
    />
  </div>;
}