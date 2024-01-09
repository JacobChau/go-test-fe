import { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Slide,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SubmitAssessmentAttemptPayload } from "@/types/apis/assessmentTypes.ts";

interface AssessmentResultsPopupProps {
  open: boolean;
  results: SubmitAssessmentAttemptPayload | null;
  onClose: () => void;
  onViewDetails: () => void;
}

const AssessmentResultsPopup: FC<AssessmentResultsPopupProps> = ({
  open,
  results,
  onClose,
  onViewDetails,
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Slide}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Assessment Results</DialogTitle>
      <DialogContent>
        <Typography>Correct Answers: {results?.correctAnswers}</Typography>
        <Typography>Total Marks: {results?.totalMarks}</Typography>
        <Typography>Total Questions: {results?.totalQuestions}</Typography>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<CheckCircleIcon />} onClick={onViewDetails}>
          View Details
        </Button>
        <Button startIcon={<ArrowBackIcon />} onClick={onClose}>
          Back to List
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssessmentResultsPopup;
