import { useShow, useOne } from "@refinedev/core";

import { Show, MarkdownField } from "@refinedev/antd";

import { Typography } from "antd";

import type { IPost, ICategory } from "../../interfaces";

const { Title, Text } = Typography;

export const ListingsShow = () => {
    const { query: queryResult } = useShow();
    const { data, isLoading } = queryResult;
    const record = data?.data;



    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Id</Title>
            <Text>{record?._id}</Text>

            <Title level={5}>Title</Title>
            <Text>{record?.title}</Text>

            {/* <Title level={5}>Category</Title>
      <Text>{record?.category}</Text> */}

            <Title level={5}>Content</Title>
            <MarkdownField value={record?.content} />
        </Show>
    );
};
