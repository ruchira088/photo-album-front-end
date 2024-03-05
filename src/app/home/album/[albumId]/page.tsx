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
import {postPhoto, UploadProgress} from "@/app/services/PhotoService"

import styles from "./styles.module.scss"

const AlbumPage =
    ({params}: { params: { albumId: string } }) => {
        const [photos, setPhotos] = useState<Photo[]>([])
        const [album, setAlbum] = useState<Maybe<PhotoAlbum>>(Maybe.None)
        const [user, setUser] = useState<Maybe<User>>(Maybe.None)
        const [showPasswordForm, setShowPasswordForm] = useState(false)

        const loadData = async (): Promise<void> => {
            const [photoAlbum, albumPhotos] = await Promise.all([getAlbumById(params.albumId), getPhotosForAlbum(params.albumId)])
            setAlbum(Maybe.Some(photoAlbum))
            setPhotos(albumPhotos)
        }

        const onAuthenticationSuccess = (): Promise<void> => {
            setShowPasswordForm(false)
            return loadData()
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
                    photos.map(photo =>
                        <img key={photo.id} src={`${apiConfiguration.baseUrl}/photo/id/${photo.id}/image-file`}/>
                    )
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
    const [uploadProgresses, setUploadProgresses] = useState<{ [key: number]: UploadProgress }>({})
    const [canRemove, setCanRemove] = useState<boolean>(true)

    const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files

        if (files != null) {
            setImageFiles(Array.from(files))
            setUploadProgresses({})
        }
    }

    async function resolveWithConcurrency<T, R>(concurrency: number, values: T[], mapper: (value: T, id: number) => Promise<R>): Promise<R[]> {
        const result: Promise<R>[] = []
        const activePromises: Map<number, Promise<[number, R]>> = new Map()
        let count = 0

        while (count < values.length) {
            const index = count
            const promise: Promise<R> = mapper(values[index], index)
            result.push(promise)
            activePromises.set(index, promise.then(result => [index, result]))
            count++

            if (activePromises.size === concurrency) {
                const [index] = await Promise.any(activePromises.values())
                activePromises.delete(index)
            }
        }

        return await Promise.all(result)
    }

    const onClick = async () => {
        setCanRemove(false)

        const mapper = (imageFile: File, id: number) =>
            postPhoto(
                props.album.id,
                imageFile,
                uploadProgress =>
                    setUploadProgresses(progresses =>
                        Object.assign({}, progresses, {[id]: uploadProgress})
                    )
            )

        const photos: Photo[] = await resolveWithConcurrency(2, imageFiles, mapper)

        setCanRemove(true)
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
                    <label htmlFor="files-upload" className={styles.fileUploadLabel}>Browse</label>
                    <input
                        id="files-upload"
                        type="file"
                        onInput={onFileUpload}
                        multiple={true}
                        accept="image/*"
                        className={styles.fileUpload}/>
                </div>
                <button onClick={onClick}>Upload</button>
            </div>
            <div>
                {
                    imageFiles.map(
                        (file, key) => {
                            const imageUrl = URL.createObjectURL(file)
                            const onRemove = () =>
                                setImageFiles(files => files.filter(((currentFile, index) => index !== key)))

                            const uploadProgress: UploadProgress | undefined = uploadProgresses[key]

                            return (
                                <div key={key}>
                                    <img src={imageUrl}/>
                                    {uploadProgress ?
                                        <div>{uploadProgress.uploaded} / {uploadProgress.total} ({uploadProgress.progress})</div> : null}
                                    {canRemove ? <button onClick={onRemove}>Remove</button> : null}
                                </div>
                            )
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