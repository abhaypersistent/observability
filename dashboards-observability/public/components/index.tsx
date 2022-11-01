/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { QueryManager } from 'common/query_manager';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { AppMountParameters, CoreStart } from '../../../../src/core/public';
import { AppPluginStartDependencies } from '../types';
import { App } from './app';
import { Fallback } from './common/helpers/Fallback';

export const Observability = (
  CoreStartProp: CoreStart,
  DepsStart: AppPluginStartDependencies,
  AppMountParametersProp: AppMountParameters,
  pplService: any,
  dslService: any,
  savedObjects: any,
  timestampUtils: any,
  queryManager: QueryManager
) => {
  const errorHandler = (err: any) => {
    console.log('error handling ', err);
  };

  const handleError = useErrorHandler();
  // try {
  ReactDOM.render(
    <ErrorBoundary FallbackComponent={Fallback} onError={errorHandler}>
      <App
        CoreStartProp={CoreStartProp}
        DepsStart={DepsStart}
        pplService={pplService}
        dslService={dslService}
        savedObjects={savedObjects}
        timestampUtils={timestampUtils}
        queryManager={queryManager}
      />
    </ErrorBoundary>,
    AppMountParametersProp.element
  );
  // } catch (error) {
  //   console.log('222222222222222222222222222222222222222222222');
  //   console.log("Inside the error");
  //   console.log('222222222222222222222222222222222222222222222');
  //   handleError(error);
  // }

  // <ErrorBoundary FallbackComponent={Fallback} onError={errorHandler}>
  return () => ReactDOM.unmountComponentAtNode(AppMountParametersProp.element);
};
