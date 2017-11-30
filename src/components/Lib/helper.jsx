export const formatBytes = (bytes,decimals) => {
    if(bytes === 0) return '0 Bytes';
    const k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};


export const extractHostname = (url) => {
  let hostname;
  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
};

export const timeSince = (date, inSeconds = false, translations = {
  'years': 'years',
  'months': 'months',
  'days': 'days',
  'hours': 'hours',
  'minutes': 'minutes',
  'seconds': 'seconds'
}) => {
  const seconds = inSeconds ? date : Math.floor((new Date() - date)/1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval + ' ' + translations['years'];
  }
  interval = Math.floor(seconds / 2629743.83);
  if (interval >= 1) {
    return interval + ' ' + translations['months'];
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + ' ' + translations['days'];
  }
  interval = Math.floor(seconds / 3600);
  console.log(seconds, interval);
  if (interval >= 1) {
    return interval + ' '  + translations['hours'];
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + ' ' + translations['minutes'];
  }
  return Math.floor(seconds) + ' ' + translations['seconds'];
};