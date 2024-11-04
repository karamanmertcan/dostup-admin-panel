import { useList, useMany } from "@refinedev/core";

import {
  List,
  TextField,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";

import { Table, Space } from "antd";

import type { IPost, ICategory } from "../../interfaces";

export const PostList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: 'blogs'
  });

  const { data: blogsData, isLoading: blogIsLoading, refetch } = useList({
    resource: "blogs",

  })

  return (
    <List>
      <Table {...tableProps} dataSource={blogsData?.data} rowKey="_id">
        <Table.Column dataIndex="_id" title="ID" />
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column dataIndex="content" title="Content" />

        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record._id} />
              <ShowButton hideText size="small" recordItemId={record._id} />
              <DeleteButton hideText size="small"
                resource="blogs/delete"
                onSuccess={() => {
                  refetch()
                }}
                recordItemId={record._id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
