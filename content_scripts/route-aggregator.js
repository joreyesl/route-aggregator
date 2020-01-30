/**
 * Fetch the modal html used for displaying results
 */
/* fetch(browser.extension.getURL("resources/modal.html"))
    .then((response) => {
        if(!response.ok) {
            throw new Error('Failed to retrieve extension resource');
        }
        return response.text()
    })
    .then((data) => {
        document.body.innerHTML += data;

        //TODO: catch showModal does not exist error
        var dialog = document.getElementById('routeDialog');
        console.log(dialog);
        dialog.showModal();

    })
    .catch((error) => {
        console.error('There was a problem with the extension: ', error);
    }); */



// get the rows containing the cluster and route tables
var rows = document.getElementsByClassName("routing-request-row");

/**
 * Iterate through the row data aggregating route details by Cluster, DSP, and route type
 */
var routes = {};
for(const row of rows) {

    // get the td containing the cluster name
    var td = row.firstElementChild;

    // filter out any td that are not a correct cluster
    var cluster = (td.firstElementChild || {}).innerText
    if(cluster === "CX" || cluster === "MX") {

        // select the table containing the route details
        var table = row.children[3].children[0].children[0].children[0].children[0];

        // initialize the cluster
        routes[cluster] = {};

        /**
         * Break down each route in the cluster and aggregate them by DSP and type
         */
        for(var i = 1; i < table.rows.length - 1; i++) {
            
            // get individual route details
            let route = table.rows[i];
            let routeType = route.cells[0].innerText;
            let routeDSP = route.cells[1].innerText;
            let routeRequests = route.cells[3].innerText;
            
            // initialize route DSP and route type if it doesn't exist
            if(!routes[cluster][routeDSP]) {
                routes[cluster][routeDSP] = {};
            }

            if(!routes[cluster][routeDSP][routeType]) {
                routes[cluster][routeDSP][routeType] = 0;
            }

            routes[cluster][routeDSP][routeType] += +routeRequests;

        }
    }
    
}

/**
 * Generate the alert message that will show the aggregated results
 */
var msg = "";
for(let cluster in routes) {
    msg += `${cluster}\n----------\n\n`;

    for(let dsp in routes[cluster]) {

        // filter out flex routes
        if(dsp !== 'Flex') {
            msg += `${dsp}\n`

            for(let type in routes[cluster][dsp]) {
                msg += `${type}: ${routes[cluster][dsp][type]}\n`;
            }

            msg += "\n"
        }
    }
}

alert(msg || "No route details found.");
