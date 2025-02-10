import { Calendar, Badge, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import './style.css';
import { useEffect, useState } from 'react';
import { request } from '@/request';

export default function CustomerPreviewCard({ isLoading = false }) {
  const translate = useLanguage();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const today = dayjs();
      await upDateFilterData(today.format('YYYY-MM-DD'));
    }

    fetchData();
  }, []);

  const onPanelChange = async (value, mode) => {
    if (mode == "month")
      await upDateFilterData(value.format('YYYY-MM-DD'));
  };

  const getListData = (value) => {
    // Convert dayjs value to string for comparison
    const formattedDate = value.format('YYYY-MM-DD');
    return data
      .filter((item) => item.date === formattedDate)
      .map((item) => ({
        type: item.event,
        content: '',
      }));
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul style={{ padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index} style={{ listStyle: 'none' }}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const upDateFilterData = async (date) => {
    const during = new Date(date);
    const today = new Date();
    const { result: data } = await request.duringFilter({ entity: 'notification', during: during });
    const duringFilter = data.map((notification) => {
      let status = 'success';
      if (dayjs(notification.date).date() < today.getDate()) {
        status = 'success';
      } else {
        status = 'warning';
      }
      return { date: dayjs(notification.date).format('YYYY-MM-DD'), event: status };
    });
    setData(duringFilter);
  };

  return (
    <Row className="gutter-row">
      <div className="whiteBox shadow" style={{ height: 458 }}>
        <div
          className="pad20"
          style={{
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <h3 style={{ color: '#22075e', fontSize: 'large' }}>
            {translate('Notification Calendar')}
          </h3>

          {isLoading ? (
            <Spin />
          ) : (
            <div
              style={{
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <Calendar
                cellRender={dateCellRender}
                onPanelChange={onPanelChange}
                fullscreen={false}
              />
            </div>
          )}
        </div>
      </div>
    </Row>
  );
}
