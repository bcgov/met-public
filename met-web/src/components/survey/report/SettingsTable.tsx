import React, { useContext, useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';
import { HeadCell } from 'components/common/Table/types';
import MetTable from 'components/common/Table';
import { ClientSidePagination } from 'components/common/Table/ClientSidePagination';
import { SurveyReportSetting } from 'models/surveyReportSetting';
import { ReportSettingsContext } from './ReportSettingsContext';
import { updatedDiff } from 'deep-object-diff';

const SettingsTable = () => {
    const { surveyReportSettings, searchFilter, savingSettings, handleSaveSettings, tableLoading } =
        useContext(ReportSettingsContext);
    const [displayedMap, setDisplayedMap] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const map = surveyReportSettings.reduce((acc, curr) => {
            acc[curr.id] = curr.display;
            return acc;
        }, {} as { [key: number]: boolean });
        setDisplayedMap(map);
    }, [surveyReportSettings]);

    useEffect(() => {
        if (!savingSettings) {
            return;
        }
        const updatedSettings = surveyReportSettings.map((setting) => {
            return {
                ...setting,
                display: displayedMap[setting.id],
            };
        });
        const diff = updatedDiff(surveyReportSettings, updatedSettings);
        const diffKeys = Object.keys(diff);
        const updatedDiffSettings = diffKeys.map((key) => updatedSettings[Number(key)]);

        handleSaveSettings(updatedDiffSettings);
    }, [savingSettings]);

    const headCells: HeadCell<SurveyReportSetting>[] = [
        {
            key: 'id',
            numeric: false,
            disablePadding: true,
            label: 'Include in Report',
            allowSort: true,
            renderCell: (row: SurveyReportSetting) => (
                <Checkbox
                    data-testid={`checkbox-${row.id}`}
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
            {(props) => <MetTable {...props} headCells={headCells} loading={tableLoading} />}
        </ClientSidePagination>
    );
};

export default SettingsTable;
