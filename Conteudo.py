from pydantic import BaseModel
from typing import Optional
from enum import Enum

class CategoriaEnum(str, Enum):
    avancos_tecnologicos = "Avanços Tecnológicos"
    ia_arte_cultura = "IA na Arte e Cultura"

class ConteudoCreate(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    autor: str
    categoria: CategoriaEnum  # Novo campo obrigatório

class Conteudo(ConteudoCreate):
    id: int
