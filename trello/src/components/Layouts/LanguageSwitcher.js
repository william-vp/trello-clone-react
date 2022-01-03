import React from 'react';
import {Dropdown, Menu, Tooltip, Typography, Button} from "antd";
import {CaretDownOutlined, GlobalOutlined} from '@ant-design/icons';
import {useTranslation} from "react-i18next";

const {Text} = Typography

const LanguageSwitcher = () => {
    const {t, i18n} = useTranslation(['app']);

    const changeLanguage = lang => i18n.changeLanguage(lang)

    const menu = <Menu>
        <Menu.Item onClick={() => changeLanguage('en')}><Button type="text">{t("lang_en_name")}</Button></Menu.Item>
        <Menu.Item onClick={() => changeLanguage('es')}><Button type="text">{t("lang_es_name")}</Button></Menu.Item>
    </Menu>

    return (
        <Tooltip placement="left" title={t('change_lang')}>
            <Dropdown trigger="click" overlay={menu}>
                <Text className="font-weight-bold">
                    <GlobalOutlined/>
                    <CaretDownOutlined/>
                </Text>
            </Dropdown>
        </Tooltip>
    );
};
export default LanguageSwitcher;