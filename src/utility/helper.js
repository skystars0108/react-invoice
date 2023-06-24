import React from 'react'
export const months = ['janeiro', 'fevereiro', 'março', 'abril' ,'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export function getPortugeDate(date_due) {
    const date_array = date_due.split('/');
    return date_array[0] + ' de ' + months[parseInt(date_array[1]) - 1];
}

export function getPortugeMonthFromCycle(date) {
    const date_array = date.split('/');
    return months[parseInt(date_array[0]) - 1];
}
export function getYearFromCycle(date) {
    const date_array = date.split('/');
    return parseInt(date_array[1]);
}
export function getCurrentDate(separator=''){

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    
    return `${date} / ${months[month]} ${year}`;
}

export function getPortugeDigit(digit)
{
    let num = parseFloat(digit);
    let point = 0;
    if(num * 10 % 10) point = 1;
    if(num * 100 % 10) point = 2;

    let number = num.toLocaleString("pt-BR");
    if(point == 0) number = number + ",00";
    if(point == 1) number = number + "0";

    return number;
}

export function getDigit(value) {
    let c = '0123456789';
    function check(x) {
        return c.includes(x) ? true : false;
    }
    let matches = [...value].reduce((x, y) => check(y) ? x + y : x, '');
    return matches;
}
export function getLocalStorage()
{
    let storage = {};
    storage['CNF'] = localStorage.getItem('CNF');
    storage['invoice'] = localStorage.getItem('invoice');
    storage['state'] = JSON.parse(localStorage.getItem('state'));
    storage['tap'] = localStorage.getItem('tap');

    return storage;
}

export function setLocalStorageCNF(CNF)
{
    localStorage.setItem('CNF', CNF);
}

export function setLocalStorageInvoice(invoice)
{
    localStorage.setItem('invoice', invoice);
}
export function setLocalStorageState(state)
{
    localStorage.setItem('state', JSON.stringify(state));
}
export function setLocalStorageCurTap(tap)
{
    localStorage.setItem('tap', tap);
}
export function clearLocalStorageCurTap()
{
    localStorage.removeItem('tap');
}
export function clearLocalStorage()
{
    localStorage.removeItem('CNF');
    localStorage.removeItem('invoice');
    localStorage.removeItem('state');
    localStorage.removeItem('tap');
    localStorage.clear();
}
