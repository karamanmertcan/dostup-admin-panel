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

export const NewsList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
        resource: 'news'
    });

    const { data: blogsData, isLoading: blogIsLoading, refetch } = useList({
        resource: "news",

    })

    return (
        <List>
            <Table {...tableProps} dataSource={blogsData?.data} rowKey="_id">
                <Table.Column dataIndex="_id" title="ID" />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column dataIndex="description" title="Description" />
                <Table.Column dataIndex="excerpt" title="Excerpt" />
                <Table.Column dataIndex="views" title="Views" />
                <Table.Column dataIndex="category" title="Category" />
                <Table.Column
                    title={"Author"}
                    render={(text, record: any) => record.user?.fullName || "Unknown"} />

                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record._id} />
                            <ShowButton hideText size="small" recordItemId={record._id} />
                            <DeleteButton hideText size="small"
                                resource="news/delete"
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
