onmessage = function(data) {
    console.log(data)
    switch (data.data) {
        case "solve":
            console.log('it has worked')
            postMessage(data.data)
            break;
        case "check":

            break;
        default:
            break;
    }
}