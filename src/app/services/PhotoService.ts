import {axiosClient} from "@/app/http/HttpClient"
import {Photo} from "@/app/services/models/Photo"
import {AxiosRequestConfig, AxiosResponse} from "axios"
import {Maybe} from "monet"

export interface UploadProgress {
    readonly uploaded: number
    readonly total: number
    readonly progress: number
}

export const postPhoto =
    async (albumId: string, imageFile: File, onProgress?: (uploadProgress: UploadProgress) => void, name?: string): Promise<Photo> => {
       const formData = new FormData()
        formData.set("photo", imageFile)
        formData.set("title", name || imageFile.name)

        const config: AxiosRequestConfig = {
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

        const response: AxiosResponse<Photo> = await axiosClient.post(`/album/id/${albumId}/photo`, formData, config)

        return response.data
    }