class PieChart {
    margin = {
        top: 10, right: 10, bottom: 40, left: 40
    };

    constructor(svg, width = 250, height = 250) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.radius = Math.min(width, height) / 2; // Pie chart의 반지름 설정
    }

    initialize() {
        this.svg = d3.select(this.svg);

        this.container = this.svg.append("g")
            .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

        this.legend = this.svg.append("g")
            .attr("transform", `translate(${this.width}, ${this.margin.top})`);

        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10); // 색상 스케일 설정
        this.pie = d3.pie().value(d => d.value); // Pie layout 설정
        this.arc = d3.arc().innerRadius(0).outerRadius(this.radius); // Arc 설정
    }

    update(data, disease, filterColumn) {
        
        const filteredData = data.filter(d => d[filterColumn] === 'Yes');
    
        const counts = {};
        filteredData.forEach(d => {
            if (!counts[d[disease]]) {
                counts[d[disease]] = 0;
            }
            counts[d[disease]]++;
        });
    
        const total = filteredData.length;
    
        const pieData = this.pie(Object.entries(counts).map(([key, value]) => ({key, value, percentage: value/total*100})));
    
        const arcs = this.container.selectAll("path")
            .data(pieData)
            .join("path")
            .attr("fill", d => this.colorScale(d.data.key))
            .attr("d", this.arc);
    
        // Update the legend
        
        const legend = this.legend.selectAll("g")
        .data(pieData)
        .join("g").attr("transform", (d, i) => `translate(0, ${i * 20})`);

        // Add colored squares to the legend
        legend.selectAll('rect')
        .data(d => [d])
        .join('rect').attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => this.colorScale(d.data.key));

        // Add labels to the legend
        legend.selectAll('text')
        .data(d => [d])
        .join(
            enter => enter.append("text")
                .attr("x", 15)
                .attr("y", 10)
                .text(d => `${d.data.key}: ${d.data.percentage.toFixed(2)}%`),
            update => update.text(d => `${d.data.key}: ${d.data.percentage.toFixed(2)}%`)
        );
    }
}