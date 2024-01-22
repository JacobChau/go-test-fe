import GenericTable, {
  ActionTableProps,
} from "@components/PaginationTable/GenericTable.tsx";
import GroupActions from "./components/GroupActions.tsx";
import { GroupColumns } from "@/pages/groups/components/GroupColumns.tsx";
import GroupService from "@/api/services/groupService.ts";
import { Alert, Snackbar } from "@mui/material";
import CreateGroupForm from "@/pages/groups/components/CreateGroupForm.tsx";
import { useFetchData } from "@/hooks";
import { SearchColumn } from "@components/Search/SearchComponent.tsx";
import { CreateGroupParams, GroupAttributes } from "@/types/apis/groupTypes.ts";
import { initialPagination } from "@/config";

const GroupSearchColumn: SearchColumn[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];

const GroupList = () => {
  const {
    items: groups,
    fetchData: fetchGroups,
    loading,
    setLoading,
    error,
    setError,
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearchTermChange,
    searchTerm,
    handleSearchChange,
    searchCriteria,
  } = useFetchData<GroupAttributes>(
    GroupService.getGroups,
    initialPagination,
    GroupSearchColumn[0],
  );

  const handleGroupDeleted = async (_id: string) => {
    setLoading(true);
    try {
      await GroupService.deleteGroup(_id);

      fetchGroups();
    } catch (error) {
      console.error("Failed to delete group:", error);
      setError("Failed to delete group");
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSaved = async (newGroup: CreateGroupParams) => {
    setLoading(true);
    await GroupService.createGroup(newGroup);
    fetchGroups();
  };

  const handleGroupUpdated = async (
    _id: string,
    updatedGroup: GroupAttributes,
  ) => {
    setLoading(true);
    try {
      await GroupService.updateGroup(_id, updatedGroup);

      fetchGroups();
    } catch (error) {
      console.error("Failed to update group:", error);
      setError("Failed to update group");
    } finally {
      setLoading(false);
    }
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
      <GenericTable
        title="Group List"
        description="List of groups with details"
        columns={GroupColumns}
        data={groups}
        actions={(props: ActionTableProps) => <GroupActions {...props} />}
        onSaved={handleGroupSaved}
        onUpdated={handleGroupUpdated}
        onDeleted={handleGroupDeleted}
        page={pagination.page}
        totalRows={pagination.total}
        rowsPerPage={pagination.perPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        FormComponent={CreateGroupForm}
        loading={loading}
        onSearch={handleSearchChange}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        searchColumn={GroupSearchColumn}
        searchCriteria={searchCriteria}
      />
    </>
  );
};

export default GroupList;
