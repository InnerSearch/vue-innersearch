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