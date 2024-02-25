import {axiosClient} from "@/app/http/HttpClient"
import {User} from "@/app/services/models/User"

export interface UserSignupRequest {
    readonly email: string
    readonly password: string
    readonly firstName: string
    readonly lastName?: string
}

export const createUser = async (userSignupRequest: UserSignupRequest): Promise<User> => {
    const response = await axiosClient.post<User>("/user", userSignupRequest)
    return response.data
}