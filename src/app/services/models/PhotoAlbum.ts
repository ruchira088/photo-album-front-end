import {Dimensions} from "@/app/home/album/[albumId]/page"

export interface PhotoAlbum {
    readonly id: string
    readonly userId: string
    readonly name: string
    readonly description?: string
    readonly isPublic: boolean
    readonly isPasswordProtected: boolean
    readonly albumCover?: Dimensions
}