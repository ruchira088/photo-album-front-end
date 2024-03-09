import {axiosClient} from "@/app/http/HttpClient"
import {Photo} from "@/app/services/models/Photo"
import {AxiosRequestConfig, AxiosResponse} from "axios"
import {Maybe} from "monet"
import {Dimensions} from "@/app/home/album/[albumId]/page"
import {UploadProgress, uploadProgressAxiosRequestConfig} from "@/app/services/models/UploadProgress"

export const postPhoto =
    async (albumId: string, imageFile: File, dimensions: Dimensions, onProgress?: (uploadProgress: UploadProgress) => void, name?: string): Promise<Photo> => {
       const formData = new FormData()
        formData.set("photo", imageFile)
        formData.set("title", name || imageFile.name)
        formData.set("height", dimensions.height.toString(10))
        formData.set("width", dimensions.width.toString(10))

        const config: AxiosRequestConfig | undefined =
            Maybe.fromNull(onProgress)
                .map(uploadProgressAxiosRequestConfig)
                .orUndefined()

        const response: AxiosResponse<Photo> = await axiosClient.post(`/album/id/${albumId}/photo`, formData, config)

        return response.data
    }