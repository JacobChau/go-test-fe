import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { AssessmentResultPayload } from "@/types/apis/assessmentTypes.ts";
import { Resource } from "@/types/apis";

interface AssessmentCardProps {
  assessmentResult: Resource<AssessmentResultPayload>;
  onSelect: (assessmentId: string, attemptId: string) => void;
}

const AssessmentResultCard: React.FC<AssessmentCardProps> = ({
  assessmentResult,
  onSelect,
}) => {
  return (
    <Card variant="outlined" sx={{ maxWidth: 345, m: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={assessmentResult.attributes.thumbnail || ""}
        alt={assessmentResult.attributes.name}
      />
      <CardContent sx={{ pb: 0 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
          {assessmentResult.attributes.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Date Start:{" "}
          {new Date(assessmentResult.attributes.startedAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Score: {assessmentResult.attributes.score}/
          {assessmentResult.attributes.totalMarks}
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button
          size="small"
          color="primary"
          onClick={() =>
            onSelect(
              String(assessmentResult.attributes.assessmentId),
              String(assessmentResult.id),
            )
          }
        >
          View Detail
        </Button>
      </Box>
    </Card>
  );
};

export default AssessmentResultCard;
