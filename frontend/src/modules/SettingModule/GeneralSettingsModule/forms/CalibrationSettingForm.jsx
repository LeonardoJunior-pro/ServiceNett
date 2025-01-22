import { Form, Select } from 'antd';

// import languages from '@/locale/languages';
import useLanguage from '@/locale/useLanguage';

export default function CalibrationSettingForm() {
  const translate = useLanguage();
  const intervalOptions = [
    { label: '6 Months', value: '6' },
    { label: '12 Months', value: '12' },
    { label: '24 Months', value: '24' },
    { label: '60 Months', value: '60' },
  ];
  return (
    <>
      <Form.Item
        label={translate('interval')}
        name="interval"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select options={intervalOptions} />
      </Form.Item>
      {/* <Form.Item
        label={translate('language')}
        name="language"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          showSearch
          placeholder={translate('select language')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
          }
        >
          {languages.map((language) => (
            <Select.Option
              key={language.value}
              value={language.value}
              label={language.label.toLowerCase()}
            >
              <div className="demo-option-label-item">
                <span role="img" aria-label={language.label}>
                  {language.icon}
                </span>
                {language.label}
              </div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item> */}
    </>
  );
}
