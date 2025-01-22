import useLanguage from '@/locale/useLanguage';
import ReadCustomerModule from '@/modules/CustomerModule/ReadCustomerModule';

export default function CustomerRead() {
  const translate = useLanguage();

  const entity = 'customer';

  const Labels = {
    PANEL_TITLE: translate('customer'),
    DATATABLE_TITLE: translate('customer_list'),
    ADD_NEW_ENTITY: translate('add_new_customer'),
    ENTITY_NAME: translate('customer'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <ReadCustomerModule config={configPage} />;
}
