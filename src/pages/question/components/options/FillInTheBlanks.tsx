import { useState } from "react";
import {
    Button,
    Grid,
    IconButton,
    Typography,
    useTheme,
} from "@mui/material";
import { Option } from "@/pages/question/CreateQuestion/CreateQuestion.tsx";
import { HandleOptionChange } from "@/pages/question/components/QuestionOptions.tsx";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CustomTextField from "@components/Input/CustomTextField.tsx";

export interface FillInTheBlanksProps {
    options: Option[];
    handleOptionChange: HandleOptionChange;
    addNewBlank: () => void;
    deleteBlank: (index: number) => void;
}

const FillInTheBlanks = ({
                             options,
                             handleOptionChange,
                             addNewBlank,
                             deleteBlank,
                         }: FillInTheBlanksProps) => {
    const theme = useTheme();
    const [hoveredIndex, setHoveredIndex] = useState(-1); // State to track hovered TextField

    return (
        <Grid container alignItems="center" mt={2} justifyContent="space-between">
            <Grid item xs={1}>
                <Typography variant="subtitle1">ORDER</Typography>
            </Grid>
            <Grid item xs>
                <Typography variant="subtitle1">CORRECT ANSWER</Typography>
            </Grid>
            {options.map((option: Option, index) => (
                <Grid
                    container
                    alignItems="center"
                    mt={2}
                    justifyContent="space-between"
                    key={index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(-1)}
                >
                    <Grid container style={{ position: "relative" }}>
                        <Grid item xs={1}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "1rem",
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    width: theme.spacing(5.5),
                                    height: theme.spacing(6),
                                    textAlign: "center", // Center align text
                                    lineHeight: theme.spacing(6),
                                    borderRadius: "4px",
                                }}
                            >
                                {index + 1}
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <CustomTextField
                                value={option.text}
                                onChange={(text) => handleOptionChange(index, "text", text)}
                                multiline
                            />

                            {/* show the delete button when hovered and there are more than 1 blanks*/}
                            {hoveredIndex === index && options.length > 1 && (
                                <IconButton
                                    onClick={() => deleteBlank(index)}
                                    sx={{
                                        position: "absolute",
                                        right: 20,
                                        top: 0,
                                        width: theme.spacing(3.5),
                                        height: theme.spacing(3.5),
                                        transform: "translate(-50%, 40%)",
                                        backgroundColor: theme.palette.common.white,
                                        color: theme.palette.primary.main,
                                        transition: "background-color 0.2s ease-in-out",
                                    }}
                                >
                                    <DeleteOutlineIcon sx={{ fontSize: "1.3rem" }} />
                                </IconButton>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={12} style={{ marginTop: theme.spacing(2), textAlign: "right" }}>
                <Button onClick={addNewBlank} variant="outlined" color="primary">
                    Add New Blank
                </Button>
            </Grid>
        </Grid>
    );
};

export default FillInTheBlanks;
