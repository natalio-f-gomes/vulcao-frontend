import { useEffect, useMemo, useState } from "react";
import {
  GetAllFeedbacks,
  PostFeedBackConfirm,
  PostFeedBackRequest,
} from "../Requests/global";
import { useUserAuthManager } from "../Auth/Auth-Handler";
import { useNavigate } from "react-router-dom";
import { FEEDBACK_TYPE_LIST, FeedbackModel } from "../Interfaces/global";
import MFAComponent from "../Components/Modals/MFAComponent";
import { formatDateTime } from "../Entities/Shopping/types";

/* ==========================================================================
   FEEDBACK PAGE — feature requests & problem reports
   Standalone: no props, no API calls. All state is local and seeded
   with dummy data. Wire `handleSubmit` / `toggleVote` to the backend
   later without touching the markup.
   Styles: feedback-page.css (uses the global theme tokens).
   ========================================================================== */

type FeedbackKind = "FEATURE" | "PROBLEM";

type FilterTab = "ALL" | FeedbackKind;

function FeedbackPage() {
  const { isEntityLoggedIn } = useUserAuthManager();
  const onNavigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState<boolean>(false);
  const [items, setItems] = useState<FeedbackModel[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [newFeedback, setNewFeedback] = useState<FeedbackModel>({
    id: "",
    title: "",
    description: "",
    feedbackType: "VISUAL_DO_WEBSITE",
    status: "ANALISANDO",
    votes: 0,
    createdAt: "",
    updatedAt: "",
    email: "",
    name: "",
  });

  // form state
  const [kind, setKind] = useState<FeedbackKind>("FEATURE");

  const toggleVote = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, voted: !i.votes, votes: i.votes + (i.votes ? -1 : 1) }
          : i,
      ),
    );
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setNewFeedback((prev: FeedbackModel) => ({
      ...prev,
      [name]: value,
    }));
  };
  const postFeedback = async (code: string) => {
    console.log("Post feedback acheived");
    if (!newFeedback) return;
    setLoading(true);
    try {
      const response = await PostFeedBackConfirm(code, newFeedback);

      console.log(response);
      if (response.status === 200) {
        alert(
          "Novo feedback publicado com sucesso. O administrador foi notificado!",
        );

        getFeedbacks();
        setShowMFA(false);
      } else if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
        setLoading(false);
      } else {
        alert("Teve um erro com o servidor. Por favor retorne mais tarde");
        console.log(response);
      }
    } catch (exception) {
      console.log(exception);
    } finally {
      setLoading(false);
      return;
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(newFeedback);
    const email: string | null = localStorage.getItem("email");

    if (isEntityLoggedIn && email) {
      const response = await PostFeedBackRequest(newFeedback);
      if (response.status === 200) {
        alert(
          "Novo feedback publicado com sucesso. O administrador foi notificado!",
        );
      } else if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
      } else {
        alert("There was an issue with your request, please come back later");
      }
      return;
    } else {
      console.log("REQUEST ENDPOINTQ");
      const response = await PostFeedBackRequest(newFeedback);
      if (response.status === 202) {
        setShowMFA(true); // code sent → show the popup
      } else if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
        setLoading(false);
      } else {
        alert("Erro inesperado. Por favor volte mais tarde");
        console.log("Unexpected error", response);
      }
      setLoading(false);
    }

    // setItems((prev) => [newItem, ...prev]);
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 5000);
  };

  const counts = {
    ALL: items.length,
    PLANNING: items.filter((i) => i.status === "PLANEJADO").length,
    PROCESSING: items.filter((i) => i.status === "PROCESSANDO").length,
    ANALYZING: items.filter((i) => i.status === "ANALISANDO").length,
    RESOLVED: items.filter((i) => i.status === "RESOLVIDO").length,
    CANCELED: items.filter((i) => i.status === "RESOLVIDO").length,
  };

  const getFeedbacks = async () => {
    const response = await GetAllFeedbacks();
    if (response.status == 200) {
      const data = await response.json();
      console.log("Feedbacks: ", data);
      setItems(data);
    } else if (response.status >= 400 && response.status < 500) {
      alert(await response.text());
    } else {
      alert(
        "There was an issue with you request, please try again or comeback later!",
      );
    }
  };
  useEffect(() => {
    getFeedbacks();
  }, []);

  return (
    <>
      <div className="feedback-page">
        {/* ── Page header ── */}
        <div className="page-header">
          <div className="page-eyebrow">A tua voz</div>
          <h1 className="page-title">Pedidos &amp; Problemas</h1>
          <p className="fb-subtitle">
            Sugere novas funcionalidades ou reporta problemas. Vota nas ideias
            que gostavas de ver primeiro.
          </p>
        </div>

        <div className="fb-layout">
          {/* ── Left: submission form ── */}
          <form className="fb-form" onSubmit={handleSubmit}>
            <div className="fb-form-head">
              <i className="bi bi-megaphone" />
              <span>Nova submissão</span>
            </div>

            <div className="fb-form-body">
              {/* Type toggle */}
              <div className="fb-field">
                <label className="fb-label">Tipo</label>
                <div className="fb-kind-toggle">
                  <button
                    type="button"
                    className={`fb-kind-btn ${kind === "FEATURE" ? "active" : ""}`}
                    onClick={() => setKind("FEATURE")}
                  >
                    <i className="bi bi-lightbulb" /> Funcionalidade
                  </button>
                  <button
                    type="button"
                    className={`fb-kind-btn problem ${kind === "PROBLEM" ? "active" : ""}`}
                    onClick={() => setKind("PROBLEM")}
                  >
                    <i className="bi bi-bug" /> Problema
                  </button>
                </div>
              </div>
              {!isEntityLoggedIn && (
                <div>
                  <div className="fb-field">
                    <label className="fb-label" htmlFor="fb-name">
                      Nome
                    </label>
                    <input
                      id="fb-name"
                      className="fb-input"
                      type="text"
                      maxLength={20}
                      placeholder="Nome"
                      required
                      name="name"
                      value={newFeedback.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="fb-field">
                    <label className="fb-label" htmlFor="fb-email">
                      Email
                    </label>
                    <input
                      id="fb-email"
                      className="fb-input"
                      type="email"
                      maxLength={50}
                      placeholder="Email"
                      required
                      name="email"
                      value={newFeedback.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div className="fb-field">
                <label className="fb-label" htmlFor="fb-title">
                  Título
                </label>
                <input
                  id="fb-title"
                  className="fb-input"
                  type="text"
                  maxLength={90}
                  placeholder={
                    kind === "FEATURE"
                      ? "ex: Lista de desejos"
                      : "ex: Erro ao finalizar compra"
                  }
                  value={newFeedback.title}
                  onChange={handleInputChange}
                  required
                  name="title"
                />
              </div>

              <div className="fb-field">
                <label className="fb-label" htmlFor="fb-category">
                  Área
                </label>
                <select
                  id="fb-category"
                  className="fb-input"
                  value={newFeedback.feedbackType}
                  onChange={handleInputChange}
                  name="feedbackType"
                >
                  {FEEDBACK_TYPE_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fb-field">
                <label className="fb-label" htmlFor="fb-desc">
                  Descrição
                </label>
                <textarea
                  id="fb-desc"
                  className="fb-input"
                  rows={5}
                  placeholder={
                    kind === "FEATURE"
                      ? "Descreve a funcionalidade e como te ajudaria..."
                      : "O que aconteceu? Em que página? Que dispositivo usavas?"
                  }
                  value={newFeedback.description}
                  onChange={handleInputChange}
                  required
                  name="description"
                />
              </div>

              <button className="fb-submit" type="submit">
                <i className="bi bi-send" /> Enviar
              </button>

              {submitted && (
                <div className="fb-success" role="status">
                  <i className="bi bi-check-circle" /> Recebido! Obrigado pela
                  contribuição.
                </div>
              )}
            </div>
          </form>

          {/* ── Right: list ── */}
          {/* <div className="fb-list-col">
          <div className="fb-tabs">
            {(
              [
                ["ALL", "Todos"],
                ["FEATURE", "Funcionalidades"],
                ["PROBLEM", "Problemas"],
              ] as [FilterTab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                className={`fb-tab ${filter === key ? "active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label} <span className="fb-tab-count">{counts[key]}</span>
              </button>
            ))}
          </div> */}

          <div className="fb-list">
            {items.map((item) => (
              <article className="fb-card" key={item.id}>
                <button
                // className={`fb-vote ${item.vote ? "voted" : ""}`}
                // onClick={() => toggleVote(item.id)}
                // aria-pressed={item.voted}
                // title={item.voted ? "Remover voto" : "Votar"}
                >
                  <i className="bi bi-caret-up-fill" />
                  <span>{item.votes}</span>
                </button>

                <div className="fb-card-body">
                  <div className="fb-card-top">
                    <span className={`fb-kind-badge `}>
                      <i className={`bi "bi-bug" `} />
                      {item.status}
                    </span>
                    <span
                      className={`fb-status fb-status--${item.status.toLowerCase()}`}
                    >
                      {/* {STATUS_LABEL[item.status]} */}
                    </span>
                  </div>

                  <h3 className="fb-card-title">{item.title}</h3>
                  <p className="fb-card-desc">{item.description}</p>

                  <div className="fb-card-meta">
                    <span className="fb-meta-item">
                      {item.feedbackType.replaceAll("_", " ")}
                    </span>
                    <span className="fb-meta-item">{item.name}</span>
                    <span className="fb-meta-item">
                      {formatDateTime(item.createdAt)}
                    </span>
                    {/* <span className="fb-meta-item">
                      <i className="bi bi-chat" /> {item.comments}
                    </span> */}
                  </div>
                </div>
              </article>
            ))}

            {items.length === 0 && (
              <div className="fb-empty">
                <i className="bi bi-inbox" />
                <p>Ainda não há submissões nesta categoria. Sê o primeiro!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showMFA && (
        <MFAComponent
          email={newFeedback.email}
          onVerify={(code) => postFeedback(code)}
          onClose={() => setShowMFA(false)}
        />
      )}
    </>
  );
}

export default FeedbackPage;
