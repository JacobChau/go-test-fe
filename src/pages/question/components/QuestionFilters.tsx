import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { QuestionType } from "@/constants/question.ts";
import questionService from "@/api/services/questionService.ts";
import { CategoryAttributes, Resource } from "@/types/apis";
import { setMessageWithTimeout } from "@/stores/messageSlice.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores/store.ts";
import { FilterProps } from "@components/PaginationTable/GenericTable.tsx";

const QuestionFilters: FC<FilterProps> = ({ filters, onChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<Resource<CategoryAttributes>[]>(
    [],
  );

  const fetchData = useCallback(async () => {
    const categoriesRes = await questionService.getCategories();
    const categoriesData = Array.isArray(categoriesRes.data)
      ? categoriesRes.data
      : [categoriesRes.data];
    setCategories(categoriesData);
  }, [dispatch]);

  useEffect(() => {
    fetchData().catch((err) => {
      dispatch(setMessageWithTimeout({ message: err.message, isError: true }));
    });
  }, [fetchData]);

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="question-type-label">Type</InputLabel>
          <Select
            label="Type"
            labelId="question-type-label"
            id="question-type"
            value={filters.type || ""}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
          >
            {Object.entries(QuestionType).map(([type, label], index) => {
              return (
                <MenuItem key={index} value={type}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs>
        <FormControl fullWidth>
          <InputLabel id="question-category-label">Category</InputLabel>
          <Select
            labelId="question-category-label"
            id="question-category-select"
            value={filters.category || ""}
            label="Category"
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category.id}>
                {category.attributes.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default QuestionFilters;
