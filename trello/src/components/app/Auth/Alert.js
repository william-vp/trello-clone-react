import {notification, message} from 'antd';

export const openNotification = (type, message, description) => {
    notification[type]({
        message, description
    });
};

export const openInfoLoading = (state) => {
    if (state) {
        message.loading({content: 'Espera un momento...'});
    } else {
        message.destroy()
        //message.success({content: 'Loaded!', duration: 2});
    }
};

export const openInfoMessage = (text, type) => {
    message.destroy()
    switch (type) {
        case 'error':
            message.error(text);
            break
        case 'success':
            message.success(text);
            break
        case 'warning':
            message.warning(text);
            break
        default:
            message.info(text);
    }
};