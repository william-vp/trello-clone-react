import React, {Fragment, useContext} from 'react';
import logo from '../../Logo-small.svg';
import {Button, Divider, Menu, Input, Typography, Form, Dropdown, Avatar} from 'antd';
import {CaretDownOutlined, AppstoreFilled, UserOutlined, GlobalOutlined} from '@ant-design/icons';
import {ExitToApp as ExitToAppIcon, AccountCircle as AccountCircleIcon} from '@material-ui/icons';
import ThemeSwitcher from "./ThemeSwitcher";
import {useTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import {Auth} from "../../contexts/AuthContext";
import {getRouteImage} from "../../utils/format";
import Loading from "./Loading";
import {useDispatch, useSelector} from "react-redux";
import {MotionScene, MotionScreen, SharedElement} from "react-motion-layout";
import {setBoardsSearchAction} from "../../actions/boardActions";

const {Text} = Typography
const {SubMenu} = Menu

const Navigation = () => {
    const history = useHistory()
    const {user, logOut, profile, loadingAuth, loadingUser} = useContext(Auth);
    const {t, i18n} = useTranslation(['app', 'auth']);
    const changeLanguage = lang => i18n.changeLanguage(lang)

    const {selectedBoard} = useSelector(state => state.board);

    const dispatch = useDispatch();
    const onSearch = query => dispatch(setBoardsSearchAction(query))

    if (loadingAuth || loadingUser) return <Loading/>;
    if (!profile) history.push('/login')
    const {name, photoUrl} = profile

    const menu = (
        <Menu>
            <Menu.Item key='profile'>
                <Button onClick={() => history.push('/profile')} type="text">
                    <AccountCircleIcon className="m-icon"/> {t('auth:my_profile')}
                </Button>
            </Menu.Item>
            <Menu.Divider/>

            <SubMenu key="language" title={
                <Button type="text">
                    <GlobalOutlined/> {t('change_lang')}
                </Button>}>
                <Menu.Item key='lang_en' onClick={() => changeLanguage('en')}>
                    <Button type="text">{t("lang_en_name")}</Button>
                </Menu.Item>
                <Menu.Item key='lang_es' onClick={() => changeLanguage('es')}>
                    <Button type="text">{t("lang_es_name")}</Button>
                </Menu.Item>
            </SubMenu>

            <Menu.Item key='theme_switch'>
                <Text className='ant-btn ant-btn-text'>
                    <ThemeSwitcher tooltip={false}/>
                </Text>
            </Menu.Item>

            <Menu.Item key='logout'>
                <Button onClick={() => logOut(history)} type="text">
                    <ExitToAppIcon className="m-icon"/> {t('auth:logout')}
                </Button>
            </Menu.Item>
        </Menu>
    );

    const userDropdown = () => {
        return <Dropdown overlay={menu} className="ant-dropdown-link">
            <a href="#!" rel="noreferrer noopener" className="ant-dropdown-link"
               onClick={e => e.preventDefault()}>
                {photoUrl ?
                    <Avatar shape="square"
                            src={getRouteImage(photoUrl, 'users', 'avatar')}/>
                    : <Avatar shape="square" icon={<UserOutlined/>}/>}
                <Text className="px-1 font-weight-bold">{name ? name : t('auth:my_profile')} </Text>
                <CaretDownOutlined/>
            </a>
        </Dropdown>
    }

    return (
        <Menu className="py-2 nav-light border-0 shadow-md" selectedKeys={['']}
              mode="horizontal">
            <Menu.Item className="not-hover" key="logo">
                <Link to={"/boards"}>
                    <img src={logo} width={32} height={29} alt="LOGO"/>
                    <Text strong className="pl-2">Thullo</Text>
                </Link>
            </Menu.Item>

            {selectedBoard && <Fragment>
                <Menu.Item key="board" className="not-hover">
                    <MotionScreen>
                        <MotionScene name={`board-${selectedBoard.code}`} scrollUpOnEnter>
                            <SharedElement.Text animationKey="text-main">
                                <Text className="font-weight-bold"> {selectedBoard.name}</Text>
                            </SharedElement.Text>
                        </MotionScene>
                    </MotionScreen>
                </Menu.Item>

                <Menu.Item key="div">
                    <Divider/>
                </Menu.Item>

                <Menu.Item key="all" className="not-hover">
                    <Link to={"/"}>
                        <Button className="bg-gray border-0 rounded-lg p-1 text-gray px-3" type="default"
                                size={"medium"}>
                            <Text className="mt-0 mx-2"><AppstoreFilled/> {t('all_boards')}</Text>
                        </Button>
                    </Link>
                </Menu.Item>
            </Fragment>}

            <Menu.Item key="search" className="not-hover pt-0" style={{marginLeft: 'auto', float: 'left'}}>
                <div className="w-100 rounded-lg p-1 pt-0 my-0 group-search">
                    <Form
                        className="mt-0 pt-0"
                        name="customized_form_controls"
                        layout="inline"
                        //onFinish={onFinish}
                        initialValues={{}}>
                        <Form.Item name="search">
                            <Input onChange={(e) => onSearch(e.target.value)} className="border-0 p-2 pr-1 mt-0"
                                   placeholder={t('search_user_placeholder')}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary rounded-lg mt-1 mr-0" size={"medium"}>{t('search')}</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Menu.Item>

            <Menu.Item key="user" className="not-hover">
                {user && userDropdown()}
            </Menu.Item>
        </Menu>
    );
};
export default Navigation;