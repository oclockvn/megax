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
import { useEffect, useRef, useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import Button from "@mui/material/Button";
import UserContactForm from "./UserContactForm";
import { Result } from "@/lib/models/common.model";

export default function UserContactList() {
  const confirmation = useConfirm();
  const [showDrawer, setShowDrawer] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);

  const rows = JSON.parse(`[{
    "id": 1,
    "name": "Marion Gaish",
    "phone": "613-272-7051",
    "email": "mgaish0@ycombinator.com",
    "dob": "Female",
    "address": "Room 1497"
  }, {
    "id": 2,
    "name": "Jason Cornwall",
    "phone": "650-484-6304",
    "email": "jcornwall1@exblog.jp",
    "dob": "Male",
    "address": "Room 551"
  }, {
    "id": 3,
    "name": "Vilhelmina Barnshaw",
    "phone": "303-449-8846",
    "email": "vbarnshaw2@sina.com.cn",
    "dob": "Female",
    "address": "9th Floor"
  }, {
    "id": 4,
    "name": "Kinny Seedull",
    "phone": "773-288-0759",
    "email": "kseedull3@qq.com",
    "dob": "Male",
    "address": "Suite 82"
  }, {
    "id": 5,
    "name": "Myrle Keniwell",
    "phone": "134-627-4461",
    "email": "mkeniwell4@ebay.com",
    "dob": "Female",
    "address": "Apt 750"
  }, {
    "id": 6,
    "name": "Damiano Hartus",
    "phone": "564-825-2248",
    "email": "dhartus5@wired.com",
    "dob": "Male",
    "address": "Apt 716"
  }, {
    "id": 7,
    "name": "Thayne Kagan",
    "phone": "485-534-9425",
    "email": "tkagan6@psu.edu",
    "dob": "Male",
    "address": "Room 312"
  }, {
    "id": 8,
    "name": "Berte Castello",
    "phone": "323-421-7418",
    "email": "bcastello7@tripod.com",
    "dob": "Female",
    "address": "9th Floor"
  }, {
    "id": 9,
    "name": "Verile Fallowes",
    "phone": "635-683-8210",
    "email": "vfallowes8@indiegogo.com",
    "dob": "Female",
    "address": "Apt 79"
  }, {
    "id": 10,
    "name": "Yovonnda Kenneway",
    "phone": "948-423-5409",
    "email": "ykenneway9@yelp.com",
    "dob": "Female",
    "address": "10th Floor"
  }]`);

  const handleDeleteContact = (contact: Contact) => {
    confirmation({
      title: "Are you sure?",
      description: `${contact.name} is about to be deleted?`,
      dialogProps: {
        maxWidth: "xs",
      },
    })
      .then(() => {
        console.log("Handle delete");
      })
      .catch(() => {
        /* ignore */
      });
  };

  const handleOpenContact = (contact: Contact) => {
    setContact(contact);
    setShowDrawer(true);
  };

  const handleSave = (contact: Contact) => {
    const result: Result<Contact> = {
      code: "",
      data: contact,
      success: true,
    };

    return Promise.resolve(result);
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
                <Button variant="outlined" size="small" className="bg-blue-500 text-white hover:!bg-blue-600">
                  <AddIcon fontSize="inherit" className="me-2" />
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">
                  <Button variant="text" onClick={() => handleOpenContact(row)}>
                    {row.name}
                  </Button>
                </TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>Relationship</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteContact(row)}
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
            handleClose={() => setShowDrawer(false)}
            handleSave={contact => handleSave(contact)}
          />
        )}
      </Drawer>
    </>
  );
}
