[![codecov](https://codecov.io/gh/ValentinVignal/chrome-markdown-emojis/branch/main/graph/badge.svg?token=K4Y5XPA3Z9)](https://codecov.io/gh/ValentinVignal/chrome-markdown-emojis)

# Chrome Markdown Emojis

A Google Chrome extension to insert emojis from their markdown code.

# Contribute

Install dependencies:

```zch
yarn install
```

Build: 

```
yarn build
```

Run the tests:

```
yarn test
```

# Debug

1. Launch the VSCode debug.
2. Apply code changes.
   1. Build with `yarn build`
   2. Go to the browser extensions and reload this one.
   3. Reload the page

:warning: Use node 14 because `node-sass` is not ready for node 16 yet :warning: 
