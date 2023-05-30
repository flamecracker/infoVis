class Heatmap {
    margin = {
        top: 50, right: 100, bottom: 100, left: 60
    }

    constructor(svg, data, width = 600, height = 600) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;
    }

    initialize() {
        this.svg = d3.select(this.svg);

        this.container = this.svg.append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.xScale = d3.scaleBand().range([0, this.width]).padding(0.05);
        this.yScale = d3.scaleBand().range([this.height, 0]).padding(0.05);
        this.colorScale = d3.scaleLinear()
        .range(['#FFFF88', '#8888FF']);
        
        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");
    }

    update(xVar, yVar) {
        this.xVar = xVar;
        this.yVar = yVar;

        const filteredData = this.data.filter(d => d['HeartDisease'] === 'Yes');

        const counts = new Map();

        filteredData.forEach(d => {
            const key = `${d[xVar]},${d[yVar]}`;
            counts.set(key, (counts.get(key) || 0) + 1);
        });

        const xValues = Array.from(new Set(filteredData.map(d => d[xVar])));
        const yValues = Array.from(new Set(filteredData.map(d => d[yVar])));
        const maxCount = d3.max(Array.from(counts.values()));

        this.xScale.domain(xValues);
        this.yScale.domain(yValues);
        this.colorScale.domain([0, 1]);

        const cells = this.container.selectAll('rect')
            .data(filteredData)
            .join('rect')
            .transition()
            .attr("x", d => this.xScale(d[xVar]))
            .attr("y", d => this.yScale(d[yVar]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", this.yScale.bandwidth())
            .attr("fill", d => {
                const key = `${d[xVar]},${d[yVar]}`;
                return this.colorScale(counts.get(key)/maxCount);
        });
    
        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.height + this.margin.top})`)
            .transition()
            .call(d3.axisBottom(this.xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));
        
        // X-axis label
        this.xAxis.selectAll(".x-label")
        .data([this.xVar])
        .join('text')
        .attr("class", "x-label")
        .attr("transform", `translate(${this.width / 2}, ${this.height + this.margin.top + this.margin.bottom})`)
        .style("text-anchor", "middle")
        .text(d => d);

        // Y-axis label
        this.yAxis.selectAll(".y-label")
            .data([this.yVar])
            .join("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x", 0 - (this.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(d => d);
        
        // Legend
        this.legend
            .attr("class", "legendLinear")
            .attr("transform", `translate(${this.width+this.margin.left}, ${this.height/2})`);

        const legendLinear = d3.legendColor()
            .shapeWidth(30)
            .cells(10)
            .orient('vertical')
            .scale(this.colorScale);

        this.svg.select(".legendLinear")
            .call(legendLinear);
    }
}

