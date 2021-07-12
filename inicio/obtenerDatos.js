$('#obtenerDatos').click(function (e) {

    e.preventDefault();

    $.ajax({
        url: "json/postres.json", // Llamo al archivo JSON con los datos 
        type: "get",
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
    })

        // Cuando la petición de los datos fue correcta, mediante el método 'done' imprimo los datos
        // en mi div #datos, utilizo una lista desordenada <ul></ul> 
        .done(function (data) {

            console.log(data);
            let datos = "<ul class='list-group'>";
            for (let i = 0; i < data.length; i++) {
                console.log(data[i].nombre);
                datos += "<li class='list-group-item'>" + data[i].nombre + "</li>";
            }
            datos += "</ul>"
            $('#datos').html(datos);

        })

        // Este método es para manejar algún error al obtener los datos 
        .fail(function (data) {
            //
        });

});