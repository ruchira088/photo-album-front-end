import {Maybe} from "monet"

export interface Configuration {
    readonly baseUrl: string
}

export const apiConfiguration: Configuration = {
    baseUrl: Maybe.fromNull(process.env.NEXT_PUBLIC_API_URL)
        .orLazy(() => `https://api.${window.location.hostname}`)
}