import React, { useState } from "react";
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
import { useFetchData } from "@/hooks";
import AssessmentService from "@/api/services/assessmentService.ts";
import { AssessmentAttributes } from "@/types/apis/assessmentTypes.ts";
import { AssessmentCard } from "./components";
import AssessmentDetailModal from "@/pages/assessments/components/AssessmentDetailModal.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store.ts";
import { clearMessage } from "@/stores/messageSlice.ts";
import PageContainer from "@components/Container/PageContainer.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";

const initialPagination = {
  page: 0,
  perPage: 12,
  total: 0,
};

const AssessmentPagination = () => {
  const navigate = useNavigate();
  const {
    items: assessments,
    loading,
    error,
    pagination,
    handlePageChange,
  } = useFetchData<AssessmentAttributes>(
    AssessmentService.getAssessments,
    initialPagination,
  );
  const dispatch = useDispatch();
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    number | null
  >(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { message, isError } = useSelector((state: RootState) => state.message);

  const handleSelectAssessment = (assessmentId: number) => {
    setSelectedAssessmentId(assessmentId);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedAssessmentId(null);
  };

  const handleTakeAssessment = (assessmentId: number) => {
    navigate(`/assessments/${assessmentId}/take`, { state: { assessmentId } });
  };

  const handleMaterialUIPageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    // Adjust page index for your API (subtract 1 for 0-based indexing)
    handlePageChange(event, page - 1);
  };

  return (
    <PageContainer
      title={"Assessments"}
      description={"Take assessments to test your knowledge."}
    >
      <ParentCard title={"Assessments"}>
        <Box sx={{ position: "relative" }}>
          {loading ? (
            <Grid container spacing={1}>
              {Array.from(new Array(initialPagination.perPage)).map(
                (_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
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
                <Grid item key={assessment.id} xs={12} sm={6} md={4}>
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
