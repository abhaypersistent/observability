/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { waitFor } from '@testing-library/react';
import { ConfigPanel } from '../config_panel';
import { ConfigGaugeValueOptions } from '../config_panes/config_controls/config_gauge_options';
import { ConfigPanelOptionGauge } from '../config_panes/config_controls/config_panel_option_gauge';
import {
  TEST_VISUALIZATIONS_DATA,
  EXPLORER_VISUALIZATIONS,
  GAUGE_TEST_VISUALIZATIONS_DATA,
} from '../../../../../../../test/event_analytics_constants';
import { TabContext } from '../../../../hooks';
import PPLService from '../../../../../../services/requests/ppl';
import httpClientMock from '../../../../../../../test/__mocks__/httpClientMock';

jest.mock('!!raw-loader!./default.layout.spec.hjson', () => 'MOCK HJSON STRING');

describe('Config panel component', () => {
  configure({ adapter: new Adapter() });

  it('Renders config panel with visualization data', async () => {
    const setCurVisId = jest.fn();
    const tabId = 'query-panel-1';
    const curVisId = 'bar';
    const curVisIdG = 'gauge';
    const pplService = new PPLService(httpClientMock);
    const mockChangeIsValidConfigOptionState = jest.fn();

    const wrapper = mount(
      <TabContext.Provider
        value={{
          tabId,
          curVisId,
          dispatch: jest.fn(),
          changeVisualizationConfig: jest.fn(),
          explorerVisualizations: EXPLORER_VISUALIZATIONS,
          setToast: jest.fn(),
          pplService,
        }}
      >
        <ConfigPanel
          visualizations={TEST_VISUALIZATIONS_DATA}
          setCurVisId={setCurVisId}
          changeIsValidConfigOptionState={mockChangeIsValidConfigOptionState}
        />
      </TabContext.Provider>
    );

    const gaugeWrapper = mount(
      <TabContext.Provider
        value={{
          tabId,
          curVisIdG,
          dispatch: jest.fn(),
          changeVisualizationConfig: jest.fn(),
          explorerVisualizations: EXPLORER_VISUALIZATIONS,
          setToast: jest.fn(),
          pplService,
        }}
      >
        <ConfigGaugeValueOptions
          visualizations={TEST_VISUALIZATIONS_DATA}
          schemas={[]}
          sectionName={''}
          vizState={''}
          handleConfigChange={mockChangeIsValidConfigOptionState}
        />
      </TabContext.Provider>
    );

    const gaugeWrapperOption = mount(
      <TabContext.Provider
        value={{
          tabId,
          curVisIdG,
          dispatch: jest.fn(),
          changeVisualizationConfig: jest.fn(),
          explorerVisualizations: EXPLORER_VISUALIZATIONS,
          setToast: jest.fn(),
          pplService,
        }}
      >
        <ConfigPanelOptionGauge
          visualizations={TEST_VISUALIZATIONS_DATA}
          panelOptionsValues={''}
          vizState={''}
          handleConfigChange={mockChangeIsValidConfigOptionState}
        />
      </TabContext.Provider>
    );

    wrapper.update();

    await waitFor(() => {
      expect(wrapper).toMatchSnapshot();
    });

    gaugeWrapper.update();

    await waitFor(() => {
      expect(gaugeWrapper).toMatchSnapshot();
    });

    gaugeWrapperOption.update();

    await waitFor(() => {
      expect(gaugeWrapperOption).toMatchSnapshot();
    });
  });
});
