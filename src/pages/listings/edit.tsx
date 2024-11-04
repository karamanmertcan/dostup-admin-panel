import React, { useState } from "react";
import { Create, Edit, useForm, useSelect } from "@refinedev/antd";
import { useCreate, useParsed, useUpdate } from "@refinedev/core";
import { Form, Input, Upload, Button, Space, Switch, Select } from "antd";
import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";


export const ListingsEdit = () => {
    const { formProps, saveButtonProps } = useForm({});
    const { id } = useParsed();
    const { mutate } = useUpdate();
    const navigate = useNavigate();
    const [location, setLocation] = useState("");
    const [fileList, setFileList] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const { selectProps: categorySelectProps, query: queryData } = useSelect({
        resource: "listings/listing-types",
    });



    const createFormData = async (values: any) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('owner', "6723c21f12030d6f36879c80")
        formData.append('price', values.price);
        formData.append('isAd', values.isAd);
        formData.append('category', values.category);
        formData.append('location', location);

        fileList.forEach((file) => {
            formData.append("images", file.originFileObj);
        });

        await mutate(
            {
                resource: 'listings/update',
                values: formData,
                id: id,
                options: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            },
            {
                onSuccess: () => {
                    navigate('/listings', { replace: true });
                }
            }
        );
    };

    const handleUploadChange = ({ fileList }) => setFileList(fileList);

    return (
        <Edit saveButtonProps={saveButtonProps} title={"Edit Listing"}>
            <Form
                {...formProps}
                onFinish={(values) => {
                    createFormData(values);
                }}
                layout="vertical"
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Please enter a title" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter a price" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Is Ad?"
                    name="isAd"
                    rules={[{
                        required: true,
                        message: "Please enter a isAd"
                    }]}
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    label="Listing Type"
                    name={["category"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...categorySelectProps}
                        options={[
                            {
                                label: "Select a category",
                                value: "",
                                disabled: true,
                            },
                            ...(queryData?.data?.data ? queryData.data.data.map((item) => ({
                                label: item?.listingType.charAt(0).toUpperCase() + item?.listingType.slice(1),
                                value: item?._id,
                            })) : []), // Fallback to an empty array if it's not defined
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Location"
                    name="location"
                >
                    <Autocomplete
                        apiKey={"AIzaSyA1fzv5yl3wK-Db2nNzfrR8HIRrgBbFWxo"}
                        onPlaceSelected={(place) => {
                            setLocation(place.formatted_address); // Save the selected location
                            console.log(place);
                        }}
                        style={{ width: '100%', borderRadius: 10, height: 40, borderWidth: 1, borderColor: '#d4d4d4' }} // Ensure full width

                        placeholder="Enter a location"
                    />
                </Form.Item>

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: "Please enter content" }]}
                >
                    <MDEditor data-color-mode="light" />
                </Form.Item>

                <Form.Item label="Images">
                    <Upload
                        multiple
                        beforeUpload={() => false} // Prevent automatic upload
                        onChange={handleUploadChange}
                        listType="picture"
                        defaultFileList={existingImages.map((url, index) => ({
                            uid: index,
                            name: `Existing Image ${index + 1}`,
                            status: "done",
                            url: `https://dostup-api.vercel.app/upload-file/blogs/${url}`,
                        }))}
                    >
                        <Button icon={<CloudUploadOutlined />}>Upload Images</Button>
                    </Upload>
                    <Space direction="horizontal" wrap>
                        {existingImages.map((src, index) => (
                            <img
                                key={index}
                                src={`https://dostup-api.vercel.app/upload-file/blogs/${src}`}
                                alt={`Existing Image ${index + 1}`}
                                style={{ width: 100, height: 100 }}
                            />
                        ))}
                    </Space>
                </Form.Item>
            </Form>
        </Edit>
    );
};
