import {message, notification} from "antd";

export const openNotification = (title, message, type) => {
    notification[type]({
        message: title,
        description: message,
        placement: "bottomRight"
    });
};

export const openMessageInfo = (type, text) => {
    message.destroy()
    if (!text) return;
    switch (type) {
        case 'warning':
            message.warning(text);
            break
        case 'error':
            message.error(text);
            break
        case 'success':
            message.success(text);
            break
        case 'info':
            message.info(text);
            break
        case 'loading':
            message.loading(text);
            break
        default:
            message.info(text);
    }
}