// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDndyi2SWHifEyrTT9AETnJJuWudBsvJxA",
    authDomain: "plcovidbo.firebaseapp.com",
        databaseURL: "https://plcovidbo.firebaseio.com",
        projectId: "plcovidbo",
        storageBucket: "plcovidbo.appspot.com",
        messagingSenderId: "65757067954",
        appId: "1:65757067954:web:7edd07c19cb4409c6aa7ab",
        measurementId: "G-F93QC77S4V"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    
    var db = firebase.firestore();
$(document).ready(function () {
    
    $("#save_user").click(function (e) { 
        e.preventDefault();
        var datos = new FormData(document.getElementById("frm_reg_user"))
        let val = validacion(datos)

        $("#frm_reg_user input").removeClass('is-invalid')
        $("div.invalid-feedback").html("")

        if(val.name == null && val.phoneNumber == null){
            let res = {}
            datos.set('line', validar_numero(datos.get('phoneNumber')))
            datos.forEach((element, key) => {
                res[key] = element
            })
            agregarUsuario(res)
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }else{
            if(val.name != null){
                $("#input_name input").addClass('is-invalid')
                $("#input_name .invalid-feedback").html(val.name)
            }
            if(val.phoneNumber != null){
                $("#input_phoneNumber input").addClass('is-invalid')
                $("#input_phoneNumber .invalid-feedback").html(val.phoneNumber)
            }
        }
    });

    function agregarUsuario(datos){
        db.collection("users").add(
            datos
        )
        .then(function(docRef) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Registrado Exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
            $("#mdl_registro").modal('hide')
        })
        .catch(function(error) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Hay un problema en el registro... Intente mas tarde por favor',
                showConfirmButton: false,
                timer: 1500
            })
        });
    }
    function validacion(datos){
        var res = []
        datos.forEach((element, key) => {
            if(element == ""){
                res[key] = "Este campo es Obligatorio"
            }else if(key === 'phoneNumber'){
                if(!(element>60000000 && element<79999999)){
                    res[key] = "Inserte un numero valido"
                }
            }
        });
        return res
    }
    function validar_numero(nro){
        let pref_nro = nro.substring(0, 2)
        if(pref_nro == '67' ||
        pref_nro == '68' ||
        pref_nro == '71' ||
        pref_nro == '72' ||
        pref_nro == '73' ||
        pref_nro == '74'){
            return "Entel"
        }else 
        if(pref_nro == '60' ||
        pref_nro == '61' ||
        pref_nro == '65' ||
        pref_nro == '70' ||
        pref_nro == '79'){
            return "Viva"
        }else 
        if(pref_nro == '69' ||
        pref_nro == '75' ||
        pref_nro == '76' ||
        pref_nro == '77' ||
        pref_nro == '78'){
            return "Tigo"
        }else{
            return "Other"
        }
    }

    if(getParams(window.location.href).plasma != null &&
        getParams(window.location.href).plasma != ""){
        $("#frm_search select[name='plasma']").val(getParams(window.location.href).plasma)
    }
    if(getParams(window.location.href).city != null &&
        getParams(window.location.href).city != ""){
        $("#frm_search select[name='city']").val(getParams(window.location.href).city)
    }

    $("#frm_search").submit(function (e) { 
        e.preventDefault();
        let plasma = $("#frm_search select[name='plasma']").val()
        let city = $("#frm_search select[name='city']").val()
        // window.location.href = `http://192.168.100.98:5500/donantes.html?plasma=${plasma}&city=${city}`
        window.location.href = `https://plasmacovidbo.github.io/home/donantes.html?plasma=${plasma}&city=${city}`
    });

    
    var c = 0
    db.collection("users").onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(doc => {
            c = querySnapshot.size
            
            db.collection("datos").onSnapshot(function(snapshot) {
                // doc.data() is never undefined for query doc snapshots
                snapshot.docChanges().forEach(function(doc) {
                    
                    $("strong#fecha").html(doc.doc.data().fecha)
                    $("#datos strong#donantes").data('number', c)
                    $("#datos strong#recuperados").data('number', doc.doc.data().recuperados)
                    $("#datos strong#infectados").data('number', doc.doc.data().infectados)
                    $("#datos strong#fallecidos").data('number', doc.doc.data().fallecidos)
                    $('#section-counter').waypoint( function( direction ) {

                        if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {
                            var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
                            $('.number').each(function(){
                                var $this = $(this),
                                num = $this.data('number');
                                    // console.log(num);
                                    $this.animateNumber(
                                        {
                                    number: num,
                                    numberStep: comma_separator_number_step
                                }, 1500
                                );
                            });   
                        }
                    } , { offset: '95%' } );
                })
            });
        })
    });

});


var getParams = function (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

function miCard(datos){
    let pl = datos.data().plasma.replace(/N|P/, function(char){
        return char=="N"? "(-)": "(+)"
    })
    let city = ""
    switch (datos.data().city) {
        case "LP":
            city = "La Paz"
            break;
        case "OR":
            city = "Oruro"
            break;
        case "PT":
            city = "Potosi"
            break;
        case "CB":
            city = "Cochabamba"
            break;
        case "CH":
            city = "Chuquisaca"
            break;
        case "TR":
            city = "Tarija"
            break;
        case "PN":
            city = "Pando"
            break;
        case "BN":
            city = "Beni"
            break;
        case "SC":
            city = "Santa Cruz"
            break;
        default:
            city = "Error"
            break;
    }
    return `<div class="col-md-4 ftco-animate fadeInUp ftco-animated">
        <div class="destination">
            <div class="text p-3">
                <div class="d-flex justify-content-between">
                    <div class="two text-left">
                        <span class="price">${pl}</span>
                    </div>
                    <div class="two d-none">
                        <small><a href="${datos.id}">Reportar</a></small>
                    </div>
                </div>
                <h3 class="days text-uppercase"><span>${datos.data().name}</span></h3>
                <p class="days text-uppercase"><span>${datos.data().phoneNumber}</span></p>
                <span><i class="icon-map-o"></i> ${city}, Bo</span>
                <hr>
                <p class="bottom-area d-flex">
                    <span class="mr-auto">
                        <a class="btn btn-sm btn-info text-white" href="tel:+591${datos.data().phoneNumber}">Llamar</a>
                    </span>
                    <span class="ml-auto">
                        <a class="btn btn-sm btn-success text-white" href="https://wa.me/591${datos.data().phoneNumber}" target="_blank">Whatsapp</a>
                    </span>
                </p>
            </div>
        </div>
    </div>`
}
