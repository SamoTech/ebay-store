export const EBAY_CONFIG = {
  appId: '',
  trackingId: ''
};

export async function getEbayProducts(keyword) {
  const response = await fetch(
    `https://svcs.ebay.com/services/search/FindingService/v1?` +
    `OPERATION-NAME=findItemsByKeywords` +
    `&SERVICE-VERSION=1.13.0` +
    `&SECURITY-APPNAME=${EBAY_CONFIG.appId}` +
    `&RESPONSE-DATA-FORMAT=JSON` +
    `&REST-PAYLOAD&keywords=${keyword}` +
    `&paginationInput.entriesPerPage=12`
  );
  
  const data = await response.json();
  return data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
}
