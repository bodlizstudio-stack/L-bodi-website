const applicationForm = document.querySelector("#course-application-form");
const formStatus = document.querySelector("[data-form-status]");

if (applicationForm && formStatus) {
  applicationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(applicationForm);
    const name = formData.get("name");
    const course = formData.get("course");

    formStatus.textContent = `${name}, tvoja prijava za program ${course} je pripravljena. Za prave prijave obrazec poveži z e-pošto ali CRM sistemom.`;
    applicationForm.reset();
  });
}
