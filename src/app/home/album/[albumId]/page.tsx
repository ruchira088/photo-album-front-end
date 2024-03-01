"use client"

import React, {useEffect, useState} from "react"
import {Photo} from "@/app/services/models/Photo"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"
import {authenticateAlbum, getAlbumById, getPhotosForAlbum} from "@/app/services/AlbumService"
import {apiConfiguration} from "@/app/http/Configuration"
import {Maybe} from "monet"
import Link from "next/link"
import {User} from "@/app/services/models/User"
import {authenticatedUser} from "@/app/services/AuthenticationService"
import {postPhoto} from "@/app/services/PhotoService"

const AlbumPage =
    ({params}: { params: { albumId: string } }) => {
        const [photos, setPhotos] = useState<Photo[]>([])
        const [album, setAlbum] = useState<Maybe<PhotoAlbum>>(Maybe.None)
        const [user, setUser] = useState<Maybe<User>>(Maybe.None)
        const [showPasswordForm, setShowPasswordForm] = useState(false)

        const loadData = async () => {
            const [photoAlbum, albumPhotos] = await Promise.all([getAlbumById(params.albumId), getPhotosForAlbum(params.albumId)])
            setAlbum(Maybe.Some(photoAlbum))
            setPhotos(albumPhotos)
        }

        const onAuthenticationSuccess = async () => {
            setShowPasswordForm(false)
            await loadData()
        }

        useEffect(() => {
            authenticatedUser().then(user => setUser(Maybe.Some(user)))
        }, [])

        useEffect(() => {
            loadData()
                .catch(error => {
                    const [errorResponse] = error.response.data.errors

                    if (errorResponse.includes("password")) {
                        setShowPasswordForm(true)
                    } else {

                    }
                })
        }, [])

        return (
            <div>
                <div>
                    <Link href="/home">Home</Link>
                </div>
                {
                    user.flatMap(userValue =>
                        album
                            .filter(albumValue => albumValue.userId === userValue.userId)
                            .map(albumValue => <AlbumDetail key={albumValue.id} album={albumValue}/>)
                    )
                }

                {
                    photos.map(photo => <img key={photo.id}
                                             src={`${apiConfiguration.baseUrl}/photo/id/${photo.id}/image-file`}/>)
                }
                {
                    showPasswordForm ?
                        <PasswordForm albumId={params.albumId} onSuccess={onAuthenticationSuccess}/> : null
                }
            </div>
        )
    }

const AlbumDetail = (props: { album: PhotoAlbum }) => {
    const [imageFiles, setImageFiles] = useState<File[]>([])

    const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files

        if (files != null) {
            setImageFiles(Array.from(files))
        }
    }

    const onClick = async () => {
        await Promise.all(imageFiles.map(imageFile => postPhoto(props.album.id, imageFile)))
    }

    return (
        <div>
            <div>
                <div>
                    <div>Name</div>
                    <div>{props.album.name}</div>
                </div>
                <div>
                    <div>Image</div>
                    <label htmlFor="files-upload"></label>
                    <input id="files-upload" type="file" onInput={onFileUpload} multiple={true} accept="image/*"/>
                </div>
                <button onClick={onClick}>Upload</button>
            </div>
            <div>
                {
                    imageFiles.map(
                        (file, key) => {
                            const imageUrl = URL.createObjectURL(file)
                            return <img key={key} src={imageUrl}/>
                        }
                    )
                }
            </div>
        </div>
    )
}

const PasswordForm = (props: { albumId: string, onSuccess: () => void }) => {
    const [password, setPassword] = useState("")

    return (
        <div>
            <div>
                <label>Password</label>
                <input value={password} onChange={event => setPassword(event.target.value)}/>
            </div>
            <div>
                <button onClick={() => authenticateAlbum(props.albumId, password).then(props.onSuccess)}>Enter</button>
            </div>
        </div>
    )
}

export default AlbumPage