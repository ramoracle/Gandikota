'use strict';
// Set only after the camping business confirms its booking number.
// International digits only, e.g. country code + number without a plus sign.
const BOOKING_WHATSAPP_NUMBER = '917036361361';
const photos = [
  ['photo-01.jpg', 'Camping tents beside the rocky gorge'],
  ['photo-02.jpg', 'Sunset over the campsite'],
  ['photo-03.jpg', 'Gandikota camping — host photo'],
  ['photo-04.jpg', 'Gandikota stay — host photo'],
  ['photo-05.jpg', 'Accommodation courtyard'],
  ['photo-06.jpg', 'Accommodation — host photo'],
  ['photo-07.jpg', 'Accommodation — host photo'],
  ['photo-08.jpg', 'Accommodation — host photo'],
  ['photo-09.jpg', 'Property exterior at night']
];
const gallery = document.getElementById('photoGallery');
const dialog = document.getElementById('photoDialog');
for (const [file, caption] of photos) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `View ${caption}`);
  const img = document.createElement('img');
  img.src = `images/${file}`; img.alt = caption; img.loading = 'lazy';
  button.append(img); gallery.append(button);
  button.addEventListener('click', () => {
    const large = document.getElementById('largePhoto');
    large.src = img.src; large.alt = caption;
    document.getElementById('photoCaption').textContent = caption;
    dialog.showModal();
  });
}
document.getElementById('closePhoto').addEventListener('click', () => dialog.close());
document.getElementById('year').textContent = new Date().getFullYear();
const arrival = document.getElementById('arrival');
const today = new Date();
arrival.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
const guests = document.getElementById('guests');
const stayType = document.getElementById('stayType');
function packageRate() { return stayType.value === 'AC room package' ? 2500 : 1200; }
stayType.addEventListener('change', estimate);
function estimate() {
  const count = Number(guests.value);
  document.getElementById('estimate').textContent = Number.isInteger(count) && count > 0 && count <= 100
    ? `Indicative package amount: ₹${(count*packageRate()).toLocaleString('en-IN')} · final quote to be confirmed` : '';
}
guests.addEventListener('input', estimate); estimate();
for (const link of document.querySelectorAll('.choose')) link.addEventListener('click', () => { document.getElementById('stayType').value = link.dataset.package; estimate(); });
if (/^[1-9]\d{7,14}$/.test(BOOKING_WHATSAPP_NUMBER)) {
  document.getElementById('bookingButton').textContent = 'Enquire on WhatsApp ↗';
  document.getElementById('contactNotice').textContent = 'Your details will be included in a WhatsApp draft. Review and press Send there. This is an enquiry, not a confirmed booking.';
}
const form = document.getElementById('bookingForm');
for (const id of ['guestName','guestPhone']) document.getElementById(id).addEventListener('input', function(){this.setCustomValidity('');});
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('guestName');
  const phone = document.getElementById('guestPhone');
  const cleanPhone = phone.value.trim().replace(/[\s()-]/g,'');
  name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
  phone.setCustomValidity(/^\+?[1-9]\d{7,14}$/.test(cleanPhone) ? '' : 'Include a valid country code and phone number.');
  if (!form.reportValidity()) return;
  const draft = ['GANDIKOTA CAMPING — BOOKING ENQUIRY','',`Name: ${name.value.trim()}`,`WhatsApp: ${cleanPhone}`,`Package: ${document.getElementById('stayType').value}`,`Check-in: ${arrival.value} at 4 PM`,`Check-out: following day at 11 AM`,`Guests aged 5+: ${guests.value}`,`Children below 5: ${document.getElementById('children').value}`,`Indicative package amount: INR ${Number(guests.value)*packageRate()}`,`Requests: ${document.getElementById('requests').value.trim() || 'None'}`,'','Please confirm availability, occupancy, total price, exact location, payment and cancellation terms.'].join('\n');
  if (/^[1-9]\d{7,14}$/.test(BOOKING_WHATSAPP_NUMBER)) {
    window.location.assign(`https://wa.me/${BOOKING_WHATSAPP_NUMBER}?text=${encodeURIComponent(draft)}`);
  } else {
    document.getElementById('enquiryText').value = draft;
    for (const id of ['enquiryText','draftLabel','copyButton']) document.getElementById(id).hidden = false;
    document.getElementById('formStatus').textContent = 'Draft prepared locally. Nothing has been sent. Booking contact is awaiting confirmation.';
  }
});
document.getElementById('copyButton').addEventListener('click', async () => {
  const draft = document.getElementById('enquiryText');
  try { await navigator.clipboard.writeText(draft.value); document.getElementById('formStatus').textContent = 'Enquiry copied. Share it privately with the confirmed host.'; }
  catch { draft.focus(); draft.select(); document.getElementById('formStatus').textContent = 'Select the draft and copy it manually.'; }
});

