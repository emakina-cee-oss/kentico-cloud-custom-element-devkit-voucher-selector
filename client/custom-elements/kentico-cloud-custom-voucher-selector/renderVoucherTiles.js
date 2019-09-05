export function renderVoucherTiles(vouchers, pickedVouchers) {
  let html = '';
  let tabs = '';
  let content = '';

  for (let key in vouchers) {
    let keyTiles = '';
    tabs += `<div class="tab-item" data-key=${key}>${key}</div>`;
    keyTiles += `<div class="tiles tile-grid" data-id=${key}>`;
    var obj = vouchers[key];
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].headline_text.value && obj[i].partner_id.value && obj[i].partner_promotion_id.value && obj[i].image_single.value[0]) {

        let button = '<button class="js-add-voucher">Add Voucher</button>';
        if (pickedVouchers.includes(obj[i].system.id)) {
          button = '<button class="js-remove-voucher">Remove Voucher</button>'
        }

        const json = JSON.stringify(obj[i])
        const tile = `<div class="voucher" id="${obj[i].system.id}">
                        <div class="voucher-inner">
                          <div class="voucher-img"><img src="${obj[i].image_single.value[0].url}"/></div>
                          <h3 class="voucher-title">${obj[i].headline_text.value}</h3>
                          <p class="voucher-partner"><strong>partner id:</strong> ${obj[i].partner_id.value} </p>
                          <p class="voucher-promotion"><strong>promotion id:</strong> ${obj[i].partner_promotion_id.value} </p>
                          <p class="voucher-expiration"><strong>voucher expiration:</strong> ${obj[i].end_date.value} </p>
                          <div class="json-data">${json}</div>
                          <div class="button-container">${button}</div>
                        </div>
                      </div>`
        keyTiles += tile;
      }
    }

    keyTiles += '</div>';

    content += keyTiles;
  }

  if (tabs.length > 0) {
    html += `<div class="tabs">${tabs}</div> <div class="voucher-list">${content}</div>`
  }

  return html;
}
