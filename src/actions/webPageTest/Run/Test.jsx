import wpt from '../../../wptPublic';

export const WPT_RUN_TEST = 'WPT_RUN_TEST';

/**
 *
 * @param property
 * @param params
 * @returns {Function}
 */

export function wptRunTest(property, params = {
    url: 'https://hosting.review',
    options: {
        location: 'ec2-us-east-1', //location to test from
        connectivity: 'Native', //connectivity profile -- requires location to be specified -- (Cable|DSL|FIOS|Dial|3G|3GFast|Native|custom) [Cable]
        runs: 1, //number of test runs [1]
        firstViewOnly: false, //skip the Repeat View test
        video: false, //capture video
        private: false, //keep the test hidden from the test log
        label: 'Hosting Review Web Page Speed Test', //label for the test
        stopAtDocumentComplete: false, //stop test at document complete. typically, tests run until all activity stops
        disableJavaScript: false, //disable JavaScript (IE, Chrome, Firefox)
        clearCerts: false, //clear SSL certificate caches
        ignoreSSL: true, //ignore SSL certificate errors, e.g. name mismatch, self-signed certificates, etc
        disableCompatibilityView: false, //forces all pages to load in standards mode (IE only)
        tcpDump: false, //capture network packet trace (tcpdump)
        saveResponseBodies: true, //save response bodies for text resources
        keepOriginalUserAgent: true, //do not add PTST to the original browser User Agent string
        domElement: 0, //DOM element to record for sub-measurement
        minimumDuration: 5, //minimum test duration in seconds
        tester: false, //run the test on a specific PC (name must match exactly or the test will not run)
        emulateMobile: false, //(experimental) emulate mobile browser: Chrome mobile user agent, 640x960 screen, 2x scaling and fixed viewport (Chrome only)
        timeline: false, //capture Developer Tools Timeline (Chrome only)
        timelineCallStack: false, //set between 1-5 to include the JS call stack. must be used in conjunction with timeline (increases overhead) (Chrome only)
        chromeTrace: false, //capture chrome trace (about://tracing) (Chrome only)
        netLog: false, //capture Network Log (Chrome only)
        dataReduction: false, //enable data reduction on Chrome 34+ Android (Chrome only)
        userAgent: false, //custom user agent string (Chrome only)
        commandLine: false, //use a list of custom command line switches (Chrome only)
        login: false, //username for authenticating tests (http authentication)
        password: false, //password for authenticating tests (http authentication)
        sensitive: false, //discard script and http headers in the result
        disableHTTPHeaders: false, //disable saving of the http headers (as well as browser status messages and CPU utilization)
        block: String, //space-delimited list of urls to block (substring match)
        spof: String, //space-delimited list of domains to simulate failure by re-routing to blackhole.webpagetest.org to silently drop all requests
        customMetrics: String, //execute arbitrary JavaScript at the end of a test to collect custom metrics
        authenticationType: Number, //type of authentication: 0 = Basic, 1 = SNS [0]
        notifyEmail: String, //e-mail address to notify with the test results
        pingback: String, //URL to ping when the test is complete (the test ID will be passed as an "id" parameter)
        bandwidthDown: String, //download bandwidth in Kbps (used when specifying a custom connectivity profile)
        bandwidthUp: String, //upload bandwidth in Kbps (used when specifying a custom connectivity profile)
        latency: String, //first-hop Round Trip Time in ms (used when specifying a custom connectivity profile)
        packetLossRate: Number, //packet loss rate - percent of packets to drop (used when specifying a custom connectivity profile)
        disableOptimization: Boolean, //disable optimization checks (for faster testing)
        disableScreenshot: Boolean, //disable screen shot capturing
        fullResolutionScreenshot: Boolean, //save a full-resolution version of the fully loaded screen shot as a PNG
        jpegQuality: Number, //jpeg compression level (30-100) for the screen shots and video capture
        medianVideo: Boolean, //store the video from the median run when capturing video is enabled
        htmlBody: Boolean, //save the content of only the base HTML response
        tsView: String, //test name to use when submitting results to tsviewdb (for private instances that have integrated with tsviewdb)
        tsViewConfigs: String, //configs to use when submitting results to tsviewdb (for private instances that have integrated with tsviewdb)
        affinity: String, //string to hash test to a specific test agent. tester will be picked by index among available testers
        priority: Number, //change test priority (0-9) [enforced by API key, otherwise 5]
        blockAds: Boolean, //block ads defined by http://adblockplus.org
        continuousVideoCapture: Boolean, //capture video continuously (unstable/experimental, may cause tests to fail)
        forceSpdy3: Boolean, //force SPDY version 3 (Chrome only)
        forceSoftwareRendering: Boolean, //force software rendering, disable GPU acceleration (Chrome only)
        pollResults: Number, //poll for results after test is scheduled at every seconds [5]
        waitResults: String, //wait for test results informed by agent once complete listening on : [hostname:first port available above 8000]
        timeout: String, //timeout for polling and waiting results [no timeout]
    }
}) {
    return function (dispatch) {
        wpt.runTest(params.url, params.options, (error, response) => {
            if (response.statusCode === 200) {
                const {testId/*, ownerKey, jsonUrl*/} = response.data;

                const intervalId = setInterval(() => {

                    /**
                     * Calls Web Page Test Api getTest Status to
                     * http://www.webpagetest.org/testStatus.php?f=json&test=our_testID (its predefined in wpt),
                     * to get Test results as json
                     */
                    wpt.getTestStatus(testId, (error, response2) => {
                        const responseData = response2.data;
                        if (responseData.statusText === 'Test Complete' || responseData.statusText === 'Test Cancelled') {
                            clearInterval(intervalId);
                            wpt.getTestResults(testId, (error, response3) => {
                                dispatch({
                                    type: WPT_RUN_TEST,
                                    payload: {
                                        data: response3,
                                        isComplete: true,
                                        error: false
                                    }
                                });
                            });
                        } else {
                            dispatch({
                                type: WPT_RUN_TEST,
                                payload: {
                                    data: responseData,
                                    isComplete: false,
                                    error: false
                                }
                            });
                        }
                    });
                }, 1000);
            }
        });
    }
}
