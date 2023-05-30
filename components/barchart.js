class Barchart {
    margin = {
        top: 10, right: 10, bottom: 40, left: 40
    }

    constructor(svg, width = 250, height = 250) {
        this.svg = svg;
        this.width = width;
        this.height = height;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(data, xVar, yVar, isRatio) {
        const categories = ['30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80 or older'];
        const counts = {}
        
        categories.forEach(c => {
            let categoryData = data.filter(d => d[xVar] === c);
        
            let countYes = categoryData.filter(d => d[yVar] === 'Yes').length;
            counts[c] = isRatio ? countYes / categoryData.length : countYes;
        });
        
        this.xScale.domain(categories).range([0, this.width]).padding(0.3);
        this.yScale.domain([0, d3.max(Object.values(counts))]).range([this.height, 0]);
        
        this.container.selectAll("rect")
            .data(categories)
            .join("rect")
            .attr("x", d => this.xScale(d))
            .attr("y", d => this.yScale(counts[d]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => this.height - this.yScale(counts[d]))
            .attr("fill", "lightgray")

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));
    }

    on(eventType, handler) {
        this.handlers[eventType] = handler;
    }
}