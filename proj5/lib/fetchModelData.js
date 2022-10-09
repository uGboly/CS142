var Promise = require("Promise");

/**
  * FetchModel - Fetch a model from the web server.
  *     url - string - The URL to issue the GET request.
  * Returns: a Promise that should be filled
  * with the response of the GET request parsed
  * as a JSON object and returned in the property
  * named "data" of an object.
  * If the requests has an error the promise should be
  * rejected with an object contain the properties:
  *    status:  The HTTP response status
  *    statusText:  The statusText from the xhr request
  *
*/


function fetchModel(url) {
  let xhr = new XMLHttpRequest();
  xhr.timeout = 10000;
  xhr.open('GET', url);
  xhr.send();

  return new Promise(function(resolve, reject) {
      // console.log(url);
      // setTimeout(() => reject({status: 501, statusText: "Not Implemented"}), 10);
      // On Success return:
      // resolve({data: getResponseObject});
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({data:JSON.parse(xhr.response) });
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({status: xhr.status, statusText: xhr.statusText});
        }
      };

      xhr.onerror = function() {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({status: 501, statusText: "Network Error : request failed to be sent!"});
      };
  });
}

export default fetchModel;
