"""Recorte, normalización y conteo de caracteres visibles (grafemas)."""

import unicodedata

import regex


def recortar(texto: str) -> str:
    """Quita los espacios al inicio y al final y normaliza a NFC."""
    return unicodedata.normalize("NFC", texto.strip())


def contar_caracteres(texto: str) -> int:
    """Cuenta caracteres visibles: un emoji compuesto o una letra con tilde cuentan 1."""
    return len(regex.findall(r"\X", texto))


def normalizar_nombre(texto: str) -> str:
    """Forma comparable de un nombre: recortado, NFC y sin distinguir mayúsculas."""
    return unicodedata.normalize("NFC", recortar(texto).casefold())


def texto_opcional(texto: str | None) -> str | None:
    """Devuelve el texto recortado, o None si no hay texto o queda vacío."""
    if texto is None:
        return None
    recortado = recortar(texto)
    return recortado or None


def validar_longitud(texto: str, maximo: int, etiqueta: str) -> str:
    """Lanza ValueError si el texto supera el máximo de caracteres; nunca lo corta."""
    cantidad = contar_caracteres(texto)
    if cantidad > maximo:
        raise ValueError(
            f"{etiqueta} puede tener como máximo {maximo} caracteres (tiene {cantidad})."
        )
    return texto
