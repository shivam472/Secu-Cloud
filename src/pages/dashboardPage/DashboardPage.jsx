import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { BsFillFolderFill } from "react-icons/bs";

const DashboardPage = () => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const textFiles = droppedFiles.filter((file) =>
      file.type.startsWith("text/")
    );
    setFiles(textFiles);
  };

  const handleInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const textFiles = selectedFiles.filter((file) =>
      file.type.startsWith("text/")
    );
    setFiles(textFiles);
  };

  const handleDropZoneClick = () => {
    inputRef.current.click();
  };

  return (
    <Grid
      container
      item
      width="100%"
      height="calc(100vh - 70px)"
      justifyContent="center"
      padding={1}
    >
      <Card
        sx={{
          width: "500px",
          height: "400px",
          position: "relative",
          top: "50px",
          display: "flex",
          flexDirection: "column",
          padding: 2
        }}
      >
        <CardContent sx={{ display: "flex", height: "70%", flex: 1 }}>
          <Box
            sx={{
              border: "1px dashed #469fff",
              borderRadius: "8px",
              bgcolor: "#f3f4f7",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              cursor: "pointer",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleDropZoneClick}
          >
            <BsFillFolderFill
              style={{ width: "80px", height: "80px" }}
              color="#0067F4"
            />
            <Typography color="#595959" fontSize="18px">
              Drag & Drop files here or browse
            </Typography>
            <input
              type="file"
              ref={inputRef}
              onChange={handleInputChange}
              style={{ display: "none" }}
              accept="text/*"
            />

            {files.map((file) => (
              <Card key={file.name} sx={{ mt: 3 }}>
                <CardContent>
                  {file.name} - {file.size} bytes
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained">Upload Files</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default DashboardPage;
