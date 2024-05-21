import React, { useContext } from 'react';
import { Stack, TextField } from '@mui/material';
import { PrimaryButtonOld } from 'components/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons/faMagnifyingGlass';
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
                <PrimaryButtonOld
                    data-testid="survey/report/search-button"
                    onClick={() => {
                        setSearchFilter({
                            ...searchFilter,
                            value: searchText,
                        });
                    }}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '20px' }} />
                </PrimaryButtonOld>
            </Stack>
        </>
    );
};

export default SearchBar;
