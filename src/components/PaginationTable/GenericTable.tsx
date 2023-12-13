import {
    Box,
    Button, CircularProgress,
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
import React, {useCallback, useState} from "react";
import TablePaginationActions from "./TablePaginationActions";

export interface TableColumn {
    label: string;
    key: string;
    type: string;
    enumValues?: string[];
    validation?: object;
    canEdit: boolean;
    render?: (row: any) => React.ReactNode;
}


export interface ActionTableProps {
    row: any;
    rowIndex: number;
    handleEdit: (rowIndex: number) => void;
    onDeleted: (_id: string) => void;
}

export type ActionHandler = (props: ActionTableProps) => React.ReactNode;

interface GenericTableProps {
    title: string;
    description: string;
    columns: TableColumn[];
    data: any[];
    actions?: ActionHandler;
    page: number;
    onPageChange: (newPage: number) => void;
    rowsPerPage: number;
    onRowsPerPageChange: (newRowsPerPage: number) => void;
    totalRows: number;
    onSaved?: (newData: any) => void;
    onUpdated: (_id: string, newData: any) => void;
    onDeleted: (_id: string) => void;
    FormComponent?: React.ComponentType<{ open: boolean, onClose: () => void, onSave: (newData: any) => void }>;
    loading: boolean;
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
                                                       onSaved,
                                                       loading,
                                                   }) => {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<Record<string, any>>({});
    const [showForm, setShowForm] = useState(false);

    const handleChangePage = (_event: any, newPage: number) => {
        onPageChange(newPage);
    };


    const handleChangeRowsPerPage = useCallback((event: { target: { value: string; }; }) => {
        onRowsPerPageChange(parseInt(event.target.value, 10));
        onPageChange(0);
    }, [onRowsPerPageChange, onPageChange]);


    const handleEdit = (rowIndex: number) => {
        setEditingRow(rowIndex);
        setEditedData({ ...data[rowIndex] });
    };

    const handleUpdate = (editedData: any) => {
        onUpdated && onUpdated(editedData._id, editedData);

        setEditingRow(null);
        setEditedData({});
    }

    const handleAddClick = () => setShowForm(true);
    const handleCloseForm = () => setShowForm(false);
    const handleSaveForm = (newData: any) => {
        onSaved && onSaved(newData);
        setShowForm(false);
    };


    return (
        <PageContainer title={title} description={description}>
            <ParentCard title={title}>
                <BlankCard>
                    <Button
                        variant="contained"
                        onClick={handleAddClick}
                        sx={{ float: 'right', mb: 2 }}
                    >
                        Add New Record
                    </Button>
                    {FormComponent && (
                        <FormComponent
                            open={showForm}
                            onClose={handleCloseForm}
                            onSave={handleSaveForm}
                        />
                    )}
                        <TableContainer>
                            {loading && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        zIndex: 100,
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                            <Table aria-label={title}>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column, index) => (
                                            <TableCell key={index}>
                                                <Typography variant="h6">{column.label}</Typography>
                                            </TableCell>
                                        ))}
                                        {actions && <TableCell />}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, rowIndex) => (
                                    <TableRow key={row.id || rowIndex}>
                                        {columns.map((column, colIndex) => (
                                            <TableCell key={colIndex}>
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
                                        {actions && (
                                            <TableCell>
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
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
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
