import React from 'react'
import Barcode from 'react-barcode';
import QRCode from "react-qr-code";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {Image, Modal, Row, Col} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getPortugeMonthFromCycle, getYearFromCycle, getPortugeDate, setLocalStorageInvoice, getPortugeDigit, getDigit } from '../utility/helper';

import pix from '../assets/pix-1.png';
import '../App.css';


function PixModal(props) {
    const {data} = props;
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className='modal-body'>
          <p className='modal-title mb-4'><Image src={pix} style={{height:40}}/> Pague esta fatura com o QR Code PIX</p>
          <Row>
                <Col md="7">
                    <p className='mb-1'>
                        <span className='modal-text-2'>Fatura</span><span className='modal-text-2-bold'> Fale</span>
                        <span className='modal-text-2 ml-30'>Data:</span><span className='modal-text-2-bold'> {getPortugeMonthFromCycle(data.cycle)} {getYearFromCycle(data.cycle)}</span>
                    </p>
                    <p className='modal-text-2'>
                        contrato nº {data.contract}
                    </p>
                    <div className="vl"></div>
                </Col>
                <Col md="5">
                    <p className='mb-1 ml-80'>
                        <span className='modal-text-1'>R$ </span>
                        <span className='modal-text-1'>{getPortugeDigit(data.amount)}</span>
                    </p>
                    <p className='modal-text-3 ml-80'>
                        <span>Vence dia {getPortugeDate(data.date_due)}</span>
                    </p>
                </Col>
          </Row>
          <CopyToClipboard text={data.payment_emv} onCopy={() => toast.success('Código pix copiado')}>
            <Row className='modal-code-bk'>
                <Col lg="7">
                    <p className='modal-text-6'>Código do pix</p>
                    <p className='modal-text-6'>{data.payment_emv}</p>
                </Col>
                <Col lg="5" style={{paddingBottom:'20'}}>
                    <Row>
                        <Col xs="6">
                            <div style={{ height: "100px", margin: "5 auto", maxWidth: 120, width: "100%" }}>
                                <QRCode value={data.payment_emv}
                                size={256}
                                style={{ height: "120px", maxWidth: "120px", width: "100%" }}
                                viewBox={`0 0 256 256`}
                                />
                            </div>
                        </Col>
                        <Col xs="6">
                            <p className='modal-text-5'>
                                Para pagar,acesse seu banco,clique em Pagarcom Pix, aponte seu celular e leia o QR-CODE
                            </p>
                        </Col>
                    </Row>
                </Col>
            </Row>
          </CopyToClipboard>
          <Row className='mt-4'>
            <Col md="10">
                <p className='modal-text-5'>Copie o número do código de barras, acesse o seu banco, </p>
                <p className='modal-text-5'>selecione pagar boleto, cole o código e finalize o pagamento. </p>
            </Col>
            <Col md="2">
                <button className="modal-button" onClick={props.onHide}>FECHAR</button>
            </Col>
          </Row>
          
        </Modal.Body>
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
      </Modal>
    );
  }
  function BoletoModal(props) {
    const {data} = props;
    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className='modal-body'>
          <p className='modal-title mb-4' style={{height:40}}>Pague esta fatura com o código de barras do boleto bancário</p>
          <Row>
                <Col md="7">
                    <p className='mb-1'>
                        <span className='modal-text-2'>Fatura</span><span className='modal-text-2-bold'> Fale</span>
                        <span className='modal-text-2 ml-30'>Data:</span><span className='modal-text-2-bold'> {getPortugeMonthFromCycle(data.cycle)} {getYearFromCycle(data.cycle)}</span>
                    </p>
                    <p className='modal-text-2'>
                        contrato nº {data.contract}
                    </p>
                    <div className="vl"></div>
                </Col>
                <Col md="5">
                    <p className='mb-1 ml-80'>
                        <span className='modal-text-1'>R$ </span>
                        <span className='modal-text-1'>{getPortugeDigit(data.amount)}</span>
                    </p>
                    <p className='modal-text-3 ml-80'>
                        <span>Vence dia {getPortugeDate(data.date_due)}</span>
                    </p>
                </Col>
          </Row>
          <Row>
            <div className='modal-text-4 modal-code-bk'>
                <p style={{marginBottom:0}}>{data.payment_slipline}</p>
                <div className="barcode">
                    <Barcode value={data.payment_slipbarcode} width={2} format = {'ITF'} displayValue={false} height={80}/>
                </div>
            </div>
          </Row>
          <Row>
            <Col md="10">
                <p className='modal-text-5'>Copie o número do código de barras, acesse o seu banco, </p>
                <p className='modal-text-5'>selecione pagar boleto, cole o código e finalize o pagamento. </p>
            </Col>
            <Col md="2">
                <button className="modal-button" onClick={props.onHide}>FECHAR</button>
            </Col>
          </Row>
          
        </Modal.Body>
      </Modal>
    );
  }

const InvBtn = (props) => {
    const [pixModalShow, setPixModalShow] = React.useState(false);
    const [boletoModalShow, setBoletoModalShow] = React.useState(false);
    const navigate = useNavigate();
    const onDialog = (type) => {
        if(type == 1)
            setPixModalShow(true);
        if(type == 2)
            setBoletoModalShow(true);
        if(type == 3) {
            navigate("/token");
            setLocalStorageInvoice(props.data.invoice);
        }
            
    }
    if(props.data)
        return (
            <>
                <div className={((props.data.status === 'PAID') && (props.type != 3)) ? 'inv-btn disabledbutton' :'inv-btn'} onClick={() => onDialog(props.type)}>
                    <Image src={props.icon} className='inv-btn-icon'/>
                    <br/>
                    {props.text}
                </div>
                {
                    (props.type != 3 && props.data.status === 'OPEN') ? (
                        <>
                            <PixModal
                                show={pixModalShow}
                                data = {props.data}
                                onHide={() => setPixModalShow(false)}
                            />
                            <BoletoModal
                                show={boletoModalShow}
                                data = {props.data}
                                onHide={() => setBoletoModalShow(false)}
                            />
                        </>
                    ) : (<></>)
                }
                
            </>
            
        )
    else
        return (<></>)
}

export default InvBtn