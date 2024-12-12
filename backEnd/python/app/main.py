from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models.database import SessionLocal
from models.Usuario import Usuario
from models.Loja import Loja 
from models.Perfil import Perfil 
from models.Transacao import Transacao 
from models.Estoque import Estoque
from typing import List
from fastapi.responses import StreamingResponse
from io import StringIO
import csv
import logging
import matplotlib.pyplot as plt
import io

logging.basicConfig(level=logging.INFO) 
logger = logging.getLogger(__name__)

origins = [ "http://localhost:3000" ]

app = FastAPI()

app.add_middleware( CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"], )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/usuarios/export/csv")
def export_usuarios_csv(db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).all()
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['matricula_usuario', 'nome', 'email', 'senha', 'id_loja', 'id_perfil', 'criado_em', 'update_em'])
    
    for usuario in usuarios:
        writer.writerow([usuario.matricula_usuario, usuario.nome, usuario.email, usuario.senha, usuario.id_loja, usuario.id_perfil, usuario.criado_em, usuario.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=usuarios.csv'})

@app.get("/lojas/export/csv")
def export_lojas_csv(db: Session = Depends(get_db)):
    lojas = db.query(Loja).all()
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id_loja', 'nome_loja', 'cep_loja','criado_em', 'update_em'])
    
    for loja in lojas:
        writer.writerow([loja.id_loja, loja.nome_loja, loja.cep_loja, loja.criado_em, loja.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=lojas.csv'})

@app.get("/perfil/export/csv")
def export_perfis_csv(db: Session = Depends(get_db)):
    perfis = db.query(Perfil).all()
  
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id_perfil', 'nome_perfil', 'criado_em', 'update_em'])
    
    for perfil in perfis:
        writer.writerow([perfil.id_perfil, perfil.nome_perfil, perfil.criado_em, perfil.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=perfis.csv'})

@app.get("/estoque/export/csv")
def export_estoque_csv(db: Session = Depends(get_db)):
    estoques = db.query(Estoque).all()
  
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id_estoque', 'status', 'id_loja', 'quantidade_atual', 'quantidade_minima', 'quantidade_recomendada', 'criado_em', 'update_em'])
    
    for estoque in estoques:
        writer.writerow([estoque.id_estoque, estoque.status, estoque.id_loja, estoque.quantidade_atual, estoque.quantidade_minima, estoque.quantidade_recomendada, estoque.criado_em, estoque.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=estoques.csv'})

@app.get("/manutencao/export/csv")
def export_estoque_csv(db: Session = Depends(get_db)):
    transacoes = db.query(Transacao).all()
 
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id_talao', 'quantidade_talao_solicitado', 'quantidade_talao_enviado', 'quantidade_talao_recebido', 'status', 'data_hora_envio', 'data_entrega_prevista', 'data_hora_recebimento', 'numero_remessa', 'id_usuario', 'id_loja', 'criado_em', 'update_em'])
    
    for transacao in transacoes:
        writer.writerow([transacao.id_talao, transacao.quantidade_talao_solicitado, transacao.quantidade_talao_enviado, transacao.quantidade_talao_recebido, transacao.status, transacao.data_hora_envio, transacao.data_entrega_prevista, transacao.data_hora_recebimento, transacao.numero_remessa, transacao.id_usuario, transacao.id_loja, transacao.criado_em, transacao.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=transacao.csv'})

@app.get("/recebimento/export/csv")
def export_estoque_csv(db: Session = Depends(get_db)):
    transacoes = db.query(Transacao).all()

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id_talao', 'quantidade_talao_recebido', 'status', 'data_hora_recebimento', 'numero_remessa', 'id_usuario', 'id_loja', 'criado_em', 'update_em'])
    
    for transacao in transacoes:
        writer.writerow([transacao.id_talao, transacao.quantidade_talao_recebido, transacao.status,transacao.data_hora_recebimento, transacao.numero_remessa, transacao.id_usuario, transacao.id_loja, transacao.criado_em, transacao.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=recebimento.csv'})

@app.get("/envio/export/csv")
def export_estoque_csv(db: Session = Depends(get_db)):
    transacoes = db.query(Transacao).all()

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id_talao', 'quantidade_talao_solicitado', 'quantidade_talao_enviado', 'status', 'data_hora_envio', 'data_entrega_prevista',  'numero_remessa', 'id_usuario', 'id_loja', 'criado_em', 'update_em'])
    
    for transacao in transacoes:
        writer.writerow([transacao.id_talao, transacao.quantidade_talao_solicitado, transacao.quantidade_talao_enviado, transacao.status, transacao.data_hora_envio, transacao.data_entrega_prevista, transacao.numero_remessa, transacao.id_usuario, transacao.id_loja, transacao.criado_em, transacao.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=envio.csv'})

@app.get("/envio/loja/export/csv")
def export_estoque_csv(id_loja: int = Query(...),db: Session = Depends(get_db)):
    transacoes = db.query(Transacao).filter(Transacao.id_loja == id_loja).all()

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id_talao', 'quantidade_talao_solicitado', 'quantidade_talao_enviado', 'status', 'data_hora_envio', 'data_entrega_prevista',  'numero_remessa', 'id_usuario', 'id_loja', 'criado_em', 'update_em'])
    
    for transacao in transacoes:
        writer.writerow([transacao.id_talao, transacao.quantidade_talao_solicitado, transacao.quantidade_talao_enviado, transacao.status, transacao.data_hora_envio, transacao.data_entrega_prevista, transacao.numero_remessa, transacao.id_usuario, transacao.id_loja, transacao.criado_em, transacao.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=envio.csv'})

@app.get("/recebimento/loja/export/csv")
def export_estoque_csv(id_loja: int = Query(...),db: Session = Depends(get_db)):
    transacoes = db.query(Transacao).filter(Transacao.id_loja == id_loja).all()

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id_talao', 'quantidade_talao_recebido', 'status', 'data_hora_recebimento', 'numero_remessa', 'id_usuario', 'id_loja', 'criado_em', 'update_em'])
    
    for transacao in transacoes:
        writer.writerow([transacao.id_talao, transacao.quantidade_talao_recebido, transacao.status,transacao.data_hora_recebimento, transacao.numero_remessa, transacao.id_usuario, transacao.id_loja, transacao.criado_em, transacao.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=recebimento.csv'})

@app.get("/estoque/loja/export/csv")
def export_estoque_csv(id_loja: int = Query(...),db: Session = Depends(get_db)):
    estoques = db.query(Estoque).filter(Estoque.id_loja == id_loja).all()
  
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id_estoque', 'status', 'id_loja', 'quantidade_atual', 'quantidade_minima', 'quantidade_recomendada', 'criado_em', 'update_em'])
    
    for estoque in estoques:
        writer.writerow([estoque.id_estoque, estoque.status, estoque.id_loja, estoque.quantidade_atual, estoque.quantidade_minima, estoque.quantidade_recomendada, estoque.criado_em, estoque.update_em])
    
    output.seek(0)
    return StreamingResponse(output, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=estoques.csv'})

# graficos taloes

@app.get("/dashboard/taloesAdminGrafico")
def taloes_solicitado_grafico(db: Session = Depends(get_db)):
    countTaloes = db.query(Transacao).count()
    countSolicitado = db.query(Transacao).filter(Transacao.status == "solicitado").count()
    countEnviado = db.query(Transacao).filter(Transacao.status == "enviado").count()
    countEntregue = db.query(Transacao).filter(Transacao.status == "entregue").count()

    return {
        'Taloes': countTaloes,
        'Solicitados': countSolicitado,
        'Enviados': countEnviado,
        'Entregue': countEntregue
    }

@app.get("/dashboard/taloes/graficoEspecificoLoja")
def taloes_solicitado_grafico(id_loja: int = Query(...),db: Session = Depends(get_db)):
    countTaloes = db.query(Transacao).filter(Transacao.id_loja == id_loja).count()
    countSolicitado = db.query(Transacao).filter(Transacao.id_loja == id_loja, Transacao.status == "solicitado").count()
    countEnviado = db.query(Transacao).filter(Transacao.id_loja == id_loja,Transacao.status == "enviado").count()
    countEntregue = db.query(Transacao).filter(Transacao.id_loja == id_loja,Transacao.status == "entregue").count()

    return {
        'Taloes': countTaloes,
        'Solicitados': countSolicitado,
        'Enviados': countEnviado,
        'Entregue': countEntregue
    }

# graficos usuario
@app.get("/dashboard/usuarioAdminGrafico")
def usuarios_grafico(db: Session = Depends(get_db)):
    countUsuarios = db.query(Usuario).count()
    countUsuariosOk = db.query(Usuario).filter(Usuario.criado_por == "admin").count()
    countAguardaAprovacao = db.query(Usuario).filter(Usuario.criado_por == "criar_conta").count()

    return {    
        'UsuariosTotal': countUsuarios,
        'UsuariosOk': countUsuariosOk,
        'UsuariosAguardandoAprovacao': countAguardaAprovacao
    }

@app.get("/dashboard/usuariosPorPerfilAdmin")
def usuarios_por_perfil_grafico(db: Session = Depends(get_db)):
    perfis = db.query(Perfil).all()

    labels = []
    valores = []

    for perfil in perfis:
        labels.append(perfil.nome_perfil)
        count_usuarios = db.query(Usuario).filter(Usuario.id_perfil == perfil.id_perfil).count()
        valores.append(count_usuarios)

    return {
        'labels': labels,
        'valores': valores
    }
