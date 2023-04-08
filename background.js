const prefix = "1@";

function to_num(x) {

    if (x == null) return null;
    if (x === false) return false;
    if (x === true) return true;

    let n = (+x);
    if (!isNaN(n)) {
        return n;
    } else {
        return x;
    }
    
    // let n = parseFloat(x);
    // if (String(n) == x) {
    //     return n;
    // } else {
    //     return x;
    // }
}


chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log(">");

    if (request.code == "ping_from_web") {
        console.log("RECEIVED ping_from_web")

        sendResponse({status: "Success!"});

    } else if (request.code == "get_from_web") {
        console.log("RECEIVED get_from_web", request.keys)

        chrome.storage.local.get(request.keys, function(items) {
            sendResponse(items);
        });
    } else if (request.code == "set_from_web") {
        console.log("RECEIVED set_from_web");
        var obj = {};
        for (let key in request.obj) {
            let val = to_num(request.obj[key]);
            obj[key] = val;
        }
        console.log("OBJ", obj);

        chrome.storage.local.set(obj);

        sendResponse();


    } else if (request.code == "get_chrx_progress") {
        console.log("RECEIVED get_chrx_progress")

        chrome.storage.local.get(null, function(items) {
            var allKeys = Object.keys(items);
            // console.log(allKeys);
            var storage_vars = [];
            for (let key of allKeys) {
                if ((key.slice(0,2) == prefix) && (key.slice(-2) == "-n")) {
                    storage_vars.push(key);
                }
            }
            console.log("storage_vars", storage_vars);

            var num_maps_complete = 0;
            for (let key of storage_vars) {
                let val = items[key];
                console.log("val", val);
                if (val > 0) {
                    num_maps_complete += 1;
                }
            }
            sendResponse(num_maps_complete);
        });
        
    } else if (request.code == "overwrite_web") {
        console.log("RECEIVED overwrite_web");
        chrome.storage.local.get(null, function(items) {
            var allKeys = Object.keys(items);
            var obj = {};
            obj[prefix+"altered_vars"] = JSON.stringify(allKeys);
            obj[prefix+"overwrite_web"] = true;
            chrome.storage.local.set(obj, function() {
                sendResponse();
            });
        });




        
    } else if (request.code == "clear_storage_data") {
        chrome.storage.local.clear(function() {
            console.log("clear_storage_data SUCCESS");

            var obj = {};
            obj[prefix+"overwrite_web"] = true;
            chrome.storage.local.set(obj, function() {
                sendResponse();
            });
        });
    } else if (request.code == "overwrite_chrx") {
        console.log("RECEIVED overwrite_chrx");

        chrome.storage.local.clear(function() {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }

            // do something more
            
            var obj = {};
            for (let key in request.new_data) {
                let val = to_num(request.new_data[key]);
                obj[key] = val;
            }
            console.log("OBJ", obj);
            chrome.storage.local.set(obj, function() {
                sendResponse();
            });
        });


    } else if (request.code == "save_sync") {


        // var info = JSON.parse(request.delta);

        // chrome.storage.local.get(["last_save"], function(items) {
        //     let last_save = items['last_save'];
        //     if (last_save == null) {
        //         console.log("Not saving to chrx because it doesn't have last_save in chrome.storage.sync.")
        //         return;
        //     }

        //     last_save = JSON.parse(last_save);
        //     var the_delta = {...info.map_delta};
        //     for (let key in the_delta) {
        //         if (last_save[key] != null) {
        //             the_delta[key].xp = Number(the_delta[key].xp) - Number(last_save[key]);
        //         }
        //         if (the_delta[key].xp == 0) {
        //             delete the_delta[key];
        //         }
        //     }

        //     console.log("Success");
        //     chrome.storage.local.set({
        //         delta: JSON.stringify(the_delta),
        //         NAME: info.mem_name
        //     });
        //     sendResponse();
        // });


    } else {
        console.log("unknown background comm req");
    }
    
});