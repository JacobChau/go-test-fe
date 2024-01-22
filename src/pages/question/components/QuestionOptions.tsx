import { QuestionType } from "@/constants/question.ts";
import { FC, useCallback, useState } from "react";
import {
  FillInTheBlanks,
  MultipleChoiceOptions,
  TrueFalseOptions,
} from "@/pages/question/components/options";
import { ExplanationAttributes, IdentityOptional } from "@/types/apis";
import { Option } from "@/pages/question/components/CreateOrUpdateQuestion.tsx";

export interface QuestionData {
  text: string;
  options: Option[];
  type: QuestionType;
  categoryId: string;
  passageId?: string;
  explanation?: ExplanationAttributes & IdentityOptional;
  hasQuillEditor: boolean;
}

export interface QuestionOptionsProps {
  questionData: Partial<QuestionData>;
  setQuestionData: any;
  quillEditor: boolean;
}

export interface HandleOptionChange {
  (index: number, field: string, value: any): void;
}

const QuestionOptions: FC<QuestionOptionsProps> = ({
  questionData,
  setQuestionData,
  quillEditor = false,
}) => {
  const [useQuillEditor, setUseQuillEditor] = useState(quillEditor);

  const toggleEditor = useCallback(() => {
    setUseQuillEditor((prev) => !prev);
  }, []);

  const handleSingleAnswerOptionChange: HandleOptionChange = useCallback(
    (index, field, value) => {
      const updatedOptions = questionData.options?.map((option, idx) => {
        if (field === "isCorrect") {
          return idx === index
            ? { ...option, [field]: Boolean(value) }
            : { ...option, [field]: false };
        }

        return idx === index ? { ...option, [field]: value } : option;
      });

      setQuestionData({ options: updatedOptions });
    },
    [questionData.options, setQuestionData],
  );

  const handleMultipleAnswerOptionChange: HandleOptionChange = useCallback(
    (index, field, value) => {
      const updatedOptions = questionData.options?.map((option, idx) =>
        idx === index ? { ...option, [field]: value } : option,
      );

      setQuestionData({ options: updatedOptions });
    },
    [questionData.options, setQuestionData],
  );

  const handleFillInBlankOptionChange: HandleOptionChange = (
    index,
    field,
    value,
  ) => {
    const updatedOptions = questionData.options?.map((option, idx) =>
      idx === index ? { ...option, [field]: value } : option,
    );

    setQuestionData({ options: updatedOptions });
  };

  const addNewBlank = () => {
    const updatedOptions = [
      // @ts-ignore
      ...questionData.options,
      // @ts-ignore
      { id: questionData.options.length + 1, text: "", isCorrect: true },
    ];
    setQuestionData({ options: updatedOptions });
  };

  const deleteBlank = (index: number) => {
    const updatedOptions = questionData?.options?.filter(
      (_: any, idx: number) => idx !== index,
    );
    setQuestionData({ options: updatedOptions });
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
          // @ts-ignore
          options={questionData.options}
          handleOptionChange={handleSingleAnswerOptionChange}
        />
      );
    case QuestionType.FillIn:
      return (
        <FillInTheBlanks
          // @ts-ignore
          options={questionData.options}
          handleOptionChange={handleFillInBlankOptionChange}
          addNewBlank={addNewBlank}
          deleteBlank={deleteBlank}
        />
      );
  }
};

export default QuestionOptions;
