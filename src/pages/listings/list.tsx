import { useState } from "react";
import { useList } from "@refinedev/core";
import {
    List,
    EditButton,
    ShowButton,
    DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Typography, Select, Image } from "antd";
import moment from "moment";

const { Title } = Typography;

export const ListingsList = () => {
    const { data: listingsData, isLoading: listingsLoading, refetch } = useList({
        resource: "listings",
    });

    const dataCategories = listingsData?.data ? Object.keys(listingsData.data) : [];
    const [selectedCategory, setSelectedCategory] = useState(dataCategories[0]);

    const hiddenFields = ["__v", "isAd"]; // Burada istemediğiniz alanları belirtin

    const generateColumns = (categoryData: any) => {
        return Object.keys(categoryData[0]).map((key) => {
            if (!hiddenFields.includes(key)) {
                return {
                    title: key.charAt(0).toUpperCase() + key.slice(1),
                    dataIndex: key,
                    render: (value: any) => {
                        if (key === "location" && value?.coordinates) {
                            return `${value.coordinates[1]}, ${value.coordinates[0]}`;
                        }

                        if (key === "category") {
                            return `${value.category}`
                        }

                        if (key === "createdAt") {
                            return moment(value).format("DD-MM-YYYY"); // Tarihi formatla
                        }

                        if (key === "updatedAt") {
                            return moment(value).format("DD-MM-YYYY"); // Tarihi formatla
                        }

                        if (key === "images" && Array.isArray(value) && value.length > 0) {
                            return value.map((img, index) => (
                                <Image key={index} width={50} src={`http://localhost:3003/upload-file/listings/${img}`} />
                            ));
                        }

                        if (key === "price") {
                            return `$${value}`;
                        }
                        return value; // Diğer değerleri doğrudan göster
                    },
                };
            }
            return null; // Gizli alanlar için null döndür
        }).filter(Boolean) // null değerlerini filtrele
            .concat({
                title: "Actions",
                dataIndex: "actions",
                render: (_: any, record: any) => (
                    <Space>
                        <EditButton hideText size="small" recordItemId={record._id} />
                        <ShowButton hideText size="small" recordItemId={record._id} />
                        <DeleteButton
                            hideText
                            size="small"
                            resource="listings"
                            onSuccess={() => refetch()}
                            recordItemId={record._id}
                        />
                    </Space>
                ),
            });
    };

    return (
        <List>
            <Title level={3}>Select Category</Title>
            <Select
                style={{ width: 200, marginBottom: 20 }}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                options={dataCategories.map((category) => ({
                    label: category,
                    value: category,
                }))}
            />

            {selectedCategory && listingsData?.data[selectedCategory] && (
                <>
                    <Title level={4}>{selectedCategory}</Title>
                    <Table
                        dataSource={listingsData?.data[selectedCategory]}
                        columns={generateColumns(listingsData?.data[selectedCategory])}
                        rowKey="_id"
                        loading={listingsLoading}
                        scroll={{ x: 'max-content', y: 400 }} // Kaydırılabilir alan
                    />
                </>
            )}
        </List>
    );
};
