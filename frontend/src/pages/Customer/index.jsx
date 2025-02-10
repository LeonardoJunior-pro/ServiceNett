import CustomerDataTableModule from '@/modules/CustomerModule/CustomerDataTableModule';
import useLanguage from '@/locale/useLanguage';

export default function Customer() {
  const translate = useLanguage();
  const entity = 'customer';

  const searchConfig = {
    displayLabels: ['name', 'surname'],
    searchFields: 'name,surname,birthday',
  };
  const entityDisplayLabels = ['number', 'client.company'];
  const dataTableColumns = [
    {
      title: translate('Customer Name'),
      dataIndex: 'name',
    },
    {
      title: translate('Primary Contact'),
      dataIndex: 'primaryContact',
    },
    {
      title: translate('Equipment Count'),
      dataIndex: 'equipmentCount',
    },
    {
      title: translate('Last Activity'),
      dataIndex: 'lastActivity',
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('customer'),
    DATATABLE_TITLE: translate('customer'),
    ADD_NEW_ENTITY: translate('add_new_customer'),
    ENTITY_NAME: translate('customer'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <CustomerDataTableModule config={config} />;
}
