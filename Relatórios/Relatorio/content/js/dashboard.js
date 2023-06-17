/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.156, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.692, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.57, 500, 1500, "Reserva"], "isController": true}, {"data": [0.76, 500, 1500, "Confirmacao"], "isController": true}, {"data": [0.76, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.57, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.692, 500, 1500, "Compra"], "isController": true}, {"data": [0.0, 500, 1500, "Fluxo - Home > Reserva > Compra > Confirmacao"], "isController": true}, {"data": [0.156, 500, 1500, "Home"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 0, 0.0, 1018.1810000000008, 244, 4026, 690.5, 2203.9, 2766.85, 3230.99, 166.72224074691565, 390.8902251271257, 107.56726851658885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 250, 0, 0.0, 2001.6039999999996, 924, 4026, 1827.0, 3070.9, 3210.0, 3586.6200000000013, 61.819980217606336, 137.7501294355836, 27.10661241963403], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 250, 0, 0.0, 633.1439999999994, 247, 3039, 563.0, 1099.8000000000002, 1393.5499999999993, 1628.6200000000003, 66.17257808364215, 166.2640306544468, 45.1953538578613], "isController": false}, {"data": ["Reserva", 250, 0, 0.0, 833.6320000000001, 263, 2731, 687.0, 1621.8000000000002, 2047.0499999999997, 2677.5600000000004, 66.73785371062468, 154.51403371930058, 41.84046316070475], "isController": true}, {"data": ["Confirmacao", 250, 0, 0.0, 604.348, 244, 2225, 443.0, 1362.4000000000005, 1802.05, 2058.76, 69.71556051310652, 161.89151387339655, 58.02758339723927], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php", 250, 0, 0.0, 604.3440000000002, 244, 2225, 443.0, 1362.4000000000005, 1802.05, 2058.76, 69.69612489545582, 161.8463810287148, 58.01140620643992], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 250, 0, 0.0, 833.6319999999998, 263, 2731, 687.0, 1621.8000000000002, 2047.0499999999997, 2677.5600000000004, 66.75567423230974, 154.55529247329773, 41.85163551401869], "isController": false}, {"data": ["Compra", 250, 0, 0.0, 633.1440000000002, 247, 3039, 563.0, 1099.8000000000002, 1393.5499999999993, 1628.6200000000003, 66.17257808364215, 166.2640306544468, 45.1953538578613], "isController": true}, {"data": ["Fluxo - Home > Reserva > Compra > Confirmacao", 250, 0, 0.0, 4072.724000000001, 2457, 5808, 4119.0, 5176.9, 5318.799999999999, 5718.160000000001, 41.28819157720892, 387.2104988129645, 106.55466169488027], "isController": true}, {"data": ["Home", 250, 0, 0.0, 2001.6039999999996, 924, 4026, 1827.0, 3070.9, 3210.0, 3586.6200000000013, 60.93102607847916, 135.76932084755057, 26.7168268644894], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
