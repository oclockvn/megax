"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useConfirm } from "material-ui-confirm";
import { Document as UserDocument } from "@/lib/models/document.model";
import { useState } from "react";
import Button from "@mui/material/Button";
import UserDocumentForm from "./UserDocumentForm";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import {
  createUpdateDocumentThunk,
  deleteDocumentThunk,
  setLoading,
} from "@/lib/store/users.state";
import { toast } from "react-hot-toast";
import datetime from "@/lib/datetime";

export default function UserDocumentList() {
  const confirmation = useConfirm();
  const { user, loading } = useAppSelector(u => u.users);
  const appDispatch = useAppDispatch();

  const [showDrawer, setShowDrawer] = useState(false);
  const [document, setDocument] = useState<Partial<UserDocument> | null>(null);
  const documents = user?.documents || [];

  const handleDeleteDocument = (document: UserDocument) => {
    confirmation({
      title: "Are you sure?",
      description: `Document# ${document.documentNumber} is about to be deleted?`,
      dialogProps: {
        maxWidth: "xs",
      },
    })
      .then(() => {
        const result = appDispatch(
          deleteDocumentThunk({ id: user!.id!, documentId: document!.id! })
        ).unwrap();

        result.then(res => {
          res.success
            ? toast.success("Document deleted successfully")
            : toast.error(`Something went wrong but I'm too lazy to check`);
        });
      })
      .catch(() => {
        /* ignore */
      });
  };

  const handleOpenDocument = (contact: Partial<UserDocument>) => {
    setDocument(contact);
    setShowDrawer(true);
    appDispatch(setLoading({ loading: false }));
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    appDispatch(setLoading({ loading: false }));
  };

  const handleSave = (document: Partial<UserDocument | null>) => {
    const resp = appDispatch(
      createUpdateDocumentThunk({ id: user?.id || 0, document })
    ).unwrap();

    resp.then(result => {
      result.success
        ? toast.success("Document saved successfully")
        : toast.error("Something went wrong");

      if (result.success) {
        handleCloseDrawer();
      }
    });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Document</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell align="right" width={100}>
                <Button
                  variant="outlined"
                  size="small"
                  className="bg-blue-500 text-white hover:!bg-blue-600"
                  onClick={() => handleOpenDocument({})}
                >
                  <AddIcon fontSize="inherit" className="me-2" />
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map(document => (
              <TableRow
                key={document.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">
                  <Button
                    variant="text"
                    onClick={() => handleOpenDocument(document)}
                  >
                    {document.documentNumber}
                  </Button>
                </TableCell>
                <TableCell>{document.documentType}</TableCell>
                <TableCell>
                  {document.issueDate &&
                    datetime.formatDate(document.issueDate, "dd/MM/yyyy")}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteDocument(document)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer anchor="right" open={showDrawer}>
        {document && (
          <UserDocumentForm
            document={document!}
            loading={loading}
            handleClose={handleCloseDrawer}
            handleSave={handleSave}
          />
        )}
      </Drawer>
    </>
  );
}
