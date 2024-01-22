import { FC, useState } from "react";
import { Button, Box, Collapse } from "@mui/material";
import QuillEditor from "@components/Form/QuillEditor/QuillEditor.tsx";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTheme } from "@mui/material/styles";

export interface QuestionExplanationProps {
  explanation?: string;
  setExplanation: (value: string) => void;
}

const QuestionExplanation: FC<QuestionExplanationProps> = ({
  explanation,
  setExplanation,
}) => {
  const theme = useTheme();
  const [showExplanation, setShowExplanation] = useState<boolean>(
    explanation !== undefined && explanation !== null && explanation !== "",
  );

  const toggleExplanation = () => setShowExplanation(!showExplanation);
  const handleExplanationChange = (value: string) => {
    setExplanation(value);
  };

  return (
    <Box sx={{ padding: 1, backgroundColor: theme.palette.common.white }}>
      <Button
        variant="text"
        color="primary"
        startIcon={showExplanation ? <RemoveIcon /> : <AddIcon />}
        onClick={toggleExplanation}
      >
        {showExplanation ? "Hide Explanation" : "Add Explanation"}
      </Button>

      <Collapse in={showExplanation}>
        <Box sx={{ mt: 2 }}>
          <QuillEditor
            value={explanation || ""}
            onChange={handleExplanationChange}
            placeholder="Type your explanation here..."
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default QuestionExplanation;
