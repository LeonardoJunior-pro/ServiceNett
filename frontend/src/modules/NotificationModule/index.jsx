import { Tag, Row, Col } from 'antd';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

import LogTable from './components/LogTable';
import UpcomingTable from './components/Upcoming';

export default function NotificationModule() {
  const translate = useLanguage();

  const upcomingTableColumns = [
    {
      title: translate('schedule'),
      dataIndex: ['nextDate'],
      render: (date) => {
        return dayjs(date).format('MM/DD/YYYY');
      },
    },
    {
      title: translate('customer_name'),
      dataIndex: ['createdBy', 'name'],
    },
    {
      title: translate('contact_person'),
      dataIndex: ['contact'],
    },
    {
      title: translate('equipment_name'),
      dataIndex: ['name'],
    },
    {
      title: translate('serial'),
      dataIndex: ['serial'],
    },
  ];

  const logTableColumns = [
    {
      title: translate('notification_date'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format('MM/DD/YYYY');
      },
    },
    {
      title: translate('notifictioin_type'),
      dataIndex: 'type',
    },
    {
      title: translate('customer'),
      dataIndex: ['equipment', 'createdBy', 'name'],
    },
    {
      title: translate('equipment'),
      dataIndex: ['equipment', 'name'],
    },
    {
      title: translate('contact_person'),
      dataIndex: ['equipment', 'contact'],
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'pending' ? 'green' : status === 'Failed' ? 'black' : 'volcano';

        return <Tag color={color}>{translate(status)}</Tag>;
      },
    },
  ];

  return (
    <>
      <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 32 }} md={{ span: 32 }} lg={{ span: 32 }}>
          <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
            <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
              {translate('Notification Logs')}
            </h3>

            <LogTable entity={'notification'} dataTableColumns={logTableColumns} />
          </div>
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 32 }} md={{ span: 32 }} lg={{ span: 32 }}>
          <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
            <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
              {translate('Upcoming Calibrations')}
            </h3>

            <UpcomingTable entity={'upcoming'} dataTableColumns={upcomingTableColumns} />
          </div>
        </Col>
      </Row>
    </>
  );
}
