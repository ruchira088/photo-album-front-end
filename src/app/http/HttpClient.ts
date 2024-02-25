import axios from "axios"
import {Maybe} from "monet"

export const axiosClient =
    axios.create({
        baseURL:
            Maybe.fromNull(process.env.NEXT_PUBLIC_API_URL)
                .orLazy(() => `https://api.${window.location.hostname}`),
        withCredentials: true
    })