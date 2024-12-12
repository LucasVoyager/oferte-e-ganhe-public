from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from .database import Base

class Perfil(Base):
    __tablename__ = 'perfil'
    __table_args__ = {'schema': 'oferteeganhe'}
    
    id_perfil = Column(Integer, primary_key=True, unique=True)
    nome_perfil = Column(String(255), nullable=False)
    criado_em = Column(TIMESTAMP(timezone=True), server_default=func.now())
    update_em = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
