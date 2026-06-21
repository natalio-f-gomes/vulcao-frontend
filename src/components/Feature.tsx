import React from "react";

function GetFeatureSection() {
  return (
    <section className="features">
      <div className="feature-item">
        <div className="feature-icon">
          <i className="bi bi-clipboard-data"></i>
        </div>
        <div className="feature-title">Rastreamento Digital de Encomendas</div>
        <p className="feature-desc">
          Monitorize e atualize encomendas em tempo real a partir de uma única
          plataforma.
        </p>
      </div>

      <div className="feature-item">
        <div className="feature-icon">
          <i className="bi bi-person-workspace"></i>
        </div>
        <div className="feature-title">Controlos do Empregador</div>
        <p className="feature-desc">
          Gerir funcionários, atribuir responsabilidades e manter registos da
          equipa.
        </p>
      </div>

      <div className="feature-item">
        <div className="feature-icon">
          <i className="bi bi-cloud-check"></i>
        </div>
        <div className="feature-title">
          Fluxo de Trabalho Totalmente Digital
        </div>
        <p className="feature-desc">
          Gerir encomendas, carrinhos e funcionários online sem papeladas.
        </p>
      </div>
    </section>
  );
}
export default GetFeatureSection;
