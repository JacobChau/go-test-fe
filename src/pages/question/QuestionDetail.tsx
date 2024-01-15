import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { CircularProgress, Grid, Typography, Paper } from '@mui/material';
import PageContainer from "@components/Container/PageContainer.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import questionService from "@/api/services/questionService.ts";
import {setMessageWithTimeout} from "@/stores/messageSlice.ts";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/stores/store.ts";
import {QuestionData} from "@/pages/question/CreateOrUpdateQuestion.tsx";
import {QuestionType} from "@/constants/question.ts";

const QuestionDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [questionData, setQuestionData] = useState<QuestionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchQuestionData = async () => {
            if (!id) {
                throw new Error('Question ID not found');
            }

            const {data} = await questionService.getQuestionById(id);
            setQuestionData({
                text: data.attributes.content,
                options: data.attributes.options.map((option, index) => ({
                    id: Number(option.id),
                    text: option.attributes.answer,
                    isCorrect: option.attributes.isCorrect,
                    label: option.attributes.blankOrder ? option.attributes.blankOrder.toString() : String.fromCharCode(65 + index),
                })),
                type: QuestionType[data.attributes.type],
                categoryId: data.attributes.category.id.toString(),
                passageId: data.attributes.passage ? data.attributes.passage.id.toString() : undefined,
                hasQuillEditor: true,
                explanation: data.attributes.explanation ? {
                    id: data.attributes.explanation.id,
                    content: data.attributes.explanation.attributes.content,
                } : undefined,
            });
        };

        fetchQuestionData().catch((err) => {
            dispatch(setMessageWithTimeout({message: err.message, isError: true}));
        }).finally(() => {
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <CircularProgress />
        );
    }

    if (!questionData) {
        return <Typography variant="h6">Question not found</Typography>;
    }

    return (
        <PageContainer title="Question Details" description="View the details of the question">
            <ParentCard title="Question Details">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6">Question:</Typography>
                            <Typography variant="body1">{questionData.text}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6">Options:</Typography>
                            {questionData.options.map((option, index) => (
                                <Typography key={index} variant="body1">
                                    {`${option.label || ''}: ${option.text}`}
                                </Typography>
                            ))}
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6">Type:</Typography>
                            <Typography variant="body1">{questionData.type}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </ParentCard>
        </PageContainer>
    );
};

export default QuestionDetailPage;
