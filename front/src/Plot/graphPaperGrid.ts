import * as d3 from 'd3'

function createGraphPaperGrid(size: number) {
    const COLOR = '#ffa500'

    const dotsGridElement = document.createElement('svg')
    dotsGridElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const dotsGrid = d3
        .select(dotsGridElement)
        .attr('height', size)
        .attr('width', size)

    for (let i = size / 5; i < size; i += size / 5) {
        for (let j = size / 5; j < size; j += size / 5) {
            dotsGrid
                .append('circle')
                .attr('cy', i)
                .attr('cx', j)
                .attr('r', size / 50)
                .attr('fill', COLOR)
        }
    }

    dotsGrid
        .append('path')
        .datum([
            [0, 0],
            [size, 0],
            [size, size],
            [0, size],
            [0, 0],
        ])
        .attr('fill', 'none')
        .attr('stroke', COLOR)
        .attr('stroke-width', size / 50)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr(
            'd',
            // @ts-ignore
            d3
                .line()
                .x(d => d[0])
                .y(d => d[1]),
        )

    const blob = new Blob([dotsGridElement.outerHTML], {
        type: 'image/svg+xml',
    })
    return URL.createObjectURL(blob)
}

function removeGraphPaperGrid(url: string) {
    URL.revokeObjectURL(url)
}

export { createGraphPaperGrid, removeGraphPaperGrid }
