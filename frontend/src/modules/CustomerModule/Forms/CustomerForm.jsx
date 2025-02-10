import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, Button, Select, Divider, Row, Col, DatePicker } from 'antd';

import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';
const { TextArea } = Input;

const ContatItemRow = ({ field, remove }) => {
  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={[field.name, 'name']}
          rules={[
            {
              required: true,
              message: 'Missing Contact person name',
            },
          ]}
        >
          <Input placeholder="James" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={8}>
        <Form.Item
          name={[field.name, 'email']}
          rules={[
            {
              required: true,
              message: 'Missing Contact email',
            },
          ]}
        >
          <Input placeholder="example@gmail.com" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'phone']}
          rules={[
            {
              required: true,
              message: 'Missing Contact phone number',
            },
          ]}
        >
          <Input placeholder="+1 (405)588-4705" />
        </Form.Item>
      </Col>
      <div style={{ position: 'absolute', right: '-20px', top: ' 5px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
    </Row>
  );
};

const EquipmentItemRow = ({ field, remove }) => {
  const translate = useLanguage();

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'name']}
          rules={[
            {
              required: true,
              message: 'Missing Equipment name',
            },
          ]}
        >
          <Input placeholder="Guiter" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'serial']}
          rules={[
            {
              required: true,
              message: 'Missing Serial number',
            },
          ]}
        >
          <Input placeholder="123456" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'interval']}
          rules={[
            {
              required: true,
              message: 'Missing Contact phone number',
            },
          ]}
          initialValue={'6'}
        >
          <Select
            options={[
              { value: 6, label: translate('6 Months') },
              { value: 12, label: translate('1 Year') },
              { value: 24, label: translate('2 Years') },
              { value: 48, label: translate('4 Years') },
            ]}
          ></Select>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'nextDate']}
          rules={[
            {
              required: true,
            },
          ]}
          getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
        >
          <DatePicker style={{ width: '100%' }} format={'MM/DD/YYYY'} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'contact']}
          rules={[
            {
              required: true,
              message: 'Missing Contact Person',
            },
          ]}
        >
          <Input placeholder="James" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'description']}
        >
          <TextArea rows={1} placeholder="Description" />
        </Form.Item>
      </Col>
      <div style={{ position: 'absolute', right: '-20px', top: ' 5px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
    </Row>
  );
};

export default function CustomerForm({ subTotal = 0, current = null }) {
  return <LoadCustomerForm current={current} />;
}

function LoadCustomerForm({ current = null }) {
  const translate = useLanguage();

  const addContact = useRef(false);
  const addEquipment = useRef(false);

  useEffect(() => {
    // addField.current.click();
  }, []);

  return (
    <>
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label={translate('Name')}
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="James" />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={7}>
          <Form.Item
            label={translate('Address')}
            name="address"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="West Jordan, UT" />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label={translate('Phone')}
            name="phone"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="+1 (405)588-4705" />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={7}>
          <Form.Item
            label={translate('email')}
            name="email"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="James" />
          </Form.Item>
        </Col>
      </Row>

      <Divider dashed />
      <Row gutter={[12, 12]} style={{ position: 'relative' }}>
        <Col className="gutter-row" span={6}>
          <p>{translate('Conatact Person')}</p>
        </Col>
        <Col className="gutter-row" span={8}>
          <p>{translate('Email')}</p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p>{translate('Phone')}</p>{' '}
        </Col>
      </Row>
      <Form.List name="contacts">
        {(contacts, { add, remove }) => (
          <>
            {contacts.map((field) => (
              <ContatItemRow
                key={field.key}
                remove={remove}
                field={field}
                current={current}
              ></ContatItemRow>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                ref={addContact}
              >
                {translate('Add field')}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider dashed />
      <Row gutter={[12, 12]} style={{ position: 'relative' }}>
        <Col className="gutter-row" span={4}>
          <p>{translate('Equipment Name')}</p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p>{translate('Serial Number')}</p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p>{translate('Interval')}</p>{' '}
        </Col>
        <Col className="gutter-row" span={4}>
          <p>{translate('Calibrate Date')}</p>{' '}
        </Col>
        <Col className="gutter-row" span={4}>
          <p>{translate('Contact Person')}</p>{' '}
        </Col>
        <Col className="gutter-row" span={4}>
          <p>{translate('Description')}</p>{' '}
        </Col>
      </Row>
      <Form.List name="equipments">
        {(equipments, { add, remove }) => (
          <>
            {equipments.map((field) => (
              <EquipmentItemRow key={field.key} remove={remove} field={field}></EquipmentItemRow>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                ref={addEquipment}
              >
                {translate('Add field')}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Divider dashed />
    </>
  );
}
