import {axiosClient} from "@/app/http/HttpClient"
import {AxiosResponse} from "axios"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"

export interface CreateAlbumRequest {
    readonly name: string
    readonly description?: string
    readonly isPublic: boolean
    readonly password?: string
}

const createPhotoAlbum = async (createAlbumRequest: CreateAlbumRequest): Promise<PhotoAlbum> => {
    const response: AxiosResponse<PhotoAlbum> = await axiosClient.post("/album", createAlbumRequest)
    return response.data
}