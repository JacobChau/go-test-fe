import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import parse from "html-react-parser";

import { QuestionDisplay } from "@/pages/assessments/components";
import { Option } from "@/pages/question/CreateOrUpdateQuestion.tsx";
import {
  ExplanationAttributes,
  Identity,
  IdentityOptional,
} from "@/types/apis";
import { QuestionType } from "@/constants/question";
import { styled } from "@mui/material/styles";
import PageContainer from "@components/Container/PageContainer.tsx";
import { AssessmentDetailPayload } from "@/types/apis/assessmentTypes.ts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AssessmentService from "@/api/services/assessmentService.ts";
import ConfirmationDialog from "@components/Dialog/ConfirmationDialog.tsx";
import { useDispatch, useSelector } from "react-redux";
import { setMessageWithTimeout } from "@/stores/messageSlice.ts";
import { AppDispatch, RootState } from "@/stores/store.ts";

export interface QuestionDisplayData {
  id: number;
  text: string | JSX.Element | JSX.Element[];
  options?: Option[] | null;
  type: QuestionType;
  passageId?: string;
  explanation?: ExplanationAttributes & IdentityOptional;
}

export interface UserAnswer {
  questionId: number;
  answer: Set<number> | string;
}

const Sidebar = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(3),
  height: "100%",
  boxSizing: "border-box",
}));

const MainContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
}));

interface QuestionButtonProps {
  answered: boolean;
}

const QuestionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "answered",
})<ButtonProps & QuestionButtonProps>(({ theme, answered }) => ({
  justifyContent: "center",
  alignItems: "center",
  textTransform: "none",
  padding: theme.spacing(1),
  width: "100%",
  minWidth: 0,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: answered
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  color: answered
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: answered
      ? theme.palette.action.selected
      : theme.palette.action.hover,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  "&:disabled": {
    color: theme.palette.text.disabled,
    border: `1px solid ${theme.palette.divider}`,
  },
}));

