import { Form, Input, message, Select, DatePicker, Row, Col } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

import { useEffect, useState } from 'react';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

import { request } from '@/request';

export default function EquipmentForm({ isUpdateForm = false }) {
  const translate = useLanguage();
  const [customerList, setCustomerList] = useState([]);
  const [customerItems, setCustomerItems] = useState([]);
  const [contactItems, setContactItems] = useState([]);

  const [currentCustomer, setCurrentCustomer] = useState(0);

  useEffect(() => {
    const getCustomers = async () => {
      const entity = 'customer';
      let result = await request.listAll({ entity });
      if (result.success && result.result.length > 0) {
        const customers = result.result;
        let temp = [];
        let temp_options = [];
        for (let i = 0; i < customers.length; i++) {
          temp_options.push({ label: customers[i].name, value: customers[i]._id });
          temp[customers[i]._id] = customers[i];
        }
        setCustomerList(temp);
        setCustomerItems(temp_options);
        setCurrentCustomer(customers[0]._id);
      }
    };

    getCustomers();
  }, []);

  useEffect(() => {
    let newContacts = [];
    if (customerList[currentCustomer]) {
      const customer = customerList[currentCustomer];
      for (let i = 0; i < customer.contacts.length; i++) {
        newContacts.push({ label: customer.contacts[i].name, value: customer.contacts[i].name });
      }
      setContactItems(newContacts);
    } else {
      setContactItems([]);
    }
  }, [currentCustomer]);

  const validateEmptyString = (_, value) => {
    if (value && value.trim() === '') {
      return Promise.reject(new Error('Field cannot be empty'));
    }

    return Promise.resolve();
  };

  const handleCustomerChange = (value) => {
    // let newContacts = [];
    // console.log('handleCustomerChange value=>', customerList.length);
    // if (customerList[value] !== undefined) {
    //   console.log('handleCustomerChange =>', customerList[value]);
    //   const customer = customerList[value];
    //   for (let i = 0; i < customer.contacts.length; i++) {
    //     newContacts.push({ label: customer.contacts[i].name, value: customer.contacts[i].name });
    //   }
    //   setContactItems(newContacts);
    // } else {
    //   setContactItems([]);
    // }
    setCurrentCustomer(value);
  };

  const intervalItems = [
    { label: '6 Months', value: '6' },
    { label: '1 Year', value: '12' },
  ];

  return (
    <>
      <Row gutter={[12, 0]} style={{ position: 'relative' }}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={translate('equipment_name')}
            name="name"
            rules={[
              {
                required: true,
              },
              {
                validator: validateEmptyString,
              },
            ]}
          >
            <Input placeholder="Guiter" />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={translate('serial_number')}
            name="serial"
            rules={[
              {
                required: true,
              },
              {
                validator: validateEmptyString,
              },
            ]}
          >
            <Input placeholder="123456" />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={24}>
          <Form.Item
            label={translate('customer')}
            name="createdBy"
            rules={[
              {
                required: true,
              },
              {
                validator: validateEmptyString,
              },
            ]}
          >
            <Select
              suffixIcon={<UserOutlined />}
              onChange={handleCustomerChange}
              options={customerItems}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={translate('calibration_interval')}
            name="interval"
            rules={[
              {
                required: true,
              },
              {
                validator: validateEmptyString,
              },
            ]}
            initialValue={'6'}
          >
            <Select suffixIcon={<CalendarOutlined />} options={intervalItems} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={translate('calibration_next_date')}
            name="nextDate"
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={24}>
          <Form.Item
            label={translate('customer')}
            name="contact"
            rules={[
              {
                required: true,
              },
              {
                validator: validateEmptyString,
              },
            ]}
          >
            <Select suffixIcon={<UserOutlined />} options={contactItems} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
