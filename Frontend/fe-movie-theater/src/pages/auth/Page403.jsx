import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import TheatersIcon from "@mui/icons-material/Theaters";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Background = styled(Box)({
  backgroundImage: "url('https://source.unsplash.com/1600x900/?movie,cinema')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  color: "#fff",
  textAlign: "center",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay effect
  },
});

const Content = styled(motion.div)({
  position: "relative",
  zIndex: 1,
  maxWidth: "600px",
  padding: "20px",
  backdropFilter: "blur(10px)",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(255, 0, 0, 0.4)",
});

const Forbidden403 = () => {
  const navigate = useNavigate();

  return (
    <Background>
      <Content
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <TheatersIcon sx={{ fontSize: 80, color: "red" }} />
        <Typography variant="h2" fontWeight="bold">
          403 - Access Denied
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Sorry! You don’t have permission to access this page. <br />
          Go back and continue enjoying great movies!
        </Typography>
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 3 }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Content>
    </Background>
  );
};

export default Forbidden403;
