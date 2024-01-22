// material-ui
import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

// project import
import value from "@assets/scss/_themes-vars.module.scss";

// ==============================|| THEME ||============================== //

export function theme() {
  let textPrimary;
  let textSecondary;
  let textDark;
  let textHint;
  let background;
  let paper;
  let textInversePrimary;
  let paperWhite;
  let primary100;

  textPrimary = textInversePrimary = value.textPrimary;
  textSecondary = value.textSecondary;
  textDark = value.textDark;
  textHint = value.textHint;

  background = value.backgound;
  paper = value.paper;

  paperWhite = value.paperWhite;

  primary100 = value.primary100;

  return createTheme({
    direction: "ltr",
    palette: {
      mode: "light",
      common: {
        black: value.paperDark,
        white: value.paperWhite,
      },
      primary: {
        light: value.primaryLight,
        main: value.primary,
        dark: value.primaryDark,
        100: value.primary100,
      },
      secondary: {
        light: value.secondaryLight,
        main: value.secondary,
        dark: value.secondaryDark,
      },
      error: {
        light: value.errorLight,
        main: value.error,
        dark: value.errorDark,
      },
      warning: {
        light: value.warningLight,
        main: value.warning,
        dark: value.warningDark,
      },
      info: {
        light: value.infoLight,
        main: value.info,
        dark: value.infoDark,
      },
      success: {
        light: value.successLight,
        main: value.success,
        dark: value.successDark,
      },
      grey: {
        300: value.grey300,
        400: value.grey400,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      background: {
        paper: paper,
        default: background,
      },
    },
    typography: {
      fontFamily: `'Poppins', sans-serif`,
      h6: {
        fontWeight: 600,
        color: textSecondary,
        fontSize: "0.875rem",
      },
      h5: {
        fontSize: "1.125rem",
        color: textSecondary,
        fontWeight: 600,
      },
      h4: {
        fontSize: "1.25rem",
        color: textSecondary,
        fontWeight: 500,
      },
      h3: {
        fontSize: "1.5rem",
        color: textDark,
        fontWeight: 600,
      },
      h2: {
        fontSize: "2rem",
        color: textDark,
        fontWeight: 600,
      },
      h1: {
        fontSize: "2.2rem",
        color: textDark,
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: "0.875rem",
        fontWeight: 500,
        color: textSecondary,
        lineHeight: "1.643em",
      },
      subtitle2: {
        fontSize: "0.8125rem",
        fontWeight: 400,
      },
      caption: {
        fontSize: "0.68rem",
        color: textHint,
        fontWeight: 500,
      },
      body1: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: "1.643em",
      },
      body2: {
        letterSpacing: "0em",
        fontWeight: 400,
        lineHeight: "1.643em",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            boxSizing: "border-box",
          },
          html: {
            height: "100%",
            width: "100%",
          },
          a: {
            textDecoration: "none",
          },
          body: {
            height: "100%",
            margin: 0,
            padding: 0,
          },
          "#root": {
            height: "100%",
          },
          "*[dir='rtl'] .buyNowImg": {
            transform: "scaleX(-1)",
          },
          ".border-none": {
            border: "0px",
            td: {
              border: "0px",
            },
          },
          ".btn-xs": {
            minWidth: "30px !important",
            width: "30px",
            height: "30px",
            borderRadius: "6px !important",
            padding: "0px !important",
          },
          ".hover-text-primary:hover .text-hover": {
            color: value.primary,
          },
          ".hoverCard:hover": {
            scale: "1.01",
            transition: " 0.1s ease-in",
          },
          ".signup-bg": {
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
          },
          ".MuiBox-root": {
            borderRadius: "10px",
          },
          ".MuiCardHeader-action": {
            alignSelf: "center !important",
          },
          ".emoji-picker-react .emoji-scroll-wrapper": {
            overflowX: "hidden",
          },
          ".scrollbar-container": {
            borderRight: "0 !important",
          },
          ".theme-timeline .MuiTimelineOppositeContent-root": {
            minWidth: "90px",
          },
          ".MuiAlert-root .MuiAlert-icon": {
            color: "inherit!important",
          },
          ".MuiTimelineConnector-root": {
            width: "1px !important",
          },
          " .simplebar-scrollbar:before": {
            background: `${value.primary} !important`,
          },
          "@keyframes gradient": {
            "0%": {
              backgroundPosition: "0% 50%",
            },
            "50%": {
              backgroundPosition: " 100% 50%",
            },
            "100% ": {
              backgroundPosition: " 0% 50%",
            },
          },
          "@keyframes slide": {
            "0%": {
              transform: "translate3d(0, 0, 0)",
            },
            "100% ": {
              transform: "translate3d(-2086px, 0, 0)",
            },
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            overflow: "hidden",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            fontSize: "1.3rem",
          },
          fontSizeInherit: {
            fontSize: "inherit",
          },
          fontSizeLarge: {
            fontSize: "2.1875rem",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            color: textInversePrimary,
            paddingTop: "12px",
            paddingBottom: "12px",
            "&.Mui-selected": {
              "& .MuiListItemIcon-root": {
                color: value.primary,
              },
              color: value.primary,
              backgroundColor: value.menuHover,
            },
            "&:hover": {
              backgroundColor: value.menuHover,
              color: value.primary,
              "& .MuiListItemIcon-root": {
                color: value.primary,
              },
            },
            button: {
              "&:hover": {
                backgroundColor: value.menuHover,
              },
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            color: textInversePrimary,
            paddingTop: "12px",
            paddingBottom: "12px",
            "&.Mui-selected": {
              "& .MuiListItemIcon-root": {
                color: value.primary,
              },
              color: value.primary,
              backgroundColor: value.menuHover,
            },
            "&:hover": {
              backgroundColor: value.menuHover,
              color: value.primary,
              "& .MuiListItemIcon-root": {
                color: value.primary,
              },
            },
            button: {
              "&:hover": {
                backgroundColor: value.menuHover,
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: "36px",
            color: textInversePrimary,
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            fontSize: "0.875rem",
          },
          content: {
            color: textSecondary,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          elevation1: {
            boxShadow:
              "0 4px 6px -2px rgb(0 0 0 / 12%), 0 2px 2px -1px rgb(0 0 0 / 5%)",
          },
          rounded: {
            borderRadius: "10px",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            color: textDark,
            padding: "24px",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: "24px",
          },
        },
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            padding: "24px",
          },
        },
      },
      // Table
      MuiTableCell: {
        styleOverrides: {
          root: {
            whiteSpace: "normal",
            color: textDark,
          },
          head: {
            color: textDark,
            fontWeight: 600,
            backgroundColor: primary100,
          },
          body: {
            color: textDark,
          },
          paddingCheckbox: {
            paddingLeft: "18px",
            position: "relative",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            background: paperWhite,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          colorSecondary: {
            color: grey[100],
          },
          colorPrimary: {
            color: grey[100],
          },
          root: {
            color: grey[100],
          },
          outlined: {
            color: grey[500],
          },
          deleteIcon: {
            color: grey[500],
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: value.textSecondary,
          },
          indeterminate: {
            color: value.textPrimary,
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            maxWidth: "100%",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: value.textHint,
            color: grey[100],
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            color: textDark,
            padding: "1rem",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: value.paper,
            color: value.primaryDark,
            // boxShadow: 'none'
          },
        },
      },
    },
  });
}

export default theme;
