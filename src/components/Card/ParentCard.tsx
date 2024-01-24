import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  useMediaQuery,
} from "@mui/material";

type Props = {
  title: string;
  footer?: string | JSX.Element;
  children: JSX.Element;
};

const ParentCard = ({ title, children, footer }: Props) => {
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const isXsDown = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={{ border: `1px solid ${borderColor}` }}>
      <CardHeader title={title} sx={{ p: isXsDown ? 2 : 3 }} />
      <Divider />

      <CardContent
        sx={{ position: "relative", p: isXsDown ? 1 : 3 }}
        style={{ paddingBottom: isXsDown ? "8px" : "24px" }}
      >
        {children}
      </CardContent>

      {footer ? (
        <>
          <Divider />
          <Box
            sx={{
              p: isXsDown ? 1 : 3, // Apply padding conditionally
              position: isXsDown ? "absolute" : "relative",
              bottom: isXsDown ? 0 : "auto",
              left: isXsDown ? 0 : "auto",
              right: isXsDown ? 0 : "auto",
            }}
          >
            {footer}
          </Box>
        </>
      ) : (
        ""
      )}
    </Card>
  );
};

export default ParentCard;
