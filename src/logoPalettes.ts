import type { CSSProperties } from "react";

type LogoPalette = {
  name: string;
  style: CSSProperties & Record<`--${string}`, string>;
};

// The cap changes the illustration, so both doorway options share one identity.
const doorPalette: LogoPalette = {
  name: "Navy and door gold",
  style: {
    "--bg": "#fcf9ee", "--surface": "#fffdf4", "--tint": "#f0e9d4",
    "--ink": "#163c52", "--muted": "#526571",
    "--line": "#dcd5bf", "--line-strong": "#9e9275",
    "--accent": "#d9a42e", "--accent-hover": "#e5b343", "--accent-ink": "#795818",
    "--band": "#123b52", "--band-ink": "#fff8e2", "--band-muted": "#cbd9d9",
    "--band-accent": "#efc765", "--logo-highlight": "#efc765",
    "--logo-on-accent": "#172f3d", "--logo-header": "#f8f1df", "--logo-band-line": "#7d98a5",
  },
};

// Each identity gets distinct canvas, action and dark-section roles. Bright logo
// colors remain available for emphasis without forcing low-contrast link text.
const palettes: Record<string, LogoPalette> = {
  original: {
    name: "Copper and charcoal",
    style: {
      "--bg": "#faf7f2", "--surface": "#fffdf9", "--tint": "#eee5da",
      "--ink": "#28231f", "--muted": "#62574d",
      "--line": "#ded1c3", "--line-strong": "#9d8a78",
      "--accent": "#a84b25", "--accent-hover": "#893919", "--accent-ink": "#8d3b1c",
      "--band": "#29221e", "--band-ink": "#fffaf1", "--band-muted": "#d8c9ba",
      "--band-accent": "#efba94", "--logo-highlight": "#efba94",
      "--logo-on-accent": "#ffffff", "--logo-header": "#fffdf9", "--logo-band-line": "#817164",
    },
  },
  "1": {
    name: "Gold and pewter",
    style: {
      "--bg": "#faf8f3", "--surface": "#fffdf8", "--tint": "#ede7da",
      "--ink": "#2a2726", "--muted": "#625b53",
      "--line": "#ddd3c3", "--line-strong": "#968675",
      "--accent": "#c09a56", "--accent-hover": "#d1ad6e", "--accent-ink": "#735223",
      "--band": "#262126", "--band-ink": "#fcf7ed", "--band-muted": "#d1c7bf",
      "--band-accent": "#e1bd79", "--logo-highlight": "#e1bd79",
      "--logo-on-accent": "#211d20", "--logo-header": "#f4eee3", "--logo-band-line": "#807575",
    },
  },
  "2": {
    name: "Ink and porcelain",
    style: {
      "--bg": "#f8f7f5", "--surface": "#ffffff", "--tint": "#eae8e4",
      "--ink": "#222120", "--muted": "#5d5a56",
      "--line": "#d7d3ce", "--line-strong": "#918c85",
      "--accent": "#343230", "--accent-hover": "#181716", "--accent-ink": "#343230",
      "--band": "#242220", "--band-ink": "#faf8f3", "--band-muted": "#cbc7bf",
      "--band-accent": "#e7dfd1", "--logo-highlight": "#e7dfd1",
      "--logo-on-accent": "#ffffff", "--logo-header": "#ffffff", "--logo-band-line": "#7d7770",
    },
  },
  "3": {
    name: "Graphite and limestone",
    style: {
      "--bg": "#f9f6f0", "--surface": "#fffdf8", "--tint": "#eee7dc",
      "--ink": "#28231e", "--muted": "#62594f",
      "--line": "#dbd1c3", "--line-strong": "#9a8876",
      "--accent": "#4e4032", "--accent-hover": "#30261e", "--accent-ink": "#594431",
      "--band": "#28231e", "--band-ink": "#fcf8ef", "--band-muted": "#d6cabc",
      "--band-accent": "#dfc69f", "--logo-highlight": "#dfc69f",
      "--logo-on-accent": "#ffffff", "--logo-header": "#fffdf8", "--logo-band-line": "#837362",
    },
  },
  "4": {
    name: "Midnight and silver",
    style: {
      "--bg": "#f5f5fa", "--surface": "#fcfcff", "--tint": "#e7e7f1",
      "--ink": "#211d36", "--muted": "#5c586e",
      "--line": "#d4d2e0", "--line-strong": "#9088a5",
      "--accent": "#383063", "--accent-hover": "#241d46", "--accent-ink": "#3a3068",
      "--band": "#17112e", "--band-ink": "#f7f6ff", "--band-muted": "#c9c5dc",
      "--band-accent": "#ccc3ed", "--logo-highlight": "#ccc3ed",
      "--logo-on-accent": "#ffffff", "--logo-header": "#efedf7", "--logo-band-line": "#79718e",
    },
  },
  "5": {
    name: "Graphite and orange",
    style: {
      "--bg": "#faf7f2", "--surface": "#fffdf8", "--tint": "#ece7df",
      "--ink": "#282829", "--muted": "#625c54",
      "--line": "#dbd2c6", "--line-strong": "#9a8b7c",
      "--accent": "#af481c", "--accent-hover": "#8a3513", "--accent-ink": "#963b17",
      "--band": "#29292b", "--band-ink": "#fffaf1", "--band-muted": "#d1cac0",
      "--band-accent": "#f1ae7e", "--logo-highlight": "#f1ae7e",
      "--logo-on-accent": "#ffffff", "--logo-header": "#fff8ed", "--logo-band-line": "#84796e",
    },
  },
  "6": {
    name: "Violet and lavender",
    style: {
      "--bg": "#f8f5fc", "--surface": "#fefbff", "--tint": "#ece4f7",
      "--ink": "#302040", "--muted": "#645171",
      "--line": "#d9cbe7", "--line-strong": "#9980ae",
      "--accent": "#6a38ad", "--accent-hover": "#512583", "--accent-ink": "#603095",
      "--band": "#36204f", "--band-ink": "#fff8e6", "--band-muted": "#dfcee9",
      "--band-accent": "#debfef", "--logo-highlight": "#e6cbf7",
      "--logo-on-accent": "#fff9e8", "--logo-header": "#f1eafa", "--logo-band-line": "#9678ab",
    },
  },
  "7": {
    name: "Evergreen and warm ivory",
    style: {
      "--bg": "#f8f7ee", "--surface": "#fffdf4", "--tint": "#e6ede2",
      "--ink": "#193d33", "--muted": "#51665a",
      "--line": "#ccd8c9", "--line-strong": "#879c87",
      "--accent": "#a44927", "--accent-hover": "#82361b", "--accent-ink": "#8a3b1f",
      "--band": "#163e33", "--band-ink": "#fff9e9", "--band-muted": "#cadbca",
      "--band-accent": "#efb28c", "--logo-highlight": "#efb28c",
      "--logo-on-accent": "#ffffff", "--logo-header": "#f0f3e7", "--logo-band-line": "#819b89",
    },
  },
  "8": {
    name: "Navy and clear blue",
    style: {
      "--bg": "#f4f7fb", "--surface": "#fcfdff", "--tint": "#e3edf7",
      "--ink": "#1c3046", "--muted": "#52657b",
      "--line": "#cdd9e6", "--line-strong": "#839ab3",
      "--accent": "#25659a", "--accent-hover": "#164d7b", "--accent-ink": "#205c8d",
      "--band": "#18334e", "--band-ink": "#f7fbff", "--band-muted": "#c4d6e8",
      "--band-accent": "#a9d4f5", "--logo-highlight": "#a9d4f5",
      "--logo-on-accent": "#ffffff", "--logo-header": "#edf3fa", "--logo-band-line": "#7894b0",
    },
  },
  "9": {
    name: "Brick and cream",
    style: {
      "--bg": "#fcf6eb", "--surface": "#fff9ee", "--tint": "#f3e4d6",
      "--ink": "#482820", "--muted": "#79574b",
      "--line": "#e4cebc", "--line-strong": "#ab8973",
      "--accent": "#ad4234", "--accent-hover": "#8c3025", "--accent-ink": "#96372b",
      "--band": "#602b25", "--band-ink": "#fff3dc", "--band-muted": "#e9cdb9",
      "--band-accent": "#f5c7a1", "--logo-highlight": "#f8d3ab",
      "--logo-on-accent": "#fff9ed", "--logo-header": "#fbefdc", "--logo-band-line": "#ac8070",
    },
  },
  "10": {
    name: "Oxblood and peach",
    style: {
      "--bg": "#fcf7f0", "--surface": "#fffcf5", "--tint": "#f1e3de",
      "--ink": "#3d292a", "--muted": "#755758",
      "--line": "#e1cbc7", "--line-strong": "#ac8587",
      "--accent": "#963247", "--accent-hover": "#732036", "--accent-ink": "#862d40",
      "--band": "#492332", "--band-ink": "#fff8eb", "--band-muted": "#e0c4c5",
      "--band-accent": "#f0b497", "--logo-highlight": "#f0b497",
      "--logo-on-accent": "#fffaf0", "--logo-header": "#f8eee4", "--logo-band-line": "#a27c88",
    },
  },
  "11": doorPalette,
  "12": doorPalette,
  "13": {
    name: "Kingfisher teal and copper",
    style: {
      "--bg": "#f8f8ef", "--surface": "#fffdf3", "--tint": "#e1eeea",
      "--ink": "#134451", "--muted": "#4d6870",
      "--line": "#c8dcd7", "--line-strong": "#839f9d",
      "--accent": "#ac5125", "--accent-hover": "#883c19", "--accent-ink": "#8c431f",
      "--band": "#0e4351", "--band-ink": "#fff9e8", "--band-muted": "#c3dcda",
      "--band-accent": "#f0b47d", "--logo-highlight": "#f0b47d",
      "--logo-on-accent": "#ffffff", "--logo-header": "#edf4e9", "--logo-band-line": "#7aa0a3",
    },
  },
  "14": {
    name: "Plum and copper",
    style: {
      "--bg": "#fcf7ee", "--surface": "#fffdf3", "--tint": "#efe2e7",
      "--ink": "#4b2943", "--muted": "#73546c",
      "--line": "#decbd5", "--line-strong": "#aa839c",
      "--accent": "#b0522b", "--accent-hover": "#8d3c1d", "--accent-ink": "#904020",
      "--band": "#4b2943", "--band-ink": "#fff8e8", "--band-muted": "#dfc9d7",
      "--band-accent": "#f3b58a", "--logo-highlight": "#f3b58a",
      "--logo-on-accent": "#ffffff", "--logo-header": "#f6ecec", "--logo-band-line": "#a27e95",
    },
  },
};

/**
 * Description: Gives a logo preview the website colors chosen for its artwork.
 * Inputs: id is a catalog logo ID. Unknown or empty IDs use the current logo.
 * Output: A palette name and CSS custom properties; leaves the document unchanged.
 * Examples: logoPalette("6").name is "Violet and lavender"; an empty ID or
 * "toString" returns "Copper and charcoal". logoPalettes.test.ts checks all three.
 */
export function logoPalette(id: string): LogoPalette {
  return Object.hasOwn(palettes, id) ? palettes[id] : palettes.original;
}
