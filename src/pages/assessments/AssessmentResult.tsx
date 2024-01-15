import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssessmentService from "@/api/services/assessmentService";
import { setMessageWithTimeout } from "@/stores/messageSlice.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores/store.ts";
import {
  AssessmentResultDetailPayload,
  QuestionResultPayload,
} from "@/types/apis/assessmentTypes.ts";
import PageContainer from "@components/Container/PageContainer.tsx";
import { QuestionType } from "@/constants/question";
import { useTheme } from "@mui/material/styles";
import { ParentCard } from "@components/Card";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { CircularProgressBar } from "@/pages/assessments/components";
import parse from "html-react-parser";
import { containsHtml } from "@/helpers";

const AssessmentResultPage: React.FC = () => {
  const theme = useTheme();
  const { id, attemptId } = useParams<{ id: string; attemptId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = React.useState(true);
  const [assessmentResult, setAssessmentResult] =
    React.useState<AssessmentResultDetailPayload>();

  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(
    null,
  );

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  const handleExpandClick = (questionId: number) => {
    setExpandedQuestion((prev) => (prev === questionId ? null : questionId));
  };

  const fetchAssessmentResult = useCallback(async () => {
    if (id && attemptId) {
      setLoading(true);
      try {
        const { data } = await AssessmentService.getAssessmentResult(
          id,
          attemptId,
        );
        setAssessmentResult(data);
      } finally {
        setLoading(false);
      }
    }
  }, [attemptId, id]);

  React.useEffect(() => {
    fetchAssessmentResult().catch((err) => {
      dispatch(setMessageWithTimeout({ message: err.message, isError: true }));
    });
  }, [dispatch, fetchAssessmentResult]);

  if (!assessmentResult) {
    return null;
  }

  const isOptionSelected = (
    optionId: string | number,
    userAnswer: number | number[] | string | null | undefined,
  ): boolean => {
    if (Array.isArray(userAnswer)) {
      return userAnswer.includes(Number(optionId));
    }
    return userAnswer === Number(optionId);
  };

  const isOptionCorrect = (
    optionId: string | number,
    correctAnswer: number | number[] | string | null | undefined,
  ): boolean => {
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.includes(Number(optionId));
    }

    return correctAnswer === Number(optionId);
  };

  const renderExplanation = (
    question: QuestionResultPayload,
    questionId: number,
  ) => {
    const isExpanded = questionId === expandedQuestion;
    return question.explanation ? (
      <Accordion
        expanded={isExpanded}
        onChange={() => handleExpandClick(questionId)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component={"span"}>
            Explanation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{question.explanation}</Typography>
        </AccordionDetails>
      </Accordion>
    ) : null;
  };

  const renderContent = (content: string) => {
    return (
      <Box
        sx={{
          wordBreak: "break-word",
          "& img": { maxWidth: "100%", height: "auto" },
          "& p": { margin: 0 },
        }}
      >
        {containsHtml(content) ? (
          parse(content)
        ) : (
          <Typography component="div" gutterBottom sx={{ mb: 2 }}>
            {content}
          </Typography>
        )}
      </Box>
    );
  };

  const renderOptionLabel = (
    option: any,
    question: QuestionResultPayload,
    index: number,
  ) => {
    const isCorrect = isOptionCorrect(option.id, question.correctAnswer);
    const isSelected = isOptionSelected(option.id, question.userAnswer);

    const optionStyle = {
      backgroundColor: isSelected
        ? isCorrect
          ? theme.palette.success.light
          : theme.palette.error.light
        : isCorrect
          ? theme.palette.success.light
          : "none",
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      "& img": {
        maxWidth: "100%",
        height: "auto",
      },
      "& p": {
        margin: 0,
      },
    };

    return (
      <Box sx={optionStyle}>
        <Typography variant="body1" component="div">
          {getOptionLabel(index)}.{" "}
        </Typography>
        {containsHtml(option.attributes.answer) ? (
          parse(option.attributes.answer)
        ) : (
          <Typography component="div">{option.attributes.answer}</Typography>
        )}
      </Box>
    );
  };

  const renderOptions = (question: QuestionResultPayload) => {
    const hasAnswer =
      question.userAnswer !== null && question.userAnswer !== "";
    switch (QuestionType[question.type]) {
      case QuestionType.TrueFalse:
      case QuestionType.MultipleChoice:
      case QuestionType.MultipleAnswer:
        return (
          <Grid container spacing={1} direction="column">
            {question.options?.map((option, idx) => (
              <Grid item key={option.id}>
                {renderOptionLabel(option, question, idx)}
              </Grid>
            ))}
          </Grid>
        );
      case QuestionType.FillIn:
        const isCorrect = question.userAnswer === question.correctAnswer;
        return (
          <>
            <Typography variant="body1" component="div" sx={{ mb: 2 }}>
              Your Answer:
              <Paper
                variant="outlined"
                sx={{
                  display: "inline",
                  ml: 1,
                  py: 0.5,
                  px: 1,
                  backgroundColor: isCorrect
                    ? theme.palette.success.light
                    : theme.palette.warning.light,
                }}
              >
                {question.userAnswer || "No Answer"}
              </Paper>
            </Typography>
            <Typography variant="body1" component="div" sx={{ mb: 2 }}>
              Correct Answer:
              <Paper
                variant="outlined"
                sx={{
                  display: "inline",
                  p: 1,
                  ml: 1,
                  backgroundColor: isCorrect ? theme.palette.success.light : "",
                }}
              >
                {question.correctAnswer || "No Answer"}
              </Paper>
            </Typography>
            {renderExplanation(question, question.id)}
          </>
        );
      case QuestionType.Text:
        return (
          <>
            <Typography variant="body1">
              Your Answer:
              <Paper
                variant="outlined"
                sx={{
                  display: "inline",
                  ml: 1,
                  p: 1,
                  backgroundColor: !hasAnswer
                    ? theme.palette.warning.light
                    : "",
                }}
              >
                {question.userAnswer || "No Answer"}
              </Paper>
            </Typography>
            {renderExplanation(question, question.id)}
          </>
        );
      default:
        return null;
    }
  };

  const renderQuestionCard = (
    question: QuestionResultPayload,
    index: number,
  ) => {
    const isCorrect = question.isCorrect;

    const cardStyle = {
      borderColor: isCorrect
        ? theme.palette.success.main
        : theme.palette.error.main,
      my: 3,
    };

    return (
      <Card key={index} elevation={2} sx={cardStyle}>
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1">Question {index + 1}</Typography>
            <Typography variant="subtitle1">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={0.5}
              >
                {isCorrect ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
                {question.marks}
              </Box>
            </Typography>
          </Box>
          {renderContent(question.content as string)}
          {renderOptions(question)}
        </CardContent>
      </Card>
    );
  };

  const renderOverallScore = () => {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 6 }}
      >
        <CircularProgressBar
          value={assessmentResult.score}
          total={assessmentResult.totalMarks}
        />
      </Box>
    );
  };

  return (
    <PageContainer
      title={`${assessmentResult.name}'s Result`}
      description={"This is an assessment result page"}
    >
      <ParentCard title={`${assessmentResult.name}'s Result`}>
        {loading ? (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box pt={2} px={4}>
            {renderOverallScore()}
            {assessmentResult.questions.map((question, index) =>
              renderQuestionCard(question, index),
            )}
          </Box>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default AssessmentResultPage;
