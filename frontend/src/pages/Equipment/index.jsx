import CrudModule from '@/modules/CrudModule/CrudModule';
import EquipmentForm from '@/forms/EquipmentForm';

import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

export default function Equipment() {
  const translate = useLanguage();
  const entity = 'equipment';

  const searchConfig = {
    displayLabels: ['equipment'],
    searchFields: 'equipment',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['equipment'];

  const readColumns = [
    {
      title: translate('Equipment Name'),
      dataIndex: 'name',
    },
    {
      title: translate('Serial Number'),
      dataIndex: 'serial',
    },
    {
      title: translate('Customer'),
      dataIndex: 'createdBy.name',
    },
    {
      title: translate('Interval'),
      dataIndex: 'interval',
    },
    {
      title: translate('Calibration Next Date'),
      dataIndex: 'nextDate',
      isDate: true,
    },
    {
      title: translate('Contact Person'),
      dataIndex: 'contact',
    },
  ];

  const dataTableColumns = [
    {
      title: translate('Equipment Name'),
      dataIndex: 'name',
    },
    {
      title: translate('Serial Number'),
      dataIndex: 'serial',
    },
    {
      title: translate('Customer Name'),
      dataIndex: ['createdBy', 'name'],
    },
    {
      title: translate('Calibration Interval'),
      dataIndex: 'interval',
    },
    {
      title: translate('Calibration Next Date'),
      dataIndex: 'nextDate',
      render: (nextDate) => {
        return dayjs(nextDate).format('DD/MM/YYYY');
      },
    },
    {
      title: translate('Contact Person'),
      dataIndex: 'contact',
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('equipment'),
    DATATABLE_TITLE: translate('equipment_list'),
    ADD_NEW_ENTITY: translate('add_new_equipment'),
    ENTITY_NAME: translate('equipment'),
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
      createForm={<EquipmentForm />}
      updateForm={<EquipmentForm isUpdateForm={true} />}
      config={config}
    />
  );
}
