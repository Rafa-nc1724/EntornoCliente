/*function inicializar() {
    var $cuadroint = document.getElementById("cuadrointerno");
    var $cuadromed = document.getElementById("cuadromedio");
    var $cuadroext = document.getElementById("cuadroexterno");
    var $fondo = document.getElementById("fondo");
    
    $cuadroint.addEventListener("click", mostrarInterno, false);
    $cuadromed.addEventListener("click", mostrarMedio, false);
    $cuadroext.addEventListener("click", mostrarExterno, false);
    $fondo.addEventListener("click", mostrarFondo, false);
}

function mostrarExterno() {
    alert("cuadro externo");
}
function mostrarMedio() {
    event.stopPropagation();//sirve para parar la propagación
    alert("cuadro medio");
   
}
function mostrarInterno() {
    alert("cuadro interno");
}
function mostrarFondo() {
    alert("fondo");
}*/
function inicializar() {
    document.addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.matches("#cuadrointerno")) {
            mostrarInterno();
        }
        if (e.target.matches("#cuadromedio")) {
            mostrarMedio();
        }
        if (e.target.matches(".cuadroexterno")) {
            mostrarExterno();
        }
        if (e.target.matches(".fondo")) {
            mostrarFondo();
        }
    })
}
function mostrarExterno(e) {
    alert("cuadro externo");
}
function mostrarMedio(e) {
    alert("cuadro medio");
}
function mostrarInterno(e) {
    alert("cuadro interno");
}
function mostrarFondo(e) {
    alert("fondo");
}