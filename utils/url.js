/** Returns decoded search object from encoded search params string. */
function genSearchObj(encodedSearchParams) {
  const searchObj = {};
  // Remove leading '?' if present
  if (encodedSearchParams.startsWith('?')) {
    encodedSearchParams = encodedSearchParams.slice(1);
  }
  const urlParams = new URLSearchParams(encodedSearchParams);
  // NOTE: For many cases, 'urlParams' could have been returned directly.
  // However, conversion to plain object is easier to, e.g., serialize.
  for (const [key, value] of urlParams.entries()) {
    searchObj[key] = value;
  }
  return searchObj;
}


/** Returns encoded search params string form search object. */
function genSearchParams(searchObj) {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(searchObj)) {
    urlParams.set(key, value);
  }
  return "?" + urlParams.toString();
}

/**  Removes hash from `window.location` */
function removeHash() {
  const url = window.location.toString().split("#")[0];
  window.history.replaceState({}, "", url);
}


function parseLocationHash() {
  

  // Get the hash part of the URL without the leading '#'
  const hash = window.location.hash.slice(1);

  // If the hash is empty, return nothing
  if (hash === '') return;

  // Initialize the result object
  const result = {};

  // Split the hash by '?' to separate path and query parts
  const [path, query] = hash.split('?');

  // Split the path by '/' and remove empty elements caused by trailing '/'
  const pathParts = path.split('/').filter(part => part !== '');

  // Assign the first part of the path to the 'key' property
  result.key = decodeURIComponent(pathParts.shift());

  // If there are any remaining path parts, assign them to the 'params' property
  if (pathParts.length > 0) {
    result.params = pathParts.map(decodeURIComponent);
  }

  // If there is a query part, parse it and assign it to the 'query' property
  if (query) {
    result.query = {};
    const urlParams = new URLSearchParams(query);
    for (const [key, value] of urlParams.entries()) {
      result.query[key] = decodeURIComponent(value);
    }
  }
  //console.log(`result: ${JSON.stringify(result)}`)
  return result;
}

function genLocationHash(hashObject) {
  // Initialize the result hash string
  let hash = '';

  // If the 'key' property exists, add it to the hash string
  if (hashObject.key) {
    hash += encodeURIComponent(hashObject.key);
  }

  // If the 'params' property exists, add the encoded params separated by '/'
  if (hashObject.params && Array.isArray(hashObject.params)) {
    const encodedParams = hashObject.params.map(encodeURIComponent);
    hash += '/' + encodedParams.join('/');
  }

  // If the 'query' property exists, add the encoded query parameters
  if (hashObject.query && typeof hashObject.query === 'object') {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(hashObject.query)) {
      urlParams.set(encodeURIComponent(key), encodeURIComponent(value));
    }
    if (urlParams.toString()) {
      hash += '?' + urlParams.toString();
    }
  }

  // If the hash is not empty, add the leading '#'
  if (hash !== '') {
    hash = '#' + hash;
  }

  return hash;
}



export {genSearchParams, parseLocationHash, removeHash}