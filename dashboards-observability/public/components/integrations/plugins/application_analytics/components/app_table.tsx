/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react-hooks/exhaustive-deps */

import '../app_analytics.scss';
import {
  EuiBadge,
  EuiButton,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiInMemoryTable,
  EuiLink,
  EuiLoadingSpinner,
  EuiOverlayMask,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPopover,
  EuiSpacer,
  EuiTableFieldDataColumnType,
  EuiText,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui';
import _ from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
import moment from 'moment';
import { DeleteModal } from '../../../../common/helpers/delete_modal';
import { AppAnalyticsComponentDeps } from '../home';
import { getCustomModal } from '../../../../custom_panels/helpers/modal_containers';
import { pageStyles, UI_DATE_FORMAT } from '../../../../../../common/constants/shared';
import {
  ApplicationType,
  AvailabilityType,
} from '../../../../../../common/types/application_analytics';

interface AppTableProps extends AppAnalyticsComponentDeps {
  loading: boolean;
  applications: ApplicationType[];
  fetchApplications: () => void;
  renameApplication: (newAppName: string, appId: string) => void;
  deleteApplication: (appList: string[], panelIdList: string[], toastMessage?: string) => void;
  clearStorage: () => void;
  moveToApp: (id: string, type: string) => void;
}

export function AppTable(props: AppTableProps) {
  const {
    chrome,
    applications,
    parentBreadcrumbs,
    fetchApplications,
    renameApplication,
    deleteApplication,
    setFilters,
    clearStorage,
    moveToApp,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isActionsPopoverOpen, setIsActionsPopoverOpen] = useState(false);
  const [modalLayout, setModalLayout] = useState(<EuiOverlayMask />);
  const [selectedApplications, setSelectedApplications] = useState<ApplicationType[]>([]);
  const createButtonText = 'Add Integration';

  useEffect(() => {
    chrome.setBreadcrumbs([
      ...parentBreadcrumbs,
      {
        text: 'Integrations',
        href: '#/integrations/plugins',
      },
    ]);
    clear();
    fetchApplications();
  }, []);

  const clear = () => {
    setFilters([]);
    clearStorage();
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onRename = async (newApplicationName: string) => {
    renameApplication(newApplicationName, selectedApplications[0].id);
    closeModal();
  };

  const onDelete = async () => {
    closeModal();
    const toastMessage = `Application${
      selectedApplications.length > 1 ? 's' : ' "' + selectedApplications[0].name + '"'
    } successfully deleted!`;
    await deleteApplication(
      selectedApplications.map((app) => app.id),
      selectedApplications.map((app) => app.panelId),
      toastMessage
    );
  };

  const renameApp = () => {
    setModalLayout(
      getCustomModal(
        onRename,
        closeModal,
        'Name',
        'Rename application',
        'Cancel',
        'Rename',
        selectedApplications[0].name
      )
    );
    showModal();
  };

  const deleteApp = () => {
    const applicationString = `application${selectedApplications.length > 1 ? 's' : ''}`;
    setModalLayout(
      <DeleteModal
        onConfirm={onDelete}
        onCancel={closeModal}
        title={`Delete ${selectedApplications.length} ${applicationString}`}
        message={`Are you sure you want to delete the selected ${selectedApplications.length} ${applicationString}?`}
      />
    );
    showModal();
  };

  const popoverButton = (
    <EuiButton
      data-test-subj="appAnalyticsActionsButton"
      iconType="arrowDown"
      iconSide="right"
      onClick={() => setIsActionsPopoverOpen(!isActionsPopoverOpen)}
    >
      Actions
    </EuiButton>
  );

  const popoverItems: ReactElement[] = [
    <EuiContextMenuItem
      key="rename"
      data-test-subj="renameApplicationContextMenuItem"
      disabled={applications.length === 0 || selectedApplications.length !== 1}
      onClick={() => {
        setIsActionsPopoverOpen(false);
        renameApp();
      }}
    >
      Rename
    </EuiContextMenuItem>,
    // <EuiContextMenuItem
    //   key="duplicate"
    //   disabled={applications.length === 0 || selectedApplications.length !== 1}
    // >
    //   Duplicate
    // </EuiContextMenuItem>,
    <EuiContextMenuItem
      key="delete"
      data-test-subj="deleteApplicationContextMenuItem"
      disabled={applications.length === 0 || selectedApplications.length === 0}
      onClick={() => {
        setIsActionsPopoverOpen(false);
        deleteApp();
      }}
    >
      Delete
    </EuiContextMenuItem>,
    // <EuiContextMenuItem key="addSample">Add sample application</EuiContextMenuItem>,
  ];

  const renderAvailability = (value: AvailabilityType, record: ApplicationType) => {
    if (value.color === 'loading') {
      return <EuiLoadingSpinner />;
    } else if (value.name) {
      return (
        <EuiBadge
          data-test-subj={`${value.name}AvailabilityBadge`}
          color={value.color || 'default'}
        >
          {value.name}
        </EuiBadge>
      );
    } else if (value.color === 'undefined') {
      return <EuiText>No match</EuiText>;
    } else if (value.color === 'null') {
      return <EuiText>-</EuiText>;
    } else {
      return (
        <EuiLink
          data-test-subj="setAvailabilityHomePageLink"
          onClick={() => moveToApp(record.id, 'createSetAvailability')}
        >
          Set Availability
        </EuiLink>
      );
    }
  };

  const tableColumns = [
    {
      field: 'name',
      name: 'Name',
      sortable: true,
      truncateText: true,
      render: (value, record) => (
        <EuiLink
          data-test-subj={`${record.name}ApplicationLink`}
          href={`#/integrations/plugins/application_analytics/${record.id}`}
        >
          {_.truncate(record.name, { length: 100 })}
        </EuiLink>
      ),
    },
    {
      field: 'composition',
      name: 'Composition',
      sortable: false,
      truncateText: true,
      render: (value, record) => (
        <EuiToolTip content={record.servicesEntities.concat(record.traceGroups).join(', ')}>
          <EuiText id="compositionColumn" data-test-subj="appAnalytics__compositionColumn">
            {record.servicesEntities.concat(record.traceGroups).join(', ')}
          </EuiText>
        </EuiToolTip>
      ),
    },
    {
      field: 'availability',
      name: 'Current Availability',
      sortable: true,
      render: renderAvailability,
    },
    {
      field: 'dateModified',
      name: 'Date Modified',
      sortable: true,
      render: (value) => <EuiText>{moment(value).format(UI_DATE_FORMAT)}</EuiText>,
    },
  ] as Array<EuiTableFieldDataColumnType<ApplicationType>>;

  return (
    <div style={pageStyles}>
      <EuiPage>
        <EuiPageBody component="div">
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>Integrations</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent id="applicationArea">
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                {/* <EuiTitle data-test-subj="applicationHomePageTitle" size="s">
                  <h3>
                    Applications<span className="panel-header-count"> ({applications.length})</span>
                  </h3>
                </EuiTitle> */}
              </EuiPageContentHeaderSection>
              <EuiPageContentHeaderSection>
                <EuiFlexGroup gutterSize="s">
                  <EuiFlexItem>
                    <EuiPopover
                      panelPaddingSize="none"
                      button={popoverButton}
                      isOpen={isActionsPopoverOpen}
                      closePopover={() => setIsActionsPopoverOpen(false)}
                    >
                      <EuiContextMenuPanel items={popoverItems} />
                    </EuiPopover>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiButton fill href="#/integrations/plugins/all_apps">
                      {createButtonText}
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiHorizontalRule />
            {applications.length > 0 ? (
              <EuiInMemoryTable
                loading={props.loading}
                items={applications}
                itemId="id"
                columns={tableColumns}
                tableLayout="auto"
                pagination={{
                  initialPageSize: 10,
                  pageSizeOptions: [8, 10, 13],
                }}
                sorting={{
                  sort: {
                    field: 'dateModified',
                    direction: 'desc',
                  },
                }}
                allowNeutralSort={false}
                isSelectable={true}
                selection={{
                  onSelectionChange: (items) => setSelectedApplications(items),
                }}
              />
            ) : (
              <>
                <EuiSpacer size="xxl" />
                <EuiText textAlign="center">
                  <h2>No applications</h2>
                </EuiText>
                <EuiSpacer size="m" />
                <EuiFlexGroup justifyContent="center">
                  <EuiFlexItem grow={false}>
                    <EuiButton fullWidth={false} href={`#/integrations/plugins/all_apps`}>
                      {createButtonText}
                    </EuiButton>
                  </EuiFlexItem>
                  {/* <EuiFlexItem grow={false}>
                    <EuiButton fullWidth={false}>Add sample applications</EuiButton>
                  </EuiFlexItem> */}
                </EuiFlexGroup>
                <EuiSpacer size="xxl" />
              </>
            )}
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
      {isModalVisible && modalLayout}
    </div>
  );
}
