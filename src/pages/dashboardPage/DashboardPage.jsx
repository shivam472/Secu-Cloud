import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsFillFolderFill } from "react-icons/bs";
import FileUploader from "../../components/fileUploader/FileUploader";
import FilesTable from "../../components/filesTable/FilesTable";
import { LoginContext } from "../../contexts/LoginContext";
import { getMetadata, listAll, ref } from "firebase/storage";
import { storage } from "../../../firebase";

const DashboardPage = () => {
  const [currentUserFiles, setCurrentUserFiles] = useState([]);
  const [otherUsersFiles, setOtherUsersFiles] = useState([]);
  const { userData } = useContext(LoginContext);

  useEffect(() => {
    const fetchAllFiles = async () => {
      const currentUserFolderName = userData.email;
      const currentUserFolderRef = ref(storage, currentUserFolderName);
      const files = await listAll(currentUserFolderRef);
      let currentUserFilesTemp = [];
      for (const fileRef of files.items) {
        const fileMetaData = await getMetadata(fileRef);
        fileMetaData.owner = currentUserFolderName;
        console.log("current User file: ", fileMetaData);
        currentUserFilesTemp.push(fileMetaData);
      }

      setCurrentUserFiles(currentUserFilesTemp);
    };

    fetchAllFiles();
  }, []);

  useEffect(() => {
    const fetchAllFolders = async () => {
      const storageRef = ref(storage, "/");
      const { prefixes } = await listAll(storageRef);

      const currentUserFolderName = userData.email;

      const folderNames = prefixes.map((prefix) => prefix.name);
      const otherUsersFolderNames = folderNames.filter(
        (name) => name !== currentUserFolderName
      );

      const otherUsersFilesTemp = [];
      for (const folderName of otherUsersFolderNames) {
        const folderRef = ref(storage, `${folderName}/`);
        const files = await listAll(folderRef);
        for (const fileRef of files.items) {
          const fileMetaData = await getMetadata(fileRef);
          fileMetaData.owner = folderName;
          console.log("other user file: ", fileMetaData);
          otherUsersFilesTemp.push(fileMetaData);
        }
      }
      setOtherUsersFiles(otherUsersFilesTemp);
    };

    fetchAllFolders();
  }, []);

  return (
    <Grid
      container
      item
      width="100%"
      height="calc(100% - 70px)"
      alignItems="center"
      padding={1}
      direction="column"
      gap={10}
    >
      <FileUploader />

      <Grid container item direction="column" gap>
        <Typography variant="h4">Your Files</Typography>
        <FilesTable files={currentUserFiles} />
      </Grid>

      <Grid container item direction="column" gap>
        <Typography variant="h4">Files By Other Users</Typography>
        <FilesTable files={otherUsersFiles} />
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
