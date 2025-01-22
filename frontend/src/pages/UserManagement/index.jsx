import useLanguage from '@/locale/useLanguage';

import { Tag } from 'antd';
import CrudModule from '@/modules/CrudModule/CrudModule';
import UserManagementForm from '@/forms/UserManagementForm';

export default function UserManagement() {
  const translate = useLanguage();
  const entity = 'user';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['name'];

  const readColumns = [
    {
      title: translate('User Name'),
      dataIndex: 'name',
    },
    {
      title: translate('email'),
      dataIndex: 'email',
    },
    {
      title: translate('role'),
      dataIndex: 'role',
    },
  ];
  const dataTableColumns = [
    {
      title: translate('Name'),
      dataIndex: 'name',
    },
    {
      title: translate('email'),
      dataIndex: 'email',
    },
    {
      title: translate('role'),
      dataIndex: 'role',
      render: (role) => {
        let color =
          role === 'admin'
            ? 'green'
            : role === 'user'
            ? 'blue'
            : 'red';
        return <Tag color={color}>{role && translate(role)}</Tag>;
      },
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('user_management'),
    DATATABLE_TITLE: translate('user_management'),
    ADD_NEW_ENTITY: translate('add_new_user'),
    ENTITY_NAME: translate('usermanagement'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <CrudModule
      createForm={<UserManagementForm />}
      updateForm={<UserManagementForm isUpdateForm={true} />}
      config={config}
    />
  );
}
