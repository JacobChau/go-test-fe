import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Grid,
  Pagination,
  PaginationItem,
  Skeleton,
  Typography,
} from "@mui/material";
import { AssessmentResultPayload } from "@/types/apis/assessmentTypes.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store.ts";
import { clearMessage, setMessageWithTimeout } from "@/stores/messageSlice.ts";
import { AssessmentResultCard } from "@/pages/assessments/components";
import { Resource } from "@/types/apis";
import PageContainer from "@components/Container/PageContainer.tsx";
import { ParentCard } from "@components/Card";
import AssessmentService from "@/api/services/assessmentService.ts";

const AssessmentResultPagination: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [results, setResults] = useState<Resource<AssessmentResultPayload>[]>(
    [],
  );
  const resultsPerPage = 12;

  const [loading, setLoading] = useState<boolean>(true);
  const { message, isError } = useSelector((state: RootState) => state.message);

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(-1);

  const fetchAssessmentResults = useCallback(async () => {
    setLoading(true);
    try {
      console.log("page", page);
      const { data, meta } = await AssessmentService.getAssessmentResults({
        page,
        perPage: resultsPerPage,
      });
      setResults(data);
      if (meta) {
        setTotal(meta.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    },
    [],
  );

  useEffect(() => {
    fetchAssessmentResults().catch((err) => {
      dispatch(setMessageWithTimeout({ message: err.message, isError: true }));
    });
  }, [fetchAssessmentResults, dispatch, page]);

  const handleSelectAssessment = (assessmentId: string, attemptId: string) => {
    navigate(`/tests/${assessmentId}/results/${attemptId}`, {
      state: { assessmentId, attemptId },
    });
  };

  return (
    <PageContainer
      title={"Assessments Results"}
      description={"List of all assessments results"}
    >
      <ParentCard title={"Assessments Results"}>
        <>
          {message && (
            <Box
              sx={{
                position: "fixed",
                bottom: "0",
                left: "0",
                zIndex: 9999,
                opacity: 1,
                width: "100%",
                height: "100%",
                "& > * + *": {
                  mt: 2,
                },
              }}
            >
              <Alert
                severity={isError ? "error" : "success"}
                sx={{
                  zIndex: 9999,
                  position: "absolute",
                  left: "50%",
                  top: "80%",
                  transform: "translateX(-50%) translateY(-50%)",
                }}
                onClose={() => dispatch(clearMessage())}
              >
                {message}
              </Alert>
            </Box>
          )}

          <Box sx={{ position: "relative" }}>
            {loading ? (
              <Grid container spacing={1}>
                {Array.from(new Array(resultsPerPage)).map((_, index) => (
                  <Grid item key={index} xs={6} sm={4} md={3}>
                    <Skeleton variant="rectangular" height={118} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Grid>
                ))}
              </Grid>
            ) : results.length > 0 ? (
              <Grid container spacing={1}>
                {results.map((assessment) => (
                  <Grid item key={assessment.id} xs={6} sm={4} md={3}>
                    <AssessmentResultCard
                      assessmentResult={assessment}
                      onSelect={handleSelectAssessment}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="h6" textAlign="center">
                No assessments available.
              </Typography>
            )}

            {!loading && (
              <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                  count={Math.ceil(total / resultsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  renderItem={(item) => (
                    <PaginationItem
                      {...item}
                      disabled={
                        results.length === 0 ||
                        (item.type === "previous" && page === 1) ||
                        (item.type === "next" &&
                          page === Math.ceil(total / resultsPerPage))
                      }
                    />
                  )}
                />
              </Box>
            )}
          </Box>
        </>
      </ParentCard>
    </PageContainer>
  );
};

export default AssessmentResultPagination;
