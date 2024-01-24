import { TableColumn } from "@components/PaginationTable/GenericTable.tsx";
import { SearchType } from "@/constants/search.ts";
import React from "react";
import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export type SearchColumn = Pick<TableColumn, "key" | "label">;

export interface SearchCriteria {
  type: keyof typeof SearchType;
  column?: SearchColumn;
}
export interface SearchProps {
  onSearchChange: (searchCriteria: SearchCriteria) => void;
  searchColumn: SearchColumn[];
  searchCriteria: SearchCriteria;
  searchTerm?: string;
  onSearchTermChange: (searchTerm: string) => void;
}

const SearchComponent: React.FC<SearchProps> = ({
  onSearchChange,
  searchColumn,
  searchCriteria,
  searchTerm,
  onSearchTermChange,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="search-column-label">Column</InputLabel>
          <Select
            labelId="search-column-label"
            id="search-column-select"
            value={searchCriteria.column?.key || ""}
            onChange={(e) =>
              onSearchChange({
                ...searchCriteria,
                column: searchColumn.find(
                  (column) => column.key === e.target.value,
                ),
              })
            }
            label="Column"
          >
            {searchColumn.map((column, index) => (
              <MenuItem key={index} value={column.key}>
                {column.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="search-type-label">Type</InputLabel>
          <Select
            labelId="search-type-label"
            id="search-type-select"
            value={searchCriteria.type || ""}
            onChange={(e) =>
              onSearchChange({
                ...searchCriteria,
                type: e.target.value as keyof typeof SearchType,
              })
            }
            label="Type"
          >
            {Object.keys(SearchType).map((key, index) => (
              <MenuItem key={index} value={key}>
                {SearchType[key as keyof typeof SearchType]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder="Search..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SearchComponent;
