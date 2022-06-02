import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';

interface SearchBarProps {
    onClick: (text: string) => void;
}
export const SearchBar = ({ onClick }: SearchBarProps) => {
    const [searchText, setSearchText] = useState('');

    return (
        <>
            <Stack direction="row" spacing={1}>
                <TextField
                    id="engagement-name"
                    variant="outlined"
                    label="Search engagement by name"
                    fullWidth
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="small"
                />
                <Button variant="contained" onClick={() => onClick(searchText)}>
                    <SearchIcon />
                </Button>
            </Stack>
        </>
    );
};
