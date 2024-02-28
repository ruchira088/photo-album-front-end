"use client"

import React, {useEffect, useState} from "react"
import AlbumCreationForm from "@/app/home/AlbumCreationForm"
import Link from "next/link"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"
import {getAlbumsByUser} from "@/app/services/AlbumService"
import {usePathname, useRouter} from "next/navigation"
import {logout} from "@/app/services/AuthenticationService"

const Home = () => {
    const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>([])
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
       loadAlbums()
            .catch(error => {
                if (error.response.status === 401) {
                    router.push(`/login?next=${pathname}`)
                }
            })
    }, [])

    const loadAlbums = () =>
        getAlbumsByUser().then(photoAlbums => setPhotoAlbums(photoAlbums))

    return (
        <div>
            {photoAlbums.map(photoAlbum =>
                <Link key={photoAlbum.id} href={`/home/album/${photoAlbum.id}`}>
                    <div>Title</div>
                    <div>{photoAlbum.name}</div>
                </Link>
            )
            }
            <div className="flex min-h-screen flex-col items-center justify-between p-24">
                <AlbumCreationForm onCreation={loadAlbums}/>
            </div>
            <div>
                <button onClick={() => logout()}>Logout</button>
            </div>
        </div>
    )
}

export default Home