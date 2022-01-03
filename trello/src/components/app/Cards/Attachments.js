import React, { useEffect, useState } from 'react'
import axios, { clientAxiosDownload } from '../../../config/axios';
import { useTranslation } from 'react-i18next';
import { Button, Popover, Upload, List, Typography, message, Space } from 'antd';
import { Description as DescriptionIcon, Add as AddIcon } from '@material-ui/icons';
import { InboxOutlined, FileExcelFilled, FileFilled, FileWordFilled, FileZipFilled, FileImageFilled, FilePdfFilled, FilePptFilled, FileTextFilled } from '@ant-design/icons';
import { getDateRelative } from '../../../utils/format';
const FileDownload = require('js-file-download');

const { Dragger } = Upload;

const { Paragraph, Text, Title } = Typography

const Attachments = ({ cardId }) => {
    const { t } = useTranslation(['app', 'board'])
    const [loading, setLoading] = useState(false)
    const [attachments, setAttachments] = useState([])
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (cardId) getAttachments()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (loading) message.loading("Espera un momento por favor")
        // eslint-disable-next-line
    }, [loading])

    const getAttachments = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`/api/files/${cardId}`);
            if (response.data.files) {
                setAttachments(response.data.files)
            }
        } catch (e) {
        }
        setLoading(false)
    }

    const getIconFile = name => {
        let extension = name.substring(name.lastIndexOf('.', name.length));
        if (extension.includes('xlsx', 'xls')) {
            return <FileExcelFilled style={{ fontSize: '35px' }} />
        } else if (extension.includes('doc', 'docx')) {
            return <FileWordFilled style={{ fontSize: '35px' }} />
        } else if (extension.includes('png', '.jpg', 'jpeg', 'gif')) {
            return <FileImageFilled style={{ fontSize: '35px' }} />
        } else if (extension.includes('zip', 'rar')) {
            return <FileZipFilled style={{ fontSize: '35px' }} />
        } else if (extension.includes('pdf')) {
            return <FilePdfFilled style={{ fontSize: '35px' }} />
        } else if (extension.includes('ppt', 'pptx')) {
            return <FilePptFilled style={{ fontSize: '35px' }} />
        } else if (extension.includes('txt', 'sql')) {
            return <FileTextFilled style={{ fontSize: '35px' }} />
        } else {
            return <FileFilled style={{ fontSize: '35px' }} />
        }
    }

    const props = {
        name: 'file',
        multiple: false,
        method: 'post',
        showUploadList: false
    };

    const customUpload = async (info) => {
        setLoading(true)
        const formData = new FormData();
        formData.append('file', info.file);
        const response = await axios.post(`/api/files/${cardId}`, formData);
        if (response.data.file) {
            message.success(`Archivo subido correctamente: ${response.data.file.name}`)
            setAttachments([...attachments, response.data.file])
            setLoading(false)
            setVisible(false)
        }
    }

    const contentUpload = () => {
        return <>
            <Dragger
                beforeUpload={beforeUpload}
                customRequest={customUpload}
                {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text p-2">{t('board:upload_title')}</p>
            </Dragger>
            <div className="mt-2 text-center">
                <Button type="primary" onClick={(e) => {
                    e.stopPropagation();
                    setVisible(false)
                }}>{t('board:close')}</Button>
            </div>
        </>
    }

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'application/exe';
        if (isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        console.log(file.size / 1024 / 1024 < 5)
        if (!isLt2M) {
            message.error('Image must smaller than 5MB!');
            return;
        }
    }

    const handleDelete = async fileId => {
        setLoading(true)
        const response = await axios.delete(`/api/files/${fileId}`);
        if (response.data.success) {
            message.success(`Archivo eliminado correctamente`)
            const files = attachments.filter(file => file._id !== fileId);
            setAttachments(files)
            setLoading(false)
        }
    }

    const handleDownload = async (fileId, name) => {
        setLoading(true)
        const response = await clientAxiosDownload.get(`/api/files/${fileId}/download`);
        FileDownload(response.data, name);
        message.success(`Archivo descargado correctamente`)
        setLoading(false)
    }

    return (
        <>
            <Paragraph>
                <Text className="label-small mt-5 mr-2">
                    <DescriptionIcon className="m-icon" /> {t('board:attachments_text')}
                </Text>
                <Popover
                    content={contentUpload}
                    title={t("board:upload_text")}
                    trigger="click"
                    visible={visible}>
                    <Button
                        onClick={() => setVisible(true)}
                        size="small"
                        className={"p-2 pt-0"}>
                        <AddIcon className="m-icon" fontSize={"small"} /> {t('board:add')}
                    </Button>
                </Popover>
            </Paragraph>

            <List
                dataSource={attachments}
                renderItem={item => (
                    <List.Item key={1}>
                        <List.Item.Meta
                            avatar={getIconFile(item.name)}
                            description={<>
                                <Text className="text-muted mb-0">{getDateRelative(item.created_at)}</Text>
                                <Title className="mt-0" level={5}>{item.name}</Title>
                                <Space>
                                    <Button
                                        onClick={() => handleDownload(item._id, item.name)} size="small" className={"p-2 pt-0 mt-0"}>
                                        {t('board:download_text')}
                                    </Button>
                                    <Button onClick={() => handleDelete(item._id)} size="small" className={"p-2 pt-0 mt-0"}>
                                        {t('board:delete_text')}
                                    </Button>
                                </Space>
                            </>}
                        />
                    </List.Item>
                )}>
            </List>
        </>
    )
}

export default Attachments;