import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ open, handleToggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    const fullName = localStorage.getItem('fullName');
    const roleId = Number(localStorage.getItem('roleId')); 

  

    if ((roleId === 1 || roleId === 2) && fullName) {
      setUser({ email, fullName, roleId });
    } else {
      setUser(null);
    }


  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBackToHomePage = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <AppBar
        position='fixed'
        sx={{
          width: isMobile ? '100%' : `calc(100% - ${open ? 240 : 64}px)`,
          ml: isMobile ? 0 : `${open ? 240 : 64}px`,
          bgcolor: 'white',
          color: 'black',
          boxShadow: 'none',
          borderBottom: '1px solid #ddd',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Toggle Sidebar trên Mobile */}
          {isMobile && (
            <IconButton onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant='h6'
            sx={{ fontWeight: 'bold', flexGrow: 1 }}
          ></Typography>

          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* User Profile */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: '16px',
                }}
              >
                <Typography
                  variant='body1'
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    ml: 1,
                    color: 'gray',
                  }}
                >
                  Hi, {user?.fullName}
                </Typography>

                <Avatar src='/broken-image.jpg' onClick={handleMenuOpen} />
              </Box>
            </Box>
          ) : (
            <IconButton onClick={handleMenuOpen}></IconButton>
          )}
        </Toolbar>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <Box sx={{ padding: 2, minWidth: '190px' }}>
            <Typography fontWeight='bold'> {user?.fullName} </Typography>
            <Typography variant='body2' color='text.secondary'>
              {user?.email}
            </Typography>
          </Box>

          <MenuItem onClick={handleBackToHomePage} sx={{ color: 'gray' }}>
            Back to HomePage
          </MenuItem>

          <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
            Sign out
          </MenuItem>
        </Menu>
      </AppBar>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        anchor='left'
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 240 } }}
      >
        <List>
          <ListItem>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              Menu
            </Typography>
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary='Dashboard' />
          </ListItem>
          <ListItem button>
            <ListItemText primary='Settings' />
          </ListItem>
          <ListItem button>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
