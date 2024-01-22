import { FC, useCallback } from "react";
import {
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Grid,
  Typography,
  useTheme,
  Switch,
} from "@mui/material";
import QuillEditor from "@components/Form/QuillEditor/QuillEditor.tsx";
import { HandleOptionChange } from "@/pages/question/components/QuestionOptions.tsx";

interface Option {
  id: string | number;
  text?: string;
  label?: string;
  isCorrect?: boolean;
}

export interface MultipleChoiceOptionsProps {
  isMultipleAnswer: boolean;
  options: Option[] | undefined;
  handleOptionChange: HandleOptionChange;
  useQuillEditor: boolean;
  toggleEditor: () => void;
}

const MultipleChoiceOptions: FC<MultipleChoiceOptionsProps> = ({
  isMultipleAnswer,
  options,
  handleOptionChange,
  useQuillEditor,
  toggleEditor,
}) => {
  const theme = useTheme();

  const handleTextChange = useCallback(
    (index: number, event: { target: { value: any } }) => {
      handleOptionChange(index, "text", event.target.value);
    },
    [handleOptionChange],
  );

  return (
    <Grid container alignItems="center" mt={2} justifyContent="space-between">
      <Grid item sx={{ mr: theme.spacing(6) }}>
        <Typography variant="subtitle1">CORRECT</Typography>
      </Grid>
      <Grid item xs>
        <Typography variant="subtitle1">QUESTION OPTION</Typography>
      </Grid>
      <Grid item xs style={{ textAlign: "right" }}>
        <FormControlLabel
          label={<Typography variant="subtitle1">TEXT EDITOR</Typography>}
          control={
            <Switch
              checked={useQuillEditor}
              onChange={toggleEditor}
              name="useQuillEditor"
              color="primary"
            />
          }
          labelPlacement={"start"}
        />
      </Grid>
      {options?.map((option: Option, index) => (
        <Grid item xs={12} key={option.id} pt={2}>
          <Grid container spacing={2}>
            <Grid item sx={{ width: "fit-content" }}>
              {isMultipleAnswer ? (
                <FormControlLabel
                  sx={{
                    ml: 0,
                    mr: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px",
                  }}
                  control={
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={(event) =>
                        handleOptionChange(
                          index,
                          "isCorrect",
                          event.target.checked,
                        )
                      }
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "1rem",
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        width: theme.spacing(4),
                        height: theme.spacing(6),
                        textAlign: "center", // Center align text
                        lineHeight: theme.spacing(6),
                        borderTopLeftRadius: "4px",
                        borderBottomLeftRadius: "4px",
                      }}
                    >
                      {option.label}
                    </Typography>
                  }
                  labelPlacement={"start"}
                  className="custom-checkbox" // Add a class for custom styling
                />
              ) : (
                <RadioGroup
                  aria-label="correct-options"
                  name="correct-options"
                  value={option.isCorrect ? index : ""}
                  onChange={(event) =>
                    handleOptionChange(index, "isCorrect", event.target.value)
                  }
                >
                  <FormControlLabel
                    sx={{
                      ml: 0,
                      mr: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: "4px",
                    }}
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "1rem",
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          width: theme.spacing(4),
                          height: theme.spacing(6),
                          textAlign: "center", // Center align text
                          lineHeight: theme.spacing(6),
                          borderTopLeftRadius: "4px",
                          borderBottomLeftRadius: "4px",
                        }}
                      >
                        {option.label}
                      </Typography>
                    }
                    control={<Radio color="primary" />}
                    labelPlacement={"start"}
                    value={index}
                    className="custom-radio" // Add a class for custom styling
                  />
                </RadioGroup>
              )}
            </Grid>
            <Grid item xs>
              {useQuillEditor ? (
                <QuillEditor
                  key={option.id}
                  value={option.text || ""}
                  onChange={(value: any) =>
                    handleOptionChange(index, "text", value)
                  }
                  minHeight={8}
                />
              ) : (
                <TextField
                  key={option.id}
                  fullWidth
                  multiline
                  label={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(event) => handleTextChange(index, event)}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default MultipleChoiceOptions;
