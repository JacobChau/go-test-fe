import { Grid, Checkbox, FormControlLabel } from "@mui/material";
import React, { FC, useState } from "react";
import { FilterProps } from "@components/PaginationTable/GenericTable.tsx";

const AssessmentFilters: FC<FilterProps> = ({ filters, onChange }) => {
  const [isTakenFilter, setIsTakenFilter] = useState<boolean>(false);
  const [hasDurationFilter, setHasDurationFilter] = useState<boolean>(false);

  const handleIsTakenFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsTakenFilter(event.target.checked);
    onChange({ ...filters, isTaken: Boolean(event.target.checked) });
  };

  const handleHasDurationFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHasDurationFilter(event.target.checked);
    onChange({ ...filters, hasDuration: Boolean(event.target.checked) });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <FormControlLabel
          control={
            <Checkbox
              checked={isTakenFilter}
              onChange={handleIsTakenFilterChange}
            />
          }
          label="Taken"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={hasDurationFilter}
              onChange={handleHasDurationFilterChange}
            />
          }
          label="Has Duration"
        />
      </Grid>
    </Grid>
  );
};

export default AssessmentFilters;
