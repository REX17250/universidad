"""Modelos Pydantic de entrada y salida con mensajes de validación en español."""

from pydantic import BaseModel, Field, field_validator

from app.colores import es_color_valido
from app.textos import contar_caracteres, recortar, validar_longitud

MAXIMO_NOMBRE_MATERIA = 50


class MateriaEntrada(BaseModel):
    # Valor por defecto None + validate_default: un campo ausente llega al validador y recibe
    # el mensaje propio en español en lugar del genérico "Este campo es obligatorio.".
    nombre: str = Field(default=None, validate_default=True)
    color: str = Field(default=None, validate_default=True)

    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, valor: object) -> str:
        if not isinstance(valor, str) or contar_caracteres(recortar(valor)) == 0:
            raise ValueError("El nombre de la materia es obligatorio.")
        return validar_longitud(recortar(valor), MAXIMO_NOMBRE_MATERIA, "El nombre")

    @field_validator("color", mode="before")
    @classmethod
    def validar_color(cls, valor: object) -> str:
        if not es_color_valido(valor):
            raise ValueError("Elige un color de la lista.")
        return valor


class MateriaSalida(BaseModel):
    id: int
    nombre: str
    color: str
    cantidad_tareas: int
