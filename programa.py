from fastapi import FastAPI, HTTPException
from typing import List
from Conteudo import ConteudoCreate, Conteudo
from typing import Optional

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Pode restringir depois se quiser
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Banco de dados em memória
conteudos_db: List[Conteudo] = []
proximo_id: int = 0  # contador de ID automático


# Rota para criar um novo conteúdo
@app.post("/conteudos", response_model=Conteudo)
def criar_conteudo(conteudo: ConteudoCreate):
    global proximo_id
    proximo_id += 1
    novo_conteudo = Conteudo(id=proximo_id, **conteudo.dict())
    conteudos_db.append(novo_conteudo)
    return novo_conteudo


# Rota para listar todos os conteúdos
@app.get("/conteudos", response_model=List[Conteudo])
def listar_conteudos():
    return conteudos_db


# Rota para obter um conteúdo específico
@app.get("/conteudos/{conteudo_id}", response_model=Conteudo)
def obter_conteudo(conteudo_id: int):
    for conteudo in conteudos_db:
        if conteudo.id == conteudo_id:
            return conteudo
    raise HTTPException(status_code=404, detail="Conteúdo não encontrado.")


# Rota para atualizar um conteúdo completo
@app.put("/conteudos/{conteudo_id}", response_model=Conteudo)
def atualizar_conteudo(conteudo_id: int, conteudo_atualizado: ConteudoCreate):
    for index, conteudo in enumerate(conteudos_db):
        if conteudo.id == conteudo_id:
            novo_conteudo = Conteudo(id=conteudo_id, **conteudo_atualizado.dict())
            conteudos_db[index] = novo_conteudo
            return novo_conteudo
    raise HTTPException(status_code=404, detail="Conteúdo não encontrado.")


# Rota para atualizar parcialmente (patch)
@app.patch("/conteudos/{conteudo_id}", response_model=Conteudo)
def atualizar_parcial_conteudo(conteudo_id: int, titulo: Optional[str] = None, descricao: Optional[str] = None, autor: Optional[str] = None):
    for conteudo in conteudos_db:
        if conteudo.id == conteudo_id:
            if titulo is not None:
                conteudo.titulo = titulo
            if descricao is not None:
                conteudo.descricao = descricao
            if autor is not None:
                conteudo.autor = autor
            return conteudo
    raise HTTPException(status_code=404, detail="Conteúdo não encontrado.")


# Rota para excluir um conteúdo
@app.delete("/conteudos/{conteudo_id}")
def deletar_conteudo(conteudo_id: int):
    for index, conteudo in enumerate(conteudos_db):
        if conteudo.id == conteudo_id:
            del conteudos_db[index]
            return {"mensagem": "Conteúdo excluído com sucesso"}
    raise HTTPException(status_code=404, detail="Conteúdo não encontrado.")
