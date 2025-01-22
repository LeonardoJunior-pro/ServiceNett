import { Form, Select, Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function CalibrationSettingForm() {
  const translate = useLanguage();

  // const notification_timing = [
  //   { label: '30 Days', value: '30' },
  //   { label: '7 Days', value: '7' },
  //   { label: '1 Days', value: '1' },
  // ];
  return (
    <>
      <Form.Item
        label={translate('Email Notification')}
        name="email_enabled"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
      <Form.Item
        label={translate('SMS Notification')}
        name="sms_enabled"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
      {/* <Form.Item
        label={translate('Timing')}
        name="time_before"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={'1'}
      >
        <Select options={notification_timing}></Select>
      </Form.Item> */}
    </>
  );
}
