class DataTable {
    constructor(id,data) {
        this.id = id;
        this.columns = Object.keys(data[0]);
    }  
    initialize(id) {
        let table = d3.select(id);
        
        this.columns.forEach(column => {
            table.append("th")
            .text(column);
        });
        
        
    }

    update(data, columns) {
        let table = d3.select(this.id);


        let rows = table
            .selectAll("tr")
            .data(data)
            .join("tr");

        rows.selectAll("td")
            .data(d => columns.map(c => d[c]))
            .join("td")
            .text(d => d)
    }
}
