import { useApiUrl, useTranslate } from "@pankod/refine-core";
import axios from 'axios';
import {
  Form,
  Upload,
  getValueFromEvent,
  Button,
  Icons
} from "@pankod/refine-antd";
import { Constants } from "../../helpers/constants";
import { setObjectValue } from "../../helpers/functions";

interface Props {
  form: any;
  name: string | string[];
  accept: string;
  maxFiles: number;
  label?: string;
  listType?: any;
  isRequired?: boolean;
  onChange?: Function;
}
export const FilesForm: React.FC<Props> = ({
  form,
  name,
  accept,
  maxFiles,
  isRequired = false,
  label = "words.files",
  listType = "text",
  onChange = (list:any) => {}
}) => {

  const apiUrl = useApiUrl();
  const t = useTranslate();

  const uploadProps = {
    action: `${apiUrl}/file/upload`,
    multiple: false,
    headers: {
      Authorization: `Bearer ${localStorage.getItem(Constants.TOKEN_KEY)}`,
    },

    customRequest({
      action,
      data,
      file,
      filename,
      headers,
      onError,
      onProgress,
      onSuccess,
      withCredentials,
    }: any) {

      const formData = new FormData();
      formData.append(filename, file, file.name);

      axios
        .post(action, formData, {
          withCredentials,
          headers,
          onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
          },
        })
        .then(({ data: response }) => {
          onSuccess(response, file);
        })
        .catch(onError);

      return {
        abort() {
          console.log('upload progress is aborted.');
        },
      };
    },
  };

  return <Form.Item label={t(label)}>
    <Form.Item
      name={name}
      valuePropName={"fileList"}
      getValueFromEvent={(event) => {
        let list: any = getValueFromEvent(event);
        let newList = [];

        for (let i in list) {
          const item = list[i];

          if (item.response) {
            let res = item.response;

            newList.push({
              uid: item.response.driveId,
              name: item.name,
              size: item.size,
              type: item.type,
              id: item.response.id,
              driveId: item.response.driveId,
              status: item.status,
              url: `${apiUrl}/file/restore/${item.response.id}`
            });

          } else {
            newList.push({ ...item });
          }
        }

        let values = form.getFieldsValue();
        setObjectValue(values, name, newList);
        form.setFieldsValue(values);

        onChange(newList);
        return newList;
      }}

      noStyle
      rules={[
        {
          required: isRequired,
        },
      ]}
    >
      <Upload.Dragger
        {...uploadProps}
        listType={listType}
        maxCount={maxFiles}
        accept={accept}
      >
        <Button icon={<Icons.UploadOutlined />}>{t('phrases.uploadButton')}</Button>
      </Upload.Dragger>
    </Form.Item>
  </Form.Item>
};