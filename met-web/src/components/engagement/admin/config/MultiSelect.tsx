import React, { HTMLAttributes, useId, ReactFragment, SyntheticEvent } from 'react';
import {
    Autocomplete,
    AutocompleteProps,
    Box,
    BoxProps,
    Grid,
    IconButton,
    PaperProps,
    Popper,
    PopperProps,
    TextField,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faPlus, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { colors } from 'styles/Theme';
import { BodyText } from 'components/common/Typography';
import { When } from 'react-if';
import { Button } from 'components/common/Input';
import { MetPaper } from 'components/common';
import { OutlineBox } from 'components/common/Layout';

import {
    AutocompleteChangeReason,
    AutocompleteRenderInputParams,
    AutocompleteRenderOptionState,
} from '@mui/material/Autocomplete';
import { textInputStyles } from 'components/common/Input/TextInput';

interface OptionalMultiSelectProps<T> extends AutocompleteProps<T, false, false, false> {
    onChange: (e: SyntheticEvent<Element, Event>, value: T | null, reason?: AutocompleteChangeReason) => void;
    onInputChange?: (e: SyntheticEvent<Element, Event>, value: string) => void;
    selectedOptions?: T[];
    getOptionRequired?: (option: T) => boolean;
    renderSelectedOption: (
        props: HTMLAttributes<HTMLLIElement>,
        option: T,
        state: AutocompleteRenderOptionState,
    ) => ReactFragment | JSX.Element;
    getOptionLabel: (option: T) => string;
    isOptionEqualToValue: (option: T, value: T) => boolean;
    renderOption: (
        props: HTMLAttributes<HTMLLIElement>,
        option: T,
        state: AutocompleteRenderOptionState,
    ) => ReactFragment | JSX.Element;
    renderInput: (params: AutocompleteRenderInputParams) => JSX.Element;
    options: readonly T[];
    searchPlaceholder?: string;
    containerProps: BoxProps;
}

interface MultiSelectProps<T> extends Partial<OptionalMultiSelectProps<T>> {
    selectLabel: string;
    buttonLabel: string;
    selectedLabel: {
        singular: string;
        plural: string;
    };
}

const MultiSelect = <T,>({
    onChange,
    onInputChange,
    options,
    selectedOptions,
    renderOption,
    renderSelectedOption,
    renderInput,
    getOptionLabel,
    getOptionRequired,
    value,
    isOptionEqualToValue = (option, value) => option === value,
    selectLabel,
    buttonLabel,
    selectedLabel,
    containerProps,
    searchPlaceholder,
    ...props
}: MultiSelectProps<T>) => {
    const defaultRenderInput = (params: AutocompleteRenderInputParams) => {
        return (
            <TextField
                value={searchTerm}
                onBlur={() => setSearchTerm('')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchTerm(event.target.value);
                    onInputChange?.(event, event.target.value);
                }}
                {...params}
                InputProps={{
                    ...params.InputProps,
                    placeholder: searchPlaceholder ?? 'Search',
                    sx: textInputStyles,
                }}
                inputProps={{
                    ...params.inputProps,
                    sx: {
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: colors.type.regular.primary,
                        '&::placeholder': {
                            color: colors.type.regular.secondary,
                        },
                        '&:disabled': {
                            cursor: 'not-allowed',
                        },
                    },
                }}
            />
        );
    };

    renderInput = renderInput ?? defaultRenderInput;

    const defaultRenderSelectedOption = (_: HTMLAttributes<HTMLLIElement>, option: T) => {
        if (typeof option === 'string') {
            return option;
        }
        return JSON.stringify(option);
    };

    renderSelectedOption = renderSelectedOption ?? renderOption ?? defaultRenderSelectedOption;

    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentOption, setCurrentOption] = React.useState<T | null>(null);
    const id = useId();

    const handleRemoveOption = (e: SyntheticEvent<Element, Event>, value: T) => {
        onChange?.(e, value, 'removeOption');
    };

    const handleAddOption = () => {
        if (currentOption && !selectedOptions?.find((option) => isOptionEqualToValue(option, currentOption))) {
            setCurrentOption(null);
            setSearchTerm('');
            const e: SyntheticEvent<Element, Event> = new Event('addOption') as unknown as SyntheticEvent<
                Element,
                Event
            >;
            onChange?.(e, currentOption, 'selectOption');
        }
    };

    return (
        <Box {...containerProps}>
            <label htmlFor={id}>
                <BodyText bold size="small" sx={{ marginBottom: '8px' }}>
                    {selectLabel}
                </BodyText>
            </label>
            <Autocomplete
                id={id}
                openOnFocus
                value={currentOption}
                popupIcon={
                    <FontAwesomeIcon icon={faChevronDown} style={{ width: '16px', height: '16px', padding: '4px' }} />
                }
                PopperComponent={SearchPopper}
                PaperComponent={SearchPaper}
                onChange={(_, newValue: T | null) => setCurrentOption(newValue)}
                options={options ?? []}
                getOptionLabel={getOptionLabel}
                sx={{ maxWidth: '320px' }}
                renderOption={renderOption}
                renderInput={renderInput}
                {...props}
            />
            <When condition={currentOption !== null}>
                <Button
                    sx={{ mt: 2 }}
                    variant="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={handleAddOption}
                    aria-label={`Add ${currentOption ? getOptionLabel?.(currentOption) : 'option'}`}
                >
                    {buttonLabel}
                </Button>
            </When>
            <When condition={selectedOptions?.length}>
                <OutlineBox sx={{ width: '300px', maxWidth: '100%', marginTop: '1rem' }}>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <BodyText bold color="primary.main">
                                {selectedOptions?.length === 1 ? selectedLabel.singular : selectedLabel.plural}
                            </BodyText>
                        </Grid>
                        {selectedOptions?.map((option, index) => (
                            <Grid item container key={getOptionLabel?.(option)} alignItems="center" spacing={2}>
                                <Grid item>
                                    <FontAwesomeIcon icon={faCheck} color={colors.type.regular.primary} />
                                </Grid>
                                <Grid item>
                                    {renderSelectedOption?.({}, option, {
                                        selected: false,
                                        inputValue: searchTerm,
                                        index: index,
                                    })}
                                </Grid>
                                <Grid item marginLeft="auto" hidden={getOptionRequired?.(option) === true}>
                                    <IconButton
                                        sx={{ height: '16px', width: '16px' }}
                                        onClick={(e) => handleRemoveOption(e, option)}
                                        aria-label={`Remove ${getOptionLabel?.(option)}`}
                                    >
                                        <FontAwesomeIcon fontSize={16} icon={faXmark} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </OutlineBox>
            </When>
        </Box>
    );
};

const SearchPaper = (props: PaperProps) => <MetPaper {...props} children={props.children ?? []} />;
const SearchPopper = (props: PopperProps) => (
    <Popper
        {...props}
        keepMounted
        placement="bottom-end"
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
    />
);

export default MultiSelect;
