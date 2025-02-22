---
title: Custom Root HTML
# TODO
sidebar_class_name: hidden
---

> This guide refers to upcoming Expo Router features, all of which are experimental. You may need to [use Expo CLI on `main`](https://github.com/expo/expo/tree/main/packages/%40expo/cli#contributing) to use these features.

When you statically render an Expo website (`EXPO_USE_STATIC=1 yarn expo start` cite needed), the root HTML element for each page can be customized by creating an `apps/+html.js` file that exports a default HTML component.

> Notice: Global context providers should go in the [Root Layout](/docs/guides/root-layout) component, not the Root HTML component.

## Default Root

If an `app/+html.js` does not exist, then the default value will be used.

```js title=app/+html.tsx
import React from "react";
import { ScrollViewStyleReset } from "expo-router/html";

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- The `children` prop comes with the root `<div id="root" />` tag included inside.
- The JavaScript scripts are appended after the static render.
- React Native web styles are statically injected automatically.

## `expo-router/html`

The exports from `expo-router/html` are related to the Root HTML component.

- `ScrollViewStyleReset`: Root style-reset for full-screen React Native web apps with a root `<ScrollView />` should use the following styles to ensure native parity. [Learn more](https://necolas.github.io/react-native-web/docs/setup/#root-element).
