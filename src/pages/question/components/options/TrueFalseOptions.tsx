import { FormControlLabel, Grid, Radio, RadioGroup, Typography, useTheme } from "@mui/material";
import { HandleOptionChange } from "@/pages/question/components/QuestionOptions.tsx";
import { FC } from "react";
import { Option } from "@/pages/question/CreateQuestion/CreateQuestion.tsx";

export interface TrueFalseOptionsProps {
    options: Option[];
    handleOptionChange: HandleOptionChange;
}

const TrueFalseOptions: FC<TrueFalseOptionsProps> = ({ options, handleOptionChange }) => {
    const theme = useTheme();

    return (
        <Grid container alignItems="center" mt={2} justifyContent="space-between">
            <Grid item xs>
                <Typography variant="subtitle1">CORRECT</Typography>
            </Grid>
            <Grid item xs>
                <Typography variant="subtitle1">CORRECT</Typography>
            </Grid>
            <Grid item xs={12} pt={2} container>
                <Grid item xs={6}>
                    <RadioGroup>
                        <FormControlLabel
                            sx={{ ml: 0, mr: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: "4px" }}
                            control={
                                <Radio
                                    checked={options[0].isCorrect}
                                    onChange={(event) => handleOptionChange(0, "isCorrect", event.target.checked)}
                                    color="primary"
                                />
                            }
                            label="True"
                        />
                    </RadioGroup>
                </Grid>
                <Grid item xs={6}>
                    <RadioGroup>
                        <FormControlLabel
                            sx={{ ml: 0, mr: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: "4px" }}
                            control={
                                <Radio
                                    checked={options[1].isCorrect}
                                    onChange={(event) => handleOptionChange(1, "isCorrect", event.target.checked)}
                                    color="primary"
                                />
                            }
                            label="False"
                        />
                    </RadioGroup>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default TrueFalseOptions;
