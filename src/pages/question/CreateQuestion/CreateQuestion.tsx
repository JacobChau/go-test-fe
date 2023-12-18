import {SetStateAction, useCallback, useEffect, useState} from 'react';
import {
    Select,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Grid, Box, Button, Alert
} from '@mui/material';
import QuillEditor from "@components/Form/QuillEditor/QuillEditor.tsx";
import PageContainer from "@components/Container/PageContainer.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import {useTheme} from "@mui/material/styles";
import {QuestionType} from "@/constants/question.ts";
import {ExplanationAttributes, PassagesPayload, Resource, CategoryAttributes} from "@/types/apis";
import passageService from "@/api/services/passageService.ts";
import CircularProgress from '@mui/material/CircularProgress';
import questionService from "@/api/services/questionService.ts";
import {getKeyByValue} from "@/helpers/enumHelper.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/stores/store.ts";
import {clearMessage, setMessageWithTimeout} from "@/stores/messageSlice.ts";
import {QuestionExplanation, QuestionOptions} from "@/pages/question/components";


export interface Option {
    id: number;
    text: string;
    label?: string;
    isCorrect?: boolean;
}

export interface QuestionData {
    text: string;
    options: Option[];
    type: QuestionType;
    categoryId: string;
    passageId?: string;
    explanation?: ExplanationAttributes;
    hasQuillEditor: boolean;
}

const initialQuestionData: QuestionData = {
    text: '',
    options: [...Array(4)].map((_, index) => ({
        id: index + 1,
        text: '',
        label: String.fromCharCode(65 + index),
        isCorrect: false,
    })),
    type: QuestionType.MultipleChoice,
    categoryId: '',
    hasQuillEditor: true,
};

