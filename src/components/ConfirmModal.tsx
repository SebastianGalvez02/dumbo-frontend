import { Icon } from "./Icon";

interface ConfirmModalProps {
  detalle: string;
  procesando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmModal({ detalle, procesando = false, onConfirmar, onCancelar }: ConfirmModalProps) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="titulo-confirmacion">
      <div className="confirm-modal">
        <button
          type="button"
          className="icon-btn modal-close"
          onClick={onCancelar}
          disabled={procesando}
          aria-label="Cerrar"
        >
          <Icon name="close" />
        </button>
        <div className="confirm-icon">
          <Icon name="shield" size={27} />
        </div>
        <p className="eyebrow">Confirmación requerida</p>
        <h2 id="titulo-confirmacion">¿Está seguro?</h2>
        <p>{detalle}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={procesando}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirmar} disabled={procesando}>
            {procesando ? "Procesando..." : "Sí"}
          </button>
        </div>
      </div>
    </div>
  );
}
