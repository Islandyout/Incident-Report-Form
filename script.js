// ✅ Clone and preserve user input values
function getFilledFormHTML(form) {
  const clone = form.cloneNode(true);

  clone.querySelectorAll('input, textarea, select').forEach(el => {
    if (el.type === 'checkbox' || el.type === 'radio') {
      if (el.checked) {
        el.setAttribute('checked', '');
      } else {
        el.removeAttribute('checked');
      }
    } else {
      el.setAttribute('value', el.value);
      if (el.tagName.toLowerCase() === 'textarea') {
        el.innerHTML = el.value;
      }
    }
  });

  return clone.innerHTML;
}

// ✅ Print PDF Function
function printPDF() {
  const form = document.getElementById('incidentForm');
  const filledHTML = getFilledFormHTML(form);

  const printWindow = window.open('', '_blank');
  const content = `
    <html>
      <head>
        <title>Incident Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, h3 { margin-top: 20px; }
          input, textarea { border: none; background: none; padding: 0; width: 100%; }
          label { display: block; margin-top: 10px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Incident Report</h1>
        ${filledHTML}
        <script>
          window.onload = function () {
            window.print();
          }
        </script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(content);
  printWindow.document.close();
}

// ✅ Attach Print Event
document.getElementById('printPdfBtn').addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form submission
  printPDF();
});

// ✅ Handle Form Submission
document.getElementById('incidentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch('http://localhost:3000/submit', { // Updated to match backend
    method: 'POST',
    body: formData
  })
  .then(response => response.text()) // Use .text() since backend sends plain text
  .then(data => {
    alert(data); // Show server response
  })
  .catch(error => {
    alert('Error sending submission.');
  });
});

// Express and Nodemailer setup (server-side code)
// const express = require('express');
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const upload = multer();
// const app = express();

// app.post('/submit', upload.none(), (req, res) => {
//   // Set up nodemailer and send email with req.body data
//   // ...
//   res.json({ success: true });
// });

// app.listen(3000);
