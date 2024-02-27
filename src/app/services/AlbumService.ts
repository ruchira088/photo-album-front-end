import {axiosClient} from "@/app/http/HttpClient"
import {AxiosResponse} from "axios"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"
import {Photo} from "@/app/services/models/Photo"

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
    const response: AxiosResponse<PhotoAlbum> = await axiosClient.post(`/album/id/${albumId}/authenticate`, { password })
    return response.data
}