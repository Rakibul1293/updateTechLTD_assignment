import React from 'react';
import FileUpload from './file-upload/FileUpload';

const Uploads = () => {
    return (
        <div className='container mt-4'>
			<h4 className='display-4 text-center mb-4'>
			  Please Upload Your Image
			</h4>

			<FileUpload />
		</div>
    )
}

export default Uploads;