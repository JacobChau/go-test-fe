import { SetStateAction, useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";

import QuillEditor from "@components/Form/QuillEditor/QuillEditor.tsx";
import PageContainer from "@components/Container/PageContainer.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import { QuestionType } from "@/constants/question.ts";
import {
  CategoryAttributes,
  CreateQuestionParams,
  ExplanationAttributes,
  IdentityOptional,
  PassagesPayload,
  Resource,
  UpdateQuestionParams,
} from "@/types/apis";
import passageService from "@/api/services/passageService.ts";
import CircularProgress from "@mui/material/CircularProgress";
import questionService from "@/api/services/questionService.ts";
import { getKeyByValue } from "@/helpers/enumHelper.ts";
import { AppDispatch, RootState } from "@/stores/store.ts";
import { clearMessage, setMessageWithTimeout } from "@/stores/messageSlice.ts";
import {
  QuestionExplanation,
  QuestionOptions,
} from "@/pages/question/components";
import { useParams } from "react-router-dom";
import ConfirmationDialog from "@components/Dialog/ConfirmationDialog.tsx";

export interface Option {
  id: number;
  text?: string;
  label?: string;
  isCorrect?: boolean;
}

export interface QuestionData {
  text: string;
  options?: Option[];
  type: QuestionType;
  categoryId: string;
  passageId?: string;
  explanation?: ExplanationAttributes & IdentityOptional;
  hasQuillEditor: boolean;
}

const initialQuestionData: QuestionData = {
  text: "",
  options: [...Array(4)].map((_, index) => ({
    id: index + 1,
    text: "",
    label: String.fromCharCode(65 + index),
    isCorrect: false,
  })),
  type: QuestionType.MultipleChoice,
  categoryId: "",
  hasQuillEditor: true,
};

const CreateOrUpdateQuestion = () => {
  const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { message, isError } = useSelector((state: RootState) => state.message);
  const [passage, setPassage] = useState("");
  const [questionData, setQuestionData] = useState(initialQuestionData);
  const [passages, setPassages] = useState<Resource<PassagesPayload>[]>([]);
  const [categories, setCategories] = useState<Resource<CategoryAttributes>[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isEditMode = id !== undefined;

  const handleSaveConfirmation = () => {
    setConfirmOpen(true);
  };

    const handleConfirmSave = async () => {
        setConfirmOpen(false);
        await handleSubmit();
    };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const fetchData = useCallback(async () => {
    const [categoriesData, passageData] = await Promise.all([
      questionService.getCategories(),
      passageService.getPassages(),
    ]);

    setCategories(categoriesData.data);
    setPassages(passageData.data);
  }, []);

  const resetState = useCallback(() => {
    setQuestionData(initialQuestionData);
    setPassage("");
  }, []);

  useEffect(() => {
    setLoading(true);
    if (isEditMode) {
      const fetchQuestionData = async () => {
        const { data } = await questionService.getQuestionById(id);
        setQuestionData({
          text: data.attributes.content,
          options: data.attributes?.options?.map((option, index) => ({
            id: Number(option.id),
            text: option.attributes.answer,
            isCorrect: option.attributes.isCorrect,
            label: option.attributes.blankOrder
              ? option.attributes.blankOrder.toString()
              : String.fromCharCode(65 + index),
          })),
          type: QuestionType[data.attributes.type],
          categoryId: data.attributes.category.id.toString(),
          passageId: data.attributes.passage
            ? data.attributes.passage.id.toString()
            : undefined,
          hasQuillEditor: true,
          explanation: data.attributes.explanation
            ? {
                id: data.attributes.explanation.id,
                content: data.attributes.explanation.attributes.content,
              }
            : undefined,
        });
      };

      Promise.all([fetchQuestionData(), fetchData()])
        .catch((err) => {
          dispatch(
            setMessageWithTimeout({ message: err.message, isError: true }),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      resetState();
      fetchData()
        .catch((err) => {
          dispatch(
            setMessageWithTimeout({ message: err.message, isError: true }),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, fetchData, id, isEditMode, resetState]);

  const handleQuestionTypeChange = useCallback(
    (event: { target: { value: any } }) => {
      const type = event.target.value;

      // Reset questionData based on the type
      const newState = {
        ...initialQuestionData, // Reset to initial state
        type,
        hasQuillEditor:
          type !== QuestionType.TrueFalse && type !== QuestionType.FillIn,
      };

      switch (type) {
        case QuestionType.MultipleChoice:
          newState.options = [...Array(4)].map((_, index) => ({
            id: index + 1,
            text: "",
            label: String.fromCharCode(65 + index), // 'A', 'B', 'C', 'D'
            isCorrect: false,
          }));
          break;
        case QuestionType.MultipleAnswer:
          newState.options = [...Array(4)].map((_, index) => ({
            id: index + 1,
            text: "",
            label: String.fromCharCode(65 + index), // 'A', 'B', 'C', 'D'
            isCorrect: false,
          }));
          break;
        case QuestionType.TrueFalse:
          newState.options = [
            { id: 1, text: "True", isCorrect: false },
            { id: 2, text: "False", isCorrect: false },
          ];
          newState.hasQuillEditor = false;
          break;
        case QuestionType.FillIn:
          // has two blanks to fill in, and the template for the question is:
          newState.text =
            "The capital of France is ${1} and the capital of Spain is ${2}.";
          // then the answers are Paris and Madrid
          newState.options = [
            { id: 1, text: "Paris", isCorrect: true },
            { id: 2, text: "Madrid", isCorrect: true },
          ];

          newState.hasQuillEditor = false;
          break;
        case QuestionType.Text:
          newState.text = "What is the capital of France?";
          break;
        default:
          break;
      }

      setQuestionData(newState);
    },
    [],
  );

  const handlePassageChange = useCallback(
    (event: { target: { value: string } }) => {
      setPassage(event.target.value);
    },
    [],
  );

  const handleQuestionDataChange = useCallback(
    (value: SetStateAction<QuestionData>) => {
      setQuestionData((prevState) => ({ ...prevState, ...value }));
    },
    [],
  );

  const validateQuestionData = () => {
    if (questionData.text === "") {
      dispatch(
        setMessageWithTimeout({
          message: "Question text is required",
          isError: true,
        }),
      );
      return false;
    }

    if (questionData.categoryId === "") {
      dispatch(
        setMessageWithTimeout({
          message: "Category is required",
          isError: true,
        }),
      );
      return false;
    }

    switch (questionData.type) {
      case QuestionType.MultipleChoice:
        if (!questionData.options || questionData.options.length === 0) {
          dispatch(
            setMessageWithTimeout({
              message: "Question options are required",
              isError: true,
            }),
          );
          return false;
        }

        if (questionData.options.some((option) => option.text === "")) {
          dispatch(
            setMessageWithTimeout({
              message: "All options must have text",
              isError: true,
            }),
          );
          return false;
        }

        if (!questionData.options.some((option) => option.isCorrect)) {
          dispatch(
            setMessageWithTimeout({
              message: "At least one option must be correct",
              isError: true,
            }),
          );
          return false;
        }
        break;
      case QuestionType.MultipleAnswer:
        if (!questionData.options || questionData.options.length === 0) {
          dispatch(
            setMessageWithTimeout({
              message: "Question options are required",
              isError: true,
            }),
          );
          return false;
        }

        if (questionData.options.some((option) => option.text === "")) {
          dispatch(
            setMessageWithTimeout({
              message: "All options must have text",
              isError: true,
            }),
          );
          return false;
        }

        if (!questionData.options.some((option) => option.isCorrect)) {
          dispatch(
            setMessageWithTimeout({
              message: "At least one option must be correct",
              isError: true,
            }),
          );
          return false;
        }
        break;
      case QuestionType.TrueFalse:
        if (!questionData.options || questionData.options.length === 0) {
          dispatch(
            setMessageWithTimeout({
              message: "Question options are required",
              isError: true,
            }),
          );
          return false;
        }
        if (questionData.options.some((option) => option.text === "")) {
          dispatch(
            setMessageWithTimeout({
              message: "All options must have text",
              isError: true,
            }),
          );
          return false;
        }
        break;
      case QuestionType.FillIn:
        if (!questionData.options || questionData.options.length === 0) {
          dispatch(
            setMessageWithTimeout({
              message: "Question options are required",
              isError: true,
            }),
          );
          return false;
        }
        if (questionData.options.some((option) => option.text === "")) {
          dispatch(
            setMessageWithTimeout({
              message: "All options must have text",
              isError: true,
            }),
          );
          return false;
        }
        break;
      default:
        break;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateQuestionData()) {
        return;
      }
      setIsSubmitted(true);

      if (isEditMode) {
        const questionPayload: UpdateQuestionParams = {
          content: questionData.text,
          type: getKeyByValue(QuestionType, questionData.type),
          categoryId: Number(questionData.categoryId),
          passageId: questionData.passageId
            ? Number(questionData.passageId)
            : undefined,
        };

        if (questionData.options) {
          questionPayload.options = questionData.options.map(
            (option, index) => ({
              id: option.id,
              answer: option.text,
              isCorrect: option.isCorrect || false,
              blankOrder:
                questionData.type === QuestionType.FillIn
                  ? index + 1
                  : undefined,
            }),
          );
        }

        if (questionData.explanation) {
          questionPayload.explanation = {
            id: Number(questionData.explanation.id),
            content: questionData.explanation.content,
          };
        }

        await questionService.updateQuestion(id, questionPayload);
        dispatch(
          setMessageWithTimeout({
            message: "Question updated successfully",
            isError: false,
          }),
        );
      } else {
        const questionPayload: CreateQuestionParams = {
          content: questionData.text,
          type: getKeyByValue(QuestionType, questionData.type),
          explanation: questionData.explanation?.content,
          categoryId: Number(questionData.categoryId),
          passageId: questionData.passageId
            ? Number(questionData.passageId)
            : undefined,
        };

        if (questionData.options) {
          questionPayload.options = questionData.options.map(
            (option, index) => ({
              answer: option.text,
              isCorrect: option.isCorrect || false,
              blankOrder:
                questionData.type === QuestionType.FillIn
                  ? index + 1
                  : undefined,
            }),
          );
        }

        await questionService.createQuestion(questionPayload);
        dispatch(
          setMessageWithTimeout({
            message: "Question created successfully",
            isError: false,
          }),
        );
        resetState();
      }
    } catch (err: any) {
      dispatch(setMessageWithTimeout({ message: err.message, isError: true }));
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <PageContainer
      title={isEditMode ? "Edit Question" : "Create Question"}
      description={
        "This is the page to" +
        (isEditMode ? " edit" : " create") +
        " a question"
      }
    >
      <ParentCard title={isEditMode ? "Edit Question" : "Create Question"}>
        <>
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
                zIndex: 2,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid
              container
              spacing={theme.spacing(3)}
              mt={-2}
              columnSpacing={{ md: 3 }}
              columns={16}
              position="relative"
              style={{ opacity: message ? 0.7 : 1 }}
            >
              <Grid item xs={16} md={4} lg={3} p={3}>
                <Typography variant="h6" gutterBottom sx={{ mt: -1 }}>
                  Question Entry Options
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    id="category-label"
                    sx={{
                      color:
                        questionData.categoryId === ""
                          ? theme.palette.text.disabled
                          : "",
                    }}
                  >
                    Select Category
                  </InputLabel>
                  <Select
                    required
                    labelId="category-label"
                    id="category"
                    value={questionData.categoryId}
                    onChange={(event) => {
                      handleQuestionDataChange({
                        ...questionData,
                        categoryId: event.target.value,
                      });
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.attributes.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="add-category">Add Category</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel
                    id="passage-label"
                    sx={{
                      color: passage === "" ? theme.palette.text.disabled : "",
                    }}
                  >
                    Select Passage
                  </InputLabel>
                  <Select
                    labelId="passage-label"
                    id="passage"
                    value={passage}
                    onChange={handlePassageChange}
                  >
                    {passages.map((passage) => (
                      <MenuItem
                        key={passage.id}
                        value={passage.attributes.title}
                      >
                        {passage.attributes.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="question-type-label">
                    Select Question Type
                  </InputLabel>
                  <Select
                    labelId="question-type-label"
                    id="question-type"
                    value={questionData.type}
                    onChange={handleQuestionTypeChange}
                  >
                    {Object.values(QuestionType).map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
                  Total Questions: <strong>10</strong>
                </Typography>
              </Grid>
              <Grid item xs={16} md={12} lg={13}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: -1 }}>
                  Type Your Question
                </Typography>
                <QuillEditor
                  key={questionData.type}
                  value={questionData.text}
                  onChange={(value: string) => {
                    handleQuestionDataChange({ ...questionData, text: value });
                  }}
                  placeholder="Type your question here..."
                />

                <QuestionOptions
                  questionData={questionData}
                  setQuestionData={handleQuestionDataChange}
                />

                {questionData.type !== QuestionType.Text && (
                  <Box sx={{ mt: 3 }}>
                    <QuestionExplanation
                      explanation={questionData.explanation?.content}
                      setExplanation={(value) => {
                        handleQuestionDataChange({
                          ...questionData,
                          explanation: {
                            id: questionData.explanation?.id,
                            content: value,
                          },
                        });
                      }}
                    />
                  </Box>
                )}

                <Button
                  sx={{ mt: 3 }}
                  variant="contained"
                  color="primary"
                  onClick={handleSaveConfirmation}
                  disabled={loading}
                >
                  Save Question
                </Button>
              </Grid>
            </Grid>
          )}

          <ConfirmationDialog
            open={confirmOpen}
            onClose={handleCloseConfirm}
            onConfirm={handleConfirmSave}
            message="Are you sure you want to save these changes?"
          />

          {isSubmitted && (
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
                zIndex: 2,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {message && (
            <Box
              sx={{
                position: "fixed",
                bottom: "0",
                left: "0",
                zIndex: 9999,
                opacity: 1,
                width: "100%",
                height: "100%",
                "& > * + *": {
                  mt: 2,
                },
              }}
            >
              <Alert
                severity={isError ? "error" : "success"}
                sx={{
                  zIndex: 9999,
                  position: "absolute",
                  left: "50%",
                  top: "80%",
                  // transform: 'translateX(-50%) translateY(-50%)',
                }}
                onClose={() => dispatch(clearMessage())}
              >
                {message}
              </Alert>
            </Box>
          )}
        </>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateOrUpdateQuestion;
