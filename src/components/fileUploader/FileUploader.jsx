import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";
import { BsFillFolderFill } from "react-icons/bs";
import { storage } from "../../../firebase";
import { LoginContext } from "../../contexts/LoginContext";
import CryptoJS from "crypto-js";

const FileUploader = ({ handleFetchFiles }) => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const { userData, secretKey } = useContext(LoginContext);

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

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  const handleUpload = async () => {
    const userFolderName = userData.email;
    const userFolderRef = ref(storage, userFolderName);

    // Upload the encrypted files to the user's folder
    for (const file of files) {
      // Read the file content as string
      const fileContent = await readFileAsText(file);
      console.log("original file content: ", fileContent);

      // Encrypt the file content using AES
      const encryptedFileContent = CryptoJS.AES.encrypt(
        fileContent,
        secretKey
      ).toString();

      console.log("encrypted file content: ", encryptedFileContent);

      // Convert the encrypted file content back to a file object
      const encryptedFile = new File([encryptedFileContent], file.name, {
        type: file.type,
      });

      const fileRef = ref(userFolderRef, file?.name);
      try {
        await uploadBytes(fileRef, encryptedFile);
        setFiles([]);
        handleFetchFiles();
        console.log("file uploaded successfully!");
      } catch (err) {
        console.log("error: ", err);
      }
    }
  };

  return (
    <Card
      sx={{
        width: "500px",
        height: "400px",
        position: "relative",
        top: "20px",
        display: "flex",
        flexDirection: "column",
        padding: 2,
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
            accept=".txt, .csv, .doc, .docx, .rtf, .odt, .pdf"
            multiple
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
        <Button
          variant="contained"
          disabled={files.length === 0}
          onClick={handleUpload}
        >
          Upload Files
        </Button>
      </CardActions>
    </Card>
  );
};

export default FileUploader;
