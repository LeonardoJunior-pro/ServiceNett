import { Tag, Row, Col } from 'antd';
import useLanguage from '@/locale/useLanguage';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import RecentTable from './components/RecentTable';
import NotificationTable from './components/NotificationTable';

import SummaryCard from './components/SummaryCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';
import dayjs from 'dayjs';

export default function DashboardModule() {
  const translate = useLanguage();
  const { result: customerResult, isLoading: customerLoading } = useFetch(() =>
    request.summary({ entity: 'customer' })
  );

  const { result: equipmentResult, isLoading: equipmentLoading } = useFetch(() =>
    request.summary({ entity: 'equipment' })
  );

  const { result: upcomingResult, isLoading: upcomingLoading } = useFetch(() =>
    request.summary({ entity: 'upcoming' })
  );

  const upcomingTableColumns = [
    {
      title: translate('customer_name'),
      dataIndex: ['createdBy', 'name'],
    },
    {
      title: translate('equipment_name'),
      dataIndex: ['name'],
    },
    {
      title: translate('serial_number'),
      dataIndex: ['serial'],
    },
    {
      title: translate('calibration_due_date'),
      dataIndex: ['nextDate'],
      render: (date) => {
        return dayjs(date).format('MM/DD/YYYY');
      },
    },
    {
      title: translate('contact_person'),
      dataIndex: ['contact'],
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: () => {
        // let color = status === 'pending' ? 'green' : 'volcano';
        let color = 'green';
        let status = "pending";

        return <Tag color={color}>{translate(status)}</Tag>;
      },
    },
  ];

  const entityData = [
    {
      count: customerResult,
      isLoading: customerLoading,
      entity: 'active_customer',
      prefix: 'active_customer',
    },
    {
      count: equipmentResult,
      isLoading: equipmentLoading,
      entity: 'equipment_total',
      prefix: 'equipment',
    },
    {
      count: upcomingResult,
      isLoading: upcomingLoading,
      entity: 'calibration_upcoming',
      prefix: 'calibration_upcoming',
    },
  ];

  const cards = entityData.map((data, index) => {
    const { count, entity, isLoading, prefix } = data;

    if (entity === 'offer') return null;

    return (
      <SummaryCard
        key={index}
        title={data?.entity === 'payment' ? translate('Payment') : translate(data?.entity)}
        tagColor={
          data?.entity === 'active_customer'
            ? 'cyan'
            : data?.entity === 'equipment_total'
            ? 'purple'
            : 'green'
        }
        prefix={translate(prefix)}
        isLoading={isLoading}
        tagContent={count}
        // tagContent={result?.total && moneyFormatter({ amount: result?.total })}
      />
    );
  });

  return (
    <>
      <Row gutter={[32, 32]}>{cards}</Row>
      <div className="space30"></div>
      <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 16 }} md={{ span: 16 }} lg={{ span: 14 }}>
          <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
            <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
              {translate('Search')}
            </h3>

            <NotificationTable entity={'equipment'} />
          </div>
        </Col>
        <Col className="gutter-row w-full" sm={{ span: 16 }} md={{ span: 16 }} lg={{ span: 10 }}>
          {/* <CustomerPreviewCard
            isLoading={clientLoading}
            activeCustomer={clientResult?.active}
            newCustomer={clientResult?.new}
          /> */}
          <CustomerPreviewCard />
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 32 }} md={{ span: 32 }} lg={{ span: 32 }}>
          <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
            <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
              {'Upcoming Calibrations'}
            </h3>

            <RecentTable entity={'upcoming'} dataTableColumns={upcomingTableColumns} />
          </div>
        </Col>
      </Row>
    </>
  );
}
