import moment from 'moment'
import 'moment/locale/es'

let lang = localStorage.getItem('i18nextLng')
lang = lang.includes('es') ? 'es' : 'en'
moment.locale(lang)

export const formatDate = date => {
    return moment(date)
}

export const formatDateMonth = date => {
    const today = moment(date).format("ll");
    const month = moment().add(1, 'month').format("ll");
    return `De ${today} hasta ${month}`
}

export const getDateRelative = (date, type) => {
    return moment(date).fromNow();
}

export const getDateString = (date, short) => {
    if (short) return moment(date).format("D MMM YYYY");
    return moment(date).format("D [de] MMMM [de] YYYY");
}

export const getRouteImage = (src, folder, type) => {
    if (!src) return false
    if (src.includes('http')) return src;
    const publicRoute = process.env.REACT_APP_BACKEND_URL;
    return `${publicRoute}/${folder}/${type}/${src}`;
}

export const getRouteAvatar = avatar => {
    if (!avatar) return 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';
    const publicRoute = process.env.REACT_APP_BACKEND_URL;
    return publicRoute + '/users/avatar/' + avatar;
}

export const formatPrice = (value) => {
    //if (!value) return value
    return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}