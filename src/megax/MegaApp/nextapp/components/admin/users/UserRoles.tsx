"use client";

import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import EditIcon from "@mui/icons-material/Edit";
import {
  CheckboxButtonGroup,
  CheckboxElement,
  FormContainer,
  useForm,
  useFormContext,
} from "react-hook-form-mui";

export default function UserRoles() {
  const roles = [
    {
      id: 1,
      name: "SA",
    },
    { id: 2, name: "Admin" },
    { id: 3, name: "HR" },
    { id: 4, name: "Leader" },
    { id: 5, name: "BOD" },
  ];

  const formContext = useForm({
    defaultValues: [],
    values: { userRoles: [1, 3] },
  });

  const handleSave = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <div>
        <FormContainer formContext={formContext} onSuccess={handleSave}>
          <Card>
            <CardHeader
              title="Roles"
              action={
                <Button size="small" startIcon={<EditIcon />}>
                  Edit
                </Button>
              }
            />
            <CardContent>
              <CheckboxButtonGroup
                disabled={true}
                name="userRoles"
                options={roles.map(r => ({ id: r.id, label: r.name }))}
              />
            </CardContent>
            <CardActions className="bg-slate-100">
              <Button
                variant="contained"
                color="primary"
                className="px-8"
                type="submit"
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </FormContainer>
      </div>
    </>
  );
}
