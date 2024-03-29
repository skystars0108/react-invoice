import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

const PageNotFound = () => {
    return (
        <div className="row justify-content-center">
            <div className="col-md-12 col-sm-12">
                <div className="card shadow-lg border-0 rounded-lg mt-5 mx-auto" style={{width:'30rem'}}>
                    <h3 className="card-header display-1 text-muted text-center">
                        404
                    </h3>

                    <span className="card-subtitle mb-2 text-muted text-center">
                        A página não pôde ser encontrada
                    </span>

                    <div className="card-body mx-auto">
                        <a type="button" href="/"
                        className="btn btn-sm btn-info text-white"> Voltar para casa </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default PageNotFound;