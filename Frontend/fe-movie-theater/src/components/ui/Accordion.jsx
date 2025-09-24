import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SettingsDialog = ({ open, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [switches, setSwitches] = useState({
    users: false,
    resumes: false,
    createUser: false,
  });

  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSwitchChange = (name) => (event) => {
    setSwitches({ ...switches, [name]: event.target.checked });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Cài đặt quyền</DialogTitle>
      <DialogContent>
        {/* USERS */}
        <Accordion expanded={expanded === "users"} onChange={handleExpand("users")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={<Switch checked={switches.users} onChange={handleSwitchChange("users")} />}
              label="USERS"
              onClick={(event) => event.stopPropagation()}
            />
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Switch checked={switches.createUser} onChange={handleSwitchChange("createUser")} />
              }
              label={
                <Typography>
                  create user u <br />
                  <Typography color="green">POST</Typography> <code>/api/v1/users</code>
                </Typography>
              }
            />
          </AccordionDetails>
        </Accordion>

        {/* RESUMES */}
        <Accordion expanded={expanded === "resumes"} onChange={handleExpand("resumes")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={<Switch checked={switches.resumes} onChange={handleSwitchChange("resumes")} />}
              label="RESUMES"
              onClick={(event) => event.stopPropagation()}
            />
          </AccordionSummary>
        </Accordion>
      </DialogContent>

      {/* Đóng Dialog */}
      <Button onClick={onClose} style={{ margin: "10px" }} variant="contained">
        Đóng
      </Button>
    </Dialog>
  );
};

export default SettingsDialog;
