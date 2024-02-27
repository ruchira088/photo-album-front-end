"use client"

import React, {useEffect, useState} from "react"
import {Photo} from "@/app/services/models/Photo"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"
import {authenticateAlbum, getAlbumById, getPhotosForAlbum} from "@/app/services/AlbumService"
import {apiConfiguration} from "@/app/http/Configuration"
import {Maybe} from "monet"

const AlbumPage =
    ({params}: { params: { albumId: string } }) => {
        const [photos, setPhotos] = useState<Photo[]>([])
        const [album, setAlbum] = useState<Maybe<PhotoAlbum>>(Maybe.None)
        const [showPasswordForm, setShowPasswordForm] = useState(false)

        useEffect(() => {
            getAlbumById(params.albumId)
                .then(album => {
                    setShowPasswordForm(false)
                    setAlbum(Maybe.Just(album))
                })
                .then(() => getPhotosForAlbum(params.albumId))
                .then(photos => setPhotos(photos))
                .catch(error => {
                    const [errorResponse] = error.response.data.errors

                    if (errorResponse.includes("password")) {
                        setShowPasswordForm(true)
                    } else {

                    }
                })
        }, [ showPasswordForm ])

        return (
            <div>
                {
                    photos.map(photo => <img key={photo.id}
                                             src={`${apiConfiguration.baseUrl}/photo/id/${photo.id}/image-file`}/>)
                }
                {
                    showPasswordForm ? <PasswordForm albumId={params.albumId} onSuccess={() => setShowPasswordForm(false)}/> : null
                }
            </div>
        )
    }

const PasswordForm = (props: {albumId: string, onSuccess: () => void}) => {
    const [password, setPassword] = useState("")

    return (
        <div>
            <div>
                <label>Password</label>
                <input value={password} onChange={event => setPassword(event.target.value)}/>
            </div>
            <div>
                <button onClick={() => authenticateAlbum(props.albumId, password).then(props.onSuccess)}>Login</button>
            </div>
        </div>
    )
}

export default AlbumPage