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

export const ListingTypeList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
        resource: 'listings/listing-types'
    });

    const { data: blogsData, isLoading: blogIsLoading, refetch } = useList({
        resource: "listings/listing-types",

    })

    return (
        <List>
            <Table {...tableProps} dataSource={blogsData?.data} rowKey="_id">
                <Table.Column dataIndex="_id" title="ID" />
                <Table.Column dataIndex="listingType" title="Listing Type" />

                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            {/* <EditButton hideText size="small" recordItemId={record._id} /> */}
                            <DeleteButton hideText size="small"
                                resource="listings/delete-listing-type"
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
