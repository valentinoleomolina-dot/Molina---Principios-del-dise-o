let datos = JSON.parse(localStorage.getItem("asistencia")) || [
    ["García, Lucía", "50.107.838", "3° Año A", "07:52", "PRESENTE"],
    ["Romero, Matías", "49.863.446", "3° Año A", "08:07", "TARDANZA"],
    ["López, Valentina", "50.106.669", "4° Año B", "13:01", "PRESENTE"],
    ["Fernández, Joaquín", "50.081.400", "2° Año A", "07:55", "PRESENTE"],
    ["Martínez, Sofía", "50.327.127", "5° Año A", "13:22", "TARDANZA"]
];

let editando = -1;

const $ = id => document.getElementById(id);


// ===============================
// MOSTRAR DATOS
// ===============================

function mostrar() {

    let buscar = $("buscar").value.toLowerCase();
    let curso = $("filtroCurso").value;

    let lista = datos.filter(x =>
        (
            x[0].toLowerCase().includes(buscar) ||
            x[1].includes(buscar)
        ) &&
        (!curso || x[2] == curso)
    );

    $("tabla").innerHTML = "";

    lista.forEach(x => {

        let fila = document.createElement("tr");

        // Alumno, DNI, Curso, Hora y Estado
        x.forEach((dato, j) => {

            if (j < 5) {

                let celda = document.createElement("td");

                celda.textContent = dato;

                if (j == 4) {
                    celda.className = dato.toLowerCase();
                }

                fila.appendChild(celda);
            }
        });


        // ===============================
        // BOTONES EDITAR Y ELIMINAR
        // ===============================

        let acciones = document.createElement("td");

        let editar = document.createElement("button");

        editar.textContent = "Editar";

        editar.onclick = () => {
            editarAlumno(datos.indexOf(x));
        };


        let borrar = document.createElement("button");

        borrar.textContent = "Eliminar";
        borrar.className = "eliminar";

        borrar.onclick = () => {
            eliminarAlumno(datos.indexOf(x));
        };


        acciones.append(editar, borrar);

        fila.appendChild(acciones);

        $("tabla").appendChild(fila);
    });


    // ===============================
    // ESTADÍSTICAS
    // ===============================

    $("presentes").textContent =
        datos.filter(x => x[4] == "PRESENTE").length;

    $("tardanzas").textContent =
        datos.filter(x => x[4] == "TARDANZA").length;

    $("ausentes").textContent =
        datos.filter(x => x[4] == "AUSENTE").length;


    // ===============================
    // INFORMACIÓN
    // ===============================

    $("cantidad").textContent =
        lista.length + " registros encontrados";

    $("actualizacion").textContent =
        new Date().toLocaleTimeString();


    // Guardar datos
    localStorage.setItem(
        "asistencia",
        JSON.stringify(datos)
    );
}


// ===============================
// REGISTRAR / EDITAR ALUMNO
// ===============================

$("formulario").onsubmit = e => {

    e.preventDefault();

    let alumno = [

        $("nombre").value,

        $("dni").value,

        $("curso").value,

        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        }),

        $("estado").value
    ];


    // NUEVO ALUMNO
    if (editando == -1) {

        datos.push(alumno);

    }

    // EDITAR ALUMNO
    else {

        datos[editando] = alumno;

        editando = -1;

        $("guardar").textContent = "REGISTRAR";
    }


    // Limpiar formulario
    $("formulario").reset();

    $("estado").value = "PRESENTE";

    // Volver a seleccionar PRESENTE
    document
        .querySelectorAll("[data-estado]")
        .forEach(b => b.classList.remove("activo"));

    document
        .querySelector('[data-estado="PRESENTE"]')
        .classList.add("activo");


    mostrar();
};


// ===============================
// EDITAR ALUMNO
// ===============================

function editarAlumno(i) {

    let x = datos[i];

    $("nombre").value = x[0];

    $("dni").value = x[1];

    $("curso").value = x[2];

    $("estado").value = x[4];


    editando = i;

    $("guardar").textContent = "GUARDAR CAMBIOS";


    // Marcar estado actual
    document
        .querySelectorAll("[data-estado]")
        .forEach(b => b.classList.remove("activo"));

    let botonEstado = document.querySelector(
        '[data-estado="' + x[4] + '"]'
    );

    if (botonEstado) {
        botonEstado.classList.add("activo");
    }


    // Subir al formulario
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// ELIMINAR ALUMNO
// ===============================

function eliminarAlumno(i) {

    if (confirm("¿Eliminar este registro?")) {

        datos.splice(i, 1);

        mostrar();
    }
}


// ===============================
// BOTONES DE ESTADO
// ===============================

document
    .querySelectorAll("[data-estado]")
    .forEach(boton => {

        boton.onclick = () => {

            $("estado").value =
                boton.dataset.estado;


            document
                .querySelectorAll("[data-estado]")
                .forEach(b => {
                    b.classList.remove("activo");
                });


            boton.classList.add("activo");
        };
    });


// PRESENTE seleccionado al comenzar
document
    .querySelector('[data-estado="PRESENTE"]')
    .classList.add("activo");


// ===============================
// BOTÓN LIMPIAR
// ===============================

$("limpiar").onclick = () => {

    $("formulario").reset();

    $("estado").value = "PRESENTE";

    editando = -1;

    $("guardar").textContent = "REGISTRAR";


    document
        .querySelectorAll("[data-estado]")
        .forEach(b => b.classList.remove("activo"));


    document
        .querySelector('[data-estado="PRESENTE"]')
        .classList.add("activo");
};


// ===============================
// BUSCADOR
// ===============================

$("buscar").oninput = mostrar;


// ===============================
// FILTRO POR CURSO
// ===============================

$("filtroCurso").onchange = mostrar;


// ===============================
// EXPORTAR CSV
// ===============================

$("exportar").onclick = () => {

    let csv =
        "Alumno,DNI,Curso,Hora,Estado\n";


    datos.forEach(x => {

        csv += x.join(",") + "\n";

    });


    let archivo = new Blob(
        [csv],
        { type: "text/csv" }
    );


    let enlace =
        document.createElement("a");


    enlace.href =
        URL.createObjectURL(archivo);


    enlace.download =
        "asistencia.csv";


    enlace.click();


    URL.revokeObjectURL(enlace.href);
};


// ===============================
// INICIAR PÁGINA
// ===============================

mostrar();