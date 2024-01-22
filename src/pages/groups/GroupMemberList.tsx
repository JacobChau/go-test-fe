import GenericTable, {
  ActionTableProps,
} from "@components/PaginationTable/GenericTable.tsx";
import { UserColumns } from "@/pages/users/components/UserColumns.tsx";
import { Alert, Button, Snackbar } from "@mui/material";
import { useFetchData } from "@/hooks";
import { UserSearchColumn } from "@/pages/users/UserList.tsx";
import GroupMemberActions from "@/pages/groups/components/GroupMemberActions.tsx";
import { initialPagination } from "@/config";
import GroupService from "@/api/services/groupService.ts";
import { AddMembersParams, GroupAttributes } from "@/types/apis/groupTypes.ts";
import { useNavigate, useParams } from "react-router-dom";
import { AddMemberForm } from "@/pages/groups/components";

const GroupMemberList = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    items: users,
    fetchData,
    searchTerm,
    searchCriteria,
    handleSearchTermChange,
    handleSearchChange,
    loading,
    setLoading,
    error,
    setError,
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
  } = useFetchData<GroupAttributes>(
    GroupService.getMembers,
    initialPagination,
    UserSearchColumn[0],
    id,
  );

  const handleMemberRemoved = async (userId: string) => {
    setLoading(true);
    try {
      if (id) {
        await GroupService.removeMember(id, userId);
      }
    } catch (error) {
      setError("Failed to remove member");
    } finally {
      setLoading(false);
    }

    fetchData();
  };

  const handleMemberAdded = async (data: AddMembersParams) => {
    setLoading(true);
    try {
      if (id) {
        await GroupService.addMembers(id, data);
      }
    } catch (error) {
      setError("Failed to add member");
    } finally {
      setLoading(false);
    }

    fetchData();
  };

  return (
    <>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <Button
        variant="contained"
        onClick={() => navigate(`/groups`)}
        sx={{ mb: 2 }}
      >
        Back to Group
      </Button>
      <GenericTable
        title="Group Members"
        description="List of group members"
        columns={UserColumns}
        searchColumn={UserSearchColumn}
        data={users}
        actions={(props: ActionTableProps) => <GroupMemberActions {...props} />}
        onSaved={handleMemberAdded}
        onDeleted={handleMemberRemoved}
        page={pagination.page}
        totalRows={pagination.total}
        rowsPerPage={pagination.perPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        FormComponent={AddMemberForm}
        loading={loading}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        onSearch={handleSearchChange}
        searchCriteria={searchCriteria}
      />
    </>
  );
};

export default GroupMemberList;
