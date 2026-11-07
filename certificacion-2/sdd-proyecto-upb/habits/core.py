"""Core business rules for habits-cli.

Pure code: no file access, no print/input/argparse, no clock (spec 001, plan section 3).
Errors carry a type and data only; the Spanish texts live in habits/messages.py.
"""

from dataclasses import dataclass
from datetime import date
from enum import Enum

MAX_NAME_LENGTH = 60  # RF-1.4
MAX_HABITS = 100  # RF-1.8


@dataclass(frozen=True)
class Habit:
    """A habit: a clean, valid name and the set of calendar days it was marked."""

    name: str
    marks: frozenset[date]


class NameReason(Enum):
    """Why a name is rejected (plan section 3.2)."""

    CONTROL = "control"  # RF-1.7: control characters or line separators
    EMPTY = "empty"  # RF-1.3
    DASH = "dash"  # RF-1.7: starts with "-"
    NO_ALNUM = "no_alnum"  # RF-1.7: no letter and no digit
    TOO_LONG = "too_long"  # RF-1.4


class HabitError(Exception):
    """Base of every core error; the CLI maps all of them to exit code 1."""


class InvalidName(HabitError):
    """The name breaks one of the naming rules."""

    def __init__(self, reason: NameReason) -> None:
        super().__init__(reason)
        self.reason = reason


class DuplicateHabit(HabitError):
    """A habit with an equivalent name already exists (RF-1.5)."""

    def __init__(self, existing_name: str) -> None:
        super().__init__(existing_name)
        self.existing_name = existing_name


class LimitReached(HabitError):
    """There are already MAX_HABITS habits (RF-1.8)."""


class HabitNotFound(HabitError):
    """No habit matches the given name (RF-2.4)."""
