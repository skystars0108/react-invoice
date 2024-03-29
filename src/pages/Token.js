import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Col, Container, Row, Button } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Circles } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

import { getLocalStorage, clearLocalStorage } from '../utility/helper';
import InputCode from '../components/InputCode'

const Token = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const iInfo = getLocalStorage();
    const [spinner, setSpinner] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const {state} = getLocalStorage();
        if(state) {
            setSpinner(true);
            axios.get('https://api.fale.net.br/customer/challenge', {
                params: {doc: iInfo.CNF}
            })
            .then(response => {
                if(response.status == 'sent')
                    setSpinner(false);
                setSpinner(false);
            })
            .catch(error => {
                setSpinner(true);
                toast.error('Ocorreu um erro');
            });
        }
        else {
            navigate('/');
        }
    },[])
    const handleSubmit = () => {
        // call api
        if(loading)
        {
            setSpinner(true);
            axios.get('https://api.fale.net.br/customer/challenge', {
                params: {doc: iInfo.CNF, token: code}
            })
            .then(response => {
                setSpinner(false);
                if(response.data.status === 'VALIDATED')
                {
                    //clearLocalStorage();
                    window.open(`https://api.fale.net.br/customer/invoice?doc=${iInfo.CNF}&invoice=${iInfo.invoice}&token=${code}`, "_blank")
                    navigate('/invoice');
                }
                else {
                    setCode('');
                    toast.error('Token não é validado.');
                }
            
            })
            .catch(error => {
                setSpinner(true);
                navigate("/PageNotFound");
            });
            
        }
        else
            toast.info('Por favor, insira.');
    }
    if((getLocalStorage().CNF) && (getLocalStorage().invoice))
    return (
        <>
            <Header/>
            <Container>
                <Row>
                    <Col md="2"></Col>
                    <Col md="8">
                        <div className='tk-text mtb-100'>
                            <p>Foi enviado um SMS para o celular (51) *****.4321 com um
                            código, digite aqui para visualizar sua fatura</p>
                        </div>
                        <div>
                            <Row>
                                <Col md="1">
                                </Col>
                                <Col md="10">
                                <InputCode
                                    length={6}
                                    onComplete={code => {
                                        setCode(code);
                                        setLoading(true);
                                    }}
                                />
                                </Col>
                                <Col md="1">
                                </Col>
                            </Row>
                        </div>
                        <div className='text-center'>
                            <Button type="submit-btn" className="submit-btn btn-circle mtb-100" onClick={handleSubmit}>ENTRAR</Button>
                        </div>
                    </Col>
                    
                    <Col md="2"></Col>
                </Row>
            </Container>
            <Footer/>
            <div className='centered'>
                <Circles
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={spinner}
                    />
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="light"
            />
        </>
    )
}

export default Token