import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useContext, useEffect } from "react";
import { storage } from "../../../firebase";
import { LoginContext } from "../../contexts/LoginContext";
import CryptoJS from "crypto-js";
// import { saveAs } from "file-saver";

const FilesTable = ({ files, type }) => {
  const { secretKey } = useContext(LoginContext);

  const handleDownload = async (owner, fileName) => {
    const pathReference = ref(storage, `${owner}/${fileName}`);
    const fileUrl = await getDownloadURL(pathReference);

    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    xhr.onload = function () {
      const encryptedFile = xhr.response;
      const reader = new FileReader();
      reader.onload = function () {
        const decryptedData = CryptoJS.AES.decrypt(reader.result, secretKey);
        const decryptedDataString = CryptoJS.enc.Utf8.stringify(decryptedData);

        // Create a new blob object
        const blob = new Blob([decryptedDataString], {
          type: encryptedFile.type,
        });

        // Create a download link
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        // Programmatically click the link to initiate the download
        link.click();
      };
      reader.readAsText(encryptedFile);
    };

    xhr.open("GET", fileUrl, true);
    xhr.send();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>File Name</TableCell>
            <TableCell align="right">Size (in KB)</TableCell>
            <TableCell align="right">Uploaded On</TableCell>
            <TableCell align="right">Owner</TableCell>
            {type === "SELF" && <TableCell align="right">Download</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.md5Hash}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {file.name}
              </TableCell>
              <TableCell align="right">{file.size}</TableCell>
              <TableCell align="right">
                {new Date(file.timeCreated).toLocaleString()}
              </TableCell>
              <TableCell align="right">{file.owner}</TableCell>
              {type === "SELF" && (
                <TableCell align="right">
                  <Button onClick={() => handleDownload(file.owner, file.name)}>
                    Download
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FilesTable;
