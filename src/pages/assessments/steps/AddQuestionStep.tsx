import {
  AssessmentQuestionAttributes,
  Identity,
  QuestionAttributes,
} from "@/types/apis";
import QuestionService from "@/api/services/questionService.ts";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import QuestionFilters from "@/pages/question/components/QuestionFilters.tsx";
import { useFetchData } from "@/hooks";
import BlankCard from "@components/Card/BlankCard.tsx";
import {
  CreateOrUpdateQuestion,
  QuestionColumns,
  QuestionSearchColumn,
} from "@/pages/question/components";
import { ActionTable } from "@components/PaginationTable";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import SearchComponent from "@components/Search/SearchComponent.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import PageContainer from "@components/Container/PageContainer.tsx";
import { initialPagination } from "@/config";

interface AddQuestionStepProps {
  selectedQuestions: Map<number, AssessmentQuestionAttributes & Identity>;
  setSelectedQuestions: React.Dispatch<
    React.SetStateAction<Map<number, AssessmentQuestionAttributes & Identity>>
  >;
}

const AddQuestionStep: FC<AddQuestionStepProps> = ({
  selectedQuestions,
  setSelectedQuestions,
}) => {
  const {
    items: questions,
    searchTerm,
    fetchData: fetchQuestions,
    filters,
    searchCriteria,
    handleSearchTermChange,
    handleSearchChange,
    loading,
    error,
    setError,
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
    handleFilterChange,
  } = useFetchData<QuestionAttributes>(
    QuestionService.getQuestions,
    initialPagination,
    QuestionSearchColumn[0],
  );

  const [isCreateOrUpdateVisible, setIsCreateOrUpdateVisible] = useState(false);
  const createOrUpdateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCreateOrUpdateVisible && createOrUpdateRef.current) {
      setTimeout(() => {
        createOrUpdateRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [isCreateOrUpdateVisible]);

  const toggleCreateOrUpdateVisibility = () => {
    setIsCreateOrUpdateVisible(!isCreateOrUpdateVisible);
  };

  const handleSelectQuestion = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>,
    question: QuestionAttributes & Identity,
  ) => {
    event.stopPropagation();
    setSelectedQuestions((prevSelected) => {
      const newSelected = new Map(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.set(id, {
          id: Number(question.id),
          content: question.content,
          type: question.type,
          order: null,
        });
      }
      return newSelected;
    });
  };

  const handleSelectAllQuestions = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedQuestions((prevSelected) => {
      const newSelected = new Map(prevSelected);
      if (event.target.checked) {
        questions.forEach((question) => {
          newSelected.set(Number(question.id), {
            id: question.id,
            content: question.content,
            type: question.type,
            order: null,
          });
        });
      } else {
        questions.forEach((question) => {
          newSelected.delete(Number(question.id));
        });
      }
      return newSelected;
    });
  };

  const isQuestionSelected = useMemo(
    () => (id: number) => selectedQuestions.has(id),
    [selectedQuestions],
  );

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
      <PageContainer
        title={"Add Questions to Test"}
        description={"Add questions to test"}
      >
        <ParentCard title={"Add Questions to Test"}>
          <BlankCard>
            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  zIndex: 10,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <Grid container sx={{ marginBottom: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                  Filter
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <QuestionFilters
                  filters={filters}
                  onChange={handleFilterChange}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ marginBottom: 2 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                  Search
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: 1 }}>
                <SearchComponent
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  searchColumn={QuestionSearchColumn}
                  searchCriteria={searchCriteria}
                  onSearchTermChange={handleSearchTermChange}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ marginBottom: 2, alignItems: "center" }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Selected Questions:</Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  {selectedQuestions.size} question(s) selected
                </Typography>
                <Box
                  sx={{
                    maxHeight: "8em",
                    overflowY: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5em",
                  }}
                >
                  {Array.from(selectedQuestions.values()).map(
                    (question, index) => (
                      <Chip
                        key={index}
                        label={
                          question.id + ". " + question.content.slice(0, 45)
                        }
                        color="primary"
                        variant="outlined"
                      />
                    ),
                  )}
                </Box>
              </Grid>
            </Grid>
            <Grid
              container
              sx={{ marginBottom: 2, alignItems: "center" }}
            ></Grid>
            <TableContainer sx={{ position: "relative" }}>
              <Table aria-label={"question-bank"}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ p: "0.5rem" }}>
                      <Checkbox
                        indeterminate={
                          selectedQuestions.size > 0 &&
                          selectedQuestions.size < questions.length
                        }
                        checked={
                          questions.length > 0 &&
                          selectedQuestions.size === questions.length
                        }
                        onChange={handleSelectAllQuestions}
                        inputProps={{ "aria-label": "select all questions" }}
                      />
                    </TableCell>
                    {QuestionColumns.map((column, index) => (
                      <TableCell key={index} sx={column.sx}>
                        <Typography variant="h6">{column.label}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={QuestionColumns.length + 1}>
                        <Typography
                          variant="body1"
                          sx={{ textAlign: "center" }}
                        >
                          No data found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell padding="checkbox" sx={{ p: "0.5rem" }}>
                        <Checkbox
                          checked={isQuestionSelected(Number(question.id))}
                          onChange={(event) =>
                            handleSelectQuestion(+question.id, event, question)
                          }
                          inputProps={{ "aria-label": "select question" }}
                        />
                      </TableCell>
                      {QuestionColumns.map((column, index) => (
                        <TableCell key={index} sx={column.sx}>
                          {column.render
                            ? column.render(question)
                            : // @ts-ignore
                              question[column.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: 999999 },
                      ]}
                      colSpan={QuestionColumns.length + 1}
                      count={pagination.total}
                      rowsPerPage={pagination.perPage}
                      page={pagination.page}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      ActionsComponent={ActionTable}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            <Box sx={{ my: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={toggleCreateOrUpdateVisibility}
              >
                {isCreateOrUpdateVisible
                  ? "Hide create Question"
                  : "You can also create a new question here"}
              </Button>
            </Box>
            <Collapse in={isCreateOrUpdateVisible} ref={createOrUpdateRef}>
              <CreateOrUpdateQuestion
                setSelectedQuestions={setSelectedQuestions}
                fetchQuestions={fetchQuestions}
              />
            </Collapse>{" "}
          </BlankCard>
        </ParentCard>
      </PageContainer>
    </>
  );
};

export default AddQuestionStep;
