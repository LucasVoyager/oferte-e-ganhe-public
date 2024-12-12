from sqlalchemy import Column, Integer, String, ForeignKey, Date, TIMESTAMP
from sqlalchemy.sql import func
from .database import Base

class Transacao(Base):
    __tablename__ = 'transacao'
    __table_args__ = {'schema': 'oferteeganhe'}
    
    id_talao = Column(Integer, primary_key=True, unique=True)
    quantidade_talao_solicitado = Column(Integer, nullable=False)
    quantidade_talao_enviado = Column(Integer)
    quantidade_talao_recebido = Column(Integer)
    status = Column(String(255), nullable=False)
    data_hora_envio = Column(Date)
    data_entrega_prevista = Column(Date)
    data_hora_recebimento = Column(Date)
    numero_remessa = Column(Integer)
    id_usuario = Column(Integer, ForeignKey('Usuario.matricula_usuario'), nullable=False)
    id_loja = Column(Integer, ForeignKey('Loja.id_loja'), nullable=False)
    criado_em = Column(TIMESTAMP(timezone=True), server_default=func.now())
    update_em = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
