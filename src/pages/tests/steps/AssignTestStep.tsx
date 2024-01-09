import React from "react";
import {
    Alert,
    Box,
    Checkbox,
    CircularProgress,
    Grid,
    Snackbar, Table, TableBody, TableCell,
    TableContainer, TableFooter, TableHead, TablePagination, TableRow,
    Typography
} from "@mui/material";
import {useFetchData} from "@/hooks";
import BlankCard from "@components/Card/BlankCard.tsx";
import {ActionTable} from "@components/PaginationTable";
import SearchComponent from "@components/Search/SearchComponent.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import PageContainer from "@components/Container/PageContainer.tsx";
import {PaginationState} from "@/types/apis";
import {GroupAttributes} from "@/types/apis/groupTypes.ts";
import GroupService from "@/api/services/groupService.ts";
import GroupSearchColumn from "@/pages/groups/components/GroupSearchColumn.ts";
import {GroupColumns} from "@/pages/groups/components/GroupColumns.tsx";

const initialPagination: PaginationState  = {
    page: 0,
    perPage: 5,
    total: -1
};

interface AssignTestProps {
    selectedGroups: Set<number>;
    setSelectedGroups: (selectedGroups: Set<number>) => void;
}

const AssignTest: React.FC<AssignTestProps> = ({ selectedGroups, setSelectedGroups }) => {
    const {
        items: groups,
        searchTerm,
        searchCriteria,
        handleSearchTermChange,
        handleSearchChange,
        loading,
        error,
        setError,
        pagination,
        handlePageChange,
        handleRowsPerPageChange,
    } = useFetchData<GroupAttributes>(GroupService.getGroups, initialPagination, GroupSearchColumn[0]);

    const handleSelectGroup = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        const updatedSelectedGroups = new Set<number>(selectedGroups);
        if (event.target.checked) {
            updatedSelectedGroups.add(id);
        } else {
            updatedSelectedGroups.delete(id);
        }
        setSelectedGroups(updatedSelectedGroups);
    };

    const handleSelectAllGroups = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedSelectedGroups = new Set<number>(selectedGroups);
        if (event.target.checked) {
            groups.forEach((group) => updatedSelectedGroups.add(group.id));
        } else {
            groups.forEach((group) => updatedSelectedGroups.delete(group.id));
        }
        setSelectedGroups(updatedSelectedGroups);
    };

    const isGroupSelected = (id: number) => selectedGroups.has(id);

    return (
        <>
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
            <PageContainer title={"Add Groups to Test"} description={"Add groups to test"}>
                <ParentCard title={"Add Groups to Test"}>
                    <BlankCard>
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
                        <Grid container sx={{ marginBottom: 2 }}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                                    Search
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ marginBottom: 1 }}>
                                <SearchComponent searchTerm={searchTerm} onSearchChange={handleSearchChange} searchColumn={GroupSearchColumn} searchCriteria={searchCriteria} onSearchTermChange={handleSearchTermChange} />
                            </Grid>
                        </Grid>

                        <Grid container sx={{ marginBottom: 2, alignItems: 'center' }}>
                            <Grid item xs={6}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                                        Selected Groups
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        {selectedGroups.size} group(s) selected
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <TableContainer sx={{ position: 'relative' }}>
                            <Table aria-label={'group-bank'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selectedGroups.size > 0 && selectedGroups.size < groups.length}
                                                checked={groups.length > 0 && selectedGroups.size === groups.length}
                                                onChange={handleSelectAllGroups}
                                                inputProps={{ 'aria-label': 'select all groups' }}
                                            />
                                        </TableCell>
                                        {GroupColumns.map((column, index) => (
                                            <TableCell key={index} sx={column.sx}>
                                                <Typography variant="h6">{column.label}</Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groups.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={GroupColumns.length + 1}>
                                                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                                    No data found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {groups.map((group) => (
                                        <TableRow key={group.id}>
                                            <TableCell padding="checkbox" sx={{ width: '5%' }}>
                                                <Checkbox
                                                    checked={isGroupSelected(group.id)}
                                                    onChange={(event) => handleSelectGroup(group.id, event)}
                                                    inputProps={{ 'aria-label': 'select group' }}
                                                />
                                            </TableCell>
                                            {GroupColumns.map((column, index) => (
                                                // @ts-ignore
                                                <TableCell key={index} sx={column.sx}>{column.render ? column.render(group) : group[column.key]}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: 999999 }]}
                                            colSpan={GroupColumns.length + 1}
                                            count={pagination.total}
                                            rowsPerPage={pagination.perPage}
                                            page={pagination.page}
                                            onPageChange={handlePageChange}
                                            onRowsPerPageChange={handleRowsPerPageChange}
                                            ActionsComponent={ActionTable}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </BlankCard>
                </ParentCard>
            </PageContainer>
        </>
    );
}

export default AssignTest;
