import React from "react"

interface ConfirmaExclusaoProps {
    onClose: () => void
    onConfirm: () => void
}

const ConfirmaExclusao: React.FC<ConfirmaExclusaoProps> = ({ onClose, onConfirm }) => {
    const confirma = (e: React.FormEvent) => {
        e.preventDefault()

        onConfirm()
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Tem certeza que deseja excluir o item?</h3>

                <div className="botoes">
                    <button className="cancelar" onClick={onClose}>Cancelar</button>
                    <button className="confirmar" onClick={confirma}>Confirmar</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmaExclusao