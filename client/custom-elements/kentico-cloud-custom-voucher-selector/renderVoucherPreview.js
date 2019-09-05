export function renderVoucherPreview(obj) {
  const arr = [];

  let tiles = '';
  let html = '';

  for (let i = 0; i < obj.length; i++) {
    const json = JSON.stringify(obj[i]);

    let button = '<button class="js-remove-voucher">Remove Voucher</button>';

    const tile = `<div class="voucher">
                    <div class="voucher-inner">
                      <div class="voucher-img"><img src="${obj[i].image_single.value[0].url}"/></div>
                      <h3 class="voucher-title">${obj[i].headline_text.value}</h3>
                      <p class="voucher-partner"><strong>partner id:</strong> ${obj[i].partner_id.value} </p>
                      <p class="voucher-promotion"><strong>promotion id:</strong> ${obj[i].partner_promotion_id.value} </p>
                      <p class="voucher-expiration"><strong>voucher expiration:</strong> ${obj[i].end_date.value} </p>
                      <div class="json-data">${json}</div>
                    </div>
                  </div>`
    tiles += tile;
  }

  html = `<div class="tile-grid">${tiles}</div>`;

  return html;
}
