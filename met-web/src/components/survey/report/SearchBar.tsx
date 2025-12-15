import React, { useState } from 'react';
import { InputAdornment, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons/faMagnifyingGlass';
import { Button, TextField } from 'components/common/Input';

const SearchBar = ({
    searchTerm,
    setSearchTerm,
}: {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}) => {
    const [searchValue, setSearchValue] = useState(searchTerm);
    return (
        <>
            <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField
                    id="question-name"
                    title="Search by name"
                    inputProps={{ 'aria-label': 'Filter questions by name' }}
                    sx={{ height: '48px', pr: 0 }}
                    name="searchText"
                    value={searchValue}
                    onChange={setSearchValue}
                    onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        setSearchTerm(searchValue);
                    }}
                    size="small"
                    endAdornment={
                        <InputAdornment position="end" sx={{ height: '100%', maxHeight: '100%' }}>
                            <Button
                                sx={{ borderRadius: '0 8px 8px 0px', marginRight: '-1rem' }}
                                variant="primary"
                                data-testid="survey/report/search-button"
                                disableElevation
                                onClick={() => {
                                    setSearchTerm(searchValue);
                                }}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '20px' }} />
                            </Button>
                        </InputAdornment>
                    }
                />
            </Stack>
        </>
    );
};

export default SearchBar;
