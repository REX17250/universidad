import unicodedata

import pytest

from app.textos import contar_caracteres, normalizar_nombre, recortar, texto_opcional


def test_recortar_quita_espacios_al_inicio_y_al_final():
    assert recortar("  Hola  ") == "Hola"


def test_recortar_cadena_solo_con_espacios_queda_vacia():
    assert recortar("   ") == ""
    assert contar_caracteres(recortar("   ")) == 0


def test_recortar_normaliza_a_nfc():
    nfd = unicodedata.normalize("NFD", "Cálculo")
    assert recortar(nfd) == unicodedata.normalize("NFC", "Cálculo")


@pytest.mark.parametrize(
    ("texto", "esperado"),
    [
        ("ñandú", 5),
        (unicodedata.normalize("NFD", "Cálculo"), 7),
        ("👍🏽", 1),
        ("👨‍👩‍👧", 1),
        ("🇧🇴", 1),
        ("", 0),
    ],
)
def test_contar_caracteres_cuenta_grafemas(texto, esperado):
    assert contar_caracteres(texto) == esperado


def test_normalizar_nombre_ignora_mayusculas_tildes_compuestas_y_espacios():
    assert normalizar_nombre("  CÁLCULO I ") == normalizar_nombre("cálculo i")
    nfd = unicodedata.normalize("NFD", "Cálculo I")
    assert normalizar_nombre(nfd) == normalizar_nombre("cálculo i")


def test_texto_opcional_vacio_o_none_devuelve_none():
    assert texto_opcional("   ") is None
    assert texto_opcional(None) is None
    assert texto_opcional("  Incluir gráficas ") == "Incluir gráficas"
