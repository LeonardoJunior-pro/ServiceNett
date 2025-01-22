import { Form, Input, Select } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function UserManagementForm({ isUpdateForm = false }) {
  const translate = useLanguage();
  return (
    <>
      <Form.Item
        label={translate('Role')}
        name="role"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={'user'}
      >
        <Select
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ]}
        />
      </Form.Item>
      <Form.Item
        label={translate('User Name')}
        name="name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="James" />
      </Form.Item>
      <Form.Item
        label={translate('Email')}
        name="email"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="example@gmail.com" />
      </Form.Item>
      <Form.Item
        label={translate('Password')}
        name="password"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Password
          placeholder="input password"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item
        label={translate('Confirm Password')}
        name="confrimpassword"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Password
          placeholder="confrim password"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
    </>
  );
}
