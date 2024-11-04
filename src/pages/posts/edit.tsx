import React, { useEffect, useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, Button, Space } from "antd";
import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { useParsed, useUpdate } from "@refinedev/core";

export const PostEdit = () => {
  const { id } = useParsed();
  const { formProps, saveButtonProps, queryResult } = useForm({
    refineCoreProps: {
      resource: "blogs/blog",
      id: id,
    },
  });
  const { mutate } = useUpdate();

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (queryResult?.data?.data) {
      const data = queryResult.data.data;
      formProps.form?.setFieldsValue(data); // Set initial form values
      setExistingImages(data.images || []); // Set existing images if they exist
    }
  }, [queryResult?.data, formProps.form]);

  const handleImageUpload = (info: any) => {
    setUploadedImages(info.fileList.map((file: any) => file.originFileObj));
  };

  const updateFormData = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);

    // Append uploaded images
    uploadedImages.forEach((file) => {
      formData.append("images", file);
    });

    console.log("formData", formData);


    // Pass data to the mutate function
    await mutate({
      resource: "blogs/blog",
      id: id,
      values: formData,
    });
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        onFinish={(values) => updateFormData(values)}
        layout="vertical"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Content is required" }]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>

        <Form.Item label="Images">
          <Upload
            multiple
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleImageUpload}
            listType="picture"
            defaultFileList={existingImages.map((url, index) => ({
              uid: index,
              name: `Existing Image ${index + 1}`,
              status: "done",
              url: `http://localhost:3003/upload-file/blogs/${url}`,
            }))}
          >
            <Button icon={<CloudUploadOutlined />}>Upload Images</Button>
          </Upload>
          <Space direction="horizontal" wrap>
            {existingImages.map((src, index) => (
              <img
                key={index}
                src={`http://localhost:3003/upload-file/blogs/${src}`}
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
