const UserCanvas = ({ user, onChangePassword, onEditProfile, onLogout }) => {
  
    return (
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="userCanvas"
        aria-labelledby="userCanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="userCanvasLabel">
            Minha Conta
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="d-flex align-items-center mb-4">
            {user ? (
              <>
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="rounded-circle"
                />
                <div className="ms-3">
                  <h6 className="mb-0">{user.displayName || "Usuário"}</h6>
                  <small>{user.email}</small>
                </div>
              </>
            ) : (
              <div className="d-flex flex-column align-items-center w-100">
                <p>Usuário não autenticado</p>
              </div>
            )}
          </div>
          <hr />
          <div className="d-grid gap-2">
            <button className="btn btn-outline-primary" onClick={onChangePassword} disabled={!user}>
              Trocar Senha
            </button>
            <button className="btn btn-outline-secondary" onClick={onEditProfile} disabled={!user}>
              Editar Perfil
            </button>
            <button className="btn btn-outline-danger" onClick={onLogout} disabled={!user}>
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default UserCanvas;
  