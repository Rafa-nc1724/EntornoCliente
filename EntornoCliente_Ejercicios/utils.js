//Función que te devuelve un número aleatorio entre un número mínimo y un máximo
function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}