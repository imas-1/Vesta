import { useNavigate } from 'react-router-dom'

export default function AddNew() {
  const navigate = useNavigate()

  return (
    <div className="vesta-screen">
      <h1 className="display" style={{ fontSize: 28 }}>Adauga</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn btn-secondary btn-block" onClick={() => navigate('/garderoba', { state: { openAdd: true } })}>
          Adauga o haina
        </button>
        <button className="btn btn-secondary btn-block" onClick={() => navigate('/outfits', { state: { openAdd: true } })}>
          Creeaza o tinuta
        </button>
        <button className="btn btn-text" onClick={() => navigate(-1)}>Inapoi</button>
      </div>
    </div>
  )
}
