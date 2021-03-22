import React, {useContext, useState} from "react";
import {Upload, message, Avatar, Tooltip} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {useTranslation} from "react-i18next";
import {openNotification} from "../Auth/Alert";
import axios from "../../../config/axios";
import {getRouteImage} from "../../../utils/format";
import {Auth} from "../../../contexts/AuthContext";

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

const AvatarUpload = ({src}) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const {t} = useTranslation(['auth','app'])
    const {getProfile} = useContext(Auth);

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                setImageUrl(imageUrl)
                setLoading(false)
            });
        }
    };

    const customUpload = async (info) => {
        setLoading(true)
        const formData = new FormData();
        formData.append('file', info.file);
        const response = await axios.put(`/api/users/avatar`, formData);
        if (response.data.user) {
            getProfile()
            openNotification("success", `Avatar subido correctamente`, "Correcto")
            setLoading(false)
        }
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>{t('upload_avatar_text')}</div>
        </div>
    );

    return (
        <Upload
            multiple={false}
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={customUpload}
            beforeUpload={beforeUpload}
            onChange={handleChange}>
            <Tooltip title={t('change_photo')}>
                {imageUrl ? <Avatar
                        size={72}
                        shape="square"
                        src={imageUrl}/>
                    : src ?
                        <Avatar
                            size={72}
                            shape="square"
                            src={getRouteImage(src, 'users', 'avatar')}/> :
                        uploadButton}
            </Tooltip>
        </Upload>
    );
}

export default AvatarUpload;