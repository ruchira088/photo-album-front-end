
export interface Photo {
    readonly id: string
    readonly albumId: string
    readonly height: number
    readonly width: number
    readonly size: number
    readonly title?: string
    readonly description?: string
}