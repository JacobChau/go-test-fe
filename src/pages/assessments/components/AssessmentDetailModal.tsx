import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import {
  Modal,
  Box,
  Typography,
  Button,
  useMediaQuery,
  Alert,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { AssessmentDetailPayload } from "@/types/apis/assessmentTypes.ts";
import AssessmentService from "@/api/services/assessmentService";
import { Resource } from "@/types/apis";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ScoreIcon from "@mui/icons-material/Score";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { clearMessage, setMessageWithTimeout } from "@/stores/messageSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store.ts";

import defaultThumbnail from "@assets/images/default-thumbnail.svg";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  width: { xs: "90%", sm: "70%", md: "60%", lg: "50%" },
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto" as const,
};

interface AssessmentDetailModalProps {
  assessmentId: string;
  open: boolean;
  onClose: () => void;
  onSelect: (assessmentId: string) => void;
  onPopupClose: () => void;
}

const AssessmentDetailModal: React.FC<AssessmentDetailModalProps> = ({
  assessmentId,
  open,
  onClose,
  onSelect,
  onPopupClose,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { message } = useSelector((state: RootState) => state.message);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [assessmentDetails, setAssessmentDetails] =
    useState<Resource<AssessmentDetailPayload> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      AssessmentService.getAssessmentById(assessmentId)
        .then((response) => {
          setAssessmentDetails(response.data);
        })
        .catch((err) => {
          dispatch(
            setMessageWithTimeout({ message: err.message, isError: true }),
          );
          onPopupClose();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [assessmentId, open]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="assessment-detail-modal"
        aria-describedby="assessment-detail-modal-description"
        closeAfterTransition
      >
        <Box
          sx={{
            ...style,
            ...(fullScreen && {
              width: "auto",
              maxWidth: "90%",
              height: "auto",
              maxHeight: "90%",
            }),
            animation: loading ? "none" : "grow 1s infinite",
          }}
        >
          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "auto" }} />
          ) : (
            assessmentDetails && (
              <>
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    position: "relative",
                    backgroundImage: `url(${
                      assessmentDetails.attributes.thumbnail || defaultThumbnail
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay color
                      borderRadius: "inherit", // Inherit the border radius of the parent
                    },
                    "& > *": {
                      // Ensure the children (like Typography) are positioned above the overlay
                      position: "relative",
                      zIndex: 1,
                    },
                  }}
                >
                  <Typography
                    id="assessment-detail-modal-title"
                    variant="h3"
                    component="h2"
                    gutterBottom
                    sx={{
                      textAlign: "center",
                      color: theme.palette.getContrastText(
                        theme.palette.primary.main,
                      ),
                    }}
                  >
                    {assessmentDetails.attributes.name}
                  </Typography>
                </Box>
                <Typography
                  id="assessment-detail-modal-description"
                  sx={{
                    mt: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  <i>{assessmentDetails.attributes.description}</i>
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <QuestionMarkIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Total Questions:{" "}
                    {assessmentDetails.attributes.totalQuestions}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Duration: {assessmentDetails.attributes.duration} minutes
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <ScoreIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Total Marks: {assessmentDetails.attributes.totalMarks}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <ScoreIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Passing Marks: {assessmentDetails.attributes.passMarks}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <EventAvailableIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Valid From:{" "}
                    {dayjs(assessmentDetails.attributes.validFrom).format(
                      "DD/MM/YYYY",
                    )}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <EventAvailableIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Valid To:{" "}
                    {dayjs(assessmentDetails.attributes.validTo).format(
                      "DD/MM/YYYY",
                    )}
                  </Typography>
                </Box>
                <Button
                  sx={{ mt: 3, width: "100%" }}
                  variant="contained"
                  color="primary"
                  onClick={() => onSelect(assessmentId)}
                >
                  Take Assessment
                </Button>
              </>
            )
          )}
        </Box>
      </Modal>
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
            severity={"error"}
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
    </>
  );
};

export default AssessmentDetailModal;
