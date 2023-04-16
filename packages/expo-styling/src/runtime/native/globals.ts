import { Dimensions, Platform, Appearance } from "react-native";

import { createSignal } from "./signals";
import { StyleMeta, StyleProp } from "../../types";

export const globalStyles = new Map<string, StyleProp>();
export const styleMetaMap = new WeakMap<
  NonNullable<StyleProp> | NonNullable<StyleProp>[],
  StyleMeta
>();

export const rem = createRem(14);
export const vw = viewportUnit("width", Dimensions);
export const vh = viewportUnit("height", Dimensions);
export const colorScheme = createColorScheme(Appearance);

export function getGlobalStyles(value: string): StyleProp[] {
  return value.split(/\s+/).map((v) => globalStyles.get(v));
}

function viewportUnit(key: "width" | "height", dimensions: Dimensions) {
  const signal = createSignal<number>(dimensions.get("window")[key] || 0);

  let subscription = dimensions.addEventListener("change", ({ window }) => {
    signal.set(window[key]);
  });

  const get = () => signal.get() || 0;
  const reset = (dimensions: Dimensions) => {
    signal.set(dimensions.get("window")[key] || 0);
    subscription.remove();
    subscription = dimensions.addEventListener("change", ({ window }) => {
      signal.set(window[key]);
    });
  };

  return { get, reset, __set: signal.set };
}

function createRem(defaultValue: number) {
  const signal = createSignal<number>(defaultValue);

  const get = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const value = Number.parseFloat(
        window.document.documentElement.style.getPropertyValue("font-size")
      );

      if (Number.isNaN(value)) {
        return 16;
      }
    }

    return signal.get() || 14;
  };

  const set = (nextValue: number) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (Number.isNaN(nextValue)) {
        return;
      }

      window.document.documentElement.style.setProperty(
        "font-size",
        `${nextValue}px`
      );
    } else {
      signal.set(nextValue);
    }
  };

  const reset = () => {
    set(defaultValue);
  };

  return { get, set, reset };
}

function createColorScheme(appearance: typeof Appearance) {
  let isSystem = true;
  const signal = createSignal<"light" | "dark">(
    appearance.getColorScheme() ?? "light"
  );

  const set = (colorScheme: "light" | "dark" | "system") => {
    if (colorScheme === "system") {
      isSystem = true;
      signal.set(appearance.getColorScheme() ?? "light");
    } else {
      isSystem = false;
      signal.set(colorScheme);
    }
  };

  let listener = appearance.addChangeListener(({ colorScheme }) => {
    if (isSystem) {
      signal.set(colorScheme ?? "light");
    }
  });

  const reset = (appearance: typeof Appearance) => {
    listener.remove();
    listener = appearance.addChangeListener(({ colorScheme }) => {
      if (isSystem) {
        signal.set(colorScheme ?? "light");
      }
    });
    isSystem = true;
    signal.set(appearance.getColorScheme() ?? "light");
  };

  return { get: signal.get, set, reset };
}
