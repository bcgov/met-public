import { EditAttributes, EditAttributesOutlined } from '@mui/icons-material';
import { MetadataFilterType } from './types';

export const MetadataFilterTypes: { [key: string]: MetadataFilterType } = {
    chips_any: {
        name: 'Chips (Match Any Selected)',
        code: 'chips_any',
        details:
            'Users can click chips to filter by metadata. At least one of the selected values must be present on the engagement for it to be shown.',
        icon: EditAttributesOutlined,
    },
    chips_all: {
        name: 'Chips (Match All Selected)',
        code: 'chips_all',
        details:
            'Users can click chips to filter by metadata. All the selected values must be present on the engagement for it to be shown.',
        icon: EditAttributes,
    },
};
