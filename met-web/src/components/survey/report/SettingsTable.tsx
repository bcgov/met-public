import React, { useContext, useEffect } from 'react';
import { Checkbox } from '@mui/material';

import { HeadCell } from 'components/common/Table/types';
import MetTable from 'components/common/Table';
import { ClientSidePagination } from 'components/common/Table/ClientSidePagination';
import { SurveyReportSetting } from 'models/surveyReportSetting';
import { ReportSettingsContext } from './ReportSettingsContext';

const SettingsTable = () => {
    const { surveyReportSettings, searchFilter } = useContext(ReportSettingsContext);
    const [displayedMap, setDisplayedMap] = React.useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        console.log('ran');
        const map = surveyReportSettings.reduce((acc, curr) => {
            acc[curr.id] = curr.display;
            return acc;
        }, {} as { [key: number]: boolean });
        setDisplayedMap(map);
    }, [surveyReportSettings]);

    const headCells: HeadCell<SurveyReportSetting>[] = [
        {
            key: 'id',
            numeric: false,
            disablePadding: true,
            label: 'Include in Report',
            allowSort: true,
            renderCell: (row: SurveyReportSetting) => (
                <Checkbox
                    checked={displayedMap[row.id]}
                    onClick={() => {
                        setDisplayedMap({
                            ...displayedMap,
                            [row.id]: !displayedMap[row.id],
                        });
                    }}
                />
            ),
        },
        {
            key: 'question',
            numeric: false,
            disablePadding: true,
            label: 'Question',
            allowSort: true,
            renderCell: (row: SurveyReportSetting) => row.question,
        },
        {
            key: 'question_type',
            numeric: false,
            disablePadding: true,
            label: 'Question Type',
            allowSort: true,
            renderCell: (row: SurveyReportSetting) => row.question_type,
        },
    ];

    return (
        <ClientSidePagination rows={surveyReportSettings} searchFilter={searchFilter}>
            {(props) => <MetTable {...props} headCells={headCells} loading={false} />}
        </ClientSidePagination>
    );
};

export default SettingsTable;
