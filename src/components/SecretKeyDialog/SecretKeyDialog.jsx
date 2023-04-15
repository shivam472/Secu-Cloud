import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { LoginContext } from "../../contexts/LoginContext";

const SecretKeyDialog = ({ open, handleClose }) => {
  const { secretKey, handleSetSecretKey } = useContext(LoginContext);
  const [secretKeyInput, setSecretKeyInput] = useState("");

  const handleSave = () => {
    if (secretKeyInput.trim() === "") return;
    handleSetSecretKey(secretKeyInput);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Secret Key</DialogTitle>
      <DialogContent sx={{ minWidth: "400px" }}>
        <DialogContentText>
          {secretKey && (
            <>
              <p style={{ wordBreak: "break-all" }}>{secretKey}</p>
              <p>
                This is your newly generated secret key. Please save it
                somewhere safe, if lost you'll not be able to encrypt of
                decrypt.
              </p>
            </>
          )}
          {!secretKey && (
            <TextField
              value={secretKeyInput}
              onChange={(e) => setSecretKeyInput(e.target.value)}
              label="Secret Key"
              fullWidth
            />
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {!secretKey && (
          <Button onClick={handleSave} autoFocus>
            save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SecretKeyDialog;
