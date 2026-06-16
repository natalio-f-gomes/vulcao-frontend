import { useEffect, useState } from "react";
import { AddWearableModel, WearableModel } from "../../../../api/interfaces";
import { CURRENCIES, WEARABLES_CATEGORY_LIST } from "../../../../api/categories";

interface Parameters{
    isOpen: boolean;
    onClose: () => void;
    onSave: (updated: WearableModel) => void;
    wearableToEdit: WearableModel,
    currentEntity: string,
    companyName: string
}

function EditWearableModal({isOpen, onClose, onSave, wearableToEdit, currentEntity, companyName}: Parameters){
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [wearable, setWearable] = useState<WearableModel>({
        name: "",
        brand: "",
        description: "",
        color: "",
        price: 0,
        material: "",
        size: "",
        offeringType: "WEARABLE",
        category: "OUTROS",
        stock: 0,
        currency: "CVE",
        companyId: "",
        creatorId: "",
        imagesMetadata: []
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setWearable((prev: AddWearableModel) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (wearableToEdit) {
            setWearable(wearableToEdit);
        }
    }, [wearableToEdit]);

    const handleWearableUpdate = () => {
        console.log("Wearable data to update: ", JSON.stringify(wearable));
        onSave(wearable);
    };

    // FIXED: This condition was wrong - removed currentEntity and companyName from the condition
    if (!isOpen || !wearableToEdit) return null;

    return (
        <div className="m-overlay open">
            <div className="m-box">
                <div className="m-head">
                    <span className="m-head-title">Editar {wearable.name}</span>
                    <button className="m-close" onClick={() => onClose()}>&times;</button>
                </div>
                
                <form id="productRegistrationForm">    
                    <div className="m-body">
                        {/* Informação Básica do Produto */}
                        <div className="m-row">
                            <div className="m-field">
                                <label className="m-label">Nome do Vestível *</label>
                                <input 
                                    className="m-input" 
                                    type="text" 
                                    placeholder="ex: Camiseta Esportiva" 
                                    name="name" 
                                    value={wearable.name} 
                                    onChange={handleInputChange} 
                                    required
                                />
                            </div>
                            <div className="m-field">
                                <label className="m-label">Categoria *</label>
                                <select 
                                    className="m-input" 
                                    name="category" 
                                    value={wearable.category} 
                                    onChange={handleInputChange} 
                                    required
                                >
                                    <option value="">Selecionar Categoria</option>
                                    {WEARABLES_CATEGORY_LIST.map((category: string) => {
                                        const label = category
                                            .replaceAll("_", " ")
                                            .toLowerCase()
                                            .split(' ')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ');
                                        return (
                                            <option key={category} value={category}>
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* Preço e Stock */}
                        <div className="m-row">
                            <div className="m-field">
                                <label className="m-label">Preço *</label>
                                <div style={{ display: "flex", gap: "5px" }}>
                                    <input 
                                        className="m-input" 
                                        type="number" 
                                        step="0.01" 
                                        value={wearable.price} 
                                        placeholder="0.00" 
                                        name="price" 
                                        onChange={handleInputChange} 
                                        required
                                    />
                                    <select 
                                        className="m-input" 
                                        name="currency" 
                                        value={wearable.currency} 
                                        style={{ width: "80px" }} 
                                        onChange={handleInputChange} 
                                        required
                                    >
                                        {CURRENCIES.map((currency: string) => {
                                            return (
                                                <option key={currency} value={currency}>
                                                    {currency}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="m-field">
                                <label className="m-label">Stock *</label>
                                <input 
                                    className="m-input" 
                                    type="number" 
                                    placeholder="ex: 100" 
                                    value={wearable.stock} 
                                    name="stock" 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Wearable Specific Fields */}
                        <div className="m-row">
                            <div className="m-field">
                                <label className="m-label">Marca *</label>
                                <input 
                                    className="m-input" 
                                    type="text" 
                                    placeholder="ex: Nike" 
                                    value={wearable.brand} 
                                    name="brand" 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="m-field">
                                <label className="m-label">Tamanho *</label>
                                <input 
                                    className="m-input" 
                                    type="text" 
                                    placeholder="ex: M, 42, L" 
                                    value={wearable.size} 
                                    name="size" 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="m-row">
                            <div className="m-field">
                                <label className="m-label">Cor *</label>
                                <input 
                                    className="m-input" 
                                    type="text" 
                                    placeholder="ex: Preto, Azul" 
                                    value={wearable.color} 
                                    name="color" 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="m-field">
                                <label className="m-label">Material *</label>
                                <input 
                                    className="m-input" 
                                    type="text" 
                                    placeholder="ex: Algodão, Poliéster" 
                                    value={wearable.material} 
                                    name="material" 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Descrição */}
                        <div className="m-field">
                            <label className="m-label">Descrição</label>
                            <textarea 
                                className="m-input" 
                                rows={4}
                                placeholder="Descreva as características do vestível..." 
                                name="description"
                                onChange={handleInputChange}
                                value={wearable.description}
                                style={{ resize: "none" }}
                            />
                        </div>

                        {/* Metadados (Indicadores visuais apenas leitura) */}
                        <div className="m-row" style={{ opacity: 0.7, fontSize: "0.8rem" }}>
                            <div className="m-field">
                                <label className="m-label">Adicionado por</label>
                                <input className="m-input" type="text" value={`@${currentEntity}`} readOnly disabled />
                            </div>
                            <div className="m-field">
                                <label className="m-label">Empresa</label>
                                <input className="m-input" type="text" value={companyName} readOnly disabled />
                            </div>
                        </div>

                        <div className="m-footer" style={{ marginTop: "20px" }}>
                            <button className="m-btn-cancel" type="button" onClick={() => onClose()}>Cancelar</button>
                            <button className="m-btn-save" type="button" onClick={handleWearableUpdate}>
                                <i className="bi bi-check2"></i> Atualizar Vestível
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditWearableModal;