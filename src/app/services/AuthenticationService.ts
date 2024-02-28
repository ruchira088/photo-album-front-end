import {axiosClient} from "@/app/http/HttpClient"
import {AxiosResponse} from "axios"
import {User} from "@/app/services/models/User"

export interface LoginRequest {
    readonly email: string
    readonly password: string
}

export const loginUser = async (loginRequest: LoginRequest): Promise<User> => {
    const response: AxiosResponse<User> = await axiosClient.post("/auth/login", loginRequest)
    return response.data
}

export const authenticatedUser = async (): Promise<User> => {
    const response: AxiosResponse<User> = await axiosClient.get("/auth/current")
    return response.data
}

export const logout = async (): Promise<User> => {
    const response: AxiosResponse<User> = await axiosClient.delete("/auth/logout")
    return response.data
}