const TakeAssessment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(2 * 60); // 20 minutes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [responses, setResponses] = useState<UserAnswer[]>([]);
  const [assessment, setAssessment] = useState<
    AssessmentDetailPayload & Identity
  >();
  const [questions, setQuestions] = useState<
    Array<QuestionDisplayData & Identity>
  >([]);
  const { message } = useSelector((state: RootState) => state.message);

  const [attemptId, setAttemptId] = useState<number | null>(null);

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const handleSubmit = useCallback(() => {
    console.log("user responses", responses);

    const formattedResponses = responses.map((response) => ({
      questionId: response.questionId,
      answer:
        response.answer instanceof Set
          ? Array.from(response.answer)
          : response.answer,
    }));

    if (id) {
      AssessmentService.submitAssessmentAttempt(id, {
        attemptId: attemptId as number,
        answers: formattedResponses,
      }).catch((err) => {
        dispatch(
          setMessageWithTimeout({ message: err.message, isError: true }),
        );
      });
    }
  }, [id, attemptId, dispatch, responses]);

  const createAssessmentAttempt = useCallback(async () => {
    if (id) {
      const { data, message } = await AssessmentService.createAssessmentAttempt(
        {
          assessmentId: id,
        },
      );

      if (!data.canStart) {
        dispatch(setMessageWithTimeout({ message, isError: true }));
        navigate("/dashboard");
      }

      setAttemptId(data.attemptId);
    }
  }, [id, navigate, dispatch]);

  useEffect(() => {
    // Check if the user navigated directly to the URL
    if (location.state?.assessmentId) {
      createAssessmentAttempt().catch((err) => {
        dispatch(
          setMessageWithTimeout({ message: err.message, isError: true }),
        );
        navigate("/dashboard");
      });
    } else {
      // User navigated directly using URL
      setShowConfirmation(true);
    }
  }, [createAssessmentAttempt, dispatch, location.state, navigate]);

  const handleConfirmation = (confirmed: boolean) => {
    setShowConfirmation(false);
    if (confirmed) {
      createAssessmentAttempt().catch((err) => {
        dispatch(
          setMessageWithTimeout({ message: err.message, isError: true }),
        );
        navigate("/dashboard");
      });
    } else {
      navigate("/dashboard");
    }
  };

  // useEffect(() => {
  //     timerRef.current = window.setInterval(() => {
  //         setTimeLeft((prevTimeLeft) => {
  //             if (prevTimeLeft <= 1) {
  //                 clearInterval(timerRef.current as never);
  //                 handleSubmit();
  //                 return 0;
  //             }
  //             return prevTimeLeft - 1;
  //         });
  //     }, 1000);
  //
  //     return () => {
  //         if (timerRef.current !== null) {
  //             clearInterval(timerRef.current);
  //         }
  //     };
  // }, [handleSubmit]);

  const fetchData = useCallback(async () => {
    if (id && attemptId) {
      setLoading(true);
      try {
        Promise.all([
          AssessmentService.getAssessmentById(+id),
          AssessmentService.getQuestionsByAssessmentId(+id),
        ]).then((res) => {
          const [assessment, questions] = res;
          const { data: assessmentData } = assessment;
          const { data: questionsData } = questions;
          setAssessment({
            id: assessmentData.id,
            name: assessmentData.attributes.name,
            description: assessmentData.attributes.description,
            thumbnail: assessmentData.attributes.thumbnail,
            duration: assessmentData.attributes.duration,
            totalQuestions: assessmentData.attributes.totalQuestions,
            totalMarks: assessmentData.attributes.totalMarks,
            passMarks: assessmentData.attributes.passMarks,
            maxAttempts: assessmentData.attributes.maxAttempts,
            isPublished: assessmentData.attributes.isPublished,
          });

          const questionList = questionsData.map((question) => {
            const { attributes } = question;
            const { options } = attributes;
            return {
              id: question.id,
              text: parse(attributes.content),
              type: QuestionType[attributes.type],
              options: options?.map((option) => {
                const { attributes } = option;
                if (!attributes) return;

                return {
                  id: option.id,
                  text: attributes.answer
                    ? parse(attributes.answer as string)
                    : "",
                };
              }),
              passageId: String(attributes.passage?.id),
            };
          });

          setQuestions(questionList);
        });
      } finally {
        setLoading(false);
      }
    }
  }, [id, attemptId]);

  useEffect(() => {
    fetchData().catch((err) => {
      dispatch(setMessageWithTimeout({ message: err.message, isError: true }));
    });
  }, [dispatch, fetchData]);

  if (loading || !assessment || !questions) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (message) {
    return (
      <Box p={3}>
        <Alert severity="error">{message}</Alert>
      </Box>
    );
  }

  const getDefaultValue = (questionType: QuestionType) => {
    if (questionType === undefined) return "";

    switch (questionType) {
      case QuestionType.MultipleChoice:
      case QuestionType.TrueFalse:
        return "";
      case QuestionType.MultipleAnswer:
        return new Set<number>();
      case QuestionType.FillIn:
      case QuestionType.Text:
        return "";
      default:
        return "";
    }
  };

  const isQuestionAnswered = (questionId: number) => {
    const response = responses.find(
      (response) => response.questionId === questionId,
    );
    if (!response) return false;
    const answer = response.answer;
    return answer instanceof Set ? answer.size >= 0 : answer !== "";
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleOptionSelect = (
    questionId: number,
    optionId: number,
    value: string | boolean,
  ) => {
    const questionIndex = questions.findIndex((q) => q.id === questionId);
    if (questionIndex === -1) {
      console.error(`Question with ID ${questionId} not found`);
      return;
    }

    const question = questions[questionIndex];

    let newAnswer: string | Set<number> = "";

    switch (question.type) {
      case QuestionType.MultipleChoice:
      case QuestionType.TrueFalse:
        newAnswer = String(optionId);
        break;
      case QuestionType.MultipleAnswer:
        newAnswer = handleMultipleAnswerSelect(
          responses.find((r) => r.questionId === questionId)?.answer ||
            new Set<number>(),
          optionId,
          value as string,
        );
        break;
      case QuestionType.FillIn:
      case QuestionType.Text:
        newAnswer = String(value);
        break;
      default:
        break;
    }

    updateResponses(questionId, newAnswer);
  };

  const handleMultipleAnswerSelect = (
    existingAnswer: string | Set<number>,
    optionId: number,
    value: string,
  ) => {
    const newAnswerSet = new Set<number>(existingAnswer as Set<number>);

    if (value) {
      newAnswerSet.add(optionId);
    } else {
      newAnswerSet.delete(optionId);
    }
    return newAnswerSet;
  };

  const updateResponses = (
    questionId: number,
    newAnswer: string | Set<number>,
  ) => {
    const existingResponseIndex = responses.findIndex(
      (response) => response.questionId === questionId,
    );
    const newResponse: UserAnswer = { questionId, answer: newAnswer };

    let newResponses = [...responses];
    if (existingResponseIndex !== -1) {
      newResponses[existingResponseIndex] = newResponse;
    } else {
      newResponses = [...newResponses, newResponse];
    }
    setResponses(newResponses);
  };

  const navigateQuestions = (direction: string) => {
    setCurrentQuestionIndex((prevIndex) => {
      if (direction === "next") {
        // If the current question has not been answered yet and the question type is MultipleAnswer, set the answer to an empty Set
        if (!isQuestionAnswered(questions[prevIndex].id)) {
          if (questions[prevIndex].type === QuestionType.MultipleAnswer) {
            setResponses([
              ...responses.slice(0, prevIndex),
              {
                questionId: questions[prevIndex].id,
                answer: new Set<number>(),
              },
              ...responses.slice(prevIndex + 1),
            ]);
          }
        }
        // Move to the next question if not the last one
        if (prevIndex < questions.length - 1) {
          return prevIndex + 1;
        }
      } else if (direction === "prev" && prevIndex > 0) {
        // Move to the previous question if not the first one
        return prevIndex - 1;
      }
      return prevIndex;
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <PageContainer
      title={assessment?.name || "Take Assessment"}
      description={assessment?.description}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <MainContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                Question {currentQuestionIndex + 1}
              </Typography>
              <Typography variant="h6">{formatTime()}</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <QuestionDisplay
                question={currentQuestion}
                selectedOption={
                  responses.find((r) => r.questionId === currentQuestion.id)
                    ?.answer || getDefaultValue(currentQuestion?.type)
                }
                onSelectOption={handleOptionSelect}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                disabled={currentQuestionIndex === 0}
                onClick={() => navigateQuestions("prev")}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() => navigateQuestions("next")}
                sx={{ ml: 2 }}
              >
                Next
              </Button>
            </Box>
          </MainContent>
        </Grid>
        <Grid item xs={12} md={3}>
          <Sidebar>
            <Typography variant="h6">Questions</Typography>
            <Grid
              container
              key={currentQuestionIndex}
              sx={{ mt: 2 }}
              spacing={1}
              columns={10}
            >
              {questions.map((question, index) => (
                <Grid item xs={2} key={question.id}>
                  <QuestionButton
                    variant={
                      index === currentQuestionIndex ? "contained" : "text"
                    }
                    onClick={() => setCurrentQuestionIndex(index)}
                    answered={isQuestionAnswered(question.id)}
                  >
                    {index + 1}
                  </QuestionButton>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Sidebar>
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => handleConfirmation(false)}
        onConfirm={() => handleConfirmation(true)}
        message="Are you sure you want to start the assessment?"
      />
    </PageContainer>
  );
};

export default TakeAssessment;
