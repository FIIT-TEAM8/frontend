import { styled } from "@mui/material/styles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import theme from "./Theme";

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  "&": {
    display: "inline-block",
    textAlign: "center",
  },
  "& .MuiToggleButtonGroup-grouped": {
    "&:not(:first-of-type)": {
      borderRadius: "5px",
      border: "1px solid #e0e0e0",
      marginLeft: "16px",
      marginTop: "16px",
    },
    "&:not(:last-of-type)": {
      borderRadius: "5px",
      border: "1px solid #e0e0e0",
      marginLeft: "16px",
      marginTop: "16px",
    },
    "&.Mui-selected+.MuiToggleButtonGroup-grouped.Mui-selected": {
      marginLeft: "16px",
      marginTop: "16px",
      border: "1px solid #e0e0e0",
      backgroundColor: theme.palette.primary.light,
      "&:hover": {
        backgroundColor: theme.palette.primary.mediumLight,
        "@media (hover: none)": {
          backgroundColor: theme.palette.primary.light,
        },
      },
    },
  },
}));

export const StyledToggleButton = styled(ToggleButton)(() => ({
  "&": {
    "&.Mui-selected": {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
      "&:hover": {
        backgroundColor: theme.palette.primary.mediumLight,
        "@media (hover: none)": {
          backgroundColor: theme.palette.primary.light,
        },
      },
    },
  },
}));
