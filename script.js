document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('result-form');
    const hallTicketInput = document.getElementById('hallticket');
    const statusMessage = document.getElementById('status-message');
    const errorMessage = document.getElementById('error-message');
    const resultDisplay = document.getElementById('result-display');
    const printButton = document.getElementById('print-button');

    // --- Elements for displaying results ---
    const resultName = document.getElementById('result-name');
    const resultHtno = document.getElementById('result-htno');
    const resultTableBody = document.querySelector('#result-table tbody');
    const resultStatus = document.getElementById('result-status');
    const resultGrade = document.getElementById('result-grade');

    // --- Initial Setup ---
    // You might fetch the actual status (announced/not announced) from an API here
    setStatusMessage("Results are expected soon. Enter Hall Ticket Number once announced.");
    // setStatusMessage("Results announced! Enter Hall Ticket Number."); // Or this if announced


    // --- Form Submission Logic ---
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        clearErrors();
        hideResult();

        const hallTicket = hallTicketInput.value.trim();

        // Basic validation (HTML pattern handles digits, this checks if empty)
        if (!hallTicket) {
            showError("Please enter your Hall Ticket Number.");
            return;
        }

        // Show loading status
        setStatusMessage("Fetching your result...");

        // *** CORE LOGIC: FETCH RESULT DATA ***
        // This is where you would make an API call to your backend
        // Replace the setTimeout mock with your actual fetch() or XMLHttpRequest
        fetchResultFromAPI(hallTicket)
            .then(data => {
                if (data.error) {
                    // Handle errors reported by the API (e.g., "Result Not Found")
                    showError(data.message || "Result not found for this Hall Ticket Number.");
                    setStatusMessage("Enter Hall Ticket Number."); // Reset status
                } else {
                    // Display the result
                    displayResult(data);
                    setStatusMessage("Result displayed below.");
                }
            })
            .catch(error => {
                // Handle network errors or other issues during fetch
                console.error("Fetch Error:", error);
                showError("An error occurred while fetching the result. Please try again later.");
                setStatusMessage("Enter Hall Ticket Number."); // Reset status
            });
    });

    // --- Print Button Logic ---
    printButton.addEventListener('click', () => {
        window.print(); // Trigger browser's print dialog
    });


    // --- Helper Functions ---

    function setStatusMessage(message) {
        statusMessage.textContent = message;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block'; // Ensure it's visible
    }

    function clearErrors() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none'; // Hide it
    }

    function hideResult() {
        resultDisplay.style.display = 'none';
    }

    function displayResult(data) {
        // Populate the result fields
        resultName.textContent = data.name || 'N/A';
        resultHtno.textContent = data.hallTicket || 'N/A';
        resultStatus.textContent = data.overallStatus || 'N/A';
        resultGrade.textContent = data.overallGrade || 'N/A';

        // Add pass/fail class for styling
        resultStatus.className = ''; // Clear previous classes
        if (data.overallStatus && data.overallStatus.toLowerCase() === 'pass') {
            resultStatus.classList.add('status-pass');
        } else if (data.overallStatus) {
             resultStatus.classList.add('status-fail');
        }

        // Clear previous table rows
        resultTableBody.innerHTML = '';

        // Populate the subjects table
        if (data.subjects && Array.isArray(data.subjects)) {
            data.subjects.forEach(subject => {
                const row = resultTableBody.insertRow();
                row.insertCell(0).textContent = subject.name || '---';
                row.insertCell(1).textContent = subject.marks !== undefined ? subject.marks : '---';
                row.insertCell(2).textContent = subject.grade || '---';
            });
        }

        // Show the result section
        resultDisplay.style.display = 'block';
    }


    // --- MOCK API CALL - Replace with your actual fetch logic ---
    // This function simulates fetching data after a short delay.
    async function fetchResultFromAPI(hallTicket) {
        console.log(`Simulating API call for Hall Ticket: ${hallTicket}`);

        // *** IMPORTANT: Replace this entire function with your actual API call ***
        // Example using fetch:
        // const response = await fetch(`/api/get-result?htno=${hallTicket}`);
        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();
        // return data;

        // --- Mock Data Simulation ---
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate different scenarios based on Hall Ticket
                if (hallTicket === "1234567890") { // Simulate valid result
                    resolve({
                        name: "STUDENT NAME EXAMPLE",
                        hallTicket: "1234567890",
                        overallStatus: "Pass",
                        overallGrade: "A1",
                        subjects: [
                            { name: "Telugu", marks: 95, grade: "A1" },
                            { name: "Hindi", marks: 92, grade: "A1" },
                            { name: "English", marks: 88, grade: "A2" },
                            { name: "Mathematics", marks: 98, grade: "A1" },
                            { name: "General Science", marks: 90, grade: "A1" },
                            { name: "Social Studies", marks: 85, grade: "A2" }
                        ]
                    });
                } else if (hallTicket === "9876543210") { // Simulate failed result
                     resolve({
                        name: "ANOTHER STUDENT NAME",
                        hallTicket: "9876543210",
                        overallStatus: "Fail",
                        overallGrade: "F",
                        subjects: [
                            { name: "Telugu", marks: 45, grade: "C1" },
                            { name: "Hindi", marks: 30, grade: "F" }, // Failed subject
                            { name: "English", marks: 55, grade: "B2" },
                            { name: "Mathematics", marks: 25, grade: "F" }, // Failed subject
                            { name: "General Science", marks: 60, grade: "B2" },
                            { name: "Social Studies", marks: 50, grade: "C1" }
                        ]
                    });
                }
                else if (hallTicket === "0000000000") { // Simulate network error
                    reject(new Error("Simulated network failure"));
                }
                else { // Simulate "Result Not Found"
                    resolve({ error: true, message: "Result not found for this Hall Ticket Number." });
                }
            }, 1500); // Simulate 1.5 second network delay
        });
        // --- End of Mock Data Simulation ---
    }

}); // End DOMContentLoaded
