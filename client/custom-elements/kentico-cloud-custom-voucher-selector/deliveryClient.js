import { Observable, of, bindCallback } from 'rxjs';
import { DeliveryClient } from 'kentico-cloud-delivery';
import moment from 'moment-timezone';

function checkValidity(date) {
  const voucherDate = moment(date, 'DD.MM.YYYY').toDate();
  moment.tz(voucherDate, 'Europe/Vienna');
  const now = new Date(moment.tz('Europe/Vienna'));

  return (voucherDate > now);
}

async function getData(client, types) {
  const deliveryClient = new DeliveryClient(client);
  // Define KC query
  const data = await deliveryClient.items().types(types)
    .getPromise();

  if (data.items.length > 0) {
    return data.items;
  } else {
    return null;
  }
}

function filterVouchers(data) {
  const array = {}

  if (data) {
    for (let i = 0; i < data.length; i++) {
      const valid = checkValidity(data[i].end_date.value);

      if (!valid) continue;

      if (data[i].partner_id.value !== '0' && data[i].partner_id.value !== undefined) {
        if (!(data[i].partner_id.value in array)) {
          array[data[i].partner_id.value] = [];
        }

        array[data[i].partner_id.value].push(data[i])
      }
    }
  }

  return array;
}


export function getAllData(config) {
  const adegProject = {
    projectId: config.adegProjectID,
    enableSecuredMode: true,
    securedApiKey: config.adegAPIKey,
  };

  const bawagProject = {
    projectId: config.bawagProjectID,
    enableSecuredMode: true,
    securedApiKey: config.bawagAPIKey,
  };

  const billaProject = {
    projectId: config.billaProjectID,
    enableSecuredMode: true,
    securedApiKey: config.billaAPIKey,
  };

  const bipaProject = {
    projectId: config.bipaProjectID,
    enableSecuredMode: true,
    securedApiKey: config.bipaAPIKey,
  };

  const interioProject = {
    projectId: config.interioProjectID,
    enableSecuredMode: true,
    securedApiKey: config.interioAPIKey,
  };

  const itsBillaProject = {
    projectId: config.itsBillaProjectID,
    enableSecuredMode: true,
    securedApiKey: config.itsBillaAPIKey,
  };

  const libroProject = {
    projectId: config.libroProjectID,
    enableSecuredMode: true,
    securedApiKey: config.libroAPIKey,
  };

  const merkurProject = {
    projectId: config.merkurProjectID,
    enableSecuredMode: true,
    securedApiKey: config.merkurAPIKey,
  };

  const omvProject = {
    projectId: config.omvProjectID,
    enableSecuredMode: true,
    securedApiKey: config.omvAPIKey,
  };

  const pagroProject = {
    projectId: config.pagroProjectID,
    enableSecuredMode: true,
    securedApiKey: config.pagroAPIKey,
  };

  const pennyProject = {
    projectId: config.pennyProjectID,
    enableSecuredMode: true,
    securedApiKey: config.pennyAPIKey,
  };

  const zgoncProject = {
    projectId: config.zgoncProjectID,
    enableSecuredMode: true,
    securedApiKey: config.zgoncAPIKey,
  };

  return (async () => {
    const results = await Promise.all([
      getData(adegProject, ['voucher']),
      getData(bawagProject, ['voucher']),
      getData(billaProject, ['voucher']),
      getData(bipaProject, ['voucher']),
      getData(interioProject, ['voucher']),
      getData(itsBillaProject, ['voucher']),
      getData(libroProject, ['voucher']),
      getData(merkurProject, ['voucher']),
      getData(omvProject, ['voucher']),
      getData(pagroProject, ['voucher']),
      getData(pennyProject, ['voucher']),
      getData(zgoncProject, ['voucher'])
    ])

    const obj = {};

    let array = results.flat();
    const vouchers = filterVouchers(array)
    console.log(vouchers)
    return vouchers;
  })();
}
