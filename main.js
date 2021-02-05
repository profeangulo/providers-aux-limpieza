const URL_API = 'https://api.auxlimpieza.com/api'
//const URL_API = 'https://localhost/api-aux-limpieza/api'

window.onload = () => {
    consultarGrupos()
    consultarCiudades()
    //consultarTipoDocumento()
}

document.getElementById('grupo').addEventListener('change', e => {
    consultarEspecialidades(e.target.value)
})

const consultarGrupos = () => {
    let select = document.getElementById('grupo')
    fetch(`${URL_API}/grupos`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            data = JSON.parse(data)
            let html = '<option value="">Área de Servicios</option>'
            data.forEach(item => {
                html += `<option value="${item.codigo}">${item.detalle}</option>`
            })
            select.innerHTML = html
        });
}

const consultarTipoDocumento = () => {
    let select = document.getElementById('tipo_doc')
    fetch(`${URL_API}/tipodoc`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            data = JSON.parse(data)
            let html = '<option value="">Seleccione</option>'
            data.forEach(item => {
                html += `<option value="${item.Codigo}">${item.Detalle}</option>`
            })
            select.innerHTML = html
        });
}

const consultarCiudades = () => {
    let select = document.getElementById('ciudad')
    fetch(`${URL_API}/ciudades`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            data = JSON.parse(data)
            let html = '<option value="">Ciudad</option>'
            data.forEach(item => {
                html += `<option value="${item.codigo}">${item.nombre}</option>`
            })
            select.innerHTML = html
        });
}

const consultarEspecialidades = (grupo) => {
    let div = document.getElementById('dServicios')
    div.innerHTML = ''
    fetch(`${URL_API}/servicios-especiales-todos/${grupo}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            data = JSON.parse(data)
            let html = ''
            data.forEach(item => {
                html += `<div class="fila-label"><input type='checkbox' id='check_${item.codigo}' value='${item.codigo}' > <label>${item.nombre}</label></div>`
            })
            div.innerHTML = html
        });
}

document.getElementById('formu-inscripcion').addEventListener('submit', e => {
    e.preventDefault()
    let nombres = document.getElementById('nombres').value,
        apellidos = document.getElementById('apellidos').value,
        ciudad = document.getElementById('ciudad').value,
        email = document.getElementById('email').value,
        celular = document.getElementById('celular').value,
        descripcion = document.getElementById('descripcion').value

    especialidades = []

    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
        if(c.checked) especialidades.push(c.value)
    })

    if (especialidades.length <= 0){
        toastr.warning('Debe seleccionar por lo menos un servicio', 'Error de Validación')
        return
    }

    if(celular.length !== 10){
        toastr.warning('Debe ingresar un celular valido', 'Error de Validación')
        return
    }
    
    let data = {
        nombres, apellidos, ciudad, email, celular, descripcion, especialidades
    }
    console.log(data)
    $.ajax(
        {
            url: `${URL_API}/pre-proveedor`,
            type: "POST",
            data
        })
        .done(function (data) {
            if (data.error) {
                if(data.message.indexOf('cedula_UNIQUE') != -1){
                    toastr.warning('La cedula ya se encuentra registrada', 'Error')
                    return
                }
                toastr.warning('Error al guardar', 'Error')
                console.log(data.message)
                return
            }
            window.location.href = 'https://providers.auxlimpieza.com/registro-exitoso'
        })
        .fail(function (data) {
            alert("error");
        })
})

//Funciones de Validación
const soloLetras = e => {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = "8-37-39-46";

    tecla_especial = false
    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
        return false;
    }
}

const soloNumeros = e => {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key == 8))
}

const sinEspacios = e => {
    if(e.code == "Space"){
        return false
    }
}
