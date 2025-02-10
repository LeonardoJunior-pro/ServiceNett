import { Descriptions, Dropdown, Table } from 'antd';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import { EllipsisOutlined, EyeOutlined, EditOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';
import { useNavigate } from 'react-router-dom';
import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import useResponsiveTable from '@/hooks/useResponsiveTable';
import { useEffect } from 'react';

export default function RecentTable({ ...props }) {
  const translate = useLanguage();
  let { entity, dataTableColumns } = props;

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
    {
      label: translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRead = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  };
  const handleEdit = (record) => {
    dispatch(erp.currentAction({ actionType: 'update', data: record }));
    navigate(`/${entity}/update/${record._id}`);
  };
  const handleDownload = (record) => {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`, '_blank');
  };

  dataTableColumns = [
    ...dataTableColumns,
    // {
    //   title: '',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Dropdown
    //       menu={{
    //         items,
    //         onClick: ({ key }) => {
    //           switch (key) {
    //             case 'read':
    //               handleRead(record);
    //               break;
    //             case 'edit':
    //               handleEdit(record);
    //               break;
    //             case 'download':
    //               handleDownload(record);
    //               break;

    //             default:
    //               break;
    //           }
    //           // else if (key === '2')handleCloseTask
    //         },
    //       }}
    //       trigger={['click']}
    //     >
    //       <EllipsisOutlined
    //         style={{ cursor: 'pointer', fontSize: '24px' }}
    //         onClick={(e) => e.preventDefault()}
    //       />
    //     </Dropdown>
    //   ),
    // },
  ];

  const asyncList = () => {
    return request.list({ entity });
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList);
  const resultItems = () => {
    if (isSuccess && result) return result;
    return [];
  };

  const { expandedRowData, tableColumns, tableHeader } = useResponsiveTable(
    dataTableColumns,
    resultItems()
  );

  return (
    <div ref={tableHeader}>
      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        // dataSource={isSuccess && firstFiveItems()}
        dataSource={resultItems()}
        pagination={{pageSize: 5}}
        loading={isLoading}
      />
    </div>
  );
}
