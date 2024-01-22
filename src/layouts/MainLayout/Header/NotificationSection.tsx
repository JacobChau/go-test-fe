// import React from "react";
//
// import { useTheme } from "@mui/material/styles";
// import {
//   Button,
//   ClickAwayListener,
//   Fade,
//   Grid,
//   Paper,
//   Popper,
//   Avatar,
//   List,
//   ListItemAvatar,
//   ListItemText,
//   ListItemSecondaryAction,
//   Typography,
//   ListItemButton,
// } from "@mui/material";
//
// // third party
// import PerfectScrollbar from "react-perfect-scrollbar";
//
// // assets
// import QueryBuilderTwoToneIcon from "@mui/icons-material/QueryBuilderTwoTone";
// import NotificationsNoneTwoToneIcon from "@mui/icons-material/NotificationsNoneTwoTone";
//
// // ==============================|| NOTIFICATION ||============================== //
// interface Notification {
//   id: string;
//   type: "newTest" | "testResult" | "groupAdded" | "testStarted";
//   title: string;
//   description: string;
//   timestamp: string; // ISO date string
//   seen: boolean;
// }
//
// interface NotificationSectionProps {
//   role: "student" | "teacher";
//   notifications: Notification[];
// }
//
// const NotificationSection: React.FC<NotificationSectionProps> = ({
//   role,
//   notifications,
// }) => {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);
//   const anchorRef = React.useRef(null);
//
//   const handleToggle = () => {
//     setOpen((prevOpen) => !prevOpen);
//   };
//
//   const handleClose = (event) => {
//     if (anchorRef.current && anchorRef.current.contains(event.target)) {
//       return;
//     }
//     setOpen(false);
//   };
//
//   const prevOpen = React.useRef(open);
//
//   const renderNotificationItem = (notification: Notification) => {
//     return (
//       <ListItemButton key={notification.id}>
//         <ListItemAvatar>
//           <Avatar
//             sx={{
//               bgcolor: theme.palette.secondary.main,
//               color: theme.palette.secondary.contrastText,
//             }}
//           >
//             <NotificationsNoneTwoToneIcon />
//           </Avatar>
//         </ListItemAvatar>
//         <ListItemText
//           primary={
//             <Typography variant="subtitle1">{notification.title}</Typography>
//           }
//           secondary={
//             <Typography variant="subtitle2">
//               {notification.description}
//             </Typography>
//           }
//         />
//         <ListItemSecondaryAction sx={{ top: 22 }}>
//           <Grid container justifyContent="flex-end">
//             <Grid item>
//               <QueryBuilderTwoToneIcon
//                 sx={{
//                   fontSize: "0.75rem",
//                   mr: 0.5,
//                   color: theme.palette.grey[400],
//                 }}
//               />
//             </Grid>
//             <Grid item>
//               <Typography
//                 variant="caption"
//                 display="block"
//                 gutterBottom
//                 sx={{ color: theme.palette.grey[400] }}
//               >
//                 {notification.timestamp}
//               </Typography>
//             </Grid>
//           </Grid>
//         </ListItemSecondaryAction>
//       </ListItemButton>
//     );
//   };
//   React.useEffect(() => {
//     if (prevOpen.current && !open && anchorRef.current) {
//       anchorRef.current.focus();
//     }
//     prevOpen.current = open;
//   }, [open]);
//
//   return (
//     <>
//       <Button
//         sx={{
//           minWidth: { sm: 50, xs: 35 },
//         }}
//         ref={anchorRef}
//         aria-controls={open ? "menu-list-grow" : undefined}
//         aria-haspopup="true"
//         aria-label="Notification"
//         onClick={handleToggle}
//         color="inherit"
//       >
//         <NotificationsNoneTwoToneIcon sx={{ fontSize: "1.5rem" }} />
//       </Button>
//       <Popper
//         placement="bottom-end"
//         open={open}
//         anchorEl={anchorRef.current}
//         role={undefined}
//         transition
//         disablePortal
//         modifiers={[
//           {
//             name: "offset",
//             options: {
//               offset: [0, 10],
//             },
//           },
//           {
//             name: "preventOverflow",
//             options: {
//               altAxis: true, // false by default
//             },
//           },
//         ]}
//       >
//         {({ TransitionProps }) => (
//           <Fade {...TransitionProps}>
//             <Paper>
//               <ClickAwayListener onClickAway={handleClose}>
//                 <List
//                   sx={{
//                     width: "100%",
//                     maxWidth: 350,
//                     minWidth: 250,
//                     backgroundColor: theme.palette.background.paper,
//                     pb: 0,
//                     borderRadius: "10px",
//                   }}
//                 >
//                   <PerfectScrollbar
//                     style={{ height: 320, overflowX: "hidden" }}
//                   >
//                     {/* Render notifications based on role */}
//                     {notifications.map((notification) =>
//                       renderNotificationItem(notification),
//                     )}
//                   </PerfectScrollbar>
//                 </List>
//               </ClickAwayListener>
//             </Paper>
//           </Fade>
//         )}
//       </Popper>
//     </>
//   );
// };
//
// export default NotificationSection;
