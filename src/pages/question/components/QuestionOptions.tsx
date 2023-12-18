import {QuestionType} from "@/constants/question.ts";
import {FC, useCallback, useState} from "react";
import {QuestionData} from "@/pages/question/CreateQuestion/CreateQuestion.tsx";
import {FillInTheBlanks, MultipleChoiceOptions, TrueFalseOptions} from "@/pages/question/components/options";


export interface QuestionOptionsProps {
    questionData: QuestionData;
    setQuestionData: any;
}

export interface HandleOptionChange {
    (index: number, field: string, value: any): void;
}

const QuestionOptions: FC<QuestionOptionsProps> = ({ questionData, setQuestionData }) => {
    const [useQuillEditor, setUseQuillEditor] = useState(false);

    const toggleEditor = useCallback(() => {
        setUseQuillEditor(prev => !prev);
    }, []);

    const handleSingleAnswerOptionChange: HandleOptionChange = (index, field, value) => {
        const updatedOptions = questionData.options.map((option, idx) =>
            idx === index ? { ...option, [field]: value } : { ...option, isCorrect: false }
        );

        console.log(updatedOptions);
        setQuestionData({ ...questionData, options: updatedOptions });
    };

    const handleMultipleAnswerOptionChange: HandleOptionChange = (index, field, value) => {
        const updatedOptions = questionData.options.map((option, idx) =>
            idx === index ? { ...option, [field]: value } : option
        );

        setQuestionData({ ...questionData, options: updatedOptions });
    };

    const handleFillInBlankOptionChange: HandleOptionChange = (index, field, value) => {
        const updatedOptions = questionData.options.map((option, idx) =>
            idx === index ? { ...option, [field]: value } : option
        );

        setQuestionData({ ...questionData, options: updatedOptions });
    };

    const addNewBlank = () => {
        const updatedOptions = [...questionData.options, { id: questionData.options.length + 1, text: "", isCorrect: true }];
        setQuestionData({ ...questionData, options: updatedOptions });
    }

    const deleteBlank = (index: number) => {
        const updatedOptions = questionData.options.filter((_, idx) => idx !== index);
        setQuestionData({ ...questionData, options: updatedOptions });
    };

    switch (questionData.type) {
        case QuestionType.MultipleChoice:
            return (
                <MultipleChoiceOptions
                    isMultipleAnswer={false}
                    options={questionData.options}
                    handleOptionChange={handleSingleAnswerOptionChange}
                    useQuillEditor={useQuillEditor}
                    toggleEditor={toggleEditor}
                />
            );
        case QuestionType.MultipleAnswer:
            return (
                <MultipleChoiceOptions
                    isMultipleAnswer={true}
                    options={questionData.options}
                    handleOptionChange={handleMultipleAnswerOptionChange}
                    useQuillEditor={useQuillEditor}
                    toggleEditor={toggleEditor}
                />
            );
        case QuestionType.TrueFalse:
            return (
                <TrueFalseOptions
                    options={questionData.options}
                    handleOptionChange={handleSingleAnswerOptionChange}
                />
            );
        case QuestionType.FillIn:
            return (
                <FillInTheBlanks
                    options={questionData.options}
                    handleOptionChange={handleFillInBlankOptionChange}
                    addNewBlank={addNewBlank}
                    deleteBlank={deleteBlank}
                />
            );
    }
}

export default QuestionOptions;