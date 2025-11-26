const form = document.querySelector('.return_call_form')


function validateForm(formData) {
    const errors = {};
  
    // Получаем значения из FormData
    const name = formData.get("name")?.trim() || "";
    const phone = formData.get("number")?.trim() || "";
    const email = formData.get("email")?.trim() || "";
  
    // Валидация имени
    if (name.length < 2) {
      errors.name = "Имя должно содержать не менее 2 символов";
    } else if (!/^[А-Яа-яA-Za-z\s'-]+$/.test(name)) {
      errors.name = "Имя может содержать только буквы, пробелы, апостроф и дефис";
    }
  
    // Валидация телефона
    if (!phone) {
      errors.phone = "Введите номер телефона";
    } else if (
      !/^(\+?\d{1,3}[- ]?)?\(?\d{3,4}\)?[- ]?\d{3}[- ]?\d{2,3}[- ]?\d{2,3}$/.test(phone)
    ) {
      errors.phone = "Введите корректный номер телефона";
    }
  
    // Валидация почты
    if (!email) {
      errors.email = "Введите адрес электронной почты";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Введите корректный адрес электронной почты";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(form);

    const result = validateForm(formData);

    if (!result.isValid) {
        alert(result.errors.name ? result.errors.name : result.errors.email ? result.errors.email : result.errors.phone ? result.errors.phone : '')
    } else {
        fetch('http://localhost:5000/api/application/', {
        method: 'POST',
        body: formData
        })
        .then(data => {
            alert('Форма успешно отправлена!')
            form.reset();
        })
        .catch((error) => {
            alert(error)
        });
    }
    // Отправка данных через Fetch API
    
});