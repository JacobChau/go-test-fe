import { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Fade,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { SubmitAssessmentAttemptPayload } from "@/types/apis/assessmentTypes.ts";

interface AssessmentResultsPopupProps {
  isSubmitting: boolean;
  open: boolean;
  results: SubmitAssessmentAttemptPayload | null;
  onClose: () => void;
  onViewDetails: () => void;
}

const AssessmentResultsPopup: FC<AssessmentResultsPopupProps> = ({
  isSubmitting,
  open,
  results,
  onClose,
  onViewDetails,
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Fade}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
      className="results-popup"
      PaperProps={{ style: { overflow: "hidden" } }}
    >
      <DialogTitle className="popup-title">Assessment Results</DialogTitle>
      <DialogContent className="popup-content">
        {isSubmitting ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              container
              alignItems="center"
              className="result-item"
            >
              <CheckCircleOutlineIcon />
              <Typography
                variant="subtitle1"
                className="result-text"
                style={{ marginLeft: 8 }}
              >
                Correct Answers: {results?.correctAnswers}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              container
              alignItems="center"
              className="result-item"
            >
              <BarChartIcon />
              <Typography
                variant="subtitle1"
                className="result-text"
                style={{ marginLeft: 8 }}
              >
                Total Marks: {results?.totalMarks}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              container
              alignItems="center"
              className="result-item"
            >
              <FormatListNumberedIcon />
              <Typography
                variant="subtitle1"
                className="result-text"
                style={{ marginLeft: 8 }}
              >
                Total Questions: {results?.totalQuestions}
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions className="popup-actions">
        <Button
          startIcon={<VisibilityIcon />}
          onClick={onViewDetails}
          className="detail-button"
        >
          View Details
        </Button>
        <Button
          startIcon={<ExitToAppIcon />}
          onClick={onClose}
          className="back-button"
        >
          Back to List
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssessmentResultsPopup;
