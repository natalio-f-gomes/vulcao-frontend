import React from "react";
import { useNavigate } from "react-router-dom";

function GetHeroSection() {
  const onNavigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="hero-eyebrow">
          Clientes · Empresários · Tudo num só lugar
        </p>

        <h1 className="display">
          Para quem compra.
          <br />
          <em>Para quem gere.</em>
        </h1>

        <p className="hero-sub">
          Os clientes fazem encomendas de forma simples. Os empresários gerem
          funcionários, produtos e operações. Uma plataforma que serve para
          ambos.
        </p>

        <div className="d-flex flex-wrap gap-2">
          <a
            className="btn-primary-custom"
            onClick={() => onNavigate("/user-register")}
          >
            Sou Cliente
          </a>
          <a
            className="btn-outline-custom"
            onClick={() => onNavigate("/employer-register")}
          >
            Sou Empresário
          </a>
        </div>
      </div>

      <div className="hero-image">
        <div className="hero-image-inner">
          <div className="hero-card">
            <div className="card-label">Clientes</div>
            <div className="card-title-sm">Encomendar</div>
            <div className="card-price">
              Navegue por produtos e faça pedidos em minutos.
            </div>
          </div>

          <div className="hero-card">
            <div className="card-label">Empresários</div>
            <div className="card-title-sm">Gerir</div>
            <div className="card-price">
              Funcionários, produtos, encomendas e permissões.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GetHeroSection;
