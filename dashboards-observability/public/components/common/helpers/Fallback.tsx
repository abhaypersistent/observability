import React, { useState, useEffect } from 'react';
import { EuiOverlayMask } from '@elastic/eui';
import { useHistory } from 'react-router-dom';
import { FallbackModal } from './fallback_modal';

export const Fallback = (error: any, resetErrorBoundary: any) => {
  const [modalLayout, setModalLayout] = useState(<EuiOverlayMask />);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pathName = window.location.pathname.split('app');
  const history = useHistory();

  const goToHomePage = () => {
    closeModal();
    // history.push(`${pathName[0]}app/observability-dashboards#/${getPageName()}`);
    window.open(`${pathName[0]}app/observability-dashboards#/${getPageName()}`, '_self');
    window.location.reload();
  };

  const goToObservality = () => {
    closeModal();
    window.location.assign(`${pathName[0]}app/observability-dashboards`);
  };

  const getPageName = () => {
    const href = window.location.href;
    if (href.includes('event_analytics')) {
      return 'event_analytics';
    } else if (href.includes('application_analytics')) {
      return 'application_analytics';
    } else if (href.includes('trace_analytics')) {
      return 'trace_analytics/home';
    } else if (href.includes('operational_panels')) {
      return 'operational_panels';
    } else if (href.includes('notebooks')) {
      return 'notebooks';
    }

    return '';
  };

  const redirectedPage: any = {
    event_analytics: 'Event Analytics',
    application_analytics: 'Application Analytics',
    'trace_analytics/home': 'Trace Analytics home page',
    operational_panels: 'operational_panels',
    notebooks: 'notebooks',
  };

  useEffect(() => {
    showFallbackModel();
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showFallbackModel = () => {
    setModalLayout(
      <FallbackModal
        onConfirm={goToHomePage}
        onCancel={closeModal}
        title={`Error!`}
        message={`Redirecting to ${redirectedPage[getPageName()]}`}
      />
    );
    showModal();
  };
  return <>{isModalVisible && modalLayout}</>;
};
