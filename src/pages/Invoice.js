import React, { useEffect , useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";
import {useLocation, useNavigate} from 'react-router-dom';
import "react-tooltip/dist/react-tooltip.css";

import {months} from '../utility/helper';
import '../App.css';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { getLocalStorage, setLocalStorageCurTap, getPortugeDate, getPortugeDigit,getPortugeMonthFromCycle,getYearFromCycle } from '../utility/helper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InvBtn from '../components/InvBtn';
import { Container, Row, Col, Card, Tooltip } from 'react-bootstrap';

import pix from '../assets/pix.png';
import boleto from '../assets/boleto.png';
import fatura from '../assets/fatura.png';

const keys = ['01/2023', '02/2023', '03/2023', '04/2023', '05/2023', '06/2023', '07/2023', '08/2023', '09/2023', '10/2023', '11/2023', '12/2023'];

let curTap = 0, curMonth = 0;
let invInfoArr = [], cycle = [];

const Invoice = () => {
    const [swiperRef, setSwiperRef] = useState(null);
    const [curMonthInvoice, setCurMonthInvoice] = useState([]);

    const navigate = useNavigate();
    let InfoArr = [], cycleArr;

    useEffect(() => {
        const {state} = getLocalStorage();console.log(getLocalStorage());
        if(state) {
            const invInfo = state;
            
            InfoArr = [];
            cycleArr = [];
            //////// configure invoice data ///////
            if(invInfo != null) {
                invInfo.map(item => {
                    if(InfoArr[item.cycle] == null) {
                        InfoArr[item.cycle] = [];
                        cycleArr.push(item.cycle);
                    }

                    InfoArr[item.cycle].push(item);

                    
                })
                
                invInfoArr = InfoArr;
                cycle = cycleArr.sort();
                
                // find unpaid first month
                let f_month = 0, f_res = false;
                cycle.map((cItems, key) => {
                    if(f_res == false) {
                        InfoArr[cItems].map(item => {
                            if(item.status === 'OPEN') {
                                f_month = key;
                                f_res = true;
                            }
                        })
                    }
                })

                const {tap} = getLocalStorage();
                if(tap)
                    curTap = tap;
                else
                    curTap = f_month;
                curMonth = months[curTap];
                setCurMonthInvoice(InfoArr[cycle[curTap]]);
            }
        }
        else{
            navigate('/');
        }
    },[]);
    
    function processClick(index) {
        curTap = index;

        var tmp = {};
        tmp = invInfoArr[cycle[index]];
        setLocalStorageCurTap(curTap);
        setCurMonthInvoice(tmp);
        curMonth = months[index];
    }
    const handleClick = (swiper) => {
        if(swiper.clickedIndex != undefined) {
            processClick(swiper.clickedIndex);
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
    function getMonthInvoiceText(info) {
        const on = invInfoArr[info].filter(inv => inv.status === 'OPEN').length;
        const off = invInfoArr[info].filter(inv => inv.status === 'PAID').length;
        const all = invInfoArr[info].length;

        if(all <= on)
            return 'Pendente';
        if(off == 0)
            return 'Pago';
        return 'Pago';
    }
    function getOnOff(iInfo) {

        if(iInfo.status === 'OPEN')
            return 'dot-on mb-auto';
        return 'dot-off mb-auto';
    }

    return (
        <>
            <Header/>
            <Container>
                <Row className='center-text'>
                    <Col xs="1">

                    </Col>
                    <Col xs="10" className='mt-50'>
                        <p className='inv-lg-text'>Fatura <b>Fale</b></p>
                    </Col>
                </Row>
                <Row>
                    <Col md="3">
                    </Col>
                    <Col md="auto">
                        {/* {
                            curMonthInvoice ? curMonthInvoice.map((inv, index) => {
                                if(inv.status === 'OPEN')
                                    return <p className='inv-cont-text mt-1' key={index}><span className="dot-on"></span> Contrato: R$ {getPortugeDigit(inv.amount)}</p>
                                else
                                    return <p className='inv-cont-text mt-1' key={index}><span className="dot-off"></span> Contrato: R$ {getPortugeDigit(inv.amount)}</p>
                            }):(<></>)
                        } */}
                        <p className='inv-cont-text pt-2 mt-3 center-text'><b>Selecione o mês da fatura desejada</b></p>
                    </Col>
                </Row>
                <Row className='pb-3 pt-1'>
                    <Swiper
                        onSwiper={setSwiperRef}
                        slidesPerView={5}
                        centeredSlides={true}
                        spaceBetween={0}
                        oneWayMovement={false}
                        navigation={true}
                        modules={[Navigation]}
                        onClick={handleClick}
                        onInit={(sw) => sw.slideTo(curTap)}
                        onUpdate={(sw) => sw.slideTo(curTap)}
                        onSlideChangeTransitionEnd={(swiper) => {
                            curTap = swiper.activeIndex;
                            processClick(swiper.activeIndex);
                          }}
                        breakpoints={{
                            0: {
                              slidesPerView: 1,
                            },
                            640: {
                              slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 5,
                            }
                          }}
                        className="mySwiper, pt-3 pb-3"
                    >
                        {
                            cycle? cycle.map((item, key) => {
                                return <SwiperSlide className={`text-center ${curTap==key ? "swiper-bold" : "swiper-normal"}`} key={key}>
                                <p className='inv-cont-text mt-1'> {getPortugeMonthFromCycle(item)} {getYearFromCycle(item)}</p>
                                <p className='inv-cont-text'><span className={getMonthClassOnOff(item)}></span> {getMonthInvoiceText(item)}</p>
                            </SwiperSlide>
                            }) :(<></>)
                        }
                    </Swiper>
                </Row>
                <Row className='pb-5' style={{cursor: 'default'}}>
                <Card className='inv-rect'>
                {
                    curMonthInvoice ? curMonthInvoice.map((item, key) => {
                        return <Card.Body className='inv-card mt-3' key={key} >
                                    <Row>
                                        <Col md="4" className='center-text'>
                                            <p className='inv-med-text mb-auto'>Fatura - {curMonth} 2023</p>
                                            <p style={{margin:'0px 0px 0px 0px'}}> Contrato: {item.contract}</p>
                                            <p className='inv-lg-text mb-auto'>R$ {getPortugeDigit(item.amount)}</p>
                                            <p className='mb-0'><span className={getOnOff(item)}></span> Fatura {item.status === 'OPEN' ? ' em aberto' : ' paga'}</p>
                                            <p className='inv-cont-text inv-grey-color mb-auto'>Venceu dia {getPortugeDate(item.date_due)}</p>
                                        </Col>
                                        <Col md="8">
                                            <Row>
                                                <Col md="4" style={item.status === 'PAID' ? {display:'none'} : {display: 'block'}}>
                                                    <InvBtn icon={pix} text="PAGAR &#10;COM PIX" type={1} data={item}/>
                                                </Col>
                                                <Col md="4" style={item.status === 'PAID' ? {display:'none'} : {display: 'block'}}>
                                                    <InvBtn icon={boleto} text="PAGAR &#10;COM BOLETO" type={2} data={item}/>
                                                </Col>
                                                <Col md="4">
                                                    <InvBtn icon={fatura} text="VISUALIZAR&#10; 2ª VIA DA&#10; FATURA" type={3} data={item}/>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            
                    }) : (<></>)
                }
                </Card>
                </Row>
            </Container>
            <Footer/>
        </>
    )
}

export default Invoice