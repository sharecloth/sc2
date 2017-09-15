$.ajaxTransport("+*", function(options, originalOptions, jqXHR){
    if (window.FormData && ((options.dataType && (options.dataType === 'blob' || options.dataType === 'arraybuffer')) ||
        (options.data && ((window.Blob && options.data instanceof Blob) ||
            (window.ArrayBuffer && options.data instanceof ArrayBuffer)))
        ))
    {
        return {
            send: function(headers, completeCallback){
                var xhr = new XMLHttpRequest(),
                    url = options.url || window.location.href,
                    type = options.type || 'GET',
                    dataType = options.dataType || 'text',
                    data = options.data || null,
                    async = options.async || true,
                    key;

                xhr.addEventListener('load', function(){
                    var response = {}, status, isSuccess;

                    isSuccess = xhr.status >= 200 && xhr.status < 300 || xhr.status === 304;

                    if (isSuccess) {
                        response[dataType] = xhr.response;
                    } else {
                        response.text = String.fromCharCode.apply(null, new Uint8Array(xhr.response));
                    }

                    completeCallback(xhr.status, xhr.statusText, response, xhr.getAllResponseHeaders());
                });

                xhr.open(type, url, async);
                xhr.responseType = dataType;

                for (key in headers) {
                    if (headers.hasOwnProperty(key)) xhr.setRequestHeader(key, headers[key]);
                }
                xhr.send(data);
            },
            abort: function(){
                jqXHR.abort();
            }
        };
    }
});
