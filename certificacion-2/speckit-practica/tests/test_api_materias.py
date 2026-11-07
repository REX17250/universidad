import pytest
from fastapi.testclient import TestClient

from app.main import app

MENSAJE_DUPLICADO = "Ya existe una materia llamada «Cálculo I». Elige otro nombre."
MENSAJE_NOMBRE_OBLIGATORIO = "El nombre de la materia es obligatorio."
MENSAJE_COLOR = "Elige un color de la lista."


def test_colores_devuelve_la_paleta_de_ocho(cliente):
    respuesta = cliente.get("/api/colores")
    assert respuesta.status_code == 200
    colores = respuesta.json()
    assert len(colores) == 8
    assert colores[0] == {"id": "azul", "nombre": "Azul", "hex": "#1F4E9C"}
    for color in colores:
        assert set(color) == {"id", "nombre", "hex"}


def test_crear_materia_valida(cliente):
    respuesta = cliente.post("/api/materias", json={"nombre": "Cálculo I", "color": "azul"})
    assert respuesta.status_code == 201
    materia = respuesta.json()
    assert materia == {
        "id": materia["id"],
        "nombre": "Cálculo I",
        "color": "azul",
        "cantidad_tareas": 0,
    }


def test_crear_materia_recorta_espacios(cliente, crear_materia):
    materia = crear_materia(cliente, "  Física I  ", "rojo")
    assert materia["nombre"] == "Física I"


@pytest.mark.parametrize("repetido", ["cálculo i", "  CÁLCULO I "])
def test_nombre_duplicado_sin_distinguir_mayusculas_ni_espacios(cliente, crear_materia, repetido):
    crear_materia(cliente, "Cálculo I")
    respuesta = cliente.post("/api/materias", json={"nombre": repetido, "color": "verde"})
    assert respuesta.status_code == 409
    assert respuesta.json()["detalle"] == MENSAJE_DUPLICADO


@pytest.mark.parametrize("nombre", ["", "    "])
def test_nombre_vacio_o_solo_espacios(cliente, nombre):
    respuesta = cliente.post("/api/materias", json={"nombre": nombre, "color": "azul"})
    assert respuesta.status_code == 422
    assert respuesta.json()["errores"]["nombre"] == MENSAJE_NOMBRE_OBLIGATORIO


def test_nombre_ausente(cliente):
    respuesta = cliente.post("/api/materias", json={"color": "azul"})
    assert respuesta.status_code == 422
    assert respuesta.json()["errores"]["nombre"] == MENSAJE_NOMBRE_OBLIGATORIO


def test_nombre_de_51_caracteres_se_rechaza(cliente):
    respuesta = cliente.post("/api/materias", json={"nombre": "a" * 51, "color": "azul"})
    assert respuesta.status_code == 422
    cuerpo = respuesta.json()
    assert cuerpo["detalle"] == "Revisa los campos marcados."
    assert cuerpo["errores"]["nombre"] == (
        "El nombre puede tener como máximo 50 caracteres (tiene 51)."
    )


def test_nombre_de_50_emojis_compuestos_se_acepta(cliente):
    respuesta = cliente.post("/api/materias", json={"nombre": "👍🏽" * 50, "color": "azul"})
    assert respuesta.status_code == 201


@pytest.mark.parametrize(
    "cuerpo", [{"nombre": "Química", "color": "amarillo"}, {"nombre": "Química"}]
)
def test_color_invalido_o_ausente(cliente, cuerpo):
    respuesta = cliente.post("/api/materias", json=cuerpo)
    assert respuesta.status_code == 422
    assert respuesta.json()["errores"]["color"] == MENSAJE_COLOR


def test_cuerpo_vacio_informa_cada_campo(cliente):
    respuesta = cliente.post("/api/materias", json={})
    assert respuesta.status_code == 422
    assert respuesta.json()["errores"] == {
        "nombre": MENSAJE_NOMBRE_OBLIGATORIO,
        "color": MENSAJE_COLOR,
    }


def test_listar_materias_ordenadas_sin_distinguir_mayusculas(cliente, crear_materia):
    crear_materia(cliente, "Química", "verde")
    crear_materia(cliente, "cálculo I", "azul")
    crear_materia(cliente, "Biología", "rojo")
    respuesta = cliente.get("/api/materias")
    assert respuesta.status_code == 200
    assert [materia["nombre"] for materia in respuesta.json()] == [
        "Biología",
        "cálculo I",
        "Química",
    ]
    assert all("nombre_normalizado" not in materia for materia in respuesta.json())


def test_listar_sin_materias_devuelve_lista_vacia(cliente):
    assert cliente.get("/api/materias").json() == []


def test_materias_persisten_al_reiniciar(cliente, crear_materia):
    crear_materia(cliente, "Cálculo I", "morado")
    # Un nuevo TestClient sobre la misma base simula reiniciar la aplicación (RF-022).
    with TestClient(app) as cliente_reiniciado:
        materias = cliente_reiniciado.get("/api/materias").json()
    assert [(materia["nombre"], materia["color"]) for materia in materias] == [
        ("Cálculo I", "morado")
    ]
