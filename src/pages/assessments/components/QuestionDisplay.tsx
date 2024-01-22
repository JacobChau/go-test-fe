import React from "react";
import {
  Box,
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
import { QuestionType } from "@/constants/question.ts";
import { QuestionResultPayload } from "@/types/apis/assessmentTypes.ts";
import parse from "html-react-parser";
import { containsHtml } from "@/helpers";

interface QuestionDisplayProps {
  question: QuestionResultPayload;
  selectedOption?: Set<number> | string;
  onSelectOption?: (
    questionId: number,
    optionId: number,
    value: string | boolean,
  ) => void;
  readOnly?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedOption,
  onSelectOption,
  readOnly = false,
}) => {
  const handleOptionChange = (optionId: number, value: string | boolean) => {
    onSelectOption && onSelectOption(question.id, optionId, value);
  };

  const renderOptions = () => {
    switch (QuestionType[question.type]) {
      case QuestionType.TrueFalse:
      case QuestionType.MultipleChoice:
        return (
          <RadioGroup
            value={selectedOption || ""}
            onChange={(event) =>
              handleOptionChange(
                parseInt(event.target.value),
                event.target.value,
              )
            }
          >
            {question.options?.map((option) => (
              <Grid item key={option.id} sx={{ mb: 1 }}>
                <FormControlLabel
                  value={option.id.toString()}
                  control={<Radio disabled={readOnly} />}
                  label={parse(option.attributes.answer as string)}
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
                  ? selectedOption.has(+option.id)
                  : false;
              return (
                <Grid item key={option.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={(event) =>
                          handleOptionChange(+option.id, event.target.checked)
                        }
                        disabled={readOnly}
                      />
                    }
                    label={parse(option.attributes.answer as string)}
                  />
                </Grid>
              );
            })}
          </Grid>
        );
      case QuestionType.FillIn:
        return (
          <TextField
            fullWidth
            multiline
            value={(selectedOption as string) || ""}
            onChange={(event) => handleOptionChange(-1, event.target.value)}
            InputProps={{
              readOnly: readOnly,
            }}
          />
        );
      case QuestionType.Text:
        return (
          <TextField
            fullWidth
            multiline
            rows={12} // Set the number of rows for the text area
            value={selectedOption}
            onChange={(event) => handleOptionChange(-1, event.target.value)}
            variant="outlined"
            placeholder="Type your essay here..."
          />
        );
      default:
        return null;
    }
  };

  const renderContent = (content: string) => {
    return (
      <Box
        sx={{
          wordBreak: "break-word",
          "& img": { maxWidth: "100%", height: "auto" },
          "& p": { margin: 0 },
        }}
      >
        {containsHtml(content) ? (
          parse(content)
        ) : (
          <Typography component="div" gutterBottom sx={{ mb: 2 }} variant="h6">
            {content}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, minHeight: 400 }}>
      <CardContent>
        {renderContent(question.content as string)}
        {renderOptions()}
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
