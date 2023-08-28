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
import {/* createUpdateDocumentThunk, deleteDocumentThunk,*/ setLoading } from "@/lib/store/users.state";
import { toast } from "react-hot-toast";
import Chip from "@mui/material/Chip";

export default function UserDocumentList() {
  const confirmation = useConfirm();
  const { user, loading } = useAppSelector(u => u.users);
  const appDispatch = useAppDispatch();

  const [showDrawer, setShowDrawer] = useState(false);
  const [document, setDocument] = useState<Partial<UserDocument> | null>(null);
  // const documents = user?.documents || []
  const documents = JSON.parse(`[{
    "id": 1,
    "documentType": "CMND",
    "issueDate": "14/01/2023",
    "documentNumber": "60-577-0792",
    "issuePlace": "Oborniki Śląskie",
    "issueBy": "Mackinac Island Airport"
  }, {
    "id": 2,
    "documentType": "CMND",
    "issueDate": "19/07/2023",
    "documentNumber": "14-036-4255",
    "issuePlace": "Woshui",
    "issueBy": "Camocim Airport"
  }, {
    "id": 3,
    "documentType": "CCCD",
    "issueDate": "05/08/2023",
    "documentNumber": "16-912-5132",
    "issuePlace": "Siteía",
    "issueBy": "Morafenobe Airport"
  }, {
    "id": 4,
    "documentType": "CCCD",
    "issueDate": "29/07/2023",
    "documentNumber": "48-327-4776",
    "issuePlace": "Banjar Petak",
    "issueBy": "Biggs Army Air Field (Fort Bliss)"
  }, {
    "id": 5,
    "documentType": "CCCD",
    "issueDate": "27/05/2023",
    "documentNumber": "89-893-9258",
    "issuePlace": "Batambak",
    "issueBy": "Narvik Framnes Airport"
  }]
  `);

  const handleDeleteDocument = (document: UserDocument) => {
    confirmation({
      title: "Are you sure?",
      description: `Document# ${document.documentNumber} is about to be deleted?`,
      dialogProps: {
        maxWidth: "xs",
      },
    })
      .then(() => {
        // appDispatch(deleteDocumentThunk({ id: user!.id!, contactId: document!.id! }))
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
  }

  const handleSave = (document: Partial<UserDocument | null>) => {
    // const resp = appDispatch(
    //   createUpdateDocumentThunk({ id: user?.id || 0, document })
    // ).unwrap();

    // resp.then(result => {
    //   result.success
    //     ? toast.success("Document saved successfully")
    //     : toast.error("Something went wrong");

    //   if (result.success) {
    //     handleCloseDrawer();
    //   }
    // });
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
            {documents.map((document: any) => (
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
                <TableCell>Issue date</TableCell>
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
