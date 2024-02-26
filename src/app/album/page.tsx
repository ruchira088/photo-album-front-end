"use client"

import React, {useEffect, useState} from "react"
import AlbumCreationForm from "@/app/album/AlbumCreationForm"
import Link from "next/link"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"
import {getAlbumsByUser} from "@/app/services/AlbumService"

const Album = () => {
    const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>([])

    useEffect(() => {
        getAlbumsByUser().then(photoAlbums => setPhotoAlbums(photoAlbums))
    }, [])

    return (
        <div>
            {photoAlbums.map(photoAlbum =>
                <Link key={photoAlbum.id} href={`/album/${photoAlbum.id}`}>
                    <div>Title</div>
                    <div>{photoAlbum.name}</div>
                </Link>
            )
            }
            <div className="flex min-h-screen flex-col items-center justify-between p-24">
                <AlbumCreationForm/>
            </div>
        </div>
    )
}

export default Album