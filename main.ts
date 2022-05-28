type Token = string | number;
const join = (tokens: Token[]) => tokens.join("");

/** Escape */
export const ESC = "\x1b";
/** Control Sequence Introducer */
export const CSI = join([ESC, "["]);
/** Device Control String */
export const DCS = join([ESC, "P"]);
/** Operating System Command */
export const OSC = join([ESC, "]"]);

export const call_csi = (token: string) => (n: number) => join([CSI, n, token]);
/** moves cursor up n lines */
export const CUU = call_csi("A");
/** moves cursor down n lines */
export const CUD = call_csi("B");
/** moves cursor right n columns */
export const CUF = call_csi("C");
/** moves cursor left n columns */
export const CUB = call_csi("D");
/** moves cursor to beginning of next line, n lines down */
export const CNL = call_csi("E");
/** moves cursor to beginning of previous line, n lines up */
export const CPL = call_csi("F");
/** moves cursor to column n */
export const CHA = call_csi("G");
/** moves cursor to line n, column m */
export const CUP = (n = 1, m = 1) => join([CSI, n, ";", m, "H"]);
/** Same as CUP,
 * but counts as a format effector function (like CR or LF) rather than an editor function (like CUD or CNL). */
export const HVP = (n = 1, m = 1) => join([CSI, n, ";", m, "f"]);
/** Sets colors and style of the characters following this code */
export const SGR = call_csi("m");
/** request cursor position (reports as ESC[#;#R) */
export const DSR = join([CSI, 6, "n"]);
/** Saves the cursor position */
export const DECSC = join([ESC, 7]);
/** Clears part of the screen */
export const ED = call_csi("J");
/** Erases part of the line */
export const EL = call_csi("K");

export const Cursor = {
  /** moves cursor to home position (0, 0) */
  home: CUP(),
  goto: CUP,
  up: CUU,
  down: CUD,
  forward: CUF,
  back: CUB,
  line: {
    next: CNL,
    prev: CPL,
  },
  col: CHA,
  current: DSR,

  visible: {
    on: join([CSI, "?", 25, "h"]),
    off: join([CSI, "?", 25, "l"]),
  },
};

export const Erase = {
  /** clear entire screen and delete all lines saved in the scrollback buffer */
  all: ED(3),

  screen: {
    /** clear from cursor to end of screen */
    end: ED(0),
    /** clear from cursor to beginning of the screen */
    begin: ED(1),
    /** clear from cursor to end of screen */
    clear: ED(2),
  },

  line: {
    /** clear from cursor to the end of the line */
    end: EL(0),
    /** clear from cursor to beginning of the line */
    begin: EL(1),
    /** clear entire line */
    clear: EL(2),
  },
};

export const Graphic = {
  /** All attributes off */
  reset: SGR(0),
  bold: {
    /** As with faint, the color change is a PC (SCO / CGA) invention */
    enable: SGR(1),
    disable: SGR(22),
  },
  dim: {
    /** May be implemented as a light font weight like bold */
    enable: SGR(2),
    disable: SGR(22),
  },
  italic: {
    /** Not widely supported. Sometimes treated as inverse or blink */
    enable: SGR(3),
    disable: SGR(23),
  },
  underline: {
    /** Style extensions exist for Kitty, VTE, mintty and iTerm2. */
    enable: SGR(4),
    disable: SGR(24),
  },
  blink: {
    /** Sets blinking to less than 150 times per minute */
    slow: SGR(5),
    /** MS-DOS ANSI.SYS, 150+ per minute; not widely supported */
    rapid: SGR(6),
    disable: SGR(25),
  },
  inverse: {
    /** Swap foreground and background colors; inconsistent emulation */
    enable: SGR(7),
    disable: SGR(27),
  },
  hide: {
    /** hide, Not widely supported */
    enable: SGR(8),
    disable: SGR(28),
  },
  strike: {
    /** Characters legible but marked as if for deletion. Not supported in Terminal.app */
    enable: SGR(9),
    disable: SGR(29),
  },
  /** select font */
  font: (n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => SGR(10 + n),
};

/**
  the original 16 colors (0-15).

  The proceeding 216 colors (16-231) 
  or formed by a 3bpc RGB value offset by 16, 
  packed into a single value.

  The final 24 colors (232-255) are grayscale starting from a shade slighly lighter than black, 
  ranging up to shade slightly darker than white.
*/
export const color_by_id = (where: 38 | 48) => (n: number) =>
  join([CSI, where, ";", 5, ";", n, "m"]);
export const color_by_rgb =
  (where: 38 | 48) => (r: number, g: number, b: number) =>
    join([CSI, where, ";", 2, ";", r, ";", g, ";", b, "m"]);

export const Color = {
  foreground: {
    id: color_by_id(38),
    rgb: color_by_rgb(38),
  },
  background: {
    id: color_by_id(48),
    rgb: color_by_rgb(48),
  },
};

/** Changes the screen width or type to the mode specified by value. */
export const Screen = {
  set: (n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 13 | 14 | 15 | 16 | 17 | 18 | 19) =>
    join([CSI, "=", n, "h"]),
  reset: (n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 13 | 14 | 15 | 16 | 17 | 18 | 19) =>
    join([CSI, "=", n, "l"]),

  /** restore screen */
  restore: join([CSI, 47, "l"]),
  /** save screen */
  save: join([CSI, 47, "h"]),
};

export const Buffer = {
  /** enables the alternative buffer */
  enable: join([CSI, 1049, "h"]),
  /** disables the alternative buffer */
  disable: join([CSI, 1049, "l"]),
};
