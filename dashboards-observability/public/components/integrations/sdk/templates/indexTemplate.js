module.exports = {
    content : `import { EuiBreadcrumb } from '@elastic/eui';
    import React from 'react';
    import { CoreStart } from '../../../../../../../src/core/public';
    import DSLService from '../../../../services/requests/dsl';
    import PPLService from '../../../../services/requests/ppl';
    import { Tabs } from '../../common/tabs';
    
    interface CustomPanelViewProps {
      panelId: string;
      page: 'app' | 'operationalPanels';
      http: CoreStart['http'];
      pplService: PPLService;
      dslService: DSLService;
      chrome: CoreStart['chrome'];
      parentBreadcrumbs: EuiBreadcrumb[];
      setToast: (
        title: string,
        color?: string,
        text?: React.ReactChild | undefined,
        side?: string | undefined
      ) => void;
      onEditClick: (savedVisualizationId: string) => any;
      startTime: string;
      endTime: string;
      setStartTime: any;
      setEndTime: any;
      childBreadcrumbs?: EuiBreadcrumb[];
      appId?: string;
      updateAvailabilityVizId?: any;
      onAddClick?: any;
      tabId?: string;
      appType: string;
    }
    
    export const {file}Tab = (props: CustomPanelViewProps) => {
      const {
        panelId,
        page,
        appId,
        http,
        pplService,
        dslService,
        chrome,
        parentBreadcrumbs,
        childBreadcrumbs,
        startTime,
        endTime,
        setStartTime,
        setEndTime,
        updateAvailabilityVizId,
        tabId,
        appType,
        setToast,
        onEditClick,
        onAddClick,
      } = props;
    
      return (
        <Tabs
          panelId={panelId}
          http={http}
          pplService={pplService}
          dslService={dslService}
          chrome={chrome}
          parentBreadcrumbs={parentBreadcrumbs}
          childBreadcrumbs={childBreadcrumbs}
          // App analytics will not be renaming/cloning/deleting panels
          renameCustomPanel={async () => undefined}
          cloneCustomPanel={async () => Promise.reject()}
          deleteCustomPanel={async () => Promise.reject()}
          setToast={setToast}
          page={page}
          appId={appId}
          updateAvailabilityVizId={updateAvailabilityVizId}
          startTime={startTime}
          endTime={endTime}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          onAddClick={onAddClick}
          onEditClick={onEditClick}
          tabId={tabId}
          appType={appType}
        />
      );
    };`,
    appData: `{
      name: '$actionName',
      icon: '$actionName',
      path: 'create?type=integration&app=$actionName',
      description: 'Monitor connection and request metrics with $actionName',
    }`,
    data :`[
      {
        name: 'Sql',
        icon: 'MySQL',
        path: 'create?type=integration&app=Sql',
        description: 'Collect performance schema metrics, query throughput, custom metrics, and more',
      },
      {
        name: 'Nginx',
        icon: 'Nginx',
        path: 'create?type=integration&app=Nginx',
        description: 'Monitor connection and request metrics with NGINX',
      },
      {
        name: 'Kibana',
        icon: 'Kibana',
        path: 'create?type=integration',
        description: 'Monitor connection and request metrics with Kibana',
      },
      {
        name: 'Metrics',
        icon: 'Metrics',
        path: 'create?type=integration',
        description: 'Monitor connection and request metrics with Kibana',
      },
      {
        name: 'Apache',
        icon: 'Apache',
        path: 'create?type=integration&app=Apache',
        description: 'Monitor connection and request metrics with Apache',
      }
    ]`,
    apacheconstant : `export enum ApacheConfig {
      STEP_1 = 'Step 1',
      STEP_2 = 'Step 2',
      STEP_3 = 'Step 3',
      STEP_4 = 'Step 4',
      STEP1_DESC = 'In this step we have added the custom log that we want to retrieve in the log.',
      STEP2_DESC = 'In this step we need to provide the location of the access file.',
      STEP3_DESC = 'In this step we need to update the fluent configuration file (fluent.conf)',
      STEP4_DESC = 'In this step we need to provide the location of the access file.',
      STEP5_DESC = 'In this setting we have created nginx_json_format as index to fetch data.',
      CONFIGURATION_STEP1 = \`LogFormat " {"timestamp":"%{%d/%b/%Y %T}t.%{msec_frac}t %{%z}t", "process_time_taken_microseconds":"%D", "filename":"%f", "remoteIP":"%a", "host":"%V", "request_url":"%U", "query":"%q", "request_method":"%m", "redirected_request_status":"%>s", "userAgent":"%{User-agent}i", "referer":"%{Referer}i", "localIP":"%A", "cookie_varname":"%{VARNAME}C", "content_of_varname":"%{VARNAME}e", "remote_host_name":"%h", "request_protocol":"%H", "keepalive_request":"%k", "remote_logname":"%l", "canonical_port":"%p", "query_string":"%q", "first_line_request":"%r", "time_to_serve_Request":"%T", "authenticated_user":"%u", "canonical_servername":"%v", "connection_response_status":"%X", "byte_received":"%I", "byte_sent":"%O", "pid_child":"%P", "thread_id":"%{format}P", "status":"%s" }" custom\`,
      CONFIGURATION_STEP2 = \`##this uses the our custom log format access_log /var/log/nginx/json_format.log custom_format\`,
      CONFIGURATION_STEP3 = \`<source>
      @type tail
       <parse>
         @type json
         types bytes_sent:integer,byte_received:integer
         #time_key time
         #time_format %time
         #time_format %d/%b/%Y:%H:%M:%S %z
        </parse>
       path /var/log/apache2/custom.log
       pos_file /home/kbhise/apache_pos2
       tag  apache2
      </source>\`,
      CONFIGURATION_STEP4 = \`<match apache2>
      @type opensearch
      ssl_verify false
      host localhost
      port 9200
      index_name apache_log_final
      verify_os_version_at_startup false
      suppress_type_name true
      #include_timestamp true
     </match>\`,
      CONFIGURATION_STEP5 = \`"_source" : {
        "@timestamp" : "2022-06-13T09:56:19.609Z",
        "timestamp" : "13/Jun/2022 15:26:18.481 +0530",
        "process_time_taken_microseconds" : "1128427",
        "filename" : "/var/www/wordpress/index.php",
        "remoteIP" : "172.24.176.1",
        "host" : "172.24.191.180",
        "request_url" : "/index.php",
        "query" : "",
        "request_method" : "GET",
        "redirected_request_status" : "200",
        "userAgent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
        "referer" : "-",
        "localIP" : "172.24.191.180",
        "cookie_varname" : "-",
        "content_of_varname" : "-",
        "remote_host_name" : "172.24.176.1",
        "request_protocol" : "HTTP/1.1",
        "keepalive_request" : "0",
        "remote_logname" : "-",
        "canonical_port" : "80",
        "query_string" : "",
        "first_line_request" : "GET / HTTP/1.1",
        "time_to_serve_Request" : "1",
        "authenticated_user" : "-",
        "canonical_servername" : "test-wordpress.com",
        "connection_response_status" : "+",
        "byte_received" : "455",
        "byte_sent" : "10168",
        "pid_child" : "2850",
        "thread_id" : "format",
        "status" : "200",
        "Peer_IP" : "172.24.176.1",
        "response_size" : "9839",
        "header_line" : "-",
        "log_error_request_id" : "-",
        "varname_content" : "-",
        "client_port" : "format",
        "note_varname_content" : "-",
        "handler_resonse" : "application/x-httpd-php",
        "time" : "format",
        "time_taken_to_serve_request" : "UNIT",
        "servername" : "172.24.191.180",
        "content_varname_request" : "-",
        "content_varname_response" : "-"
        }\`,
    }`,
    apacheschema : `export interface apacheSource {
      process_time_taken_microseconds: number;
      filename: string;
      remoteIP: string;
      host: string;
      request_url: string;
      query: string;
      request_method: string;
      byte_received: number;
      byte_sent: number;
      pid_child: number;
      status: number;
      Peer_IP: string;
      response_size: number;
      servername:string;
      '@timestamp': string;
    }`,
    apacheindex : `import {
      EuiButton,
      EuiButtonEmpty,
      EuiCodeBlock,
      EuiFlexGroup,
      EuiFlexItem,
      EuiFlyoutFooter,
      EuiHorizontalRule,
      EuiLink,
      EuiPageBody,
      EuiPageContent,
      EuiPageContentHeader,
      EuiPageContentHeaderSection,
      EuiPageHeader,
      EuiPageHeaderSection,
      EuiPanel,
      EuiSpacer,
      EuiText,
      EuiTitle,
    } from '@elastic/eui';
    import React, { useState } from 'react';
    import { FlyoutContainers } from '../../../../common/flyout_containers';
    import { ApacheConfig } from './constant';
    
    type Props = {
      appName: string;
    };
    
    export function NginxDocument({ appName }: Props) {
      const [isFlyoutVisibleIntegration, setIsFlyoutVisibleIntegration] = useState(false);
      const closeIntegrationFlyout = () => {
        setIsFlyoutVisibleIntegration(false);
      };
    
      const openIntegrationFlyout = () => {
        setIsFlyoutVisibleIntegration(true);
      };
      let integrationFlyout;
      if (isFlyoutVisibleIntegration) {
        integrationFlyout = (
          <FlyoutContainers
            closeFlyout={closeIntegrationFlyout}
            flyoutHeader={
              <EuiPageHeader>
                <EuiPageHeaderSection>
                  {/* <EuiTitle data-test-subj="createPageTitle" size="l">
                    <h1>{appName} Doc</h1>
                  </EuiTitle> */}
                </EuiPageHeaderSection>
              </EuiPageHeader>
            }
            flyoutBody={
              <EuiPageContent style={{ overflow: 'scroll' }} id="appInfo">
                <EuiPageContentHeader>
                  <EuiPageContentHeaderSection>
                    <EuiTitle size="l">
                      <h1>{appName} Configurations</h1>
                    </EuiTitle>
                  </EuiPageContentHeaderSection>
                </EuiPageContentHeader>
                <EuiHorizontalRule />
                <EuiTitle data-test-subj="createPageTitle" size="s">
                  <h6>{ApacheConfig.STEP_1}</h6>
                </EuiTitle>
                <br />
                <EuiText data-test-subj="createPageTitle" size="s">
                  {ApacheConfig.STEP1_DESC}
                </EuiText>
                <br />
                <EuiCodeBlock language="json" overflowHeight={300}>
                  {ApacheConfig.CONFIGURATION_STEP1}
                </EuiCodeBlock>
                <br />
                <EuiTitle data-test-subj="createPageTitle" size="s">
                  <h6>{ApacheConfig.STEP_2}</h6>
                </EuiTitle>
                <br />
                <EuiText data-test-subj="createPageTitle" size="s">
                  {ApacheConfig.STEP2_DESC}
                </EuiText>
                <br />
                <EuiCodeBlock language="json" overflowHeight={300}>
                  {ApacheConfig.CONFIGURATION_STEP2}
                </EuiCodeBlock>
                <br />
                <EuiTitle data-test-subj="createPageTitle" size="s">
                  <h6>{ApacheConfig.STEP_3}</h6>
                </EuiTitle>
                <br />
                <EuiText data-test-subj="createPageTitle" size="s">
                  {ApacheConfig.STEP3_DESC}
                </EuiText>
                <br />
                <EuiCodeBlock language="json" overflowHeight={300}>
                  {ApacheConfig.CONFIGURATION_STEP3}
                </EuiCodeBlock>
                <br />
                <EuiText data-test-subj="createPageTitle" size="s">
                  {ApacheConfig.STEP5_DESC}
                </EuiText>
                <br />
                <EuiCodeBlock language="json" overflowHeight={300}>
                  {ApacheConfig.CONFIGURATION_STEP4}
                </EuiCodeBlock>
                <br />
                <EuiTitle data-test-subj="createPageTitle" size="s">
                  <h6>{ApacheConfig.STEP_4}</h6>
                </EuiTitle>
                <br />
                <EuiText data-test-subj="createPageTitle" size="s">
                  {ApacheConfig.STEP4_DESC}
                </EuiText>
                <br />
                <EuiCodeBlock language="json" overflowHeight={300}>
                  {ApacheConfig.CONFIGURATION_STEP5}
                </EuiCodeBlock>
                <br />
              </EuiPageContent>
            }
            flyoutFooter={
              <EuiFlyoutFooter>
                <EuiFlexGroup gutterSize="s" justifyContent="spaceBetween">
                  <EuiFlexItem grow={false}>
                    <EuiButton onClick={closeIntegrationFlyout}>Close</EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlyoutFooter>
            }
            ariaLabel="configurationLayout"
          />
        );
      }
    
      return (
        <div>
          <EuiPageBody component="div" style={{ marginLeft: '28px' }}>
            <EuiPageHeader>
              <EuiPageHeaderSection>
                <EuiTitle data-test-subj="createPageTitle" size="l">
                  <h1>Document panel</h1>
                </EuiTitle>
              </EuiPageHeaderSection>
            </EuiPageHeader>
            <EuiPageContent id="appInfo">
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection>
                  <EuiTitle size="m">
                    <h2>{appName} information</h2>
                  </EuiTitle>
                </EuiPageContentHeaderSection>
              </EuiPageContentHeader>
              <EuiHorizontalRule />
              <EuiTitle data-test-subj="createPageTitle" size="m">
                <h6>Installation</h6>
              </EuiTitle>
              <br />
              <EuiText grow={false}>
              The Apache HTTP server is the most widely used web server in the world. Apache functions as way to communicate over networks from client to server using the TCP/IP protocol. The Apache provides bytes served, requests per second, number of worker threads, service uptime, Hits by node and more
              </EuiText>
              <br />
              <EuiTitle data-test-subj="createPageTitle" size="s">
                <h6>{ApacheConfig.STEP_1}</h6>
              </EuiTitle>
              <EuiPanel color="subdued" borderRadius="none" hasShadow={false}>
                <p>sudo apt update</p>
              </EuiPanel>
              <br />
              <EuiTitle data-test-subj="createPageTitle" size="s">
                <h3>{ApacheConfig.STEP_2}</h3>
              </EuiTitle>
              <EuiPanel color="subdued" borderRadius="none" hasShadow={false}>
                <p>sudo apt install apache2</p>
              </EuiPanel>
              <EuiSpacer />
              <EuiButtonEmpty color={'primary'} onClick={openIntegrationFlyout}>
                Configurations
              </EuiButtonEmpty>
              {/* <EuiPanel color="transparent" hasBorder={false}>
            <p>I am a transparent box simply for padding</p>
          </EuiPanel> */}
            </EuiPageContent>
          </EuiPageBody>
          {integrationFlyout}
        </div>
      );
    }`
};
