import React, { useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import { useCreate } from "@refinedev/core";
import { Form, Input, Upload, Button, Space } from "antd";
import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";

export const BlogsCreate = () => {
    const { formProps, saveButtonProps } = useForm({});
    const { mutate } = useCreate();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [existingImages, setExistingImages] = useState([]);



    const createFormData = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('author', "6723c21f12030d6f36879c80")

        fileList.forEach((file) => {
            formData.append("images", file.originFileObj);
        });

        await mutate(
            {
                resource: 'blogs/create-blog',
                values: formData,
                options: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            },
            {
                onSuccess: () => {
                    navigate('/blogs', { replace: true });
                }
            }
        );
    };

    const handleUploadChange = ({ fileList }) => setFileList(fileList);

    return (
        <Create saveButtonProps={saveButtonProps} title={"Create Blog"}>
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
        </Create>
    );
};
