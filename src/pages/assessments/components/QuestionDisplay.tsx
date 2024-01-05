import React from "react";
import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Identity } from "@/types/apis";
import { QuestionType } from "@/constants/question.ts";
import { QuestionDisplayData } from "@/pages/assessments/TakeAssessment.tsx";

interface QuestionDisplayProps {
  question: QuestionDisplayData & Identity;
  onSelectOption: (
    questionId: number,
    optionId: number,
    value: string | boolean,
  ) => void;
  selectedOption?: Set<number> | string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onSelectOption,
  selectedOption,
}) => {
  const renderOptions = () => {
    switch (question.type) {
      case QuestionType.TrueFalse:
      case QuestionType.MultipleChoice:
        return (
          <RadioGroup
            value={selectedOption || ""}
            onChange={(event) =>
              onSelectOption(
                question.id,
                parseInt(event.target.value),
                event.target.value,
              )
            }
          >
            {question.options?.map((option) => (
              <Grid item key={option.id}>
                <FormControlLabel
                  value={option.id.toString()}
                  control={<Radio />}
                  label={option.text}
                />
              </Grid>
            ))}
          </RadioGroup>
        );
      case QuestionType.MultipleAnswer:
        return (
          <Grid container direction="column">
            {question.options?.map((option) => {
              const isChecked =
                selectedOption instanceof Set
                  ? selectedOption.has(option.id)
                  : false;
              return (
                <Grid item key={option.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={(event) =>
                          onSelectOption(
                            question.id,
                            option.id,
                            event.target.checked,
                          )
                        }
                      />
                    }
                    label={option.text}
                  />
                </Grid>
              );
            })}
          </Grid>
        );
      case QuestionType.FillIn:
      case QuestionType.Text:
        return (
          <TextField
            fullWidth
            multiline
            value={(selectedOption as string) || ""}
            onChange={(event) =>
              onSelectOption(question.id, -1, event.target.value)
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, minHeight: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {question.text}
        </Typography>
        {renderOptions()}
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
