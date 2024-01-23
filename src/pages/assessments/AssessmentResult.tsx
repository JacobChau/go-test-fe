import React, { useCallback, useEffect, useState } from "react";
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
  TextField,
  IconButton,
  Button,
  Alert,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssessmentService from "@/api/services/assessmentService";
import { setMessageWithTimeout } from "@/stores/messageSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store.ts";
import {
  AssessmentResultDetailPayload,
  QuestionResultPayload,
  UpdateAssessmentAttemptAnswerMarkParams,
} from "@/types/apis/assessmentTypes.ts";
import parse from "html-react-parser";
import { QuestionType } from "@/constants/question";
import { useTheme } from "@mui/material/styles";
import { ParentCard } from "@components/Card";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmailIcon from "@mui/icons-material/Email";
import PublishIcon from "@mui/icons-material/Publish";
import CheckIcon from "@mui/icons-material/Check";
import { CircularProgressBar } from "@/pages/assessments/components";
import { containsHtml } from "@/helpers";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import UserService from "@/api/services/userService.ts";
import PageContainer from "@components/Container/PageContainer.tsx";
import { OptionDetailPayload, Resource, UserAttributes } from "@/types/apis";
import { UserRole } from "@/constants/userRole.ts";
import avatarDefault from "@assets/images/avatar-default.svg";

