// ==UserScript==
// @name          ReTok
// @namespace     http://tampermonkey.net/
// @version       2025-01-19
// @description   Unblock TikTok in the US
// @author        zeusssz
// @match         https://www.tiktok.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant         GM_cookie
// ==/UserScript==
(function() {
    'use strict';
    const possibleCountries = ['au', 'ie', 'gb', 'ca'];
    let selectedCountry = 'au';
    const showModal = () => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 25px;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            min-width: 300px;
        `;
        
        modal.innerHTML = `
            <style>
                .modal-select {
                    width: 100%;
                    padding: 8px;
                    margin: 15px 0;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    background: #f8f8f8;
                }
                .modal-button {
                    background: #fe2c55;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    width: 100%;
                    transition: background 0.2s;
                }
                .modal-button:hover {
                    background: #e11d48;
                }
                .modal-title {
                    margin: 0;
                    font-size: 18px;
                    color: #333;
                    font-weight: bold;
                }
            </style>
            <h3 class="modal-title">Select Region</h3>
            <select id="country-select" class="modal-select">
                ${possibleCountries.map(country => `<option value="${country}">${country.toUpperCase()}</option>`).join('')}
            </select>
            <button id="confirm-country" class="modal-button">Apply</button>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        const closeModal = () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
            fixCookie();
        };

        document.getElementById('confirm-country').onclick = () => {
            selectedCountry = document.getElementById('country-select').value;
            closeModal();
        };
        overlay.onclick = closeModal;
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        }, { once: true });
    };
    
    const fixCookie = () => {
        GM_cookie.list({ url: 'https://www.tiktok.com/', name: 'store-country-code' }, (cookies, error) => {
            if (error) return;
            if (cookies.length > 0) {
                const cookie = cookies[0];
                if (cookie.value === 'us') {
                    cookie.value = selectedCountry;
                    GM_cookie.set(cookie);
                }
                if (window.location.pathname === '/us-landing') {
                    window.location.pathname = '/';
                }
            }
        });
    };
    
    if (typeof GM_cookie !== 'undefined') {
        showModal();
        setInterval(fixCookie, 1000);
    } else {
        alert('GM_cookie API is not available.');
    }
})();
