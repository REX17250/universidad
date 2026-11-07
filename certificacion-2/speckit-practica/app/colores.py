"""Paleta predefinida de colores para las materias.

Tonos oscuros: el texto blanco sobre cada uno tiene un contraste de al menos 4.5:1 (WCAG AA).
"""

PALETA = [
    {"id": "azul", "nombre": "Azul", "hex": "#1F4E9C"},
    {"id": "rojo", "nombre": "Rojo", "hex": "#B3261E"},
    {"id": "verde", "nombre": "Verde", "hex": "#1E6B34"},
    {"id": "naranja", "nombre": "Naranja", "hex": "#A84300"},
    {"id": "morado", "nombre": "Morado", "hex": "#6A3D9A"},
    {"id": "turquesa", "nombre": "Turquesa", "hex": "#00706E"},
    {"id": "rosa", "nombre": "Rosa", "hex": "#A8326E"},
    {"id": "marron", "nombre": "Marrón", "hex": "#6D4C33"},
]

IDS_COLORES = frozenset(color["id"] for color in PALETA)


def es_color_valido(id_color: object) -> bool:
    return isinstance(id_color, str) and id_color in IDS_COLORES
