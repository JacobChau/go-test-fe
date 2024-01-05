import BlankCard from "@components/Card/BlankCard.tsx";
import {
    Button,
    Checkbox, Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {AssessmentQuestionAttributes, Identity} from "@/types/apis";
import React, {FC, useState} from "react";
import ParentCard from "@components/Card/ParentCard.tsx";

const QuestionSettingColumn = [
    {
        id: 'id',
        label: 'ID',
        key: 'id',
        type: 'text',
        sx: {width: '5%', p: '0 1rem'}
    },
    {
        id: 'question',
        label: 'Questions',
        key: 'content',
        type: 'text',
        sx: {width: '75%', p: '0 1rem'}
    },
    {
        id: 'mark',
        label: 'Marks',
        key: 'mark',
        type: 'number',
        sx: {width: '15%', p: '0 1rem'}
    },
];

interface QuestionSettingStepProps {
    questions: Map<number, AssessmentQuestionAttributes & Identity>;
    setQuestions: React.Dispatch<React.SetStateAction<Map<number, AssessmentQuestionAttributes & Identity>>>;
}

const QuestionSettingStep: FC<QuestionSettingStepProps> = ({questions, setQuestions}) => {
    if (!questions || questions.size === 0) {
        return (
            <BlankCard>
                <Typography variant={'body1'}>
                    No questions selected.
                </Typography>
            </BlankCard>
        );
    }
    const [selectedQuestions, setSelectedQuestions] = useState(new Map());
    const questionsValue = Array.from(questions.values());

    const [bulkMark, setBulkMark] = useState(0);

    const handleMarkChange = (id: number, mark: string) => {
        // Parse as float and restrict to two decimal places
        const newMark = parseFloat(mark);
        if (!isNaN(newMark)) {
            const updatedQuestions = new Map(questions);
            const question = updatedQuestions.get(id);
            if (question) {
                updatedQuestions.set(id, { ...question, mark: parseFloat(newMark.toFixed(2)) });
                setQuestions(updatedQuestions);
            }
        }
    };

    const applyBulkMark = () => {
        const updatedQuestions = new Map(questions);
        selectedQuestions.forEach((question, id) => {
            if (updatedQuestions.has(id)) {
                updatedQuestions.set(id, { ...question, mark: bulkMark });
            }
        });
        setQuestions(updatedQuestions);
    };


    const handleSelectAllQuestions = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelectedQuestions = new Map();
            questions.forEach((question, id) => {
                newSelectedQuestions.set(id, question);
            });
            setSelectedQuestions(newSelectedQuestions);
        } else {
            setSelectedQuestions(new Map());
        }
    }

    const deleteSelectedQuestions = () => {
        const updatedQuestions = new Map(questions);
        selectedQuestions.forEach((_, id) => {
            updatedQuestions.delete(id);
        });

        setQuestions(updatedQuestions);
    };


    return (
        <ParentCard title="Question Setting">
            <BlankCard>
                <Grid container spacing={2}>
                    <Grid item xs={12} container spacing={2} alignItems="center">
                        <Grid item xs={6} sm={4}>
                            <TextField
                                fullWidth
                                label="Set Marks for Selected"
                                type="number"
                                value={bulkMark}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const newBulkMark = value === "" ? 0 : parseFloat(value);
                                    if (!isNaN(newBulkMark) && newBulkMark >= 0) {
                                        setBulkMark(parseFloat(newBulkMark.toFixed(2)));
                                    }
                                }}
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        </Grid>
                        <Grid item>
                            <Button onClick={applyBulkMark} variant="contained" color="primary">
                                Apply Marks
                            </Button>
                        </Grid>

                        {/* Put the button delete select on the last right of the row*/}
                        <Grid item sx={{ml: 'auto'}}>
                            <Button onClick={deleteSelectedQuestions} variant="contained" color="secondary">
                                Delete Selected
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table aria-label={'question-setting-table'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedQuestions.size === questions.size}
                                                onChange={handleSelectAllQuestions}
                                                inputProps={{ 'aria-label': 'select all questions' }}
                                            />
                                        </TableCell>
                                        {QuestionSettingColumn.map((column) => (
                                            <TableCell
                                                key={column.id} sx={column.sx}
                                            >
                                                <Typography variant={'body1'}>
                                                    {column.label}
                                                </Typography>
                                            </TableCell>
                                        ))}

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {questionsValue.map((question) => {
                                        const isItemSelected = questions.has(question.id);
                                        return (
                                            <TableRow
                                                hover
                                                key={question.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedQuestions.has(question.id)}
                                                        inputProps={{ 'aria-labelledby': `question-${question.id}` }}
                                                        onChange={() => {
                                                            const newSelectedQuestions = new Map(selectedQuestions);
                                                            if (newSelectedQuestions.has(question.id)) {
                                                                newSelectedQuestions.delete(question.id);
                                                            } else {
                                                                newSelectedQuestions.set(question.id, question);
                                                            }
                                                            setSelectedQuestions(newSelectedQuestions);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={QuestionSettingColumn[0].sx}>
                                                    <Typography variant={'body1'}>
                                                        {question.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={QuestionSettingColumn[1].sx}>
                                                    <Typography variant={'body1'}>
                                                        {question.content}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={QuestionSettingColumn[2].sx}>
                                                    <TextField
                                                        sx={{p: '0', m: '1rem 0'}}
                                                        type="number"
                                                        value={question.mark || 0}
                                                        onChange={(e) => handleMarkChange(question.id, e.target.value)}
                                                        inputProps={{ min: 0, step: "0.01", sx: {p: '0.5rem'} }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </BlankCard>
        </ParentCard>
    );
}

export default QuestionSettingStep;