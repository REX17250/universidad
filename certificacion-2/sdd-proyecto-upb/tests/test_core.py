"""Core rules (habits/core.py). No files, no clock: pure functions only."""

import dataclasses
from datetime import date

import pytest

from habits import core
from habits.core import (
    DuplicateHabit,
    Habit,
    HabitError,
    HabitNotFound,
    InvalidName,
    LimitReached,
    NameReason,
)


# --- T-02: constants, type and errors -------------------------------------------------------------


def test_max_name_length_is_60():
    """RF-1.4"""
    assert core.MAX_NAME_LENGTH == 60


def test_max_habits_is_100():
    """RF-1.8"""
    assert core.MAX_HABITS == 100


def test_habit_keeps_name_and_marks():
    """RF-1.1"""
    marks = frozenset({date(2026, 10, 20), date(2026, 10, 21)})
    habit = Habit(name="Inglés", marks=marks)
    assert habit.name == "Inglés"
    assert habit.marks == marks


def test_habit_cannot_be_modified_after_creation():
    """RF-1.1, RF-2.1 (core functions return new lists; they never change a habit)"""
    habit = Habit(name="Inglés", marks=frozenset())
    with pytest.raises(dataclasses.FrozenInstanceError):
        habit.name = "Otro"
    with pytest.raises(dataclasses.FrozenInstanceError):
        habit.marks = frozenset({date(2026, 10, 20)})
    assert isinstance(habit.marks, frozenset)  # a frozenset has no add(): marks cannot be changed either


def test_name_reasons_are_exactly_the_five_rules_of_the_plan():
    """RF-1.3, RF-1.4, RF-1.7"""
    assert {reason.name for reason in NameReason} == {"CONTROL", "EMPTY", "DASH", "NO_ALNUM", "TOO_LONG"}


@pytest.mark.parametrize("reason", list(NameReason))
def test_invalid_name_keeps_its_reason(reason):
    """RF-1.3, RF-1.4, RF-1.7"""
    error = InvalidName(reason)
    assert error.reason is reason


def test_duplicate_habit_keeps_the_existing_name():
    """RF-1.5"""
    error = DuplicateHabit("Inglés")
    assert error.existing_name == "Inglés"


@pytest.mark.parametrize(
    "error",
    [InvalidName(NameReason.EMPTY), DuplicateHabit("Inglés"), LimitReached(), HabitNotFound()],
)
def test_core_errors_share_one_base_type(error):
    """RF-1.3, RF-1.5, RF-1.8, RF-2.4 (the CLI maps every core error to exit code 1)"""
    assert isinstance(error, HabitError)
    assert isinstance(error, Exception)
