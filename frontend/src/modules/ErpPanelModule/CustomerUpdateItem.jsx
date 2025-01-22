import { useState, useEffect } from 'react';
import { Form, Divider } from 'antd';
import dayjs from 'dayjs';
import { Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';

import calculate from '@/utils/calculate';
import { generate as uniqueId } from 'shortid';
import { selectUpdatedItem } from '@/redux/erp/selectors';
import Loading from '@/components/Loading';

import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
// import { StatusTag } from '@/components/Tag';

function SaveForm({ form, config }) {
  let { UPDATE_ENTITY } = config;
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {UPDATE_ENTITY}
    </Button>
  );
}

export default function CustomerUpdateItem({ config, UpdateForm }) {
  const translate = useLanguage();
  let { entity, UPDATE_ENTITY } = config;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
  const [form] = Form.useForm();
  const { id } = useParams();

  const onSubmit = (fieldsValue) => {
    dispatch(erp.update({ entity, id, jsonData: fieldsValue }));
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'update' }));
      navigate(`/${entity.toLowerCase()}/read/${id}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue(current);
    }
  }, [current]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={UPDATE_ENTITY}
        ghost={false}
        // tags={StatusTag(form.getFieldValue().status)}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Cancel')}
          </Button>,
          <SaveForm config={config} form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit} >
          <UpdateForm subTotal={0} current={current} />
        </Form>
      </Loading>
    </>
  );
}
