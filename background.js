
/**
 * Execute route-aggregator script when browser action is clicked.
 */
browser.browserAction.onClicked.addListener(() => {
    browser.tabs.executeScript({file: "/content_scripts/route-aggregator.js"});
})
.catch((error) => {
    console.error(`Failed to execute route-aggregator script: ${error.message}`);
});