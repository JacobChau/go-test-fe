import GenericTable, {
  ActionTableProps,
} from "@components/PaginationTable/GenericTable.tsx";
import { Alert, Snackbar } from "@mui/material";
import { SearchColumn } from "@components/Search/SearchComponent.tsx";
import { initialPagination } from "@/config";
import { AssessmentAttributes } from "@/types/apis/assessmentTypes.ts";
import AssessmentService from "@/api/services/assessmentService.ts";
import { useFetchData } from "@/hooks";
import {
  AssessmentAction,
  AssessmentColumn,
} from "@/pages/assessments/components";

const TestSearchColumn: SearchColumn[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];

const AssessmentList = () => {
  const {
    items: tests,
    fetchData: fetchTests,
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
  } = useFetchData<AssessmentAttributes>(
    AssessmentService.getAssessments,
    initialPagination,
    TestSearchColumn[0],
  );

  const handleTestDeleted = async (_id: string) => {
    setLoading(true);
    try {
      await AssessmentService.deleteAssessment(_id);

      fetchTests();
    } catch (error) {
      console.error("Failed to delete test:", error);
      setError("Failed to delete test");
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
        title="Test List"
        description="List of tests with details"
        columns={AssessmentColumn}
        data={tests}
        actions={(props: ActionTableProps) => <AssessmentAction {...props} />}
        onDeleted={handleTestDeleted}
        page={pagination.page}
        totalRows={pagination.total}
        rowsPerPage={pagination.perPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        loading={loading}
        onSearch={handleSearchChange}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        searchColumn={TestSearchColumn}
        searchCriteria={searchCriteria}
      />
    </>
  );
};

export default AssessmentList;
