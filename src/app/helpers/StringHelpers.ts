
export const parseString = (input: string): string | undefined => {
    const trimmedInput = input.trim()

    if (trimmedInput.length === 0) {
        return undefined
    } else {
        return trimmedInput
    }
}