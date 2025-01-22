import useLanguage from '@/locale/useLanguage';

import NotificationSettingsModule from '@/modules/SettingModule/NotificationSettingsModule';

export default function NotificationSettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
    SETTINGS_TITLE: translate('General Settings'),
  };

  const configPage = {
    entity,
    settingsCategory: 'general_settings',
    ...Labels,
  };
  return <NotificationSettingsModule config={configPage} />;
}
