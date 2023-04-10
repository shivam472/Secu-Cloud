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
import React from "react";
import { storage } from "../../../firebase";

const FilesTable = ({ files }) => {
  const handleDownload = async (owner, fileName) => {
    const pathReference = ref(storage, `${owner}/${fileName}`);
    getDownloadURL(ref(storage, pathReference)).then((url) => {
      // Create a link or button that points to the download URL
      const link = document.createElement("a");
      link.href = url;
      link.download = "filename.png"; // set the filename to download as
      link.click(); // simulate a click to trigger the download
    });
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
            <TableCell align="right">Download</TableCell>
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
              <TableCell align="right">
                <Button onClick={() => handleDownload(file.owner, file.name)}>
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FilesTable;
