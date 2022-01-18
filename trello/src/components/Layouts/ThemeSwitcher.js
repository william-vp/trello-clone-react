import React, {Fragment, useState} from 'react';
import {Switch, Tooltip, Typography} from "antd";
import {LoadingOutlined} from '@ant-design/icons';
import {Brightness2, Brightness7} from '@material-ui/icons';
import {useThemeSwitcher} from "react-css-theme-switcher";
import {useTranslation} from "react-i18next";

const {Text} = Typography

const ThemeSwitcher = ({tooltip}) => {
    const theme = localStorage.getItem('theme')
    const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
    const {switcher, status, themes} = useThemeSwitcher(); //currentTheme prop
    const {t} = useTranslation(['app']);

    const toggleTheme = isChecked => {
        const theme = isChecked ? 'dark' : 'light';
        setIsDarkMode(isChecked);
        switcher({theme: isChecked ? themes.dark : themes.light});
        localStorage.setItem('theme', theme)
    };

    if (status === "loading") {
        return <LoadingOutlined/>;
    }

    if (tooltip === false) {
        return (
            <Fragment>
                {isDarkMode ?
                    <Brightness2 style={{fontSize: '15px', marginTop: 3}} className="m-icon"/>
                    : <Brightness7 style={{fontSize: '15px', marginTop: 3}} className="m-icon"/>}
                <Text className="mr-2">{t('change_theme')}</Text>
                <Switch
                    checked={isDarkMode} size="medium"
                    onChange={toggleTheme}
                    checkedChildren={<Brightness2 style={{fontSize: '15px', marginTop: 3}} className="m-icon"/>}
                    unCheckedChildren={<Brightness7 style={{fontSize: '15px', marginTop: 3}} className="m-icon"/>}
                    defaultChecked/>
            </Fragment>
        );
    } else {
        return (
            <Tooltip placement="bottom" title={t('change_theme')}>
                <Switch
                    checked={isDarkMode} size="medium"
                    onChange={toggleTheme}
                    checkedChildren={<Brightness2 style={{fontSize: '15px', marginTop: 3}} className="m-icon"/>}
                    unCheckedChildren={<Brightness7 style={{fontSize: '15px', marginTop: 3}} className="m-icon"/>}
                    defaultChecked/>
            </Tooltip>
        );
    }
};
export default ThemeSwitcher;