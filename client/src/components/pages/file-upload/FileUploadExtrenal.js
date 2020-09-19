import React, { Fragment, useState, useEffect } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import { Upload, Modal, Icon, message } from 'antd';
import { InboxOutlined, PlusOutlined, PlusCircleOutlined, PlusSquareOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const FileUploadExtrenal = () => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [text, setText] = useState(true);
  const [fileList, setFileList] = useState();
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadedFile, setUploadedFile] = useState({});
  const [imgName, setImgName] = useState();
  const [imgUrl, setImgUrl] = useState();

  var file_list;
  const handleUpload = ({ fileList }) => {
    file_list = fileList[0];
  };
  
  const handleCancel = () => {
	  setPreviewVisible(false);
  };
  
  const handleText = () => {
	  setText(false);
  };
  
  const handlePreview = file => {
	  setPreviewImage(file.thumbUrl);
	  setPreviewTitle(file.name);
	  setPreviewVisible(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
	formData.append("file", file_list.originFileObj);

    try {
      const res = await axios.post('https://rocky-peak-43925.herokuapp.com/api/upload_external', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath, imgUrl } = res.data;

      setUploadedFile({ fileName, filePath });
	  setImgUrl(res.data.imgUrl);
	  setImgName(res.data.file.filename);

      setMessage('File Uploaded');
    } catch (err) {
		console.log(err);
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };
  
  return (
	<>
		{message ? <Message msg={message} /> : null}
		<form onSubmit={onSubmit}>
          <Progress percentage={uploadPercentage} />
		  <Dragger 
			  name='file' 
			  multiple={false}
			  fileList={fileList} 
			  listType='picture-card' 
			  onPreview={handlePreview}
			  onChange={handleUpload}
			  onClick={handleText}
			  beforeUpload={() => false} 
		  >
			  <p className="ant-upload-drag-icon">
			    <InboxOutlined />
			  </p>
			  <p className="ant-upload-text">Click or drag file to this area to upload</p>
		  </Dragger>
		  
		  {setText && <p className="h5 p-3">Preview image, click on Image.</p>}
		  
		  <input
			  type='submit'
			  value='Upload'
			  className='btn btn-primary btn-block mt-4'
		   />
		   
		   {uploadedFile ? (
			   <div className='row mt-5'>
				  <div className='col-md-6 m-auto'>
					<h3 className='text-center'>{uploadedFile.fileName}</h3>	
					{
						imgUrl && <img style={{ width: '100%' }} src={`${imgUrl}`} />
					}
				  </div>
				</div>
		    ) : null}
		   
		   <Modal
			  visible={previewVisible}
			  title={previewTitle}
			  footer={null}
			  onCancel={handleCancel}
		   >
			  <img alt="example" style={{ width: '100%' }} src={previewImage} />
           </Modal>
		</form>
	</>
  );
};

export default FileUploadExtrenal;
