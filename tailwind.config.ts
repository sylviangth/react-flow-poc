import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        // light mode
        tremor: {
          brand: {
            faint: "#eff6ff", // blue-50
            muted: "#bfdbfe", // blue-200
            subtle: "#60a5fa", // blue-400
            DEFAULT: "#3b82f6", // blue-500
            emphasis: "#1d4ed8", // blue-700
            inverted: "#ffffff", // white
          },
          background: {
            muted: "#f9fafb", // gray-50
            subtle: "#f3f4f6", // gray-100
            DEFAULT: "#ffffff", // white
            emphasis: "#374151", // gray-700
          },
          border: {
            DEFAULT: "#e5e7eb", // gray-200
          },
          ring: {
            DEFAULT: "#e5e7eb", // gray-200
          },
          content: {
            subtle: "#9ca3af", // gray-400
            DEFAULT: "#6b7280", // gray-500
            emphasis: "#374151", // gray-700
            strong: "#111827", // gray-900
            inverted: "#ffffff", // white
          },
        },
        // dark mode
        "dark-tremor": {
          brand: {
            faint: "#0B1229", // custom
            muted: "#172554", // blue-950
            subtle: "#1e40af", // blue-800
            DEFAULT: "#3b82f6", // blue-500
            emphasis: "#60a5fa", // blue-400
            inverted: "#030712", // gray-950
          },
          background: {
            muted: "#131A2B", // custom
            subtle: "#1f2937", // gray-800
            DEFAULT: "#111827", // gray-900
            emphasis: "#d1d5db", // gray-300
          },
          border: {
            DEFAULT: "#1f2937", // gray-800
          },
          ring: {
            DEFAULT: "#1f2937", // gray-800
          },
          content: {
            subtle: "#4b5563", // gray-600
            DEFAULT: "#6b7280", // gray-500
            emphasis: "#e5e7eb", // gray-200
            strong: "#f9fafb", // gray-50
            inverted: "#000000", // black
          },
        },
      },
      boxShadow: {
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem"],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  darkMode: "class",
  plugins: [
    require('@tailwindcss/typography'),
    require("@headlessui/tailwindcss"),
    nextui({
      themes: {
        "mindpal-light": {
          colors: {
            background: "#E0E6FD",
            foreground: "#000",
            primary: {
              DEFAULT: "#6466E9",
              foreground: "#fff",
              50: "#fff",
              100: "#E0E6FD",
              200: "#C9D2FA",
              300: "#A7B4F6",
              400: "#828CF1",
              500: "#6466E9",
              600: "#4E46DC",
              700: "#4138C2",
              800: "#36309D",
              900: "#302E7D",
            },
            focus: "#6466E9",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "mindpal-dark": {
          colors: {
            background: "#36309D",
            foreground: "#fff",
            primary: {
              DEFAULT: "#828CF1",
              foreground: "#fff",
              50: "#302E7D",
              100: "#36309D",
              200: "#4138C2",
              300: "#4E46DC",
              400: "#6466E9",
              500: "#828CF1",
              600: "#A7B4F6",
              700: "#C9D2FA",
              800: "#E0E6FD",
              900: "#EEF2FE"
            },
            focus: "#828CF1",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "zinc-light": {
          colors: {
            background: "#F4F4F5",
            foreground: "#000",
            primary: {
              DEFAULT: "#18181B",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA",
            },
            focus: "#A1A1AA",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "zinc-dark": {
          colors: {
            background: "#52525B",
            foreground: "#fff",
            primary: {
              DEFAULT: "#F4F4F5",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            },
            focus: "#F4F4F5",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "red-light": {
          colors: {
            background: "#ffebee",
            foreground: "#000",
            primary: {
              DEFAULT: "#f44336",
              foreground: "#fff",
              50: "#fff",
              100: "#ffcdd2",
              200: "#ef9a9a",
              300: "#e57373",
              400: "#ef5350",
              500: "#f44336",
              600: "#e53935",
              700: "#d32f2f",
              800: "#c62828",
              900: "#b71c1c",
            },
            focus: "#f44336",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "red-dark": {
          colors: {
            background: "#b71c1c",
            foreground: "#fff",
            primary: {
              DEFAULT: "#f44336",
              foreground: "#fff",
              50: "#b71c1c",
              100: "#c62828",
              200: "#d32f2f",
              300: "#e53935",
              400: "#f44336",
              500: "#ef5350",
              600: "#e57373",
              700: "#ef9a9a",
              800: "#ffcdd2",
              900: "#ffebee"
            },
            focus: "#f44336",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "orange-light": {
          colors: {
            background: "#fff3e0",
            foreground: "#000",
            primary: {
              DEFAULT: "#ff9800",
              foreground: "#fff",
              50: "#fff",
              100: "#ffe0b2",
              200: "#ffcc80",
              300: "#ffb74d",
              400: "#ffa726",
              500: "#ff9800",
              600: "#fb8c00",
              700: "#f57c00",
              800: "#ef6c00",
              900: "#e65100"
            },
            focus: "#ff9800",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "orange-dark": {
          colors: {
            background: "#e65100",
            foreground: "#fff",
            primary: {
              DEFAULT: "#ff9800",
              foreground: "#fff",
              50: "#e65100",
              100: "#ef6c00",
              200: "#f57c00",
              300: "#fb8c00",
              400: "#ff9800",
              500: "#ffa726",
              600: "#ffb74d",
              700: "#ffcc80",
              800: "#ffe0b2",
              900: "#fff3e0",
            },
            focus: "#ff9800",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "pink-light": {
          colors: {
            background: "#fce4ec",
            foreground: "#000",
            primary: {
              DEFAULT: "#e91e63",
              foreground: "#fff",
              50: "#fff",
              100: "#f8bbd0",
              200: "#f48fb1",
              300: "#f06292",
              400: "#ec407a",
              500: "#e91e63",
              600: "#d81b60",
              700: "#c2185b",
              800: "#ad1457",
              900: "#880e4f"
            },
            focus: "#e91e63",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "pink-dark": {
          colors: {
            background: "#880e4f",
            foreground: "#fff",
            primary: {
              DEFAULT: "#e91e63",
              foreground: "#fff",
              50: "#880e4f",
              100: "#ad1457",
              200: "#c2185b",
              300: "#d81b60",
              400: "#e91e63",
              500: "#ec407a",
              600: "#f06292",
              700: "#f48fb1",
              800: "#f8bbd0",
              900: "#fce4ec"
            },
            focus: "#e91e63",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "amber-light": {
          colors: {
            background: "#fff8e1",
            foreground: "#000",
            primary: {
              DEFAULT: "#ffc107",
              foreground: "#fff",
              50: "#fff",
              100: "#fef3c7",
              200: "#fde68a",
              300: "#fcd34d",
              400: "#fbbf24",
              500: "#f59e0b",
              600: "#d97706",
              700: "#b45309",
              800: "#92400e",
              900: "#78350f"
            },
            focus: "#ffc107",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "amber-dark": {
          colors: {
            background: "#ff6f00",
            foreground: "#fff",
            primary: {
              DEFAULT: "#ffc107",
              foreground: "#fff",
              50: "#78350f",
              100: "#92400e",
              200: "#b45309",
              300: "#d97706",
              400: "#f59e0b",
              500: "#fbbf24",
              600: "#fcd34d",
              700: "#fde68a",
              800: "#fef3c7",
              900: "#ff6f00"
            },
            focus: "#ffc107",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "lime-light": {
          colors: {
            background: "#f9fbe7",
            foreground: "#000",
            primary: {
              DEFAULT: "#c0ca33",
              foreground: "#fff",
              50: "#fff",
              100: "#f0f4c3",
              200: "#e6ee9c",
              300: "#dce775",
              400: "#d4e157",
              500: "#cddc39",
              600: "#c0ca33",
              700: "#afb42b",
              800: "#9e9d24",
              900: "#827717"
            },
            focus: "#c0ca33",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "lime-dark": {
          colors: {
            background: "#827717",
            foreground: "#fff",
            primary: {
              DEFAULT: "#cddc39",
              foreground: "#fff",
              50: "#827717",
              100: "#9e9d24",
              200: "#afb42b",
              300: "#c0ca33",
              400: "#cddc39",
              500: "#d4e157",
              600: "#dce775",
              700: "#e6ee9c",
              800: "#f0f4c3",
              900: "#f9fbe7"
            },
            focus: "#cddc39",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "green-light": {
          colors: {
            background: "#e8f5e9",
            foreground: "#000",
            primary: {
              DEFAULT: "#4caf50",
              foreground: "#fff",
              50: "#fff",
              100: "#c8e6c9",
              200: "#a5d6a7",
              300: "#81c784",
              400: "#66bb6a",
              500: "#4caf50",
              600: "#43a047",
              700: "#388e3c",
              800: "#2e7d32",
              900: "#1b5e20"
            },
            focus: "#4caf50",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "green-dark": {
          colors: {
            background: "#1b5e20",
            foreground: "#fff",
            primary: {
              DEFAULT: "#4caf50",
              foreground: "#fff",
              50: "#1b5e20",
              100: "#2e7d32",
              200: "#388e3c",
              300: "#43a047",
              400: "#4caf50",
              500: "#66bb6a",
              600: "#81c784",
              700: "#a5d6a7",
              800: "#c8e6c9",
              900: "#e8f5e9"
            },
            focus: "#4caf50",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "teal-light": {
          colors: {
            background: "#e0f2f1",
            foreground: "#000",
            primary: {
              DEFAULT: "#009688",
              foreground: "#fff",
              50: "#fff",
              100: "#b2dfdb",
              200: "#80cbc4",
              300: "#4db6ac",
              400: "#26a69a",
              500: "#009688",
              600: "#00897b",
              700: "#00796b",
              800: "#00695c",
              900: "#004d40"
            },
            focus: "#009688",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "teal-dark": {
          colors: {
            background: "#004d40",
            foreground: "#fff",
            primary: {
              DEFAULT: "#009688",
              foreground: "#fff",
              50: "#004d40",
              100: "#00695c",
              200: "#00796b",
              300: "#00897b",
              400: "#009688",
              500: "#26a69a",
              600: "#4db6ac",
              700: "#80cbc4",
              800: "#b2dfdb",
              900: "#e0f2f1"
            },
            focus: "#009688",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "cyan-light": {
          colors: {
            background: "#e0f7fa",
            foreground: "#000",
            primary: {
              DEFAULT: "#00bcd4",
              foreground: "#fff",
              50: "#fff",
              100: "#b2ebf2",
              200: "#80deea",
              300: "#4dd0e1",
              400: "#26c6da",
              500: "#00bcd4",
              600: "#00acc1",
              700: "#0097a7",
              800: "#00838f",
              900: "#006064"
            },
            focus: "#00bcd4",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "cyan-dark": {
          colors: {
            background: "#006064",
            foreground: "#fff",
            primary: {
              DEFAULT: "#00bcd4",
              foreground: "#fff",
              50: "#006064",
              100: "#00838f",
              200: "#0097a7",
              300: "#00acc1",
              400: "#00bcd4",
              500: "#26c6da",
              600: "#4dd0e1",
              700: "#80deea",
              800: "#b2ebf2",
              900: "#e0f7fa"
            },
            focus: "#00bcd4",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
        "blue-light": {
          colors: {
            background: "#e3f2fd",
            foreground: "#000",
            primary: {
              DEFAULT: "#2196f3",
              foreground: "#fff",
              50: "#fff",
              100: "#bbdefb",
              200: "#90caf9",
              300: "#64b5f6",
              400: "#42a5f5",
              500: "#2196f3",
              600: "#1e88e5",
              700: "#1976d2",
              800: "#1565c0",
              900: "#0d47a1"
            },
            focus: "#2196f3",
            default: {
              DEFAULT: "#52525B",
              foreground: "#000",
              50: "#fff",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B"
            }
          },
        },
        "blue-dark": {
          colors: {
            background: "#0d47a1",
            foreground: "#fff",
            primary: {
              DEFAULT: "#2196f3",
              foreground: "#fff",
              50: "#0d47a1",
              100: "#1565c0",
              200: "#1976d2",
              300: "#1e88e5",
              400: "#2196f3",
              500: "#42a5f5",
              600: "#64b5f6",
              700: "#90caf9",
              800: "#bbdefb",
              900: "#e3f2fd"
            },
            focus: "#2196f3",
            default: {
              DEFAULT: "#D4D4D8",
              foreground: "#fff",
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA"
            }
          },
        },
      },
    }),
  ],
}