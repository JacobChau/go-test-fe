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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {AssessmentQuestionAttributes, Identity} from "@/types/apis";
import React, {FC, useEffect, useState} from "react";
import {ParentCard, BlankCard} from "@components/Card";

const QuestionSettingColumn = [
    {
        id: 'id',
        label: 'ID',
        key: 'id',
        type: 'text',
        sx: {width: '5%', p: '0'}
    },
    {
        id: 'question',
        label: 'Questions',
        key: 'content',
        type: 'text',
        sx: {width: '75%', p: '0'}
    },
    {
        id: 'marks',
        label: 'Marks',
        key: 'marks',
        type: 'number',
        sx: {width: '15%', p: '0'}
    },
];



interface QuestionSettingStepProps {
    totalMarks: number;
    questions: Map<number, AssessmentQuestionAttributes & Identity>;
    setQuestions: React.Dispatch<React.SetStateAction<Map<number, AssessmentQuestionAttributes & Identity>>>;
}

const QuestionSettingStep: FC<QuestionSettingStepProps> = ({totalMarks, questions, setQuestions}) => {
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
    const [bulkMark, setBulkMark] = useState(0);

    const calculateMedianMark = () => {
        const numberOfQuestions = questions.size;
        if (numberOfQuestions > 0) {
            return totalMarks / numberOfQuestions;
        }
        return 0;
    };

    const medianMark = calculateMedianMark();

    useEffect(() => {
        const updatedQuestions = new Map();
        questions.forEach((question) => {
            updatedQuestions.set(question.id, { ...question, marks: medianMark });
        });
        setQuestions(updatedQuestions);
    }, [medianMark, totalMarks]);


    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(questions.values());
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedQuestions = new Map();
        items.forEach((item, index) => {
            updatedQuestions.set(item.id, { ...item, order: index });
        });

        setQuestions(updatedQuestions);
    };

    const handleMarkChange = (id: number, marks: string) => {
        // Parse as float and restrict to two decimal places
        const newMark = parseFloat(marks);
        if (!isNaN(newMark)) {
            const updatedQuestions = new Map(questions);
            const question = updatedQuestions.get(id);
            if (question) {
                updatedQuestions.set(id, { ...question, marks: parseFloat(newMark.toFixed(2)) });
                setQuestions(updatedQuestions);
            }
        }
    };

    const applyBulkMark = () => {
        const updatedQuestions = new Map(questions);
        selectedQuestions.forEach((question, id) => {
            if (updatedQuestions.has(id)) {
                updatedQuestions.set(id, { ...question, marks: bulkMark });
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
                        {/* Bulk Mark and Delete Selected Buttons */}
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
                        <Grid item sx={{ ml: 'auto' }}>
                            <Button onClick={deleteSelectedQuestions} variant="contained" color="secondary">
                                Delete Selected
                            </Button>
                        </Grid>
                    </Grid>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <TableContainer {...provided.droppableProps} ref={provided.innerRef} sx={{ pl: '1rem', pt: '1rem' }}>
                                    <Table aria-label={'question-setting-table'}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox" sx={{ p: '0.5rem' }}>
                                                    <Checkbox
                                                        checked={selectedQuestions.size === questions.size}
                                                        onChange={handleSelectAllQuestions}
                                                        inputProps={{ 'aria-label': 'select all questions' }}
                                                    />
                                                </TableCell>
                                                {QuestionSettingColumn.map((column) => (
                                                    <TableCell key={column.id} sx={column.sx}>
                                                        <Typography variant={'body1'}>
                                                            {column.label}
                                                        </Typography>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Array.from(questions.values()).map((question, index) => (
                                                <Draggable key={question.id} draggableId={String(question.id)} index={index}>
                                                    {(provided) => (
                                                        <TableRow
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            hover
                                                            selected={selectedQuestions.has(question.id)}
                                                        >
                                                            <TableCell padding="checkbox" sx={{ p: '0.5rem' }}>
                                                                <Checkbox
                                                                    checked={selectedQuestions.has(question.id)}
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
                                                                    sx={{ p: '0', m: '0.5rem 0' }}
                                                                    type="number"
                                                                    value={question.marks || 0}
                                                                    onChange={(e) => handleMarkChange(question.id, e.target.value)}
                                                                    inputProps={{ min: 0, step: "0.01", sx: { p: '0.5rem' } }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Grid>
            </BlankCard>
        </ParentCard>
    );
}

export default QuestionSettingStep;