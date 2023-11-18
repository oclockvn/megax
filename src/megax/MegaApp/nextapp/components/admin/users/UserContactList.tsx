"use client";

import { useContext, useReducer } from "react";
import dynamic from "next/dynamic";

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
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

import { useConfirm } from "material-ui-confirm";
import { Contact } from "@/lib/models/contact.model";
import { toast } from "react-hot-toast";
import { UserContext } from "@/components/contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import { deleteContact, createUpdateContact } from "@/lib/apis/user.api";
import { MagicMotion } from "react-magic-motion";

const UserContactForm = dynamic(() => import("./UserContactForm"));

type UserContactListState = {
  loading: boolean;
  showDrawer: boolean;
  contact: Partial<Contact> | null;
};

type Action = {
  type: "patch";
  payload: Partial<UserContactListState>;
};

function userContactListReducer(state: UserContactListState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case "patch":
      return {
        ...state,
        ...payload,
      } as UserContactListState;
  }
}

export default function UserContactList() {
  const confirmation = useConfirm();
  const { user, updateUser } = useContext(UserContext);
  const [state, dispatch] = useReducer(userContactListReducer, {
    contact: null,
    loading: false,
    showDrawer: false,
  } as UserContactListState);

  const deleteHandler = useMutation({
    mutationFn: (contactId: number) => deleteContact(user!.id!, contactId),
    onSuccess: ({ data: success }, contactId: number) => {
      if (success) {
        toast.success(`Contact was deleted successfully`);
        updateUser({
          contacts: user.contacts?.filter(c => c.id !== contactId) || [],
        });
      } else {
        toast.error(`Something went wrong but I'm too lazy to check`);
      }
    },
  });

  const handleDeleteContact = (contact: Contact) => {
    confirmation({
      title: "Are you sure?",
      description: `${contact.name} is about to be deleted?`,
      dialogProps: {
        maxWidth: "xs",
      },
    }).then(() => deleteHandler.mutateAsync(contact.id!));
  };

  const handleOpenContact = (contact: Partial<Contact>) => {
    if (contacts.length === 0) {
      contact.isPrimaryContact = true;
    }

    dispatch({
      type: "patch",
      payload: {
        contact,
        showDrawer: true,
        loading: false,
      },
    });
  };

  const handleCloseDrawer = () => {
    dispatch({
      type: "patch",
      payload: {
        showDrawer: false,
        loading: false,
      },
    });
  };

  const createUpdateHandler = useMutation({
    mutationFn: (contact: Partial<Contact>) =>
      createUpdateContact(user!.id!, contact),
    onSuccess: ({ success, data }, contact: Partial<Contact>) => {
      success
        ? toast.success("Contact saved successfully")
        : toast.error("Something went wrong");
      if (!success) {
        return;
      }

      handleCloseDrawer();

      const isUpdate = Number(contact.id) > 0;
      let contacts = user.contacts || [];

      if (isUpdate) {
        contacts =
          contacts.map(c =>
            c.id === data.id
              ? data
              : {
                  ...c,
                  isPrimaryContact: data.isPrimaryContact
                    ? false
                    : c.isPrimaryContact,
                }
          ) || [];
      } else {
        contacts = [data, ...contacts];
      }

      updateUser({
        contacts,
      });
    },
  });

  const handleSave = async (contact: Partial<Contact>) => {
    await createUpdateHandler.mutateAsync(contact);
  };

  const contacts = user?.contacts || [];

  const RenderRow = (contact: Contact) => (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell scope="row">
        <Button variant="text" onClick={() => handleOpenContact(contact)}>
          {contact.name}
        </Button>
        {contact.isPrimaryContact && (
          <Chip label="Primary" variant="filled" size="small" color="primary" />
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
  );

  return (
    <>
      <MagicMotion>
        <div>
          <TableContainer component={Paper} key="exclude">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Relationship</TableCell>
                  <TableCell align="right" width={100}>
                    <Button
                      variant="contained"
                      size="small"
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
                  <RenderRow key={contact.id} {...contact} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </MagicMotion>

      <Drawer
        anchor="right"
        open={state.showDrawer}
        onClose={handleCloseDrawer}
      >
        {state.contact && (
          <UserContactForm
            contact={state.contact!}
            loading={state.loading}
            handleClose={handleCloseDrawer}
            handleSave={handleSave}
          />
        )}
      </Drawer>
    </>
  );
}
