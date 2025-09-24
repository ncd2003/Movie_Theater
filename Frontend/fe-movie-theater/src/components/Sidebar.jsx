import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MovieIcon from "@mui/icons-material/Movie";
import ChairIcon from "@mui/icons-material/Chair";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Access from "./../utils/Access"; // Import component kiểm tra quyền

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const menuItems = [
    {
      text: "Room Management",
      icon: <MeetingRoomIcon />,
      path: "/admin/rooms-management",
      permission: {
        method: "GET",
        apiPath: "/api/v1/cinema-room",
        module: "CinemaRoom",
      },
    },
    {
      text: "Movie Management",
      icon: <MovieIcon />,
      path: "/admin/movies/movie-management",
      permission: { method: "GET", apiPath: "/api/v1/movies", module: "Movie" },
    },
    {
      text: "Seat Type Management",
      icon: <ChairIcon />,
      path: "/admin/seat-types-management",
      permission: {
        method: "GET",
        apiPath: "/api/v1/seat-type",
        module: "SeatType",
      },
    },
    {
      text: "Seat Status Management",
      icon: <FlightClassIcon />,
      path: "/admin/seat-status-management",
      permission: {
        method: "GET",
        apiPath: "/api/v1/seat-status",
        module: "SeatStatus",
      },
    },
    {
      text: "Promotion Manager",
      icon: <LocalOfferIcon />,
      path: "/admin/promotion-management",
      permission: {
        method: "GET",
        apiPath: "/api/v1/promotions",
        module: "Promotion",
      },
    },
    {
      text: "Invoice Management",
      icon: <ConfirmationNumberIcon />,
      path: "/admin/invoice",
      permission: {
        method: "GET",
        apiPath: "/api/v1/invoice",
        module: "Invoice",
      },
    },
    {
      text: "Account Management",
      icon: <PeopleIcon />,
      path: "/admin/account-management",
      permission: {
        method: "GET",
        apiPath: "/api/v1/account",
        module: "Account",
      },
    },
    {
      text: "Permission Management",
      icon: <ContactMailIcon />,
      path: "/admin/permission-management",
      permission: {
        method: "GET",
        apiPath: "/api/v1/permission",
        module: "Permission",
      },
    },
    {
      text: "Role Management",
      icon: <ContactMailIcon />,
      path: "/admin/role-management",
      permission: { method: "GET", apiPath: "/api/v1/role", module: "Role" },
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 64,
        flexShrink: 0,
        transition: "width 0.3s ease-in-out",
        "& .MuiDrawer-paper": {
          width: open ? 240 : 64,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
          color: "#333",
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: open ? "space-between" : "center",
          p: 2,
        }}
      >
        {open && (
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Dashboard
          </Typography>
        )}
        <IconButton onClick={handleToggleSidebar}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>

      <Divider />

      <List>
        {menuItems.map((item, index) => {
          const isSelected = location.pathname === item.path;

          return (
            <Access key={index} permission={item.permission} hideChildren>
              <Tooltip title={!open ? item.text : ""} placement="right">
                <ListItem
                  component="button"
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: isSelected ? "#d0d0d0" : "transparent",
                    "&:hover": { backgroundColor: "#e0e0e0" },
                    borderRadius: "8px",
                    cursor: "pointer",
                    my: 0.5,
                    px: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isSelected ? "#000" : "#555", minWidth: 40 }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        color: isSelected ? "#000" : "#333",
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            </Access>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
