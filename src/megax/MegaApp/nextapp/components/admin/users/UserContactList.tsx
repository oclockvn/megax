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
import { Contact } from "@/lib/models/contact.model";
import { useState } from "react";
import Button from "@mui/material/Button";
import UserContactForm from "./UserContactForm";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { createUpdateContactThunk, deleteContactThunk, setLoading } from "@/lib/store/users.state";
import { toast } from "react-hot-toast";
import Chip from "@mui/material/Chip";

export default function UserContactList() {
  const confirmation = useConfirm();
  const { user, loading } = useAppSelector(u => u.users);
  const appDispatch = useAppDispatch();

  const [showDrawer, setShowDrawer] = useState(false);
  const [contact, setContact] = useState<Partial<Contact> | null>(null);
  const contacts = user?.contacts || [];

  const handleDeleteContact = (contact: Contact) => {
    confirmation({
      title: "Are you sure?",
      description: `${contact.name} is about to be deleted?`,
      dialogProps: {
        maxWidth: "xs",
      },
    })
      .then(() => {
        appDispatch(deleteContactThunk({ id: user!.id!, contactId: contact!.id! }))
      })
      .catch(() => {
        /* ignore */
      });
  };

  const handleOpenContact = (contact: Partial<Contact>) => {
    if (contacts.length === 0) {
      contact.isPrimaryContact = true;
    }

    setContact(contact);
    setShowDrawer(true);
    appDispatch(setLoading({ loading: false }));
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    appDispatch(setLoading({ loading: false }));
  }

  const handleSave = (contact: Partial<Contact | null>) => {
    const resp = appDispatch(
      createUpdateContactThunk({ id: user?.id || 0, contact })
    ).unwrap();

    resp.then(result => {
      result.success
        ? toast.success("Contact saved successfully")
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
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Relationship</TableCell>
              <TableCell align="right" width={100}>
                <Button
                  variant="outlined"
                  size="small"
                  className="bg-blue-500 text-white hover:!bg-blue-600"
                  onClick={() => handleOpenContact({})}
                >
                  <AddIcon fontSize="inherit" className="me-2" />
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(contact => (
              <TableRow
                key={contact.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">
                  <Button
                    variant="text"
                    onClick={() => handleOpenContact(contact)}
                  >
                    {contact.name}
                  </Button>
                  {contact.isPrimaryContact && (
                    <Chip
                      label="Primary"
                      variant="filled"
                      size="small"
                      color="primary"
                    />
                  )}
                </TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.relationship}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteContact(contact)}
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
        {contact && (
          <UserContactForm
            contact={contact!}
            loading={loading}
            handleClose={handleCloseDrawer}
            handleSave={handleSave}
          />
        )}
      </Drawer>
    </>
  );
}
