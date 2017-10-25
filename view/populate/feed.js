import readJSON from "./readJSON";

readJSON("food.json").then(data => {
    let file = JSON.parse(data);
        if (file !== null) {
        var hits = file.hits.hits,
            count = 0;
    
        hits.forEach(function(value) {
            var obj = JSON.stringify(value["_source"], null, 4);
            var p = document.createElement("p");
            p.innerText = "POST /immobilier/batiment\n" + obj;
            document.getElementById("JSON").appendChild(p);
    
            if (count++ > 50) throw("Stop");
        });
    }
}).catch(e => {
    throw e
});

// async function feed() {
//     let file = await readJSON("./food.json");
//     file = JSON.parse(file);
//     if (file !== null) {
//         var hits = file.hits.hits,
//             count = 0;
    
//         hits.forEach(function(value) {
//             var obj = JSON.stringify(value["_source"], null, 4);
//             var p = document.createElement("p");
//             p.innerText = "POST /immobilier/batiment\n" + obj;
//             document.getElementById("JSON").appendChild(p);
    
//             if (count++ > 50) throw("Stop");
//         });
//     }
// };

// feed();