interface Props {
  companyName: string;
  onBack:      () => void;
}

const styles: Record<string, React.CSSProperties> ={
  overviewHeader: {
    width: "100vh",
    marginBottom: -75
  },
}

function CompanyHeader({ companyName, onBack }: Props) {
  return (
    <>
      <div style={styles.overviewHeader}>
        <div className="row">
          <div className="col-8">
              <div className="page-header">
                  <p className="page-eyebrow">Company Dashboard</p>
                  <h1 className="page-title">{companyName}</h1>
              </div>
            </div>
              <div className="col-3 me-2 d-flex justify-content-between align-items-center mb-3" >
                <button onClick={onBack} className="btn btn-primary mt-4" style={{fontSize:14}}>
                      <i className="bi bi-arrow-left" ></i> Back
                </button>
          </div>
          </div>
      </div> 
    </>
  );
}

export default CompanyHeader;
