import React, { useState } from 'react';
import { Button, Form, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useHistory } from 'react-router';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

const Uploads = () => {
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    // const headers = {
	//	'Content-Type': 'multipart/form-data'
    // }

    const handleSubmit = (values: any) => {
        console.log(values);
        setLoading(true);
        axios.post('http://localhost:5000/upload', values)
            .then(res => {
                console.log(res.data);
				if(!res.data) {
					setLoading(false);
					message.success('User Added Successfully!');
					history.push('/list');
				}
            })
            .catch(error => {
                setLoading(false);
                message.error(error);
            })
    }

    return (
        <div>
            <Form {...layout} onFinish={handleSubmit}>
                <Form.Item>
                    <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle
                        rules={[
                            {
                                required: true,
                                message: 'Please upload your image'
                            }
                        ]}
                    >
                        <Upload.Dragger name="files" action="/upload" listType="picture">
                            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>
                <div style={{ textAlign: "left", paddingTop: "9px" }}>
                    <Button type="primary" loading={loading} htmlType="submit">Save</Button>
                </div>
            </Form>
        </div >
    )
}

export default Uploads;