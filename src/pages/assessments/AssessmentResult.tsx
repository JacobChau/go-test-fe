import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssessmentService from "@/api/services/assessmentService";
import { setMessageWithTimeout } from "@/stores/messageSlice.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores/store.ts";
import { AssessmentResultPayload } from "@/types/apis/assessmentTypes.ts";
import PageContainer from "@components/Container/PageContainer.tsx";

// {
//   "data": {
//   "id": 23,
//       "name": "Assessment 1",
//       "score": 60,
//       "totalCorrect": 6,
//       "totalMarks": 90,
//       "totalQuestions": 9,
//       "questions": [
//     {
//       "id": 25,
//       "content": "What is the main topic of the audio?",
//       "type": "MultipleChoice",
//       "options": [
//         {
//           "id": "62",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "The weather",
//             "isCorrect": false
//           }
//         },
//         {
//           "id": "63",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "The news",
//             "isCorrect": false
//           }
//         },
//         {
//           "id": "64",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "The traffic",
//             "isCorrect": true
//           }
//         },
//         {
//           "id": "65",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "The sports",
//             "isCorrect": false
//           }
//         }
//       ],
//       "userAnswer": 65,
//       "correctAnswer": [
//         64
//       ],
//       "isCorrect": false,
//       "marks": "10",
//       "explanation": null
//     },
//     {
//       "id": 31,
//       "content": "The TOEIC test is used by more than 14,000 companies in 150 countries.",
//       "type": "TrueFalse",
//       "options": [
//         {
//           "id": "84",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "True",
//             "isCorrect": true
//           }
//         },
//         {
//           "id": "85",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "False",
//             "isCorrect": false
//           }
//         }
//       ],
//       "userAnswer": 84,
//       "correctAnswer": [
//         84
//       ],
//       "isCorrect": true,
//       "marks": "10",
//       "explanation": "The TOEIC test is used by more than 14,000 companies in 150 countries."
//     },
//     {
//       "id": 23,
//       "content": "Choose the images that best describe the house.",
//       "type": "MultipleAnswer",
//       "options": [
//         {
//           "id": "57",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "The weather",
//             "isCorrect": true
//           }
//         },
//         {
//           "id": "54",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "The weather",
//             "isCorrect": false
//           }
//         },
//         {
//           "id": "55",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "The weather",
//             "isCorrect": false
//           }
//         },
//         {
//           "id": "56",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "The weather",
//             "isCorrect": false
//           }
//         }
//       ],
//       "userAnswer": [
//         "54"
//       ],
//       "correctAnswer": [
//         57
//       ],
//       "isCorrect": false,
//       "marks": "10",
//       "explanation": null
//     },
//     {
//       "id": 17,
//       "content": "What are the disadvantages of using renewable energy sources?",
//       "type": "MultipleAnswer",
//       "options": [
//         {
//           "id": "30",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "They are more expensive than fossil fuels.",
//             "isCorrect": true
//           }
//         },
//         {
//           "id": "31",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "They are less environmentally friendly than fossil fuels.",
//             "isCorrect": false
//           }
//         },
//         {
//           "id": "32",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "They are less efficient than fossil fuels.",
//             "isCorrect": true
//           }
//         },
//         {
//           "id": "33",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "They are less reliable than fossil fuels.",
//             "isCorrect": true
//           }
//         }
//       ],
//       "userAnswer": [
//         "30",
//         "32",
//         "33"
//       ],
//       "correctAnswer": [
//         30,
//         32,
//         33
//       ],
//       "isCorrect": true,
//       "marks": "10",
//       "explanation": "The disadvantages of using renewable energy sources are that they are more expensive than fossil fuels, less efficient than fossil fuels, and less reliable than fossil fuels."
//     },
//     {
//       "id": 8,
//       "content": "The rate of growth of the TOEIC test in Japan is ___.",
//       "type": "FillIn",
//       "options": [
//         {
//           "id": "23",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "rapid",
//             "isCorrect": true
//           }
//         }
//       ],
//       "userAnswer": "rapid",
//       "correctAnswer": [
//         23
//       ],
//       "isCorrect": true,
//       "marks": "10",
//       "explanation": "The rate of growth of the TOEIC test in Japan is rapid."
//     },
//     {
//       "id": 20,
//       "content": "What are the qualities of a good leader?",
//       "type": "MultipleAnswer",
//       "options": [
//         {
//           "id": "42",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "They are charismatic.",
//             "isCorrect": true
//           }
//         },
//         {
//           "id": "43",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "They are intelligent.",
//             "isCorrect": true
//           }
//         },
//         {
//           "id": "44",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "They are honest.",
//             "isCorrect": true
//           }
//         },
//         {
//           "id": "45",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "They are humble.",
//             "isCorrect": false
//           }
//         }
//       ],
//       "userAnswer": [
//         "43"
//       ],
//       "correctAnswer": [
//         42,
//         43,
//         44
//       ],
//       "isCorrect": false,
//       "marks": "10",
//       "explanation": "The qualities of a good leader are that they are charismatic, intelligent, and honest."
//     },
//     {
//       "id": 15,
//       "content": "What is the main topic of the passage?",
//       "type": "Text",
//       "options": [],
//       "userAnswer": "huhu",
//       "correctAnswer": [],
//       "isCorrect": true,
//       "marks": "10",
//       "explanation": null
//     },
//     {
//       "id": 14,
//       "content": "What is the TOEIC test used for?",
//       "type": "Text",
//       "options": [],
//       "userAnswer": "hihi",
//       "correctAnswer": [],
//       "isCorrect": true,
//       "marks": "10",
//       "explanation": null
//     },
//     {
//       "id": 32,
//       "content": "<p>Test image with correct B</p>",
//       "type": "MultipleChoice",
//       "options": [
//         {
//           "id": "86",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "<p><img src=\"https://s3-hcm-r1.longvan.net/go-test/1704420557.png\" alt=\"Njc3MDUzLjIzNTU0Nzc4NjUxNzA0NDIwNTU2OTg5.png\"></p>"
//           }
//         },
//         {
//           "id": "87",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "<p><img src=\"https://s3-hcm-r1.longvan.net/go-test/1704421379.png\" alt=\"MjQ4MzEwLjY5MzgzOTM1MTMzMTcwNDQyMTM3ODcwNw=.png\"></p>"
//           }
//         },
//         {
//           "id": "88",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "<p><img src=\"https://s3-hcm-r1.longvan.net/go-test/1704421379.png\" alt=\"MjQ4MzEwLjY5MzgzOTM1MTMzMTcwNDQyMTM3ODcwNw=.png\"></p>"
//           }
//         },
//         {
//           "id": "89",
//           "type": "questionOptions",
//           "attributes": {
//             "answer": "<p><img src=\"https://s3-hcm-r1.longvan.net/go-test/1704421379.png\" alt=\"MjQ4MzEwLjY5MzgzOTM1MTMzMTcwNDQyMTM3ODcwNw=.png\"></p>"
//           }
//         }
//       ],
//       "userAnswer": 87,
//       "correctAnswer": [
//         87
//       ],
//       "isCorrect": true,
//       "marks": "10",
//       "explanation": "explanationexplanationexplanationexplanationexplanationexplanationexplanation"
//     }
//   ]
// },
//   "message": "Assessment result retrieved successfully."
// }
const AssessmentResultPage: React.FC = () => {
  // assessments/{id}/results/{attemptId}
  const { id, attemptId } = useParams<{ id: string; attemptId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = React.useState(true);
  const [assessmentResult, setAssessmentResult] =
    React.useState<AssessmentResultPayload>();
  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(
    null,
  );

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

  const handleExpandClick = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const getAnswerIcon = (isCorrect?: boolean) => {
    return isCorrect ? (
      <CheckCircleOutlineIcon color="success" />
    ) : (
      <HighlightOffIcon color="error" />
    );
  };

  return (
    <PageContainer title="Assessment Results" description="Assessment Results">
      {loading || !assessmentResult ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Assessment Results
          </Typography>
          <Typography variant="h5" gutterBottom>
            {assessmentResult.name}
          </Typography>

          <Card elevation={3} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Score: {assessmentResult.score}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  (assessmentResult.score / assessmentResult.totalMarks) *
                    100 || 0
                }
              />
            </CardContent>
          </Card>

          {assessmentResult.questions.map((question, index) => (
            <Card key={index} elevation={2} sx={{ my: 1 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar
                    sx={{
                      bgcolor: question.isCorrect
                        ? "success.main"
                        : "error.main",
                      mr: 1,
                    }}
                  >
                    {getAnswerIcon(question.isCorrect)}
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    Question {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expandedQuestion === index}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Typography gutterBottom>{question.content}</Typography>
                <Tooltip title="Your answer">
                  <Typography>
                    Your Answer: {question.userAnswer || "Not Attempted"}
                  </Typography>
                </Tooltip>
                <Tooltip title="Correct answer">
                  <Typography>
                    Correct Answer: {question.correctAnswer}
                  </Typography>
                </Tooltip>
                {expandedQuestion === index && question.explanation && (
                  <Box mt={2}>
                    <Typography variant="subtitle2">Explanation:</Typography>
                    <Typography variant="body2">
                      {question.explanation}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}

          <Box my={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary">
              Review Questions
            </Button>
            <Button variant="contained" color="secondary">
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      )}
    </PageContainer>
  );
};

export default AssessmentResultPage;
