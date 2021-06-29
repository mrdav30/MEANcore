import fs from 'fs';
import got from 'got';
import moment from 'moment';

const oneWeekSeconds = 24 * 7 * (60 * 60);

// proxy file from remote url for page speed score
export function fileProxy(fileUrl, filePath, req, res) {
    // ensure file exists and is less than 1 hour old
    fs.promises.stat(filePath, function (err, stats) {
        if (err) {
            // file doesn't exist so download and create it
            updateFileAndReturn();
        } else {
            // file exists so ensure it's not stale
            if (moment().diff(stats.mtime, 'minutes') > 60) {
                updateFileAndReturn();
            } else {
                returnFile();
            }
        }
    });

    // update file from remote url then send to client
    function updateFileAndReturn() {
        got(fileUrl, function (error, response, body) {
            fs.writeFileSync(filePath, body);
            returnFile();
        });
    }

    // send file to client
    function returnFile() {
        res.set('Cache-Control', 'public, max-age=' + oneWeekSeconds);
        res.sendFile(filePath);
    }
}