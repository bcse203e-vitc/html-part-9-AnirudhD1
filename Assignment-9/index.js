document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const appointmentsContainer = document.createElement("div");
    appointmentsContainer.id = "appointments";
    document.body.appendChild(appointmentsContainer);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const service = document.getElementById("service").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const people = document.getElementById("people").value;
        const special = document.getElementById("special").value.trim();
        const terms = document.getElementById("terms").checked;

        // Validation
        if (name === "" || email === "" || phone === "" || service === "" || date === "" || time === "" || people === "") {
            alert("Please fill all required fields.");
            return;
        }

        if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
            alert("Phone number must be in the format XXX-XXX-XXXX.");
            return;
        }

        const selectedDate = new Date(`${date}T${time}`);
        if (selectedDate < new Date()) {
            alert("Please select a future date and time.");
            return;
        }

        if (!terms) {
            alert("You must agree to the terms and conditions.");
            return;
        }

        // Create Appointment Object
        const appointment = {
            name,
            email,
            phone,
            service,
            date,
            time,
            people,
            special,
            status: "Pending",
        };

        saveAppointment(appointment);
        displayAppointments();
        form.reset();
        alert(`Thank you, ${name}! Your appointment for ${service} on ${date} at ${time} is confirmed.`);
    });

    function saveAppointment(appointment) {
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));
    }

    function displayAppointments() {
        appointmentsContainer.innerHTML = "<h3>Booked Appointments</h3>";
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

        appointments.forEach((appointment, index) => {
            const appointmentCard = document.createElement("div");
            appointmentCard.classList.add("appointment-card");
            appointmentCard.innerHTML = `
                <p><strong>Name:</strong> ${appointment.name}</p>
                <p><strong>Service:</strong> ${appointment.service}</p>
                <p><strong>Date & Time:</strong> ${appointment.date} at ${appointment.time}</p>
                <p><strong>Status:</strong> ${appointment.status}</p>
                <button onclick="cancelAppointment(${index})">Cancel</button>
            `;
            appointmentsContainer.appendChild(appointmentCard);
        });
    }

    window.cancelAppointment = function (index) {
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        if (confirm("Are you sure you want to cancel this appointment?")) {
            appointments.splice(index, 1);
            localStorage.setItem("appointments", JSON.stringify(appointments));
            displayAppointments();
        }
    };

    displayAppointments();
});

