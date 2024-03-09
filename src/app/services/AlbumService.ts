import {axiosClient} from "@/app/http/HttpClient"
import {AxiosRequestConfig, AxiosResponse} from "axios"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"
import {Photo} from "@/app/services/models/Photo"
import {Dimensions} from "@/app/home/album/[albumId]/page"
import {Maybe} from "monet"
import {UploadProgress, uploadProgressAxiosRequestConfig} from "@/app/services/models/UploadProgress"

export interface CreateAlbumRequest {
    readonly name: string
    readonly description?: string
    readonly isPublic: boolean
    readonly password?: string
}

export const createPhotoAlbum = async (createAlbumRequest: CreateAlbumRequest): Promise<PhotoAlbum> => {
    const response: AxiosResponse<PhotoAlbum> = await axiosClient.post("/album", createAlbumRequest)
    return response.data
}

export const getAlbumsByUser = async (): Promise<PhotoAlbum[]> => {
    const response: AxiosResponse<PhotoAlbum[]> = await axiosClient.get("/album/user")
    return response.data
}

export const getAlbumById = async (albumId: string): Promise<PhotoAlbum> => {
    const response: AxiosResponse<PhotoAlbum> = await axiosClient.get(`/album/id/${albumId}`)
    return response.data
}

export const getPhotosForAlbum = async (albumId: string): Promise<Photo[]> => {
    const response: AxiosResponse<Photo[]> = await axiosClient.get(`/album/id/${albumId}/photo`)
    return response.data
}

export const authenticateAlbum = async (albumId: string, password: string): Promise<PhotoAlbum> => {
    const response: AxiosResponse<PhotoAlbum> = await axiosClient.post(`/album/id/${albumId}/authenticate`, {password})
    return response.data
}

export const uploadAlbumCover =
    async (albumId: string, imageFile: File, dimensions: Dimensions, onProgress?: (uploadProgress: UploadProgress) => void): Promise<PhotoAlbum> => {
        const formData = new FormData()
        formData.set("photo", imageFile)
        formData.set("height", dimensions.height.toString(10))
        formData.set("width", dimensions.width.toString(10))

        const config: AxiosRequestConfig | undefined =
            Maybe.fromNull(onProgress)
                .map(uploadProgressAxiosRequestConfig)
                .orUndefined()

        const response: AxiosResponse<PhotoAlbum> = await axiosClient.post(`/album/id/${albumId}/album-cover`, formData, config)

        return response.data
    }