interface MetricPrefix {
    readonly pow: number
    readonly symbol: string
}

const metricPrefixes: MetricPrefix[] =
    [
        {pow: 3, symbol: "GB"},
        {pow: 2, symbol: "MB"},
        {pow: 1, symbol: "kB"}
    ]

export const parseString = (input: string): string | undefined => {
    const trimmedInput = input.trim()

    if (trimmedInput.length === 0) {
        return undefined
    } else {
        return trimmedInput
    }
}

export const prettyBytes = (input: number): string => {
    const metricPrefix =
        metricPrefixes.find(metricPrefix => input > Math.pow(1_000, metricPrefix.pow)) ?? { pow: 0, symbol: "B"}

    const number = (Math.round(input * 10 / Math.pow(1_000, metricPrefix.pow)) / 10).toFixed(1)

    const label = `${number} ${metricPrefix.symbol}`

    return label
}