import React, { useState, useEffect } from 'react';
import { EuiOverlayMask } from '@elastic/eui';
import { useHistory } from 'react-router-dom';
import { EuiGlobalToastList } from '@elastic/eui';
import { FallbackModal } from './fallback_modal';

export const Fallback = (error: any, resetErrorBoundary: any) => {
  const [modalLayout, setModalLayout] = useState(<EuiOverlayMask />);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [toasts, setToasts] = useState([]);
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

  const toastLists: any = [
    {
      title: 'Oops, there was an error',
      color: 'danger',
      iconType: 'help',
      text: `${error?.error?.message}`,
      toastLifeTimeMs: 1500,
    },
  ];

  const addToastHandler = () => {
    showModal();
    setToasts(toasts.concat(toastLists[0]));
  };

  const redirectedPage: any = {
    event_analytics: 'Event Analytics',
    application_analytics: 'Application Analytics',
    'trace_analytics/home': 'Trace Analytics home page',
    operational_panels: 'operational_panels',
    notebooks: 'notebooks',
  };

  useEffect(() => {
    console.log('0000---------------------------------------------------111111111111');
    console.log(error);
    console.log('0000---------------------------------------------------111111111111');
    addToastHandler();
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const removeToast = () => {
    setToasts([]);
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

  return (
    <>
      {isModalVisible && (
        <EuiGlobalToastList toasts={toasts} dismissToast={removeToast} toastLifeTimeMs={6000} />
      )}
    </>
  );
};
