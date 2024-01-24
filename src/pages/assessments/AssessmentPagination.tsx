import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Grid,
  Pagination,
  PaginationItem,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFetchData } from "@/hooks";
import AssessmentService from "@/api/services/assessmentService.ts";
import { AssessmentAttributes } from "@/types/apis/assessmentTypes.ts";
import { AssessmentCard, AssessmentSearchColumn } from "./components";
import AssessmentDetailModal from "@/pages/assessments/components/AssessmentDetailModal.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store.ts";
import { clearMessage } from "@/stores/messageSlice.ts";
import PageContainer from "@components/Container/PageContainer.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import AssessmentFilters from "@/pages/assessments/AssessmentFilters.tsx";

const initialPagination = {
  page: 0,
  perPage: 12,
  total: -1,
};

const AssessmentPagination = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const gridItemSize = isMobile ? 12 : 3;

  const paginationSize = isMobile ? "small" : "medium";

  const {
    items: assessments,
    loading,
    error,
    pagination,
    searchTerm,
    filters,
    handleSearchTermChange,
    handleFilterChange,
    handlePageChange,
  } = useFetchData<AssessmentAttributes>(
    AssessmentService.getAssessments,
    initialPagination,
    AssessmentSearchColumn[0],
  );
  const dispatch = useDispatch<AppDispatch>();

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | null
  >(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { message, isError } = useSelector((state: RootState) => state.message);

  const handleSelectAssessment = (assessmentId: string) => {
    setSelectedAssessmentId(assessmentId);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedAssessmentId(null);
  };

  const handleTakeAssessment = (assessmentId: string) => {
    navigate(`/tests/${assessmentId}/take`, { state: { assessmentId } });
  };

  const handleMaterialUIPageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    handlePageChange(event, page - 1);
  };

  return (
    <PageContainer
      title={"Tests"}
      description={"Take test to assess your knowledge"}
    >
      <ParentCard title={"Tests"}>
        <Box
          sx={{
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              label="Search Assessments"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              sx={{
                mr: isMobile ? 0 : 4,
                mb: isMobile ? 2 : 0, // add margin-bottom on mobile
              }}
              InputLabelProps={{
                sx: !searchTerm
                  ? { color: "#BDBDBD", transition: "0.3s", opacity: 0.7 }
                  : {},
              }}
            />
            <AssessmentFilters
              filters={filters}
              onChange={handleFilterChange}
            />
          </Box>
          {loading ? (
            <Grid container spacing={1}>
              {Array.from(new Array(initialPagination.perPage)).map(
                (_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={gridItemSize}>
                    <Skeleton variant="rectangular" height={118} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Grid>
                ),
              )}
            </Grid>
          ) : error ? (
            <Alert severity="error">
              {error || "Error fetching assessments"}
            </Alert>
          ) : assessments.length > 0 ? (
            <Grid container spacing={1}>
              {assessments.map((assessment) => (
                <Grid item key={assessment.id} xs={12} sm={6} md={gridItemSize}>
                  <AssessmentCard
                    assessment={assessment}
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

          {!loading && !error && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                size={paginationSize}
                count={Math.ceil(pagination.total / pagination.perPage)}
                page={pagination.page + 1}
                onChange={handleMaterialUIPageChange}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    disabled={
                      assessments.length === 0 ||
                      (item.type === "previous" && pagination.page === 0) ||
                      (item.type === "next" &&
                        pagination.page ===
                          Math.ceil(pagination.total / pagination.perPage) - 1)
                    }
                  />
                )}
              />
            </Box>
          )}

          {isDetailModalOpen && selectedAssessmentId && (
            <AssessmentDetailModal
              onPopupClose={() => setIsDetailModalOpen(false)}
              assessmentId={selectedAssessmentId}
              open={isDetailModalOpen}
              onClose={handleDetailModalClose}
              onSelect={handleTakeAssessment}
            />
          )}
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
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default AssessmentPagination;
