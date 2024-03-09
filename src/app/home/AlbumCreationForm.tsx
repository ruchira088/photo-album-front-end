"use client"

import React, {SyntheticEvent, useState} from "react"
import {createPhotoAlbum, uploadAlbumCover} from "@/app/services/AlbumService"
import {parseString} from "@/app/helpers/StringHelpers"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"
import styles from "@/app/home/album/[albumId]/styles.module.scss"
import {Maybe} from "monet"
import {Dimensions} from "@/app/home/album/[albumId]/page"

const AlbumCreationForm = (props: { onCreation: () => void }) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [imageData, setImageData] = useState<Maybe<[File, string]>>(Maybe.None)
    const [imageDimensions, setImageDimensions] = useState<Maybe<Dimensions>>(Maybe.None)
    const [isPublic, setPublic] = useState(false)
    const [password, setPassword] = useState("")

    const onSubmit = async (): Promise<PhotoAlbum> => {
        const album = await createPhotoAlbum({
            name,
            isPublic,
            description: parseString(description),
            password: parseString(password)
        })

        await imageData.flatMap<Promise<PhotoAlbum | void>>(([file]) =>
            imageDimensions.map(dimensions => uploadAlbumCover(album.id, file, dimensions))
        ).orJust(Promise.resolve())

        setName("")
        setDescription("")
        setPublic(false)
        setPassword("")
        setImageData(Maybe.None)
        setImageDimensions(Maybe.None)

        props.onCreation()

        return album
    }

    const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files

        if (files != null && files.length === 1) {
            const file = files[0]
            const imageUrl = URL.createObjectURL(file)

            setImageData(Maybe.Some([file, imageUrl]))
        }
    }

    const onImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        const imageElement = event.target as HTMLImageElement
        const currentDimension: Dimensions = {height: imageElement.naturalHeight, width: imageElement.naturalWidth}

        const hasDiff = imageDimensions
            .every(dimension =>
                dimension.height != currentDimension.height ||
                dimension.width != currentDimension.width
            )

        if (hasDiff) {
            setImageDimensions(Maybe.Just(currentDimension))
        }
    }

    return (
        <div>
            <div>
                <label>Name</label>
                <input value={name} onChange={event => setName(event.target.value)}/>
            </div>
            <div>
                <label>Description</label>
                <input value={description} onChange={event => setDescription(event.target.value)}/>
            </div>
            <div>
                <div>
                    <div>Image</div>
                    <label htmlFor="album-cover-upload" className={styles.fileUploadLabel}>Browse</label>
                    <input
                        id="album-cover-upload"
                        type="file"
                        onInput={onFileUpload}
                        accept="image/*"/>
                    {
                        imageData.map(([file, imageUrl]) =>
                            <img key={file.name} src={imageUrl} alt="image preview" onLoad={onImageLoad}/>
                        )
                            .orUndefined()
                    }
                </div>
            </div>
            <div>
                <label>Public</label>
                <input type="checkbox"
                       checked={isPublic}
                       onChange={event => {
                           setPublic(!isPublic)
                           if (isPublic) {
                               setPassword("")
                           }
                       }
                       }/>
            </div>
            {!isPublic ?
                (
                    <div>
                        <label>Password</label>
                        <input value={password} onChange={event => setPassword(event.target.value)}/>
                    </div>
                ) : null
            }
            <div>
                <button onClick={onSubmit}>Create</button>
            </div>
        </div>
    )
}

export default AlbumCreationForm