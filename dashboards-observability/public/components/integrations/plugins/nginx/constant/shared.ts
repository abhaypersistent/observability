import { visChartTypes } from '../../../../../../common/constants/shared';

export const QUERY_VIS_TYPES = [
  {
    type: visChartTypes.Line,
    query:
      '| stats avg( upstream_response_time )as Response_Time , count() as response_count by span( @timestamp ,1h)',
  },
  {
    type: visChartTypes.Line,
    query: '| stats max(bytes_sent), avg(bytes_sent) by remote_addr',
  },
  {
    type: visChartTypes.Bar,
    query: '| stats count() by request_method',
  },
  {
    type: visChartTypes.Bar,
    query: '| where status > 400 or status < 599 | stats count() by span( @timestamp , 1d)',
  },
  {
    type: visChartTypes.Line,
    query: '| stats avg( bytes_sent ) by span( @timestamp ,1d)',
  },
  {
    type: visChartTypes.Bar,
    query: '| stats avg( upstream_response_time ) as response_time by span( @timestamp , 1h)',
  },
];
