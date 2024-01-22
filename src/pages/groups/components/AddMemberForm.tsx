import React, { FC, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Pagination,
  Box,
  PaginationItem,
  ListItemButton,
  Avatar,
} from "@mui/material";
import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import { AddMembersParams, UserAttributes } from "@/types/apis";
import { useFetchData } from "@/hooks";
import UserService from "@/api/services/userService.ts";
import { initialPagination } from "@/config";
import { SearchColumn } from "@components/Search/SearchComponent.tsx";
import { useParams } from "react-router-dom";

const AddMemberSearchColumn: SearchColumn[] = [
  { key: "name,email", label: "Name or Email" },
];

interface AddMemberFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AddMembersParams) => void;
}

const AddMemberFormSchema = Yup.object().shape({
  memberIds: Yup.array().of(Yup.string().required("Required")),
});

const AddMemberForm: FC<AddMemberFormProps> = ({ open, onClose, onSave }) => {
  const { id } = useParams<{ id: string }>();

  console.log("id", id);
  console.log("open", open);

  const {
    items: users,
    fetchData,
    handleSearchTermChange,
    searchTerm,
    loading,
    pagination,
    handlePageChange,
  } = useFetchData<UserAttributes>(
    UserService.getUsersNotInGroup,
    initialPagination,
    AddMemberSearchColumn[0],
    id,
  );

  useEffect(() => {
    if (open) {
      handleSearchTermChange("");
      fetchData();
    }
  }, [open]);

  const initialFormValues = {
    memberIds: [],
  };

  const onSubmit = (values: AddMembersParams) => {
    onSave(values);
    onClose();
  };

  const handleMaterialUIPageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    handlePageChange(event, page - 1);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Members</DialogTitle>
      <Formik
        initialValues={initialFormValues}
        validationSchema={AddMemberFormSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values, setFieldValue }) => {
          const handleClick = async (event: any, userId: string) => {
            event.preventDefault();
            event.stopPropagation();
            const newMemberIds = values.memberIds.includes(userId as never)
              ? values.memberIds.filter((id) => id !== userId) // Remove userId
              : [...values.memberIds, userId]; // Add userId

            await setFieldValue("memberIds", newMemberIds);
          };

          return (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent
                sx={{ pb: 0, position: "relative", minHeight: 400 }}
              >
                <TextField
                  fullWidth
                  sx={{ mb: 2 }}
                  placeholder="Search by name or email"
                  onChange={(e) => handleSearchTermChange(e.target.value)}
                  value={searchTerm}
                />
                {loading ? (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      zIndex: 10,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <List>
                    <FieldArray
                      name="memberIds"
                      render={() =>
                        users.map((user) => (
                          <ListItem
                            key={user.id}
                            sx={{
                              p: 0,
                              border: "1px solid #ccc",
                              borderRadius: 1,
                              mb: 1,
                            }}
                            onClick={(event) => handleClick(event, user.id)}
                          >
                            <ListItemButton sx={{ py: 1, px: 2 }}>
                              <Avatar
                                src={user.avatar}
                                alt={`${user.name}`}
                                sx={{ marginRight: 2, width: 30, height: 30 }}
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.memberIds.includes(
                                      user.id as never,
                                    )}
                                  />
                                }
                                label={`${user.name} (${user.email})`}
                                style={{ width: "100%" }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))
                      }
                    />
                  </List>
                )}
              </DialogContent>
              <Box display="flex" justifyContent="center" mt={1}>
                <Pagination
                  page={pagination.page + 1}
                  count={Math.ceil(pagination.total / pagination.perPage)}
                  onChange={handleMaterialUIPageChange}
                  renderItem={(item) => (
                    <PaginationItem
                      {...item}
                      disabled={
                        users.length === 0 ||
                        (item.type === "previous" && pagination.page === 0) ||
                        (item.type === "next" &&
                          pagination.page ===
                            Math.ceil(pagination.total / pagination.perPage) -
                              1)
                      }
                    />
                  )}
                />
              </Box>
              <DialogActions>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default AddMemberForm;
