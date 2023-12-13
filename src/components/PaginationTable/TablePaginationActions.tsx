import React from 'react';
import { IconButton, Button } from '@mui/material';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';

const CustomTablePaginationActions: React.FC<TablePaginationActionsProps> = (props) => {
    const { count, page, rowsPerPage, onPageChange } = props;
    const lastPage = Math.ceil(count / rowsPerPage) - 1;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, lastPage);
    };

    // Calculating page range for display
    const startPage = Math.max(0, page - 2);
    const endPage = Math.min(page + 2, lastPage);
    const pageRange = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div style={{ flexShrink: 0, marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                <FirstPage />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                <KeyboardArrowLeft />
            </IconButton>

            {pageRange.map((pageNum) => (
                <Button
                    key={pageNum}
                    onClick={(event) => onPageChange(event, pageNum)}
                    disabled={page === pageNum}
                    style={{ minWidth: '36px', margin: '0 3px' }}
                >
                    {pageNum + 1}
                </Button>
            ))}

            <IconButton onClick={handleNextButtonClick} disabled={page >= lastPage} aria-label="next page">
                <KeyboardArrowRight />
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= lastPage} aria-label="last page">
                <LastPage />
            </IconButton>
        </div>
    );
};

export default CustomTablePaginationActions;
