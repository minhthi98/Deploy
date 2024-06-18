import React from 'react';
import Switch from 'react-switch';
import { useTheme } from './Context/ThemeContext';
import { useLanguage } from './Context/LanguageContext';
import { useFontSize } from './Context/FontSizeContext';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import 'flag-icon-css/css/flag-icon.min.css';
import i18n from '../../../../../i18n'; // Import i18n từ file i18n.js

const cx = classNames.bind(styles);

const fontSizeLabels = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large'
};

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, switchLanguage } = useLanguage();
  const { fontSize, changeFontSize } = useFontSize();
  const { t } = useTranslation();

  const handleLanguageChange = (checked) => {
    const newLanguage = checked ? 'vi' : 'en';
    console.log(newLanguage);
    switchLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Cập nhật ngôn ngữ trong i18next
  };

  return (
    <div className={cx('container')}>
      <h2 className={cx('title')}>{t('settings.title')}</h2>

      <div className={cx('section')}>
        <h3>{t('settings.theme')}</h3>
        <div className={cx('switch-container')}>
          <Switch 
            onChange={toggleTheme} 
            checked={theme === 'dark'} 
            offColor="#ccc" 
            onColor="#000" 
            uncheckedIcon={false} 
            checkedIcon={false}
          />
          <span>{theme === 'light' ? t('settings.lightMode') : t('settings.darkMode')}</span>
        </div>
      </div>

      <div className={cx('section')}>
        <h3>{t('settings.language')}</h3>
        <div className={cx('switch-container')}>
          <span className="flag-icon flag-icon-us" style={{ marginRight: '8px' }}></span>
          <Switch
            checked={language === 'vi'}
            onChange={handleLanguageChange}
            checkedIcon={<span className="flag-icon flag-icon-vn" />}
            uncheckedIcon={<span className="flag-icon flag-icon-us" />}
            onColor="#0d6efd"
            offColor="#ccc"
            height={24}
            width={48}
            handleDiameter={22}
          />
          <span className="flag-icon flag-icon-vn" style={{ marginLeft: '8px' }}></span>
        </div>
      </div>

      <div className={cx('section')}>
        <h3>{t('settings.fontSize')}</h3>
        <div className={cx('font-size-options')}>
          {Object.keys(fontSizeLabels).map(size => (
            <button
              key={size}
              className={cx('font-size-button', { active: fontSize === size })}
              onClick={() => changeFontSize(size)}
              title={`Select ${fontSizeLabels[size]} font size`}
            >
              {fontSizeLabels[size]}
            </button>
          ))}
        </div>
        <span className={cx('font-size-display')}>
          {t('settings.fontSize')}: {t(`settings.${fontSize}`)}
        </span>
      </div>
    </div>
  );
};

export default Settings;
