from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from .database import Base

class Usuario(Base):
    __tablename__ = 'usuario'
    __table_args__ = {'schema': 'oferteeganhe'}

    matricula_usuario = Column(Integer, primary_key=True, unique=True) 
    nome = Column(String(255), nullable=False) 
    email = Column(String(255), nullable=False) 
    senha = Column(String(255), nullable=False)
    criado_por = Column(String(255), nullable=False) 
    id_loja = Column(Integer, ForeignKey('Loja.id_loja'), nullable=False) 
    id_perfil = Column(Integer, ForeignKey('Perfil.id_perfil')) 
    criado_em = Column(TIMESTAMP(timezone=True), server_default=func.now()) 
    update_em = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
