from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from .database import Base

class Estoque(Base):
    __tablename__ = 'estoque'
    __table_args__ = {'schema': 'oferteeganhe'}
    
    id_estoque = Column(Integer, primary_key=True, unique=True)
    status = Column(String(255), nullable=False)
    id_loja = Column(Integer, ForeignKey('Loja.id_loja'), nullable=False)
    quantidade_atual = Column(Integer, nullable=False)
    quantidade_minima = Column(Integer, nullable=False)
    quantidade_recomendada = Column(Integer, nullable=False)
    criado_em = Column(TIMESTAMP(timezone=True), server_default=func.now())
    update_em = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
