import GenericTable, {ActionTableProps} from "@components/PaginationTable/GenericTable.tsx";
import UserActions from "./components/UserActions";
import {UserColumns} from "@/pages/users/components/UserColumns.tsx";
import {CreateUserParams, PaginationState, UserAttributes} from "@/types/apis";
import UserService from "@/api/services/userService.ts";
import {Alert, Snackbar} from "@mui/material";
import CreateUserForm from "@/pages/users/components/CreateUserForm.tsx";
import {useFetchData} from "@/hooks";
import {SearchColumn} from "@components/Search/SearchComponent.tsx";

const initialPagination: PaginationState  = {
    page: 0,
    perPage: 5,
    total: 0
};

const UserSearchColumn: SearchColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'email_verified_at', label: 'Email Verified At' },
];


const UserListPage = () => {
    const {items: users, fetchData: fetchUsers,searchTerm, searchCriteria, handleSearchTermChange, handleSearchChange, loading, setLoading, error, setError, pagination, handlePageChange, handleRowsPerPageChange} = useFetchData<UserAttributes>(UserService.getUsers, initialPagination, UserSearchColumn[0]);

    const handleUserUpdated = async (_id: string, updatedUser: UserAttributes) => {
        setLoading(true);
        try {
            await UserService.updateUser(_id, updatedUser);

            fetchUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
            setError('Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleUserDeleted = async (_id: string) => {
        setLoading(true);
        try {
            await UserService.deleteUser(_id);

            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            setError('Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    const handleUserSaved = async (newUser: CreateUserParams) => {
        setLoading(true);
        await UserService.createUser(newUser);

        fetchUsers();
    }

    return (
        <>
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
            <GenericTable
                title="User List"
                description="List of users with details"
                columns={UserColumns}
                searchColumn={UserSearchColumn}
                data={users}
                actions={(props: ActionTableProps) => (
                    <UserActions
                        {...props}
                    />
                )}
                onSaved={handleUserSaved}
                onUpdated={handleUserUpdated}
                onDeleted={handleUserDeleted}
                page={pagination.page}
                totalRows={pagination.total}
                rowsPerPage={pagination.perPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                FormComponent={CreateUserForm}
                loading={loading}
                searchTerm={searchTerm}
                onSearchTermChange={handleSearchTermChange}
                onSearch={handleSearchChange}
                searchCriteria={searchCriteria}
            />
        </>
    );
}

export default UserListPage;
