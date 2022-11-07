import { useApiUrl } from "@pankod/refine-core";
import axios from "axios";

export const uploadProps = () => {
    const apiUrl = useApiUrl();
    const token = localStorage.getItem(Constants.TOKEN_KEY);

    return {
        action: `${apiUrl}/file/upload`,
        multiple: false,
        // headers: {
        //   Authorization: '$prefix $token',
        // },
        // onStart(file:any) {
        //   console.log('onStart', file, file.name);
        // },
        // onSuccess(res:any, file:any) {
        //   console.log('onSuccess', res, file.name);
        // },
        // onError(err:any) {
        //   console.log('onError', err);
        // },
        // onProgress({ percent }:any, file:any) {
        //   console.log('onProgress', `${percent}%`, file.name);
        // },
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
        }) {
        
          const formData = new FormData();
          formData.append(filename, file, file.name);

          headers['Authorization'] = `Bearer ${token}`;

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
}



