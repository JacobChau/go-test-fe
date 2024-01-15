import React from "react";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";

interface CircularProgressBarProps {
  value: number; // The current value (score)
  total: number; // The total possible value (total marks)
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  value,
  total,
}) => {
  const theme = useTheme();

  // Calculate the percentage of the current value against the total
  const normalizedValue = (value / total) * 100;

  return (
    <Box position="relative" display="inline-flex">
      {/* Background circle */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={200}
        thickness={3}
        sx={{ color: theme.palette.grey[100] }}
      />
      {/* Foreground circle */}
      <CircularProgress
        variant="determinate"
        value={normalizedValue}
        size={200}
        thickness={3}
        sx={{
          color: theme.palette.primary.main,
          position: "absolute",
          left: 0,
        }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h5" component="div" color="text.primary">
          {`${value} / ${total}`}
        </Typography>
        <Typography variant="subtitle2" component="div" color="text.secondary">
          {normalizedValue < 50
            ? "Low"
            : normalizedValue < 75
              ? "Medium"
              : "High"}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressBar;
