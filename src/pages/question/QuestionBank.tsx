import {QuestionAttributes} from "@/types/apis";
import QuestionService from "@/api/services/questionService.ts";
import {Alert, Snackbar} from "@mui/material";
import {GenericTable} from "@components/PaginationTable";
import {QuestionActions, QuestionColumns, QuestionSearchColumn} from "@/pages/question/components";
import {ActionTableProps} from "@components/PaginationTable/GenericTable.tsx";
import QuestionFilters from "@/pages/question/components/QuestionFilters.tsx";
import {useNavigate} from "react-router-dom";
import {useFetchData} from "@/hooks";
import {initialPagination} from "@/config";

const QuestionListPage = () => {
    const navigate = useNavigate();

    const {items: questions, searchTerm, filters, searchCriteria, handleSearchTermChange, handleSearchChange, loading, setLoading, error, setError, pagination, handlePageChange, handleRowsPerPageChange, handleFilterChange} =
        useFetchData<QuestionAttributes>(QuestionService.getQuestions, initialPagination, QuestionSearchColumn[0]);

    const handleQuestionDeleted = async (_id: string) => {
        setLoading(true);
        try {
            await QuestionService.deleteQuestion(_id);
        } catch (error) {
            console.error('Failed to delete question:', error);
            setError('Failed to delete question');
        } finally {
            setLoading(false);
        }
    };

    const onAddNewRecordClick = () => {
        navigate('/questions/create');
    }

    return (
        <>
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
            <GenericTable
                title="Question List"
                description="List of questions with details"
                columns={QuestionColumns}
                data={questions}
                actions={(props: ActionTableProps) => (
                    <QuestionActions
                        {...props}
                    />
                )}
                onDeleted={handleQuestionDeleted}
                page={pagination.page}
                totalRows={pagination.total}
                rowsPerPage={pagination.perPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                loading={loading}
                onSearch={handleSearchChange}
                searchTerm={searchTerm}
                onSearchTermChange={handleSearchTermChange}
                searchCriteria={searchCriteria}
                searchColumn={QuestionSearchColumn}
                onAddNewRecord={onAddNewRecordClick}
                renderFilterComponent={() => (
                    <QuestionFilters
                        onChange={handleFilterChange}
                        filters={filters}
                        />
                )}
            />
        </>
    );
}

export default QuestionListPage;
