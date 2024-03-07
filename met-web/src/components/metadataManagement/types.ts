import { SvgIconComponent } from '@mui/icons-material';
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import { EngagementMetadata, MetadataTaxon, MetadataTaxonModify } from 'models/engagement';
import { ControllerRenderProps, FieldErrorsImpl, FieldValues } from 'react-hook-form';
import * as yup from 'yup';

export type TaxonFormValues = {
    [key: string]: string[];
} & FieldValues;

export interface IProps {
    errorMessage?: string;
    errorCode?: string;
}

export interface ActionContextProps {
    metadataTaxa: MetadataTaxon[];
    selectedTaxon: MetadataTaxon | null;
    setSelectedTaxonId: (taxonId: number) => void;
    reorderMetadataTaxa: (taxonIds: number[]) => void;
    createMetadataTaxon: (taxon: MetadataTaxonModify) => Promise<MetadataTaxon | null>;
    updateMetadataTaxon: (taxon: MetadataTaxon) => void;
    removeMetadataTaxon: (taxonId: number) => void;
    isLoading: boolean;
}

export interface GenericInputProps {
    field: ControllerRenderProps<TaxonFormValues, string>;
    taxon: MetadataTaxon;
    taxonType: TaxonType;
    trigger: (name?: string | string[] | undefined) => Promise<boolean>;
    errors: Partial<
        FieldErrorsImpl<{
            [x: string]: any;
        }>
    >;
    setValue: (
        name: string,
        value: any,
        options?:
            | Partial<{
                  shouldValidate: boolean;
                  shouldDirty: boolean;
                  shouldTouch: boolean;
              }>
            | undefined,
    ) => void;
}

export interface TaxonType {
    name: string;
    icon: SvgIconComponent;
    supportsPresetValues: boolean;
    supportsFreeform: boolean;
    supportsMulti: boolean;
    yupValidator: yup.AnySchema;
    customInput?: (props: GenericInputProps) => JSX.Element;
    externalResource?: (value: string) => string;
    externalResourceLabel?: string;
}

export interface TaxonCardProps {
    taxon: MetadataTaxon;
    isExpanded: boolean;
    onSelect: (taxon: MetadataTaxon) => void;
    onExpand: (taxon: MetadataTaxon) => void;
    isSelected: boolean;
    index: number;
}
