"use client"

import React, {useEffect, useState} from "react"
import AlbumCreationForm from "@/app/home/AlbumCreationForm"
import Link from "next/link"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"
import {getAlbumsByUser} from "@/app/services/AlbumService"
import {usePathname, useRouter} from "next/navigation"
import {logout} from "@/app/services/AuthenticationService"
import {renderIfTrue} from "@/app/helpers/ComponentHelpers"
import {apiConfiguration} from "@/app/http/Configuration"

const Home = () => {
    const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>([])
    const [showAlbumCreationDialog, setShowAlbumCreationDialog] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        loadAlbums()
            .catch(error => {
                if (error.response.status === 401) {
                    router.push(`/login?next=${pathname}`)
                }
            })
    }, [router, pathname])

    const loadAlbums = async () => {
        const photoAlbums = await getAlbumsByUser()
        setPhotoAlbums(photoAlbums)
    }

    const newAlbumCreated = async () => {
        await loadAlbums()
        setShowAlbumCreationDialog(false)
    }

    const onLogout = async () => {
        await logout()
        router.push("/login")
    }

    return (
        <div>
            {
                photoAlbums.map(photoAlbum =>
                    <Link key={photoAlbum.id} href={`/home/album/${photoAlbum.id}`}>
                        <div>{photoAlbum.name}</div>
                        {
                            renderIfTrue(
                                photoAlbum.albumCover != null,
                                <img src={`${apiConfiguration.baseUrl}/album/id/${photoAlbum.id}/album-cover`}
                                     alt="Album cover"/>
                            )
                        }
                    </Link>
                )
            }
            <div>
                <button onClick={() => setShowAlbumCreationDialog(true)}>Create Album</button>
                {
                    renderIfTrue(
                        showAlbumCreationDialog,
                        <AlbumCreationForm onCreation={newAlbumCreated}
                                           onCancel={() => setShowAlbumCreationDialog(false)}/>
                    )
                }
            </div>
            <div>
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Home