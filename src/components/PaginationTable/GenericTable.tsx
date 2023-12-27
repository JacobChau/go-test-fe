import {
    Box,
    Button, CircularProgress,
    Grid,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import ParentCard from "../Card/ParentCard";
import PageContainer from "../Container/PageContainer";
import BlankCard from "../Card/BlankCard";
import React, {useState} from "react";
import {ActionTable} from "@components/PaginationTable/index.tsx";
import SearchComponent, {SearchColumn, SearchCriteria} from "@components/Search/SearchComponent.tsx";

export interface TableColumn {
    label: string;
    key: string;
    type: string;
    enumValues?: string[];
    validation?: object;
    canEdit: boolean;
    canSearch: boolean;
    sx?: object;
    render?: (row: any) => React.ReactNode;
}

export interface FilterProps {
    filters: any;
    onChange: (filters: any) => void;
}

export interface ActionTableProps {
    row: any;
    rowIndex: number;
    handleEdit: (rowIndex: number) => void;
    onDeleted?: (_id: string) => void;
}



export type ActionHandler = (props: ActionTableProps) => React.ReactNode;

interface GenericTableProps {
    title: string;
    description: string;
    readonly?: boolean;
    columns: TableColumn[];
    searchColumn: SearchColumn[];
    searchCriteria: SearchCriteria;
    searchTerm?: string;
    onSearch: (searchCriteria: SearchCriteria) => void;
    onSearchTermChange: (searchTerm: string) => void;
    data: any[];
    actions?: ActionHandler;
    page: number;
    onPageChange: (event: any, newPage: number) => void;
    rowsPerPage: number;
    onRowsPerPageChange: (event: { target: { value: string; }; }) => void;
    totalRows: number;
    onSaved?: (newData: any) => void;
    onUpdated?: (_id: string, newData: any) => void;
    onDeleted?: (_id: string) => void;
    FormComponent?: React.ComponentType<{ open: boolean, onClose: () => void, onSave: (newData: any) => void }>;
    loading: boolean;
    renderFilterComponent?: (onFilter: (filters: any) => void) => React.ReactNode;
    onAddNewRecord?: () => void;
}


const GenericTable: React.FC<GenericTableProps> = ({
                                                       title,
                                                       description,
                                                       columns,
                                                       data,
                                                       actions,
                                                       FormComponent,
                                                       onDeleted,
                                                       onUpdated,
                                                       page,
                                                       rowsPerPage,
                                                       onPageChange,
                                                       onRowsPerPageChange,
                                                       totalRows,
                                                       onAddNewRecord,
                                                       onSaved,
                                                       loading, onSearchTermChange, searchTerm,
                                                       searchColumn, searchCriteria, onSearch, renderFilterComponent,
                                                         readonly = false
                                                   }) => {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<Record<string, any>>({});
    const [showForm, setShowForm] = useState(false);

    const handleEdit = (rowIndex: number) => {
        setEditingRow(rowIndex);
        setEditedData({ ...data[rowIndex] });
    };

    const handleUpdate = (editedData: any) => {
        onUpdated && onUpdated(editedData.id, editedData);

        setEditingRow(null);
        setEditedData({});
    }

    const handleAddClick = () => {
        if (onAddNewRecord) {
            onAddNewRecord();
        }

        setShowForm(true);
    }

    const handleCloseForm = () => setShowForm(false);
    const handleSaveForm = (newData: any) => {
        onSaved && onSaved(newData);
        setShowForm(false);
    };

    return (
        <PageContainer title={title} description={description}>
            <ParentCard title={title}>
                <BlankCard>
                    {renderFilterComponent && (
                        <Grid container sx={{ marginBottom: 3 }}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                                    Filter
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {renderFilterComponent(onSearch)}
                            </Grid>
                        </Grid>
                    )}
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                                Search
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ marginBottom: 2 }}>
                            <SearchComponent searchTerm={searchTerm} onSearchChange={onSearch} searchColumn={searchColumn} searchCriteria={searchCriteria} onSearchTermChange={onSearchTermChange} />
                        </Grid>
                        {!readonly && (
                            <Grid item xs={12}>
                                <Button
                                    sx={{ marginBottom: 2, float: 'right' }}
                                    variant="contained"
                                    onClick={handleAddClick}
                                >
                                    Add New Record
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                    {FormComponent && (
                        <FormComponent
                            open={showForm}
                            onClose={handleCloseForm}
                            onSave={handleSaveForm}
                        />
                    )}
                        <TableContainer sx={{ position: 'relative' }}>
                            {loading && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        zIndex: 10
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                            <Table aria-label={title}>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column, index) => (
                                            <TableCell key={index} sx={column.sx}>
                                                <Typography variant="h6">{column.label}</Typography>
                                            </TableCell>
                                        ))}
                                        {(actions && !readonly) && <TableCell sx={{ p: 0, textAlign: 'center', width: '10%' }}>
                                            <Typography variant="h6">Action</Typography>
                                        </TableCell>
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                                                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                                    No data found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {data.map((row, rowIndex) => (
                                    <TableRow key={row.id || rowIndex}>
                                        {columns.map((column, colIndex) => (
                                            <TableCell key={colIndex} sx={column.sx}>
                                                {editingRow === rowIndex ? (
                                                    // Display editor in edit mode depending on the column type
                                                    // if type is readonly, display the value as text
                                                    !column.canEdit ? (
                                                        column.render ? column.render(row) : row[column.key]
                                                    ) :
                                                    column.type === 'enum' ? (
                                                        <TextField
                                                            select
                                                            fullWidth
                                                            value={editedData[column.key]}
                                                            onChange={(e) =>
                                                                setEditedData({
                                                                    ...editedData,
                                                                    [column.key]: e.target.value,
                                                                })
                                                            }
                                                        >
                                                            {column.enumValues?.map((value, index) => (
                                                                <MenuItem key={index} value={value}>
                                                                    {value}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    ) : column.type === 'date' ? (
                                                        <TextField
                                                            fullWidth
                                                            type="date"
                                                            value={dayjs(editedData[column.key]).format('YYYY-MM-DD')}
                                                            onChange={(e) =>
                                                                setEditedData({
                                                                    ...editedData,
                                                                    [column.key]: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    ) : column.type === 'user' ? (
                                                        <>
                                                            <TextField
                                                                value={editedData['name']}
                                                                onChange={(e) =>
                                                                    setEditedData({ ...editedData, name: e.target.value })
                                                                }
                                                            />
                                                            {/* Add edit component for 'Avatar' if needed */}
                                                        </>
                                                        ) : (
                                                        <TextField
                                                            value={editedData[column.key]}
                                                            onChange={(e) =>
                                                                setEditedData({
                                                                    ...editedData,
                                                                    [column.key]: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    )
                                                ) : (
                                                    column.render ? column.render(row) : row[column.key]
                                                )}
                                            </TableCell>
                                        ))}
                                        {actions && !readonly && (
                                            <TableCell sx={{ p: 0, textAlign: 'center', width: '10%' }}>
                                                {editingRow === rowIndex ? (
                                                    // Display Save button in edit mode
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleUpdate(editedData)}
                                                    >
                                                        Save
                                                    </Button>
                                                ) : (
                                                    actions({
                                                        row,
                                                        rowIndex,
                                                        handleEdit,
                                                        onDeleted,
                                                    })
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: 999999 }]}
                                        colSpan={columns.length + (actions ? 1 : 0)}
                                        count={totalRows}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={onPageChange}
                                        onRowsPerPageChange={onRowsPerPageChange}
                                        ActionsComponent={ActionTable}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </BlankCard>
            </ParentCard>
        </PageContainer>
    );
};

export default GenericTable;
