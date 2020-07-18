function mostrarTodo(){
    var res_bus = "";
    // Get parameters from the current URL
    if(getParams(window.location.href).plasma != null &&
        getParams(window.location.href).plasma != "" &&
        getParams(window.location.href).city != null &&
        getParams(window.location.href).city != ""){
        // Get parameters from the current URL
        db.collection("users").where("city", "==", getParams(window.location.href).city)
        .get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                if(doc.data().plasma == getParams(window.location.href).plasma){
                    if(doc.data().state == 1){
                        res_bus = res_bus + miCard(doc)
                    }
                };
            });
            if(res_bus === ""){
                $("#pnl_cards").html(`<p>No se Encontraron Resultados.</p>`)
            }else{
                $("#pnl_cards").html(`<h2 class="mb-4 d-block w-100">Resultados para <strong class="text-info">${getParams(window.location.href).plasma.replace(/N|P/, function(char){
                    return char=="N"? "(-)": "(+)"
                })}</strong> en <strong class="text-info">${$('select[name="city"] option:selected').html()}</strong></h2>
                ${res_bus}`)
                
            }
            //console.log(res_bus)
        }) 
    }else{
        db.collection("users")
        .get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                if(doc.data().state == 1){
                    res_bus = res_bus + miCard(doc)
                }
                // $("#pnl_cards").append(miCard(doc))
            })
            if(res_bus === ""){
                $("#pnl_cards").html("<p>Aun no existen donadores.</p>")
            }else{
                $("#pnl_cards").html(`<h2 class="mb-4 d-block w-100">Todos los donantes</h2>${res_bus}`)
            }
        })
    }
}
mostrarTodo()