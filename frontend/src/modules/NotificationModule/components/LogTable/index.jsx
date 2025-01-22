import { Descriptions, Table } from 'antd';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import useResponsiveTable from '@/hooks/useResponsiveTable';

export default function LogTable({ ...props }) {
  let { entity, dataTableColumns } = props;

  dataTableColumns = [
    ...dataTableColumns,
  ];

  const asyncList = () => {
    return request.list({ entity });
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList);
  const firstFiveItems = () => {
    if (isSuccess && result) return result.slice(0, 5);
    return [];
  };

  const { expandedRowData, tableColumns, tableHeader } = useResponsiveTable(
    dataTableColumns,
    firstFiveItems()
  );

  return (
    <div ref={tableHeader}>
      <Table
        columns={tableColumns}
        rowKey={(item) => item._id}
        dataSource={isSuccess && firstFiveItems()}
        pagination={true}
        loading={isLoading}
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
    </div>
  );
}
