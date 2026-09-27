function initContactForm(root = document) {
  const form = root.querySelector('[data-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const requiredFields = [...form.querySelectorAll('[required]')];
    requiredFields.forEach((field) => {
      field.classList.toggle('is-invalid', !field.checkValidity());
    });

    const firstInvalid = requiredFields.find((field) => !field.checkValidity());
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Company: ${data.get('company') || 'Not specified'}`,
      `Services: ${data.getAll('service').join(', ') || 'Not specified'}`,
      '',
      String(data.get('message')),
    ].join('\n');

    form.classList.add('is-success');
    const subject = encodeURIComponent(`Project enquiry from ${data.get('name')}`);
    window.location.href = `mailto:hello@wellbalance.io?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => {
      form.reset();
      form.classList.remove('is-success');
    }, 4200);
  });

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
  });
}

window.WellBalance.register('initContactForm', initContactForm);
