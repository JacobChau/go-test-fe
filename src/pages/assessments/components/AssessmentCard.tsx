import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { green, red } from "@mui/material/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SubjectIcon from "@mui/icons-material/Subject";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TimerIcon from "@mui/icons-material/Timer";
import PublicIcon from "@mui/icons-material/Public";

import { AssessmentAttributes } from "@/types/apis/assessmentTypes.ts";
import defaultThumbnail from "@assets/images/default-thumbnail.svg";
import { Identity } from "@/types/apis";

interface AssessmentCardProps {
  assessment: AssessmentAttributes & Identity;
  onSelect: (assessmentId: string) => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  onSelect,
}) => {
  const displayValueOrFallback = (value: any, fallback: string = "N/A") =>
    value !== null && value !== undefined ? value : fallback;

  return (
    <Card
      sx={{
        maxWidth: 345,
        m: 1,
        border: `1px solid ${green[100]}`,
        ...(!assessment.startedAt && {
          border: `1px solid ${red[100]}`,
        }),
      }}
    >
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
          <Typography variant="body1" sx={{ mb: 1.5 }}>
            <SubjectIcon
              color="primary"
              sx={{ verticalAlign: "middle", mr: 1 }}
            />
            Subject:{" "}
            <Box component="span" sx={{ fontWeight: "600" }}>
              {displayValueOrFallback(
                assessment.subject.attributes.name,
                "No subject",
              )}
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ mb: 1.5 }}>
            <QuestionMarkIcon
              color="primary"
              sx={{ verticalAlign: "middle", mr: 1 }}
            />
            Total Questions:{" "}
            <Box component="span" sx={{ fontWeight: "600" }}>
              {displayValueOrFallback(
                assessment.totalQuestions,
                "Not specified",
              )}
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ mb: 1.5 }}>
            <TimerIcon
              color="primary"
              sx={{ verticalAlign: "middle", mr: 1 }}
            />
            {Boolean(assessment.duration) ? (
              <>
                Duration:{" "}
                <Box component="span" sx={{ fontWeight: "600" }}>
                  {assessment.duration} minutes
                </Box>
              </>
            ) : (
              <Box component="span" sx={{ fontWeight: "600" }}>
                No duration
              </Box>
            )}
          </Typography>
          {Boolean(assessment.publishedAt) && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <PublicIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Published: {""}
                <Box component="span" sx={{ fontWeight: "600" }}>
                  {dayjs(assessment.publishedAt).format("DD MMM YYYY")}
                </Box>
              </Typography>
            </Box>
          )}
          {!Boolean(assessment.publishedAt) && (
            <Box display="flex" alignItems="center" mb={1}>
              <PublicIcon fontSize="small" sx={{ mr: 1, color: red[500] }} />
              <Typography variant="body2" color="text.secondary">
                Not published yet
              </Typography>
            </Box>
          )}
          {Boolean(assessment.startedAt) && (
            <Box display="flex" alignItems="center" mb={1}>
              <CheckCircleOutlineIcon
                fontSize="small"
                sx={{ mr: 1, color: green[500] }}
              />
              <Typography variant="body2" color="text.secondary">
                Taken on: {dayjs(assessment.startedAt).format("DD MMM YYYY")}
              </Typography>
            </Box>
          )}
          {!Boolean(assessment.startedAt) && (
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon
                fontSize="small"
                sx={{ mr: 1, color: red[500] }}
              />
              <Typography variant="body2" color="text.secondary">
                Not taken yet
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AssessmentCard;
