import { Grid, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";

import FileUploader from "../../components/fileUploader/FileUploader";
import FilesTable from "../../components/filesTable/FilesTable";
import { LoginContext } from "../../contexts/LoginContext";
import { getMetadata, listAll, ref } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import SecretKeyDialog from "../../components/SecretKeyDialog/SecretKeyDialog";
import CryptoJS from "crypto-js";

const generateRandomSecretKey = (length) => {
  const randomWordArray = CryptoJS.lib.WordArray.random(length);
  const randomString = CryptoJS.enc.Base64.stringify(randomWordArray);
  return randomString;
};

const DashboardPage = () => {
  const [currentUserFiles, setCurrentUserFiles] = useState([]);
  const [otherUsersFiles, setOtherUsersFiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(true);
  const { userData, handleSetSecretKey } = useContext(LoginContext);

  useEffect(() => {
    const userId = userData.uid;

    const checkEncryptionKeyGeneratedStatus = async () => {
      try {
        const docRef = doc(db, "encryptionKeys", userId);
        const docSnap = await getDoc(docRef);
        const encryptionKeyGenerated = docSnap.exists()
          ? docSnap.data().encryptionKeyGenerated
          : false;
        if (!encryptionKeyGenerated) {
          console.log("new user");
          const secretKey = generateRandomSecretKey(128);
          handleSetSecretKey(secretKey);
          await setDoc(docRef, {
            encryptionKeyGenerated: true,
          });
          console.log("Encryption key generated status updated successfully.");
        } else {
          handleSetSecretKey("");
          console.log("existing user");
        }
      } catch (error) {
        console.error(
          "Error getting/setting encryption key generated status: ",
          error
        );
      }
    };

    checkEncryptionKeyGeneratedStatus();
  }, []);

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

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const handleFetchFiles = () => {
    fetchAllFiles();
  };

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
    <>
      <SecretKeyDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
      />

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
        <FileUploader handleFetchFiles={handleFetchFiles} />

        <Grid container item direction="column" gap>
          <Typography variant="h4">Your Files</Typography>
          <FilesTable files={currentUserFiles} type="SELF" />
        </Grid>

        <Grid container item direction="column" gap>
          <Typography variant="h4">Files By Other Users</Typography>
          <FilesTable files={otherUsersFiles} type="OTHER_USERS" />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;
