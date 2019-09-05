import { getAllData } from './deliveryClient';
import { renderVoucherTiles } from './renderVoucherTiles';
import { renderVoucherPreview } from './renderVoucherPreview';

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-item');
  const tileContainers = document.querySelectorAll('.tiles');

  for (const tab of tabs) {
    tab.addEventListener('click', (event) => {
      document.querySelector('.tiles.selected').classList.remove('selected')
      document.querySelector(`.tiles[data-id="${tab.getAttribute('data-key')}"]`).classList.add('selected')
      document.querySelector('.tab-item.selected').classList.remove('selected')
      document.querySelector(`.tab-item[data-key="${tab.getAttribute('data-key')}"]`).classList.add('selected')
    });
  }
}

function voucherPreview() {
  const previewContainer = document.querySelector('.voucher-preview');
  const html = renderVoucherPreview(window.voucherJSON);

  previewContainer.innerHTML = html;
}

function addToJSON(data) {
  const vouchers = window.voucherJSON;
  const voucher = JSON.parse(data);

  if (vouchers.length < 1) {
    const arr = [];
    arr.push(voucher)
    window.voucherJSON = arr;
    CustomElement.setValue(JSON.stringify(window.voucherJSON));
  } else {
    vouchers.push(voucher);
    window.voucherJSON = vouchers;
    CustomElement.setValue(JSON.stringify(window.voucherJSON));
  }

  voucherPreview();
}

function removeFromJSON(data) {
  const vouchers = window.voucherJSON;
  const voucher = JSON.parse(data);
  let arr = [];

  for (let i = 0; i < vouchers.length; i++) {
    if(vouchers[i].system.id === voucher.system.id) {
      vouchers.splice(i, 1);
      window.voucherJSON = vouchers;
      CustomElement.setValue(JSON.stringify(window.voucherJSON));
      voucherPreview();
    }
  }
}

function addVoucherEventListener(event, btn) {

  event.preventDefault();
  const parent = btn.closest('.voucher-inner');
  addToJSON(parent.querySelector('.json-data').innerText);

  btn.remove();

  const removeButton = document.createElement("button");
  removeButton.innerHTML = "Remove Voucher";
  removeButton.className = "js-remove-voucher";
  parent.querySelector('.button-container').appendChild(removeButton);

  removeButton.addEventListener('click', (event) => {
    removeVoucherEventListener(event, removeButton)
  });
}

function removeVoucherEventListener(event, btn) {
  event.preventDefault();
  const parent = btn.closest('.voucher-inner');
  removeFromJSON(parent.querySelector('.json-data').innerText);

  btn.remove();
  const addButton = document.createElement("button");
  addButton.innerHTML = "Add Voucher";
  addButton.className = "js-add-voucher";
  parent.querySelector('.button-container').appendChild(addButton);

  addButton.addEventListener('click', (event) => {
    addVoucherEventListener(event, addButton)
  });
}

function addVoucherClick() {
  const buttons = document.querySelectorAll('.js-add-voucher');
  for (const btn of buttons) {
    btn.addEventListener('click', (event) => {
      addVoucherEventListener(event, btn);
    });
  }
}

function removeVoucherClick() {
  const buttons = document.querySelectorAll('.js-remove-voucher');
  for (const btn of buttons) {
    btn.addEventListener('click', (event) => {
      removeVoucherEventListener(event, btn)
    });
  }
}

function setupVoucherPicker(vouchers, jsonData) {
  const pickedVouchers = [];
  const parsed = JSON.parse(jsonData)
  if (parsed !== null) {
    for (let i = 0; i < parsed.length; i++) {
      pickedVouchers.push(parsed[i].system.id);
    }
  }

  const html = renderVoucherTiles(vouchers, pickedVouchers);

  document.querySelector('.drawer').innerHTML = html;
  document.querySelectorAll('.tiles')[0].classList.add('selected')
  document.querySelector(`[data-key="${document.querySelectorAll('.tiles')[0].getAttribute('data-id')}"]`).classList.add('selected')
  document.querySelector('.pending').remove();

  setupTabs();
  addVoucherClick();
  removeVoucherClick();
  voucherPreview();
}

function initJSONData(data) {
  const arr = [];
  window.voucherJSON = (data === null) ? arr : JSON.parse(data);
}

function updateSize() {
  // Update the custom element height in the Kentico UI.
  const height = Math.ceil($("html").height());
  CustomElement.setHeight(height);
}

function initCustomElement() {
  try {

    CustomElement.init((element, _context) => {
      let pending = true;
      let vouchers = null;

      initJSONData(element.value);
      getAllData(element.config).then((result) => {
        vouchers = result;
        pending = false;

        setupVoucherPicker(vouchers, element.value);
        updateSize();
      })
    });
  }
  catch (err) {
    // Initialization with Kentico Custom element API failed (page displayed outside of the Kentico UI)
    console.error(err);
  }
}

initCustomElement();
