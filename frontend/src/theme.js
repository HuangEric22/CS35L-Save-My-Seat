import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { Battery20Rounded } from "@mui/icons-material";

//color designs
export const tokens = (mode) => ({
    ...(mode === 'dark'
        ? {
            grey: {
                100: "#e6e6e6",
                200: "#cccccc",
                300: "#b3b3b3",
                400: "#999999",
                500: "#808080",
                600: "#666666",
                700: "#4d4d4d",
                800: "#333333",
                900: "#1a1a1a"
            },
            primary: {
                50: "#2774ae", //hard coding button color
                100: "#d4e3ef",
                200: "#a9c7df",
                300: "#7dacce",
                400: "#5290be",
                500: "#2774ae",
                600: "#1f5d8b",
                700: "#174668",
                800: "#102e46",
                900: "#081723"
            },
            greenAccent: {
                100: "#fff1d2",
                200: "#ffe3a4",
                300: "#ffd477",
                400: "#ffc649",
                500: "#ffb81c",
                600: "#cc9316",
                700: "#996e11",
                800: "#664a0b",
                900: "#332506"
            }, 
            redAccent: {
                100: "#fff1d2",
                200: "#ffe3a4",
                300: "#ffd477",
                400: "#ffc649",
                500: "#ffb81c",
                600: "#cc9316",
                700: "#996e11",
                800: "#664a0b",
                900: "#332506"
            },
            blueAccent: {
                100: "#ccd8de",
                200: "#99b1be",
                300: "#66899d",
                400: "#33627d",
                500: "#003b5c",
                600: "#002f4a",
                700: "#002337",
                800: "#001825",
                900: "#000c12"
            },
            buttonText: {
                default: "#2774ae"
            }
        }
    :   {
        grey: {
            100: "#141414",
            200: "#292929",
            300: "#3d3d3d",
            400: "#525252",
            500: "#666666",
            600: "#858585",
            700: "#a3a3a3",
            800: "#c2c2c2",
            900: "#e0e0e0"
        },
        primary: {
            50: "#990000", //hard coding button color
          100: "#ebcccc",
          200: "#d69999",
          300: "#c26666",
          400: "#d3d3d3",
          500: "#ffffff",
          600: "#7a0000",
          700: "#5c0000",
          800: "#3d0000",
          900: "#1f0000"
        },
        greenAccent: {
            100: "#fff1d2",
            200: "#ffe3a4",
            300: "#ffd477",
            400: "#ffc649",
            500: "#ffb81c",
            600: "#cc9316",
            700: "#996e11",
            800: "#664a0b",
            900: "#332506"
        }, 
        redAccent: {
            100: "#2c100f",
            200: "#58201e",
            300: "#832f2c",
            400: "#af3f3b",
            500: "#db4f4a",
            600: "#e2726e",
            700: "#e99592",
            800: "#f1b9b7",
            900: "#f8dcdb"
        },
        blueAccent: {
            100: "#151632",
            200: "#2a2d64",
            300: "#3e4396",
            400: "#535ac8",
            500: "#6870fa",
            600: "#868dfb",
            700: "#FFB81C",
            800: "#c3c6fd",
            900: "#e1e2fe"
        },
        buttonText: {
            default: "#990000"
        }
    }),
});

//mui theme settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode,
            ...(mode === 'dark'
                ? {
                    primary: {
                        main: colors.primary[500],
                    },
                    secondary: {
                        main: colors.greenAccent[500],
                    },
                    neutral: {
                        dark: colors.grey[700],
                        main: colors.grey[500],
                        light: colors.grey[100]

                    },
                    background: {
                        default: colors.primary[500],
                    }

                    
                } : {
                    primary: {
                        main: colors.primary[100],
                    },
                    secondary: {
                        main: colors.greenAccent[500],
                    },
                    neutral: {
                        dark: colors.grey[700],
                        main: colors.grey[500],
                        light: colors.grey[100]

                    },
                    background: {
                        default: "#990000",
                    },
                }
            ),
        },
        typography: {
            fontFamily: ["Source Sans 3", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Source Sans 3", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Source Sans 3", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Source Sans 3", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Source Sans 3", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Source Sans 3", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Source Sans 3", "sans-serif"].join(","),
                fontSize: 14,
            },

        },
    };
};

export const ColorModeContext = createContext({
    toggleColorMode: () => {}
});

export const useMode = () => {
    const [mode, setMode] = useState("dark");

    const colorMode = useMemo (
        () => ({
         toggleColorMode: () =>
            setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
}