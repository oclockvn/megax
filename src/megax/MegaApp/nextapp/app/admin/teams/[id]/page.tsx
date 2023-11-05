"use client";

import React, { useEffect } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchTeamThunk } from "@/lib/store/teams.state";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ToggleButton from "@mui/material/ToggleButton";
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import FormControlLabel from "@mui/material/FormControlLabel";
import RemoveIcon from "@mui/icons-material/Remove";
import UserSelector from "@/components/common/UserSelector";

export default function TeamDetailPage({ params }: { params: { id: number } }) {
  const pathname = usePathname();
  const appDispatch = useAppDispatch();
  const { current, loading } = useAppSelector(s => s.teams);

  useEffect(() => {
    appDispatch(fetchTeamThunk(params.id));
  }, [params.id]);

  return (
    <>
      <div role="presentation" className="bg-blue-200 py-2 px-6">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            href={`${pathname}/..`}
            className="text-blue-500 flex items-center"
          >
            <ArrowBackIcon className="mr-2" />
            Teams
          </Link>
          <div>{current?.name || "..."}</div>
        </Breadcrumbs>
      </div>

      <div className="container mx-auto py-4">
        <Card className="max-w-[800px] mx-auto">
          <CardHeader title="Team detail" />
          <CardContent>
            <FormContainer>
              <TextFieldElement
                name="name"
                fullWidth
                required
                label="Team name"
              />

              <div className="mt-4">
                <UserSelector />
              </div>

              <List
                className="border border-gray-200 rounded mt-4 overflow-hidden"
                subheader={<ListSubheader>Members</ListSubheader>}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => (
                  <ListItem
                    key={i}
                    className="border-t border-gray-300"
                    secondaryAction={
                      <div>
                        <FormControlLabel
                          label="Leader"
                          control={
                            <Checkbox
                              icon={<RemoveIcon />}
                              checkedIcon={<CheckIcon />}
                            />
                          }
                        />
                      </div>
                    }
                  >
                    <ListItemIcon>
                      <Avatar children={"QP"} sizes={"32px"} />
                    </ListItemIcon>
                    <ListItemText children="Quang Phan" />
                  </ListItem>
                ))}
              </List>
            </FormContainer>
          </CardContent>
          <CardActions className="bg-blue-50">
            <Button variant="contained" color="primary" className="px-8">
              Save
            </Button>
          </CardActions>
        </Card>
      </div>
    </>
  );
}
