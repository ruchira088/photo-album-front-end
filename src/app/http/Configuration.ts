import {Maybe} from "monet"

export interface Configuration {
    readonly baseUrl: string
}

export const apiConfiguration: Configuration = {
    baseUrl: Maybe.fromNull(process.env.NEXT_PUBLIC_API_URL)
        .orJust("https://api.photo-album.home.ruchij.com")
}