import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Grid,
  Pagination,
  PaginationItem,
  Skeleton,
  Typography,
  useMediaQuery,
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
import { useTheme } from "@mui/material/styles";

const AssessmentResultPagination: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [results, setResults] = useState<Resource<AssessmentResultPayload>[]>(
    [],
  );

  const theme = useTheme();
  const isXsDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));

  const resultsPerPage = 12;

  const [loading, setLoading] = useState<boolean>(true);
  const { message, isError } = useSelector((state: RootState) => state.message);

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(-1);

  const fetchAssessmentResults = useCallback(async () => {
    setLoading(true);
    try {
      if (id) {
        const { data, meta } =
          await AssessmentService.getAssessmentResultsByAssessmentId(id, {
            page,
            perPage: resultsPerPage,
          });
        setResults(data);
        if (meta) {
          setTotal(meta.total);
        }
      } else {
        const { data, meta } = await AssessmentService.getAssessmentResults({
          page,
          perPage: resultsPerPage,
        });
        setResults(data);
        if (meta) {
          setTotal(meta.total);
        }
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
    if (id) {
      navigate(`/tests/${id}/results/${attemptId}`, {
        state: { assessmentId, attemptId, owner: true },
      });
      return;
    }

    navigate(`/tests/${assessmentId}/results/${attemptId}`);
  };

  const title = location.state?.name
    ? `Test Results of ${location.state.name}`
    : "Test Results";

  return (
    <PageContainer title={title} description={"List of all test results"}>
      <ParentCard title={title}>
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
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Skeleton variant="rectangular" height={118} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Grid>
                ))}
              </Grid>
            ) : results.length > 0 ? (
              <Grid container spacing={1}>
                <Grid container item xs={12} spacing={1}>
                  {results.map((assessment) => (
                    <Grid item key={assessment.id} xs={12} sm={6} md={4} lg={3}>
                      <AssessmentResultCard
                        assessmentResult={assessment}
                        onSelect={handleSelectAssessment}
                        user={assessment.attributes.user?.attributes}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: isXsDown
                    ? "calc(100vh - 200px)"
                    : "calc(100vh - 300px)",
                }}
              >
                <Typography variant={isSmDown ? "h6" : "h4"}>
                  No results found
                </Typography>
              </Box>
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
