import React, { useContext } from 'react';
import { Stack, TextField } from '@mui/material';
import { PrimaryButton } from 'components/common';
import SearchIcon from '@mui/icons-material/Search';
import { ReportSettingsContext } from './ReportSettingsContext';

const SearchBar = () => {
    const { searchFilter, setSearchFilter } = useContext(ReportSettingsContext);
    const [searchText, setSearchText] = React.useState<string>('');

    return (
        <>
            <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                    id="engagement-name"
                    variant="outlined"
                    label="Search by name"
                    fullWidth
                    name="searchText"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                    size="small"
                />
                <PrimaryButton
                    data-testid="survey/report/search-button"
                    onClick={() => {
                        setSearchFilter({
                            ...searchFilter,
                            value: searchText,
                        });
                    }}
                >
                    <SearchIcon />
                </PrimaryButton>
            </Stack>
        </>
    );
};

export default SearchBar;
