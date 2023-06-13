import React, { useEffect , useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";
import {useLocation, useNavigate} from 'react-router-dom';

import {months} from '../utility/helper';
import '../App.css';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { getLocalStorage, setLocalStorageInvoice, getPortugeDate, getPortugeDigit,getPortugeMonthFromCycle,getYearFromCycle } from '../utility/helper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InvBtn from '../components/InvBtn';
import { Container, Row, Col, Card } from 'react-bootstrap';

import pix from '../assets/pix.png';
import boleto from '../assets/boleto.png';
import fatura from '../assets/fatura.png';

const keys = ['01/2023', '02/2023', '03/2023', '04/2023', '05/2023', '06/2023', '07/2023', '08/2023', '09/2023', '10/2023', '11/2023', '12/2023'];

const Invoice = () => {
    const [swiperRef, setSwiperRef] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [curTap, setCurTap] = useState({});
    const [curMonthInvoice, setCurMonthInvoice] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [curMonth, setCurMonth] = useState('');
    const [invInfoArr, setInvInfoArr] = useState([]);
    const [cycle, setCycle] = useState([]);
    //const [state, setState] = useState(useLocation());
    const {state} = useLocation();

    const navigate = useNavigate();
    let InfoArr = [], cycleArr;


    useEffect(() => {
        if(state && getLocalStorage().CNF) {
            const {invInfo} = state;
            setInvoiceData(invInfo);

            InfoArr = [];
            cycleArr = [];
            //////// configure invoice data ///////
            if(invoiceData != null) {
                invoiceData.map(item => {
                    if(InfoArr[item.cycle] == null) {
                        InfoArr[item.cycle] = [];
                        cycleArr.push(item.cycle);
                    }

                    InfoArr[item.cycle].push(item);
                })
                
                setInvInfoArr(InfoArr);
                setCycle(cycleArr.sort());
            }
        }
        else
            navigate('/');        

    },[invoiceData]);
    
    const handleClick = (swiper) => {
        if(swiper.clickedIndex != undefined) {
            setCurTap(swiper.clickedIndex);
            var tmp = {}, seldata = null;
            tmp = invInfoArr[cycle[swiper.clickedIndex]];
            setCurMonthInvoice(tmp);

            if(tmp != null)
            tmp.map(item => {
                if(item.status === "OPEN")
                    seldata = item;
            });
            if(seldata)
                setLocalStorageInvoice(seldata.invoice);

            
            setCurMonth(months[swiper.clickedIndex]);
            setSelectedInvoice(seldata);
        }
    }
    function getMonthClassOnOff(info) {
        const on = invInfoArr[info].filter(inv => inv.status === 'OPEN').length;
        const off = invInfoArr[info].filter(inv => inv.status === 'PAID').length;
        const all = invInfoArr[info].length;

        if(all <= on)
            return 'dot-on';
        if(off == 0)
            return 'dot-disable';
        return 'dot-off';
    }

    if((state !== null) && (getLocalStorage().CNF)) 
    return (
        <>
            <Header/>
            <Container>
                <Row>
                    <Col xs="1">

                    </Col>
                    <Col xs="auto" className='mt-50'>
                        <p className='inv-lg-text'>Fatura <b>Fale</b></p>
                    </Col>
                </Row>
                <Row>
                    <Col md="3">
                    </Col>
                    <Col md="auto">
                        {
                            curMonthInvoice ? curMonthInvoice.map((inv, index) => {
                                if(inv.status === 'OPEN')
                                    return <p className='inv-cont-text mt-1' key={index}><span className="dot-on"></span> Contrato: {inv.contract}</p>
                                else
                                    return <p className='inv-cont-text mt-1' key={index}><span className="dot-off"></span> Contrato: {inv.contract}</p>
                            }):(<></>)
                        }
                        <p className='inv-cont-text pt-2 mt-3'><b>Selecione o mês da fatura desejada</b></p>
                    </Col>
                </Row>
                <Row>
                    <Swiper
                        onSwiper={setSwiperRef}
                        slidesPerView={5}
                        centeredSlides={true}
                        spaceBetween={0}
                        oneWayMovement={false}
                        navigation={true}
                        modules={[Navigation]}
                        onClick={handleClick}
                        className="mySwiper, pt-3"
                    >
                        {
                            cycle? cycle.map((item, key) => {
                                return <SwiperSlide className={`text-center ${curTap===0 ? "swiper-bold" : "swiper-normal"}`} key={key}>
                                <p className='inv-cont-text mt-1'> {getPortugeMonthFromCycle(item)} {getYearFromCycle(item)}</p>
                                <p className='inv-cont-text'><span className={getMonthClassOnOff(item)}></span> Pago</p>
                            </SwiperSlide>
                            }) :(<></>)
                        }
                    </Swiper>
                </Row>
                {
                    selectedInvoice ? (
                        <Row className='pt-5 pb-5'>
                            <Card className='inv-rect'>
                                <Card.Body className='inv-card'>
                                    <Row>
                                        <Col md="4">
                                            <p className='inv-med-text mb-auto'>Fatura - {curMonth} 2023</p>
                                            <p className='inv-lg-text mb-auto'>R$ {getPortugeDigit(selectedInvoice.amount)}</p>
                                            <p><span className='dot-disable mb-auto'></span> Fatura em aberto</p>
                                            <p className='inv-cont-text inv-grey-color mb-auto'>Venceu dia {getPortugeDate(selectedInvoice.date_due)}</p>
                                        </Col>
                                        <Col md="8">
                                            <Row>
                                                <Col md="4">
                                                    <InvBtn icon={pix} text="PAGAR &#10;COM PIX" type={1} data={selectedInvoice}/>
                                                </Col>
                                                <Col md="4" >
                                                    <InvBtn icon={boleto} text="PAGAR &#10;COM BOLETO" type={2} data={selectedInvoice}/>
                                                </Col>
                                                <Col md="4">
                                                    <InvBtn icon={fatura} text="VISUALIZAR&#10; 2ª VIA DA&#10; FATURA" type={3}/>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Row>
                    ) : (
                        <>
                            <Row className='pt-5 pb-5'>
                                <Card className='inv-rect'>
                                    <Card.Body className='inv-card'>
                                        <p className='inv-nodata'>Não há dados da fatura.</p>
                                    </Card.Body>
                                </Card>
                            </Row>
                        </>
                    )
                }
                
            </Container>
            <Footer/>
        </>
    )
}

export default Invoice