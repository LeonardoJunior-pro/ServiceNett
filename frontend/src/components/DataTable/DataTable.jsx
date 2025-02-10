import { useCallback, useEffect } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Descriptions, Dropdown, Table, Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import xlsx from 'better-xlsx';
import objectPath from 'object-path';
import { saveAs } from 'file-saver';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';

import { generate as uniqueId } from 'shortid';
import useResponsiveTable from '@/hooks/useResponsiveTable';
import { useCrudContext } from '@/context/crud';
import dayjs from 'dayjs';

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}
export default function DataTable({ config, extra = [] }) {
  let { entity, dataTableColumns, DATATABLE_TITLE } = config;
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox } = crudContextAction;
  const translate = useLanguage();

  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    ...extra,
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const exportField = [
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
      title: translate('Contact Person'),
      dataIndex: 'contact',
    },
    {
      title: translate('Last Calibration Date'),
      dataIndex: 'lastDate',
    },
  ];

  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;

                case 'delete':
                  handleDelete(record);
                  break;
                // case 'updatePassword':
                //   handleUpdatePassword(record);
                //   break;

                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { items: dataSource } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 5 };
    dispatch(crud.list({ entity, options }));
  }, []);

  const dispatcher = () => {
    dispatch(crud.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  const { expandedRowData, tableColumns, tableHeader } = useResponsiveTable(
    dataTableColumns,
    items
  );

  const exportClick = () => {
    const file = new xlsx.File();
    const sheet = file.addSheet('equipment');
    const headerRow = sheet.addRow();
    exportField.forEach(({ title, render }) => {
      if (render) return;
      const cell = headerRow.addCell();
      cell.value = title;
    });
    dataSource.forEach((record) => {
      const row = sheet.addRow();
      exportField.forEach(({ dataIndex, render }) => {
        if (render) return;
        const cell = row.addCell();
        cell.value = objectPath.get(record, dataIndex);
        if (dataIndex == 'lastDate') {
          cell.value = dayjs(cell.value).format('MM/DD/YYYY');
        }
      });
    });

    file.saveAs('blob').then((blob) => {
      saveAs(blob, `equipment_${dayjs().format('YYYY_MM_DD')}.xlsx`);
    });
  };

  return (
    <>
      <div ref={tableHeader}>
        <PageHeader
          onBack={() => window.history.back()}
          title={DATATABLE_TITLE}
          ghost={false}
          extra={[
            <Button onClick={handelDataTableLoad} key={`${uniqueId()}`}>
              {translate('Refresh')}
            </Button>,
            <AddNewItem key={`${uniqueId()}`} config={config} />,
            <Button onClick={exportClick} key={`${uniqueId()}`} type="primary">
              {translate('Export')}
            </Button>,
          ]}
          style={{
            padding: '20px 0px',
          }}
        ></PageHeader>
      </div>
      <Table
        columns={tableColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={{pageSize: 5,}}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        expandable={
          expandedRowData.length
            ? {
                expandedRowRender: (record) => (
                  <Descriptions title="" bordered column={1}>
                    {expandedRowData.map((item, index) => {
                      return (
                        <Descriptions.Item key={index} label={item.title}>
                          {item.render?.(record[item.dataIndex])?.children
                            ? item.render?.(record[item.dataIndex])?.children
                            : item.render?.(record[item.dataIndex])
                            ? item.render?.(record[item.dataIndex])
                            : Array.isArray(item.dataIndex)
                            ? record[item.dataIndex[0]]?.[item.dataIndex[1]]
                            : record[item.dataIndex]}
                        </Descriptions.Item>
                      );
                    })}
                  </Descriptions>
                ),
              }
            : null
        }
      />
    </>
  );
}
