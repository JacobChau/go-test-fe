import GenericTable, {ActionTableProps} from "@components/PaginationTable/GenericTable.tsx";
import UserActions from "./components/UserActions";
import {UserColumns} from "@/pages/users/components/UserColumns.tsx";
import {useCallback, useEffect, useState} from "react";
import {CreateUserParams, PaginationState, UserAttributes} from "@/types/apis";
import UserService from "@/api/services/userService.ts";
import {Alert, Snackbar} from "@mui/material";
import CreateUserForm from "@/pages/users/components/CreateUserForm.tsx";

const initialPagination: PaginationState  = {
    page: 0,
    perPage: 5,
    total: 0
};


const UserListPage = () => {
    const [users, setUsers] = useState<UserAttributes[]>([]);
    const [pagination, setPagination] = useState(initialPagination);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const {data, meta} = await UserService.getUsers({
                page: pagination.page + 1,
                perPage: pagination.perPage
            });

            const users = Array.isArray(data) ? data : [data];
            setUsers(users.map(user => ({...user.attributes, _id: user.id})));
            if (!pagination.total && meta && meta.total) {
                setPagination(prev => ({...prev, total: meta.total}));
            }

        } catch (error) {
            console.error('Failed to fetch users:', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.perPage]);

    useEffect(() => {
        fetchUsers().catch((error) => {
            console.error('Failed to fetch users:', error);
            setError('Failed to fetch users');
        })
    }, [fetchUsers]);

    const handleUserUpdated = async (_id: string, updatedUser: UserAttributes) => {
        setLoading(true);
        try {
            // Perform the update operation
            await UserService.updateUser(_id, updatedUser);

            // If successful, refetch the user list
            fetchUsers().catch((error) => {
                console.error('Failed to refetch users after update:', error);
                setError('Failed to update user and refetch list');
            });
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
            // Perform the update operation
            await UserService.deleteUser(_id);

            // If successful, refetch the user list
            fetchUsers().catch((error) => {
                console.error('Failed to refetch users after delete:', error);
                setError('Failed to delete user and refetch list');
            });
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

        fetchUsers().catch((error) => {
            console.error('Failed to refetch users after create:', error);
            setError('Failed to create user and refetch list');
        });
    }


    const handlePageChange = (newPage: number) =>
        setPagination(prev => ({...prev, page: newPage}));


    const handleRowsPerPageChange = (newRowsPerPage: number) =>
        setPagination({ ...initialPagination, perPage: newRowsPerPage });


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
            />
        </>
    );
}

export default UserListPage;
