import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Tooltip,
  Chip,
} from "@mui/material";
import { AssessmentResultPayload } from "@/types/apis/assessmentTypes.ts";
import { Resource, UserAttributes } from "@/types/apis";
import { UserComponent } from "@/pages/assessments/components/index.ts";
import defaultThumbnail from "@assets/images/default-thumbnail.svg";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import relativeTime from "dayjs/plugin/relativeTime";
import { ResultDisplayMode } from "@/constants/resultDisplayMode.ts";
import ScoreIcon from "@mui/icons-material/Score";
dayjs.extend(relativeTime);
interface AssessmentCardProps {
  assessmentResult: Resource<AssessmentResultPayload>;
  onSelect: (assessmentId: string, attemptId: string) => void;
  user?: UserAttributes;
}

const AssessmentResultCard: React.FC<AssessmentCardProps> = ({
  assessmentResult,
  onSelect,
  user,
}) => {
  const formattedDate = dayjs(assessmentResult.attributes.startedAt).format(
    "MMMM D, YYYY h:mm A",
  );
  const relativeDate = dayjs(assessmentResult.attributes.startedAt).fromNow();
  const canShowResult = Boolean(
    assessmentResult.attributes.displayMode &&
      ResultDisplayMode[assessmentResult.attributes.displayMode] !==
        ResultDisplayMode.HideResults &&
      assessmentResult.attributes.marked,
  );

  const showDetailMode = Boolean(
    assessmentResult.attributes.marked &&
      assessmentResult.attributes.displayMode &&
      ResultDisplayMode[assessmentResult.attributes.displayMode] ===
        ResultDisplayMode.DisplayMarkAndAnswers,
  );

  const hasResult = Boolean(assessmentResult.attributes.requiredMark);
  const showScore = Boolean(
    hasResult &&
      canShowResult &&
      (assessmentResult.attributes.fromOwner ||
        assessmentResult.attributes.marked),
  );

  const getChipProps = (): {
    label: string;
    color: "success" | "warning";
  } | null => {
    if (!hasResult) {
      return null;
    }

    if (canShowResult && assessmentResult.attributes.marked) {
      return { label: "Marked", color: "success" };
    }

    return { label: "Not Marked", color: "warning" };
  };

  const chipProps = getChipProps();

  return (
    <Card variant="outlined" sx={{ maxWidth: 345, m: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={assessmentResult.attributes.thumbnail || defaultThumbnail}
        alt={assessmentResult.attributes.name}
      />

      <CardContent sx={{ pb: 0, minHeight: 180 }}>
        <Typography gutterBottom variant="h5" component="div">
          {assessmentResult.attributes.name}
        </Typography>

        {chipProps && (
          <Chip label={chipProps.label} color={chipProps.color} size="small" />
        )}
        <Tooltip title={formattedDate}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", mb: 1.5, mt: 1 }}
          >
            <AccessTimeIcon sx={{ mr: 0.5 }} /> Taken {relativeDate}
          </Typography>
        </Tooltip>
        {showScore && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            <ScoreIcon
              color="primary"
              sx={{ verticalAlign: "middle", mr: 1 }}
            />
            Score: &nbsp;
            <Box
              component="span"
              sx={{ fontWeight: "600", color: "primary.main" }}
            >
              {assessmentResult.attributes.score || 0}/
              {assessmentResult.attributes.totalMarks || "N/A"}
            </Box>
          </Typography>
        )}
        {user && <UserComponent username={user.name} avatarUrl={user.avatar} />}
        {showDetailMode && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentResultCard;
