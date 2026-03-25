function togglePassword() {
    const password = document.getElementById("account_password");
    const icon = document.querySelector(".toggle-eye");

    if (password.type === "password") {
        password.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    // Add Inventory form rules
    const form = document.getElementById("vehicleForm");

    const fields = {
        classification: document.getElementById("classification_id"),
        make: document.getElementById("inv_make"),
        model: document.getElementById("inv_model"),
        description: document.getElementById("inv_description"),
        image: document.getElementById("inv_image"),
        thumbnail: document.getElementById("inv_thumbnail"),
        price: document.getElementById("inv_price"),
        year: document.getElementById("inv_year"),
        miles: document.getElementById("inv_miles"),
        color: document.getElementById("inv_color")
    };

    // Validation rules
    const validators = {
        classification: val => val !== "",
        make: val => val.trim().length > 0,
        model: val => val.trim().length > 0,
        description: val => val.trim().length > 0,
        image: val => val.trim().length > 0,
        thumbnail: val => val.trim().length > 0,
        color: val => val.trim().length > 0,
        price: val => /^[0-9]+$/.test(val.trim()),
        year: val => /^[0-9]{4}$/.test(val.trim()),
        miles: val => /^[0-9]+$/.test(val.trim())
    };

    function validateField(field, rule) {
        const value = field.value.trim();

        if (!rule(value)) {
            field.classList.add("error");
            field.classList.remove("success");
            return false;
        } else {
            field.classList.remove("error");
            field.classList.add("success");
            return true;
        }
    }

    Object.keys(fields).forEach(key => {
        const field = fields[key];

        if (!field) {
            return;
        }


        field.addEventListener("input", () => {
            validateField(field, validators[key]);
        });

        field.addEventListener("change", () => {
            validateField(field, validators[key]);
        });
    });

    if (form) {
        form.addEventListener("submit", function (e) {
            let isValid = true;

            Object.keys(fields).forEach(key => {
                const field = fields[key];
                if (!field) return;

                const valid = validateField(field, validators[key]);
                if (!valid) isValid = false;
            });

            if (!isValid) {
                e.preventDefault();
                const firstError = document.querySelector(".error");
                if (firstError) firstError.focus();

                alert("Please fill all fields correctly. Price must be a valid integer.");
            }
        });
    } else {
    }

});