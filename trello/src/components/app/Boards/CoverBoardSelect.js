import React, {useState, useCallback, useEffect} from "react";
import Gallery from "react-photo-gallery";
import Carousel, {Modal as ModalImage, ModalGateway} from "react-images";
import clientAxiosUnsplashApi from "../../../config/axiosUnsplashApi";

import {Image as ImageIcon} from '@material-ui/icons';
import {Button, Form, Input, Modal, Pagination, Popconfirm, Tooltip, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {PictureOutlined} from '@ant-design/icons'

const {Title} = Typography

const CoverBoardSelect = ({onChangeImage}) => {
    const {t} = useTranslation(['app', 'board'])
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalImages, setTotalImages] = useState(0);
    const [query, setQuery] = useState('');
    const [numPerPage, setNumPerPage] = useState(10);

    const [visible, setVisible] = useState(false);

    const [images, setImages] = useState([]);

    const getImages = async () => {
        try {
            const response = await clientAxiosUnsplashApi
                .get(`https://api.unsplash.com/search/photos?page=${page}&query=${query}&per_page=${numPerPage}`);
            if (response.data) {
                setTotalImages(response.data.total)
                const data = response.data.results.map((image) => {
                    let width = image.width;
                    let height = image.height;
                    return {
                        src: image.urls.small,
                        srcFull: image.urls.full,
                        alt: image.description,
                        width, height,
                        key: image.id
                    }
                })
                setImages(data)
            }
        } catch (e) {
            setImages([])
        }
    }

    useEffect(() => {
        if (query.length > 2) getImages()
        // eslint-disable-next-line
    }, [page, query, numPerPage]);

    const openLightbox = useCallback((event, {photo, index}) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, [])

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    }

    const onShowSizeChange = (current, pageSize) => {
        setNumPerPage(pageSize)
        setPage(1)
    }

    const pagination = () => {
        if (totalImages > 10) {
            return <div className="text-center w-100 my-2">
                <Pagination
                    showSizeChanger
                    onShowSizeChange={onShowSizeChange}
                    onChange={(page) => setPage(page)}
                    defaultCurrent={page}
                    total={totalImages}/>
            </div>
        }
    }

    const onSelectImage = (photo) => {
        onChangeImage(photo.src, photo.srcFull)
        setVisible(false)
    }

    return (
        <div>
            <Tooltip title={t('label_select_cover')}>
                <Button
                    block
                    onClick={() => setVisible(true)}
                    type="default" size="large"
                    className="bg-gray border-0 rounded-lg p-1 text-gray px-3">
                    <ImageIcon className="m-icon"/> {t('cover_label')}
                </Button>
            </Tooltip>

            <Modal
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={800}>
                <Title level={5}>{t('label_select_cover')}</Title>

                <Form
                    name="edit_profile"
                    initialValues={{query}}>
                    <Form.Item
                        className="mb-3"
                        required
                        rules={[{
                            required: true,
                            message: `${t('message_input')} ${t('label_name')}`
                        }]}>
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            name="query"
                            className="input-profile"
                            placeholder={`${t('board:placeholder_query_cover')}`}/>
                    </Form.Item>
                </Form>

                {pagination()}
                {images.length > 0 &&
                <>
                    <Gallery
                        renderImage={(image) => {
                            let photo = image.photo
                            return <Popconfirm
                                index={image.index}
                                icon={<PictureOutlined/>}
                                trigger={'hover'}
                                title={t('board:select_cover_question')}
                                cancelText={t('cancel_text')}
                                onConfirm={() => onSelectImage(photo)}
                                okText="Ok">
                                <img
                                    style={{margin: image.margin, borderRadius: '8px'}}
                                    onClick={(e) => openLightbox(e, {photo, index: image.index})}
                                    key={photo.key}
                                    width={photo.width}
                                    height={photo.height}
                                    alt={photo.alt}
                                    src={photo.src}/>
                            </Popconfirm>
                        }}
                        columns={4}
                        photos={images}
                        onClick={openLightbox}/>
                    <ModalGateway>
                        {viewerIsOpen ? (
                            <ModalImage onClose={closeLightbox}>
                                <Carousel
                                    currentIndex={currentImage}
                                    views={images.map(x => ({
                                        //...x,
                                        key: x.key,
                                        src: x.src,
                                        alt: x.alt
                                    }))}/>
                            </ModalImage>
                        ) : null}
                    </ModalGateway>
                </>}
                {pagination()}
            </Modal>
        </div>
    );
}
export default CoverBoardSelect;