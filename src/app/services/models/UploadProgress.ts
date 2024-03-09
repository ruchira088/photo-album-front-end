import {AxiosRequestConfig} from "axios"
import {Maybe} from "monet"

export interface UploadProgress {
    readonly uploaded: number
    readonly total: number
    readonly progress: number
}

export const uploadProgressAxiosRequestConfig =
    (onProgress: (uploadProgress: UploadProgress) => void): AxiosRequestConfig => ({
            onUploadProgress: progressEvent => {
                if (onProgress != undefined) {
                    onProgress({
                        uploaded: progressEvent.loaded,
                        total: Maybe.fromNull(progressEvent.total).orJust(0),
                        progress: Maybe.fromNull(progressEvent.progress).orJust(0)
                    })
                }
            }
        }
    )