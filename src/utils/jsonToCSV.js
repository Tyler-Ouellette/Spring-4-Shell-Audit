exports.JSONToCSVConvertor = (JSONData, ReportTitle, ShowLabel) => {
    // Handles JSON both ends
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = 'sep=,' + '\r\n\n';

    //condition will generate Label/Header
    if (ShowLabel){
        var row = '';

        //extract the label from list index of an array
        for (var index in arrData[0]){
            //convert each value to string and comma-seperated
            row += index + ',';
        }
        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //loop to extract each row
    for (var i = 0; i < arrData.length; i++){
        var row = '';

        // Loop will extract each column and convert it in string comma-seperated
        for (var index in arrData[i]) {
            // row += '' + arrData[i][index] + ',';
            row += '"' + arrData[i][index].replace(/"/g, "\\\"") + '",';
        }
        row.slice(0, row.length -1);
        //append line break
        CSV += row + '\r\n';
    }

    var fileName = "DynatraceReport_";
    fileName += ReportTitle.replace(/ /g,"_");

    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    const today = new Date();
    const reportDate = today.toDateString();

    return `<button><a href=${uri} download="${fileName}-${reportDate}.csv">Click to download Excel File <a/></button>`;
}