const CreateQuestion = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { message, isError } = useSelector((state: RootState) => state.message);
    const [passage, setPassage] = useState('');
    const [questionData, setQuestionData] = useState(initialQuestionData);

    const [passages, setPassages] = useState<Resource<PassagesPayload>[]>([]);
    const [categories, setCategories] = useState<Resource<CategoryAttributes>[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const categoriesRes = await questionService.getCategories();
        const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : [categoriesRes.data];
        setCategories(categoriesData);

        const passagesRes = await passageService.getPassages();
        const passagesData = Array.isArray(passagesRes.data) ? passagesRes.data : [passagesRes.data];
        setPassages(passagesData);
    }, [dispatch]);

    useEffect(() => {
        fetchData().catch((err) => {
            dispatch(setMessageWithTimeout({ message: err.message, isError: true }));
        }).finally(() => {
            setLoading(false);
        });
    }, [fetchData]);

    const handleQuestionTypeChange = useCallback((event: { target: { value: any; }; }) => {
        const type = event.target.value;

        // Reset questionData based on the type
        let newOptions: Option[] = [];
        let hasQuillEditor = true;
        let text = '';

        switch (type) {
            case QuestionType.MultipleChoice:
                newOptions = [...Array(4)].map((_, index) => ({
                    id: index + 1,
                    text: '',
                    label: String.fromCharCode(65 + index), // 'A', 'B', 'C', 'D'
                    isCorrect: false,
                }));
                break;
            case QuestionType.MultipleAnswer:
                newOptions = [...Array(4)].map((_, index) => ({
                    id: index + 1,
                    text: '',
                    label: String.fromCharCode(65 + index), // 'A', 'B', 'C', 'D'
                    isCorrect: false,
                }));
                break;
            case QuestionType.TrueFalse:
                newOptions = [
                    { id: 1, text: 'True', isCorrect: false },
                    { id: 2, text: 'False', isCorrect: false }
                ];
                hasQuillEditor = false;
                break;
            case QuestionType.FillIn:
                // has two blanks to fill in, and the template for the question is:
                text = 'The capital of France is ${1} and the capital of Spain is ${2}.';
                // then the answers are Paris and Madrid
                newOptions = [
                    { id: 1, text: 'Paris', isCorrect: true },
                    { id: 2, text: 'Madrid', isCorrect: true }
                ];

                hasQuillEditor = false;
                break;
            case QuestionType.Text:
                text = 'What is the capital of France?';
                break;
            default:
                break;
        }

        handleQuestionDataChange({
            ...questionData,
            text,
            options: newOptions,
            type,
            hasQuillEditor,
        });

    }, [questionData]);


    const handlePassageChange = useCallback((event: { target: { value: string; }; }) => {
        setPassage(event.target.value);
    }, []);

    const handleQuestionDataChange = useCallback((value: SetStateAction<QuestionData>) => {
        setQuestionData(prevState => ({ ...prevState, ...value }));
    }, []);

    const validateQuestionData = () => {
        if (questionData.text === '') {
            dispatch(setMessageWithTimeout({ message: 'Question text is required', isError: true }));
            return false;
        }

        if (questionData.categoryId === '') {
            dispatch(setMessageWithTimeout({ message: 'Category is required', isError: true }));
            return false;
        }

        switch (questionData.type) {
            case QuestionType.MultipleChoice:
                if (questionData.options.some((option) => option.text === '')) {
                    dispatch(setMessageWithTimeout({ message: 'All options must have text', isError: true }));
                    return false;
                }

                if (!questionData.options.some((option) => option.isCorrect)) {
                    dispatch(setMessageWithTimeout({ message: 'At least one option must be correct', isError: true }));
                    return false;
                }
                break;
            case QuestionType.MultipleAnswer:
                if (questionData.options.some((option) => option.text === '')) {
                    dispatch(setMessageWithTimeout({ message: 'All options must have text', isError: true }));
                    return false;
                }

                if (!questionData.options.some((option) => option.isCorrect)) {
                    dispatch(setMessageWithTimeout({ message: 'At least one option must be correct', isError: true }));
                    return false;
                }
                break;
            case QuestionType.TrueFalse:
                if (questionData.options.some((option) => option.text === '')) {
                    dispatch(setMessageWithTimeout({ message: 'All options must have text', isError: true }));
                    return false;
                }
                break;
            case QuestionType.FillIn:
                if (questionData.options.some((option) => option.text === '')) {
                    dispatch(setMessageWithTimeout({ message: 'All options must have text', isError: true }));
                    return false;
                }
                break;
            default:
                break;
        }

        return true;
    }

    const handleSubmit = async () => {
        try {
            if (!validateQuestionData()) {
                return;
            }

            setLoading(true);

            await questionService.createQuestion({
                content: questionData.text,
                type: getKeyByValue(QuestionType, questionData.type),
                options: [
                    ...questionData.options.map((option, index) => ({
                        answer: option.text,
                        isCorrect: option.isCorrect,
                        blankOrder: questionData.type === QuestionType.FillIn ? index + 1 : undefined,
                    }))
                ],
                explanation: questionData.explanation,
                categoryId: questionData.categoryId,
                passageId: questionData.passageId,
            });

            dispatch(setMessageWithTimeout({ message: 'Question created successfully', isError: false }));

            handleQuestionDataChange(initialQuestionData);
            setPassage('');
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    console.log("questionData", questionData);

    return (
        <PageContainer title="Create Question" description="this is Create Question page">
            <ParentCard title="Create Question">
                <>
                {/* opacity if message is not null */}
                <Grid container spacing={theme.spacing(3)} mt={-2} columnSpacing={{ md: 3 }} columns={16} position="relative" style={{ opacity: message ? 0.7 : 1 }}>
                    {loading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                zIndex: 2
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                    <Grid item xs={16} md={4} lg={3} p={3}>
                        <Typography variant="h6" gutterBottom sx={{ mt: -1 }}>
                            Question Entry Options
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="category-label" sx={{ color: questionData.categoryId === '' ? theme.palette.text.disabled : '' }}>Select Category</InputLabel>
                            <Select
                                required
                                labelId="category-label"
                                id="category"
                                value={questionData.categoryId}
                                onChange={(event) => {
                                    console.log("event.target.value", event.target.value);
                                    handleQuestionDataChange({ ...questionData, categoryId: event.target.value })}
                                }
                            >

                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>{category.attributes.name}</MenuItem>
                                ))}
                                <MenuItem value="add-category">Add Category</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="passage-label" sx={{ color: passage === '' ? theme.palette.text.disabled : '' }}>Select Passage</InputLabel>
                            <Select
                                labelId="passage-label"
                                id="passage"
                                value={passage}
                                onChange={handlePassageChange}
                            >
                                {passages.map((passage) => (
                                    <MenuItem key={passage.id} value={passage.attributes.title}>{passage.attributes.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="question-type-label sx={{ color: questionData.type === '' ? theme.palette.text.disabled : '' }}">Select Question Type</InputLabel>
                            <Select
                                labelId="question-type-label"
                                id="question-type"
                                value={questionData.type}
                                onChange={handleQuestionTypeChange}
                            >
                                {
                                    Object.values(QuestionType).map((type, index) => (
                                        <MenuItem key={index} value={type}>{type}</MenuItem>
                                    ))
                                }
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
                                handleQuestionDataChange({ ...questionData, text: value })
                            }}
                            placeholder="Type your question here..."
                        />

                        <QuestionOptions
                            questionData={questionData}
                            setQuestionData={handleQuestionDataChange}
                        />

                        {questionData.type !== QuestionType.Text && (
                            <Box sx={{ mt: 3 }}>
                                <QuestionExplanation explanation={questionData.explanation} setExplanation={(value: any) => {
                                    handleQuestionDataChange({ ...questionData, explanation: value })
                                }} />
                            </Box>
                        )}

                        <Button
                            sx={{ mt: 3 }}
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Save Question
                        </Button>
                    </Grid>
                </Grid>
                {message && (
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 80,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 9999,
                            opacity: 1,
                            width: '100%',
                            '& > * + *': {
                                mt: 2,
                                },
                            }}
                    >
                        <Alert
                            severity={isError ? 'error' : 'success'}
                            sx={{
                                zIndex: 9999,
                                position: 'absolute',
                                left: '50%',
                                bottom: '0',
                                transform: 'translateX(-50%) translateY(-50%)',
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
}

export default CreateQuestion;
