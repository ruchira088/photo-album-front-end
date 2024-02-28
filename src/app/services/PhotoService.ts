import {axiosClient} from "@/app/http/HttpClient"
import {Photo} from "@/app/services/models/Photo"
import {AxiosResponse} from "axios"

export const postPhoto =
    async (albumId: string, imageFile: File, name?: string): Promise<Photo> => {
       const formData = new FormData()
        formData.set("photo", imageFile)
        formData.set("title", name || imageFile.name)

        const response: AxiosResponse<Photo> = await axiosClient.post(`/album/id/${albumId}/photo`, formData)

        return response.data
    }