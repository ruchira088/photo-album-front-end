"use client"

import axios from "axios"
import {apiConfiguration} from "@/app/http/Configuration"

export const axiosClient =
    axios.create({
        baseURL: apiConfiguration.baseUrl,
        withCredentials: true
    })