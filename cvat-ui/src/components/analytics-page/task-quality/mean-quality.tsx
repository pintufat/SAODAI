// Copyright (C) 2023-2024 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { DownloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';
import Button from 'antd/lib/button';

import { QualityReport, TargetMetric, getCore } from 'cvat-core-wrapper';
import { toRepresentation } from 'utils/quality';
import AnalyticsCard from '../views/analytics-card';

interface Props {
    taskID: number;
    taskReport: QualityReport | null;
    targetMetric: TargetMetric;
    setQualitySettingsVisible: (visible: boolean) => void;
}

function MeanQuality(props: Props): JSX.Element {
    const {
        taskID, taskReport, targetMetric, setQualitySettingsVisible,
    } = props;
    const reportSummary = taskReport?.summary;

    const tooltip = (
        <div className='cvat-analytics-tooltip-inner'>
            <Text>
                Mean annotation quality consists of:
            </Text>
            <Text>
                Correct annotations:&nbsp;
                {reportSummary?.validCount || 0}
            </Text>
            <Text>
                Task annotations:&nbsp;
                {reportSummary?.dsCount || 0}
            </Text>
            <Text>
                GT annotations:&nbsp;
                {reportSummary?.gtCount || 0}
            </Text>
            <Text>
                Accuracy:&nbsp;
                {toRepresentation(reportSummary?.accuracy)}
            </Text>
            <Text>
                Precision:&nbsp;
                {toRepresentation(reportSummary?.precision)}
            </Text>
            <Text>
                Recall:&nbsp;
                {toRepresentation(reportSummary?.recall)}
            </Text>
        </div>
    );

    const downloadReportButton = (
        <div className='cvat-quality-summary-controls'>
            <Row>
                <Col>
                    {
                        taskReport?.id ? (
                            <Button type='primary' icon={<DownloadOutlined />} className='cvat-analytics-download-report-button'>
                                <a
                                    href={
                                        `${getCore().config.backendAPI}/quality/reports/${taskReport?.id}/data`
                                    }
                                    download={`quality-report-task_${taskID}-${taskReport?.id}.json`}
                                >
                                    Quality Report
                                </a>
                            </Button>
                        ) : null
                    }
                </Col>
                <Col>
                    <SettingOutlined
                        className='cvat-quality-settings-switch ant-btn ant-btn-default'
                        onClick={() => setQualitySettingsVisible(true)}
                    />
                </Col>
            </Row>
        </div>
    );

    return (
        <AnalyticsCard
            title='Mean annotation quality'
            className='cvat-task-mean-annotation-quality'
            value={toRepresentation(reportSummary?.[targetMetric])}
            tooltip={tooltip}
            rightElement={downloadReportButton}
        />
    );
}

export default React.memo(MeanQuality);
