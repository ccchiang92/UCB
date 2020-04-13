// from data.js
var tableData = data;
// grab table selector
var tableBody = d3.select('#data-table').select('tbody');
// for each row
data.forEach((sighting) => {
    var row = tableBody.append('tr');
    // for each column
    Object.entries(sighting).forEach(([key,value])=>{
        if (key === 'datetime'){
            var cell = row.append('td');
            cell.text(value);
            cell.attr('id','Date');
        }else if (key === 'city'){
            var cell = row.append('td');
            cell.text(value);
            cell.attr('id','City');
        }else if (key === 'state'){
            var cell = row.append('td');
            cell.text(value);
            cell.attr('id','State');
        }else if (key === 'country'){
            var cell = row.append('td');
            cell.text(value);
            cell.attr('id','Country');
        }else if (key === 'shape'){
            var cell = row.append('td');
            cell.text(value);
            cell.attr('id','Shape');
        }else if (key === 'durationMinutes'){
            var cell = row.append('td');
            cell.text(value);
            cell.attr('id','Duration');
        }else{
            var cell = row.append('td');
            cell.text(value);
            cell.attr('id','Comments');
        }
        
    });
});

// form input
var button = d3.select('#filter-btn');
var filterSelect = d3.select('#filterSelect')
button.on("click", function() {
    var filterForm = d3.select('#filter-form');
    var filterFormInput = filterForm.property('value');
    var columnToFilter = '#'+ filterSelect.node().value;
    var rows = tableBody.selectAll('tr');
    rows.each(function(){
        var thisRow=d3.select(this);
        var colValue = thisRow.select(columnToFilter).text();
        if (filterFormInput===''){
            thisRow.style("display", "table-row");
        }
        else if (colValue===filterFormInput){
            thisRow.style("display", "table-row");
        }else{
            thisRow.style("display", "none");
        }
    });
        
  });