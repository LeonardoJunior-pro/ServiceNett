import { Button, DatePicker, Table, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useLanguage from '@/locale/useLanguage';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

dayjs.extend(isBetween); // Extend dayjs to use isBetween

export default function NotificationTable({ ...props }) {
  const translate = useLanguage();
  let { entity } = props;
  const [datasource, setDataSource] = useState([]);
  const [fetchResult, setFetchResult] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { result: filterData } = useFetch(() =>
    request.filterNotification({ entity: 'equipment' })
  );

  // Custom date filter dropdown
  const getDateFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <RangePicker
        onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
        style={{ width: '100%', marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button type="primary" onClick={() => confirm()} size="small" icon={<SearchOutlined />}>
          Filter
        </Button>
        <Button onClick={() => clearFilters()} size="small">
          Reset
        </Button>
      </Space>
    </div>
  );

  const equipFilter = filterData?.equipment.map((data) => {
    return { text: data, value: data };
  });

  const customerFilter = filterData?.customer.map((data) => {
    return { text: data, value: data };
  });

  const serialFilter = filterData?.serial.map((data) => {
    return { text: data, value: data };
  });

  const dataTableColumns = [
    {
      title: translate('customer'),
      dataIndex: ['createdBy', 'name'],
      filterSearch: true,
      filters: customerFilter || [{ text: '100', value: '100' }],
      onFilter: (value, record) => {
        return record.equipment.createdBy.name.includes(value);
      },
    },
    {
      title: translate('equipment'),
      dataIndex: ['name'],
      filterSearch: true,
      filters: equipFilter || [{ text: '140', value: '140' }],
      onFilter: (value, record) => {
        return record.equipment.name.includes(value);
      },
    },
    {
      title: translate('serial'),
      dataIndex: ['serial'],
      filterSearch: true,
      filters: serialFilter || [{ text: '140', value: '140' }],
      onFilter: (value, record) => {
        return record.equipment.serial.includes(value);
      },
    },
    {
      title: translate('notification_date'),
      dataIndex: 'nextDate',
      render: (date) => {
        return dayjs(date).format('MM/DD/YYYY');
      },
      filterDropdown: getDateFilterDropdown,
      onFilter: (value, record) => {
        if (!value.length) return true;
        const [startDate, endDate] = value;
        return dayjs(record.date).isBetween(startDate, endDate, null, '[]');
      },
    },
  ];

  useEffect(() => {
    async function asyncList() {
      const { result, success } = await request.list({ entity });
      setFetchResult(result);
      setIsSuccess(success);
      setIsLoading(false);
    }

    asyncList();
  }, []);

  useEffect(() => {
    if (isSuccess && fetchResult) return setDataSource(fetchResult);
    return setDataSource([]);
  }, [fetchResult, isSuccess]);

  return (
    <div>
      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={datasource}
        loading={isLoading}
        pagination={{pageSize: 5}}
      />
    </div>
  );
}
