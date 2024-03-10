import React from "react"

export const renderIfTrue =
    (expression: boolean, component: React.JSX.Element) =>
        expression ? component : undefined