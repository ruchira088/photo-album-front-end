"use client"

import React, {useState} from "react"
import {createPhotoAlbum} from "@/app/services/AlbumService"
import {parseString} from "@/app/helpers/StringHelpers"
import {PhotoAlbum} from "@/app/services/models/PhotoAlbum"

const AlbumCreationForm = (props: { onCreation: () => void}) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isPublic, setPublic] = useState(false)
    const [password, setPassword] = useState("")

    const onSubmit = async (): Promise<PhotoAlbum> => {
        const album = await createPhotoAlbum({
            name,
            isPublic,
            description: parseString(description),
            password: parseString(password)
        })

        setName("")
        setDescription("")
        setPublic(false)
        setPassword("")

        props.onCreation()

        return album
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