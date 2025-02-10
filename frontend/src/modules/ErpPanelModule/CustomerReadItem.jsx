import { useState, useEffect } from 'react';
import { Divider } from 'antd';
import dayjs from 'dayjs';

import { Button, Row, Col, Descriptions, Statistic } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { EditOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';

import { generate as uniqueId } from 'shortid';

import { selectCurrentItem } from '@/redux/erp/selectors';
import { useNavigate } from 'react-router-dom';

const ContactItem = ({ item }) => {
  return (
    <Row gutter={[12, 0]} key={item._id}>
      <Col className="gutter-row" span={8}>
        <p style={{ marginBottom: 5 }}>
          <strong>{item.name}</strong>
        </p>
      </Col>
      <Col className="gutter-row" span={6}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.email}
        </p>
      </Col>
      <Col className="gutter-row" span={6}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.phone}
        </p>
      </Col>
      <Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
    </Row>
  );
};

const EquipmentItem = ({ item }) => {
  return (
    <Row gutter={[12, 0]} key={item._id}>
      <Col className="gutter-row" span={5}>
        <p style={{ marginBottom: 5 }}>
          <strong>{item.name}</strong>
        </p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.serial}
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.interval == 6 ? '6 Months' : (item.interval == 12 ? '1 Year': (item.interval == 24 ? '2 Years' : (item.interval == 48 ? '4 Years' : "")))}
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p
          style={{
            textAlign: 'right',
            fontWeight: '700',
          }}
        >
          {dayjs(item.nextDate).format('MM/DD/YYYY')}
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p
          style={{
            textAlign: 'right',
            fontWeight: '700',
          }}
        >
          {item.contact}
        </p>
      </Col>
      <Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
    </Row>
  );
};

export default function CustomerReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { result: currentResult } = useSelector(selectCurrentItem);

  const resetCustomer = {
    name: '',
    address: '',
    phone: '',
    email: '',
    contracts: [],
    equipments: [],
  };

  const [contactslist, setContactsList] = useState([]);
  const [equipmentslist, setEquipmentsList] = useState([]);
  const [customer, setCustomer] = useState(selectedItem ?? resetCustomer);

  useEffect(() => {
    if (currentResult) {
      const { contacts, equipments } = currentResult;
      setContactsList(contacts);
      setEquipmentsList(equipments);
      setCustomer(currentResult);
    }
    return () => {
      setContactsList([]);
      setEquipmentsList([]);
      setCustomer(resetCustomer);
    };
  }, [currentResult]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={`${ENTITY_NAME}`}
        ghost={false}
        // tags={<Tag color="volcano">{currentErp.paymentStatus || currentErp.status}</Tag>}
        // subTitle="This is cuurent erp page"
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: customer,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${customer._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
        <Row>
          <Statistic
            title={translate('Contact Persons')}
            value={contactslist.length}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('Equipment Count')}
            value={equipmentslist.length}
            style={{
              margin: '0 32px',
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`Client : ${customer.name}`}>
        <Descriptions.Item label={translate('Address')}>{customer.address}</Descriptions.Item>
        <Descriptions.Item label={translate('email')}>{customer.email}</Descriptions.Item>
        <Descriptions.Item label={translate('Phone')}>{customer.phone}</Descriptions.Item>
      </Descriptions>
      <Divider />

      {contactslist.length > 0 && (
        <>
          <Row gutter={[12, 0]}>
            <Col className="gutter-row" span={8}>
              <p
                style={{
                  color: '#00000073',
                }}
              >
                <strong>{translate('Contact Person')}</strong>
              </p>
            </Col>
            <Col className="gutter-row" span={6}>
              <p
                style={{
                  textAlign: 'right',
                  color: '#00000073',
                }}
              >
                <strong>{translate('Email')}</strong>
              </p>
            </Col>
            <Col className="gutter-row" span={6}>
              <p
                style={{
                  textAlign: 'right',
                  color: '#00000073',
                }}
              >
                <strong>{translate('Phone')}</strong>
              </p>
            </Col>
            <Divider />
          </Row>
          {contactslist.map((item) => (
            <ContactItem key={item._id} item={item}></ContactItem>
          ))}
          <Divider />
        </>
      )}

      {equipmentslist.length > 0 && (
        <>
          <Row gutter={[12, 0]}>
            <Col className="gutter-row" span={5}>
              <p
                style={{
                  color: '#00000073',
                }}
              >
                <strong>{translate('Equipment')}</strong>
              </p>
            </Col>
            <Col className="gutter-row" span={4}>
              <p
                style={{
                  textAlign: 'right',
                  color: '#00000073',
                }}
              >
                <strong>{translate('Serial')}</strong>
              </p>
            </Col>
            <Col className="gutter-row" span={5}>
              <p
                style={{
                  textAlign: 'right',
                  color: '#00000073',
                }}
              >
                <strong>{translate('Interval')}</strong>
              </p>
            </Col>
            <Col className="gutter-row" span={5}>
              <p
                style={{
                  textAlign: 'right',
                  color: '#00000073',
                }}
              >
                <strong>{translate('Calibrate Date')}</strong>
              </p>
            </Col>
            <Col className="gutter-row" span={5}>
              <p
                style={{
                  textAlign: 'right',
                  color: '#00000073',
                }}
              >
                <strong>{translate('Contact Person')}</strong>
              </p>
            </Col>
            <Divider />
          </Row>
          {equipmentslist.map((item) => (
            <EquipmentItem key={item._id} item={item}></EquipmentItem>
          ))}
        </>
      )}
    </>
  );
}
