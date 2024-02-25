import React from "react"

const AlbumPage =
    ({params}: { params: { albumId: string}}) => {
        return <div>{params.albumId}</div>
    }

export default AlbumPage