import { CompanyModel, WeekDays } from "../../api/interfaces";
import { imageUrlFromKey } from "../../components/ImageCarousel";

interface OverviewViewProps {
  company: CompanyModel;
  productCount: number;
}

const SCHEDULE_DAYS: { key: WeekDays; label: string }[] = [
  { key: "SEGUNDA_FEIRA", label: "Segunda" },
  { key: "TERÇA_FEIRA", label: "Terça" },
  { key: "QUARTA_FEIRA", label: "Quarta" },
  { key: "QUINTA_FEIRA", label: "Quinta" },
  { key: "SEXTA_FEIRA", label: "Sexta" },
  { key: "SABADO", label: "Sábado" },
  { key: "DOMINGO", label: "Domingo" },
];

// JS getDay() (0=Sun … 6=Sat) -> schedule key, for the "today" highlight
const JS_DAY_TO_KEY: WeekDays[] = [
  "DOMINGO",
  "SEGUNDA_FEIRA",
  "TERÇA_FEIRA",
  "QUARTA_FEIRA",
  "QUINTA_FEIRA",
  "SEXTA_FEIRA",
  "SABADO",
];

export default function OverviewView({
  company,
  productCount,
}: OverviewViewProps) {
  const sinceYear = company.createdAt
    ? new Date(company.createdAt).getFullYear()
    : null;

  const todayKey = JS_DAY_TO_KEY[new Date().getDay()];

  return (
    <>
      {/* cover image */}
      {(company.imgS3UrlKeys?.length ?? 0) > 0 && (
        <div
          style={{
            width: "100%",
            height: "clamp(160px, 26vw, 300px)",
            position: "relative",
            overflow: "hidden",
            background: "var(--ink)",
          }}
        >
          <img
            src={imageUrlFromKey(
              company.imgS3UrlKeys![
                Math.floor(Math.random() * company.imgS3UrlKeys!.length)
              ],
            )}
            alt={`${company.name} cover`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(15,14,14,0) 55%, rgba(15,14,14,0.85) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* dark banner */}
      <header
        style={{
          background: "var(--ink)",
          color: "var(--cream)",
          padding: "3rem 2.5rem 2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,69,42,0.35), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.8rem",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              border: "2px solid var(--accent)",
              background: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.4rem",
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            {company.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 6,
              }}
            >
              {company.category?.replaceAll("_", " ")}
              {sinceYear && (
                <span style={{ color: "#666" }}> · est. {sinceYear}</span>
              )}
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 900,
                letterSpacing: "-1px",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {company.name}
            </h1>
            <div style={{ fontSize: "0.85rem", color: "#999", marginTop: 8 }}>
              <i
                className="bi bi-geo-alt"
                style={{ color: "var(--accent)", marginRight: 6 }}
              ></i>
              {company.address?.street ? `${company.address.street}, ` : ""}
              {company.address?.city || "—"}, {company.address?.island || "—"}
            </div>
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background:
                company.status === "OPERATING"
                  ? "rgba(45,106,79,0.2)"
                  : "rgba(255,255,255,0.08)",
              color: company.status === "OPERATING" ? "#7fd4a8" : "#aaa",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "currentColor",
              }}
            />
            {company.status === "OPERATING"
              ? "Aberto ao público"
              : company.status?.toLowerCase()}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "3rem",
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #1e1e1e",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {[
            { label: "Produtos", value: String(productCount) },
            { label: "Sede", value: company.address?.island || "—" },
            {
              label: "Membro desde",
              value: sinceYear ? String(sinceYear) : "—",
            },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#666",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* about + contact */}
      <section
        style={{
          padding: "3rem 2.5rem 3rem 0",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "2rem",
        }}
        className="business-about-grid"
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8e4de",
            padding: "2rem",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 10,
            }}
          >
            Sobre
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            Quem somos
          </h2>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--mid)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {company.description ||
              "Esta empresa ainda não escreveu uma descrição."}
          </p>
        </div>
        <div
          style={{
            background: "var(--ink)",
            color: "var(--cream)",
            padding: "2rem",
            borderTop: "4px solid var(--accent)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.05rem",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Entre em contacto
          </h3>
          {[
            { icon: "bi-envelope-fill", label: "Email", value: company.email },
            {
              icon: "bi-telephone-fill",
              label: "Telefone",
              value: company.phoneNumber,
            },
            { icon: "bi-printer-fill", label: "Fax", value: company.faxNumber },
          ]
            .filter((row) => row.value)
            .map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "9px 0",
                  borderBottom: "1px solid #1f1c1a",
                }}
              >
                <i
                  className={`bi ${row.icon}`}
                  style={{
                    color: "var(--accent)",
                    fontSize: "0.9rem",
                    marginTop: 2,
                  }}
                ></i>
                <div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#888",
                    }}
                  >
                    {row.label}
                  </div>
                  <div style={{ fontSize: "0.88rem", wordBreak: "break-word" }}>
                    {row.value}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
      {/* horário de funcionamento */}
      {company.weeklySchedule && (
        <section style={{ padding: "0 2.5rem 3rem 0" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e4de",
              padding: "2rem",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 10,
              }}
            >
              Horário
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.4rem",
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              Horário de funcionamento
            </h2>

            {company.weeklySchedule.open247 ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 20,
                  background: "rgba(45,106,79,0.12)",
                  color: "#2d6a4f",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                <i className="bi bi-clock-fill"></i> Aberto 24 horas, todos os
                dias
              </span>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  columnGap: "2.5rem",
                }}
              >
                {SCHEDULE_DAYS.map(({ key, label }) => {
                  const day = company.weeklySchedule!.daySchedule?.[key];
                  const isToday = key === todayKey;
                  const closed = !day || day.isClosed;
                  const value = !day
                    ? "—"
                    : day.isClosed
                      ? "Fechado"
                      : `${day.start} – ${day.end}`;
                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                        padding: "10px 0",
                        borderBottom: "1px solid #f0ece6",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          fontWeight: isToday ? 700 : 600,
                          color: isToday ? "var(--accent)" : "#888",
                        }}
                      >
                        {label}
                        {isToday && " · hoje"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          color: closed ? "var(--mid)" : "var(--ink)",
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
