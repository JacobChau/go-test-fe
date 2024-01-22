import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";

interface UserComponentProps {
  username: string;
  avatarUrl?: string;
}
const UserComponent: React.FC<UserComponentProps> = ({
  username,
  avatarUrl,
}) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ mt: 1.5, mb: 1 }}
    >
      <Avatar src={avatarUrl} alt={username} sx={{ width: 22, height: 22 }} />
      <Typography
        variant="subtitle1"
        component="div"
        style={{ marginLeft: "8px" }}
        sx={{ fontWeight: 600 }}
      >
        {username}
      </Typography>
    </Stack>
  );
};

export default UserComponent;