const AssessmentResultPage: React.FC = () => {
  const theme = useTheme();
  const { id, attemptId } = useParams<{ id: string; attemptId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = React.useState(true);
  const [assessmentResult, setAssessmentResult] =
    React.useState<AssessmentResultDetailPayload>();

  const [comments, setComments] = React.useState<{ [key: number]: string }>({});
  const { message, isError } = useSelector((state: RootState) => state.message);

  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(
    null,
  );
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<Resource<UserAttributes>>();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await UserService.getCurrentUser();
      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching current user", error);
    }
  }, []);

  const isTeacherAndOwner = useCallback(() => {
    return (
      currentUser &&
      (currentUser.attributes.role === UserRole.Teacher ||
        currentUser.attributes.role === UserRole.Admin) &&
      assessmentResult &&
      assessmentResult.ownerId === Number(currentUser.id) &&
      Boolean(assessmentResult.requiredMark)
    );
  }, [currentUser, assessmentResult]);

  const [isCommentEditing, setIsCommentEditing] = React.useState<{
    [questionId: number]: boolean;
  }>({});

  const [editComment, setEditComment] = React.useState<{
    [key: number]: string;
  }>({});

  const [editScores, setEditScores] = useState<{
    [questionId: number]: { score?: number | null; isEditing: boolean };
  }>({});

  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const [totalScore, setTotalScore] = useState<number>(0);
  const [loadingPublish, setLoadingPublish] = useState<boolean>(false);

  const handlePublishResults = async () => {
    if (id && attemptId) {
      const unmarkedQuestions = assessmentResult?.questions.filter(
        (question) =>
          question.type === QuestionType.Text && question.userMarks === null,
      );
      if (unmarkedQuestions && unmarkedQuestions.length > 0) {
        dispatch(
          setMessageWithTimeout({
            message: "Please mark all questions before publishing results",
            isError: true,
          }),
        );
        return;
      }
      setLoadingPublish(true);
      try {
        await AssessmentService.publishAssessmentResult(id, attemptId);
        setIsPublished(true);
        dispatch(
          setMessageWithTimeout({
            message: "Successfully published marks",
            isError: false,
          }),
        );
      } catch (error: any) {
        dispatch(
          setMessageWithTimeout({ message: error.message, isError: true }),
        );
      } finally {
        setLoadingPublish(false);
      }
    }
  };

  const handleCommentEditClick = (questionId: number) => {
    setEditComment((prev) => ({
      ...prev,
      [questionId]: comments[questionId] || "",
    }));
    setIsCommentEditing((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleCancelComment = (questionId: number) => {
    setEditComment((prev) => ({
      ...prev,
      [questionId]: comments[questionId] || "", // Revert to original comment
    }));
    setIsCommentEditing((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  const handleSaveComment = async (
    questionId: number,
    assessmentQuestionId: number,
  ) => {
    const updatedComment = editComment[questionId] || "";
    if (id && attemptId) {
      setLoadingStates((prev) => ({ ...prev, [questionId]: true }));
      try {
        const success = await AssessmentService.updateAssessmentAttemptAnswer(
          id,
          attemptId,
          assessmentQuestionId,
          { comment: updatedComment },
        );

        if (success) {
          setComments((prev) => ({
            ...prev,
            [questionId]: updatedComment,
          }));
          setIsCommentEditing((prev) => ({
            ...prev,
            [questionId]: false,
          }));
        }
      } catch (error: any) {
        dispatch(
          setMessageWithTimeout({ message: error.message, isError: true }),
        );
      } finally {
        setLoadingStates((prev) => ({ ...prev, [questionId]: false }));
      }
    }
  };

  const handleSaveClick = async (
    questionId: number,
    assessmentQuestionId: number,
  ) => {
    const editedScore = editScores[questionId]?.score;
    const previousScore =
      assessmentResult?.questions.find((q) => q.id === questionId)?.userMarks ||
      0;

    const updateData: UpdateAssessmentAttemptAnswerMarkParams = {
      marks: editedScore,
    };

    try {
      if (id && attemptId) {
        setLoadingStates((prev) => ({ ...prev, [questionId]: true }));
        const { data } = await AssessmentService.updateAssessmentAttemptAnswer(
          id,
          attemptId,
          assessmentQuestionId,
          updateData,
        );

        // Update the state to reflect the saved changes
        setEditScores((prev) => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            score: data.marks,
            isEditing: false,
          },
        }));

        setAssessmentResult((prev) => {
          const question = prev?.questions.find((q) => q.id === questionId);
          if (question) {
            question.userMarks = data.marks;
          }
          return prev;
        });

        if (editedScore !== null && editedScore !== undefined) {
          setTotalScore(
            (prevScore) => prevScore + (editedScore - previousScore),
          );
        }
      }
    } catch (error: any) {
      dispatch(
        setMessageWithTimeout({ message: error.message, isError: true }),
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleCancelClick = (questionId: number) => {
    setEditScores((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], isEditing: false },
    }));
  };

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
        if (data.marked) {
          setIsPublished(true);
        }
        setComments(
          data.questions.reduce(
            (acc, question) => {
              acc[question.id] = question.comment || "";
              return acc;
            },
            {} as { [key: number]: string },
          ),
        );
        setTotalScore(data.score);
        setEditScores(
          data.questions.reduce(
            (acc, question) => {
              acc[question.id] = {
                score: question.userMarks,
                isEditing: false,
              };
              return acc;
            },
            {} as {
              [questionId: number]: {
                score?: number | null;
                isEditing: boolean;
              };
            },
          ),
        );
      } finally {
        setLoading(false);
      }
    }
  }, [attemptId, id]);

  useEffect(() => {
    fetchCurrentUser().catch(console.error);
    fetchAssessmentResult().catch((err) => {
      dispatch(setMessageWithTimeout({ message: err.message, isError: true }));
    });
  }, [fetchCurrentUser, fetchAssessmentResult, dispatch]);

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
          mb: 1,
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

  const PreformattedText = ({ text: text }: { text: any }) => {
    return (
      <Box
        component="pre" // Use the <pre> HTML tag to preserve formatting
        sx={{
          whiteSpace: "pre-wrap", // Allows normal line breaks
          wordBreak: "break-word", // Breaks long words to prevent overflow
          backgroundColor: "action.hover", // Light background to distinguish the text area
          padding: 1,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          marginTop: 1,
        }}
      >
        {text}
      </Box>
    );
  };

  const renderOptions = (question: QuestionResultPayload) => {
    const isSurveyType = !Boolean(assessmentResult?.requiredMark);

    const renderSurveyResponse = (
      option: Resource<OptionDetailPayload>,
      question: QuestionResultPayload,
      idx: number,
    ) => {
      const isSelected = question.userAnswer == option.id;

      return (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            padding: theme.spacing(1),
            backgroundColor: isSelected ? theme.palette.action.selected : "",
            marginBottom: theme.spacing(1),
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {getOptionLabel(idx)}.{"  "}
          </Typography>
          {containsHtml(option.attributes.answer as string) ? (
            parse(option.attributes.answer as string)
          ) : (
            <Typography component="div">{option.attributes.answer}</Typography>
          )}
        </Paper>
      );
    };

    switch (QuestionType[question.type]) {
      case QuestionType.TrueFalse:
      case QuestionType.MultipleChoice:
      case QuestionType.MultipleAnswer:
        return (
          <Grid container spacing={1} direction="column">
            {question.options?.map((option, idx) => (
              <Grid item key={option.id}>
                {isSurveyType
                  ? renderSurveyResponse(option, question, idx)
                  : renderOptionLabel(option, question, idx)}
              </Grid>
            ))}
          </Grid>
        );
      case QuestionType.FillIn:
        return isSurveyType ? (
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
                }}
              >
                {question.userAnswer || "No Answer"}
              </Paper>
            </Typography>
          </>
        ) : (
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
                  backgroundColor:
                    question.userAnswer === question.correctAnswer
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
                  backgroundColor:
                    question.userAnswer === question.correctAnswer
                      ? theme.palette.success.light
                      : "",
                }}
              >
                {question.correctAnswer || "No Answer"}
              </Paper>
            </Typography>
            {renderExplanation(question, question.id)}
          </>
        );
      case QuestionType.Text:
        return isSurveyType ? (
          <>
            <Typography variant="body1" component="div" sx={{ mt: 2 }}>
              Your Answer:
              <PreformattedText text={question.userAnswer || "No Answer"} />
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1" component="div" sx={{ mt: 2 }}>
              Your Answer:
              <PreformattedText text={question.userAnswer || "No Answer"} />
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
    const isSurveyType = !Boolean(assessmentResult?.requiredMark);
    const isManualMarked = question.type === QuestionType.Text;
    const canEdit = isTeacherAndOwner();
    const editState = editScores[question.id] || {
      score: null,
      isEditing: false,
    };

    const isEditing = isCommentEditing[question.id];

    const cardStyle = {
      borderColor: isSurveyType
        ? theme.palette.divider
        : isCorrect
          ? theme.palette.success.main
          : theme.palette.error.main,
      my: 3,
      position: "relative",
    };

    const handleScoreChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      questionId: number,
    ) => {
      let value = e.target.value;
      let numericValue = value === "" ? null : parseInt(value, 10);

      // Check if numericValue exceeds the maximum allowed score and adjust if necessary
      if (numericValue !== null) {
        numericValue = Math.min(numericValue, question.marks); // Ensure score does not exceed maximum
      }

      setEditScores((prev) => ({
        ...prev,
        [questionId]: { ...prev[questionId], score: numericValue },
      }));
    };

    const handleKeyPress = (
      e: React.KeyboardEvent<HTMLDivElement>,
      questionId: number,
      assessmentQuestionId: number,
    ) => {
      if (e.key === "Enter") {
        handleSaveClick(questionId, assessmentQuestionId).catch(console.error);
      }
    };

    return (
      <Card key={index} elevation={2} sx={cardStyle}>
        <CardContent>
          {loadingStates[question.id] && (
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
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 2,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" color={"primary.main"}>
              Question {index + 1}
            </Typography>
            {!isManualMarked && !isSurveyType && (
              <Box display="flex" alignItems="center" gap={1}>
                {question.isCorrect ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
                <Typography variant="subtitle1">{question.marks}</Typography>
              </Box>
            )}

            {isManualMarked && !isSurveyType && canEdit && (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1">
                  Mark Score (Max: {question.marks}):
                </Typography>
                {editState.isEditing ? (
                  <TextField
                    autoFocus
                    sx={{ width: "60px" }}
                    size="small"
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 0, max: question.marks }}
                    value={editScores[question.id]?.score ?? ""}
                    onChange={(e) => handleScoreChange(e, question.id)}
                    onKeyUp={(e) =>
                      handleKeyPress(
                        e,
                        question.id,
                        question.assessmentQuestionId,
                      )
                    }
                  />
                ) : (
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color:
                        editState.score !== null ? "success.main" : undefined,
                    }}
                    component="span"
                  >
                    {editState.score !== null ? editState.score : "Unmarked"}
                  </Typography>
                )}

                {editState.isEditing ? (
                  <React.Fragment>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleSaveClick(
                          question.id,
                          question.assessmentQuestionId,
                        )
                      }
                      title="Save Score"
                    >
                      <SaveIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleCancelClick(question.id)}
                      title="Cancel Edit"
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  </React.Fragment>
                ) : (
                  <IconButton
                    size="small"
                    onClick={() =>
                      setEditScores((prev) => ({
                        ...prev,
                        [question.id]: {
                          score: editScores[question.id]?.score,
                          isEditing: true,
                        },
                      }))
                    }
                    title="Edit Score"
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Box>
            )}

            {isManualMarked && !canEdit && !isSurveyType && (
              //   Show the score if the user is not the owner
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color:
                    editState.score !== null && editState.score !== 0
                      ? "success.main"
                      : undefined,
                }}
                component="span"
              >
                {editState.score !== null && editState.score !== 0 ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
                &nbsp;
                {editState.score !== null ? editState.score : "Unmarked"}
              </Typography>
            )}
          </Box>

          {renderContent(question.content as string)}
          {renderOptions(question)}
          {isManualMarked && canEdit && !isSurveyType && (
            <Box
              sx={{
                mt: 1,
                p: 1,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Comment
              </Typography>
              {isEditing ? (
                <React.Fragment>
                  <TextField
                    multiline
                    fullWidth
                    rows={4}
                    variant="outlined"
                    value={editComment[question.id] || ""}
                    onChange={(e) =>
                      setEditComment((prev) => ({
                        ...prev,
                        [question.id]: e.target.value,
                      }))
                    }
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleSaveComment(
                        question.id,
                        question.assessmentQuestionId,
                      )
                    }
                    sx={{ mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleCancelComment(question.id)}
                  >
                    Cancel
                  </Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Box
                    sx={{
                      maxHeight: "100px",
                      wordBreak: "break-word",
                      overflow: "auto",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <Typography variant="body1" sx={{ ml: 1, p: 1 }}>
                      {comments[question.id] || "No Comment"}
                    </Typography>
                  </Box>
                  <Button
                    sx={{ mt: 1 }}
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleCommentEditClick(question.id)}
                  >
                    {comments[question.id] ? "Edit" : "Add"} Comment
                  </Button>
                </React.Fragment>
              )}
            </Box>
          )}

          {isManualMarked && !canEdit && !isSurveyType && (
            <Box
              sx={{
                maxHeight: "100px",
                wordBreak: "break-word",
                overflow: "auto",
                whiteSpace: "pre-line",
              }}
            >
              <Typography variant="body1" sx={{ ml: 1, p: 1 }}>
                {comments[question.id] || "No Comment"}
              </Typography>
            </Box>
          )}
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
          value={totalScore}
          total={assessmentResult.totalMarks}
        />
      </Box>
    );
  };

  const renderUserInfo = () => {
    if (!assessmentResult.user) return null;

    const { name, email, avatar } = assessmentResult.user;
    const avatarUrl = avatar || avatarDefault;

    return (
      <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            {avatarUrl ? (
              <Avatar src={avatarUrl} alt={name} />
            ) : (
              <Avatar>{name?.charAt(0)}</Avatar> // Display the first letter as the Avatar if no avatar URL
            )}
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{name}</Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <EmailIcon sx={{ mr: 0.5 }} />
              {email}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    );
  };

  const title = assessmentResult.requiredMark
    ? `${assessmentResult.name}'s Result`
    : `${assessmentResult.name}'s Response`;

  return (
    <PageContainer
      title={title}
      description={`This is an assessment result page`}
    >
      <ParentCard title={title}>
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
            {assessmentResult.user && renderUserInfo()}
            {assessmentResult.requiredMark && renderOverallScore()}
            {assessmentResult.questions.map((question, index) =>
              renderQuestionCard(question, index),
            )}
            {isTeacherAndOwner() && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                {/*Loading overlay*/}
                {loadingPublish && (
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
                )}
                <Button
                  variant="contained"
                  color={isPublished ? "success" : "primary"}
                  onClick={handlePublishResults}
                  disabled={loadingPublish}
                >
                  {isPublished ? (
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CheckIcon sx={{ mr: 1 }} />
                      Publish Again
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <PublishIcon sx={{ mr: 1 }} />
                      Publish Results
                    </Typography>
                  )}
                </Button>
                {message && (
                  <Alert
                    severity={isError ? "error" : "success"}
                    sx={{
                      position: "absolute",
                      left: "50%",
                      bottom: "0",
                      transform: "translateX(-50%) translateY(-100%)",
                      maxWidth: "475px",
                    }}
                  >
                    {message}
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default AssessmentResultPage;
