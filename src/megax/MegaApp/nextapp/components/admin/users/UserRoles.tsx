"use client";

import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import EditIcon from "@mui/icons-material/Edit";
import {
  CheckboxButtonGroup,
  FormContainer,
  useForm,
} from "react-hook-form-mui";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/lib/apis/role.api";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { updateUserRolesThunk } from "@/lib/store/users.state";
import toast from "react-hot-toast";

type UserRoleFormType = {
  userRoles: number[];
};

export default function UserRoles() {
  const appDispatch = useAppDispatch();
  const { user, loading } = useAppSelector(s => s.users);
  const { id, roles: userRoles } = user || { id: 0, roles: [] };

  const { data: allRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
    staleTime: 1000 * 10 * 60, // 10 minutes
  });

  const formContext = useForm({
    values: { userRoles: userRoles?.map(r => r.roleId) || [] },
  });

  const handleSave = async (data: UserRoleFormType) => {
    const result = await appDispatch(
      updateUserRolesThunk({ id: id || 0, roles: data.userRoles })
    ).unwrap();
    if (result.success) {
      toast.success("Updated successfully");
    }
  };

  return (
    <>
      <div>
        <FormContainer formContext={formContext} onSuccess={handleSave}>
          <Card>
            <CardHeader title="Roles" />
            <CardContent className="pt-0">
              <CheckboxButtonGroup
                name="userRoles"
                options={
                  allRoles?.map(r => ({ id: r.id, label: r.name })) || []
                }
              />
            </CardContent>
            <CardActions className="bg-slate-100">
              <Button
                variant="contained"
                color="primary"
                className="px-8"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </CardActions>
          </Card>
        </FormContainer>
      </div>
    </>
  );
}
