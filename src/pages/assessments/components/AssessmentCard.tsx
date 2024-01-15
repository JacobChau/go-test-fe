import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import { AssessmentAttributes } from "@/types/apis/assessmentTypes.ts";
import { Identity } from "@/types/apis";
import defaultThumbnail from "@assets/images/default-thumbnail.svg";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ScoreIcon from "@mui/icons-material/Score";

interface AssessmentCardProps {
  assessment: AssessmentAttributes & Identity;
  onSelect: (assessmentId: string) => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  onSelect,
}) => {
  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <CardActionArea onClick={() => onSelect(String(assessment.id))}>
        <CardMedia
          component="img"
          height="140"
          image={assessment.thumbnail || defaultThumbnail}
          alt={assessment.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
            {assessment.name}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <ScoreIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Total Marks: {assessment.totalMark}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <QuestionMarkIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Total Questions: {assessment.totalQuestions}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <AccessTimeIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Duration: {assessment.duration} minutes
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AssessmentCard;
