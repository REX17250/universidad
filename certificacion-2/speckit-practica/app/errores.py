"""Formato uniforme de errores {detalle, errores} con mensajes en español."""

from http import HTTPStatus

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

DETALLE_VALIDACION = "Revisa los campos marcados."

MENSAJES_GENERICOS = {
    "missing": "Este campo es obligatorio.",
    "json_invalid": "Los datos enviados no tienen un formato JSON válido.",
    "int_type": "Debe ser un número entero.",
    "int_parsing": "Debe ser un número entero.",
    "bool_type": "Debe ser verdadero o falso.",
    "bool_parsing": "Debe ser verdadero o falso.",
    "string_type": "Debe ser un texto.",
    "model_attributes_type": "Los datos enviados deben ser un objeto JSON.",
    "dict_type": "Los datos enviados deben ser un objeto JSON.",
}
MENSAJE_POR_DEFECTO = "El valor no es válido. Revisa este campo."

MENSAJES_HTTP = {
    404: "No se encontró lo que buscas. Revisa la dirección.",
    405: "Esta operación no está permitida en esta dirección.",
}
ERROR_HTTP = "No se pudo completar la operación. Intenta de nuevo."


def respuesta_error(codigo: int, detalle: str, errores: dict | None = None) -> JSONResponse:
    cuerpo = {"detalle": detalle}
    if errores:
        cuerpo["errores"] = errores
    return JSONResponse(status_code=codigo, content=cuerpo)


def _nombre_campo(ubicacion: tuple) -> str:
    # ("body", "titulo") -> "titulo"; ("body",) -> "cuerpo" (el cuerpo completo es inválido).
    partes = [str(parte) for parte in ubicacion[1:]]
    return ".".join(partes) if partes else "cuerpo"


def _mensaje_en_espanol(error: dict) -> str:
    if error["type"] == "value_error":
        # Mensaje propio lanzado con ValueError desde un validador.
        return str(error["ctx"]["error"])
    return MENSAJES_GENERICOS.get(error["type"], MENSAJE_POR_DEFECTO)


async def manejar_validacion(_request: Request, exc: RequestValidationError) -> JSONResponse:
    errores: dict[str, str] = {}
    for error in exc.errors():
        # Se conserva el primer mensaje de cada campo.
        errores.setdefault(_nombre_campo(tuple(error["loc"])), _mensaje_en_espanol(error))
    return respuesta_error(422, DETALLE_VALIDACION, errores)


async def manejar_http(_request: Request, exc: StarletteHTTPException) -> JSONResponse:
    # detail puede ser un texto o un dict {"detalle": ..., "errores": {...}}.
    if isinstance(exc.detail, dict):
        return respuesta_error(exc.status_code, exc.detail["detalle"], exc.detail.get("errores"))
    if exc.detail == HTTPStatus(exc.status_code).phrase:
        # Mensaje por defecto de Starlette (en inglés), p. ej. "Not Found" en una ruta inexistente.
        return respuesta_error(exc.status_code, MENSAJES_HTTP.get(exc.status_code, ERROR_HTTP))
    return respuesta_error(exc.status_code, str(exc.detail))


def registrar_manejadores(app: FastAPI) -> None:
    app.add_exception_handler(RequestValidationError, manejar_validacion)
    app.add_exception_handler(StarletteHTTPException, manejar_http)
