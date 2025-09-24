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
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import BookIcon from "@mui/icons-material/Book";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Sidebar from "./Sidebar";


const SidebarClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "My Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "History", icon: <HistoryIcon />, path: "/booking-history" },
    { text: "Booked Ticket", icon: <BookIcon />, path: "/booked-ticket" },
    // { text: "Promotions", icon: <LocalOfferIcon />, path: "/promotions" },
    // { text: "Contact Support", icon: <ContactMailIcon />, path: "/contact" },
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
      <Toolbar sx={{ display: "flex", justifyContent: open ? "space-between" : "center", p: 2 }}>
        {open && (
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Customer
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
            <Tooltip key={index} title={!open ? item.text : ""} placement="right">
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
                <ListItemIcon sx={{ color: isSelected ? "#000" : "#555", minWidth: 40 }}>
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
          );
        })}
      </List>
    </Drawer>
  );
};

export default SidebarClient;