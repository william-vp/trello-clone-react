import React, {useState, useEffect} from "react";
import {List, message, Avatar, Spin} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import clientAxiosUnsplashApi from "../../../config/axiosUnsplashApi";

const SelectCover = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        const response = await clientAxiosUnsplashApi
            .get(`https://api.unsplash.com/topics`);
        if (response.data) setData(response.data)
    }

    const handleInfiniteOnLoad = () => {
        setLoading(true)
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            setLoading(true)
            setHasMore(false)
            return;
        }
        setLoading(true)
    };

    return (
        <div className="demo-infinite-container">
            <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                useWindow={false}>
                <List
                    dataSource={data}
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={item.cover_photo.urls.small}/>
                                }
                                description={item.slug}/>
                            <div>Content</div>
                        </List.Item>
                    )}>
                    {loading && hasMore && (
                        <div className="demo-loading-container">
                            <Spin/>
                        </div>
                    )}
                </List>
            </InfiniteScroll>
        </div>
    );
}

export default SelectCover;