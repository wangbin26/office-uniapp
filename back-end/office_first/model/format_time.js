var sd = require('silly-datetime');

function formattime() {
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    console.log(time);
    return time;
}

exports.formattime = formattime;
