"""
Base classes for Unit Operations.
"""

from abc import ABC, abstractmethod
from typing import List
from open_sim.core.stream import MaterialStream


class UnitOperation(ABC):
    """Abstract base class for all process unit operations."""

    def __init__(self, name: str):
        self.name = name
        self.inlets: List[MaterialStream] = []
        self.outlets: List[MaterialStream] = []

    @abstractmethod
    def solve(self) -> None:
        """Executes mass and energy balances to compute outlet stream states."""
        pass

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(name='{self.name}')"
