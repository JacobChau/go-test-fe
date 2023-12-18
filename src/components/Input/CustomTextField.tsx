import React from "react";
import { TextField } from "@mui/material";

export interface CustomTextFieldProps {
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
                                                             value,
                                                             onChange,
                                                             multiline = false,
                                                         }) => {
    return (
        <TextField
            fullWidth
            variant="outlined"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            multiline={multiline}
            sx={{
                textarea: {
                    resize: "vertical",
                    overflow: "auto",
                },
            }}
        />
    );
};

export default CustomTextField;
